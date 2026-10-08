# CR-004 (public site): Admin area and visit tracking

| | |
| --- | --- |
| **Status** | `APPROVED` by Kevin, 2026-10-08, with every recommended decision (D1-D8): "approve CR-004 build it and merge it". |
| **Requested by** | Kevin, 2026-10-08 |
| **Covers** | Spec §8 (Lead Management, Phase 5), §9 (Marketing Attribution), constitution §12-14 |
| **Does not change** | The public pages' look and wording, the contact form, the hub intake contract (`POST /api/intake/website`), `INTAKE_SECRET`, or the database tables (the `leads` and `visits` tables already have every column this needs). |

## 1. Why

- `admin.html` is still an empty page. Leads are saved, but nobody can see them on this site.
- The site remembers which link brought a visitor (`utm_source`) and saves it with each lead, but never records **visits**. Without visits there's no conversion rate, so you can't tell whether flyers or Instagram work.

## 2. Visit tracking

**How it works**
- Each page sends one small request, `POST /api/visits`, with two things: the **source** (the first `utm_source` this browser arrived with, or `direct`) and the **page** (`home`, `offerings`, `about`, `contact`, `privacy`).
- **Nothing else is stored**: no IP address, no name, no device info. That matches the Privacy Policy ("This does not include your name or contact information").
- **One visit per browser session (D1)**: a visitor who clicks through 4 pages counts as 1 visit, not 4. This keeps the conversion rate meaningful.

**Protection against junk numbers**
- The server only accepts known pages and clean sources (lowercase letters, numbers, `-` and `_`, up to 40 characters). Anything else is saved as `direct`.
- At most 30 visits a minute from one connection; extra requests are ignored. This is held in memory only, so no IPs are saved.
- Bots that say they're bots aren't counted.

**No third-party analytics** (constitution §14).

## 3. Admin area (`/admin`)

**Logging in (D3)**
- One shared password for the team, stored in a new **Replit Secret `ADMIN_PASSWORD`**. It never goes in code or GitHub.
- If the secret isn't set, the admin area stays locked ("Admin is not set up yet") instead of opening.
- Logging in sets a signed, secure, HttpOnly cookie that lasts 12 hours. There's a "Log out" button.
- After 5 wrong passwords in 15 minutes, logins pause for 15 minutes.
- The page isn't linked from the public site and tells search engines not to index it (already set).

**Leads list (spec §8)**
- Newest first. On phones each lead is a card; on desktop, a table you can expand.
- Each lead shows: name, business type, how they want the info doc (email or text), email or phone, message, consent, source, date and time, status, response note, and **"Reached the team hub: yes / not yet / refused"** with the time.
- Filters: All · New · Responded · Not in the hub yet.
- **Mark responded** (records the time) or set back to **New**. **Add or edit a response note**; it saves when you click Save.
- **Delete a lead** (D6), with an "Are you sure?" step. The Privacy Policy promises people can ask to have their information deleted. Deleting here removes only this site's backup copy; the hub copy is deleted in the hub.

**Marketing dashboard (spec §9)**
- A table by source: **visits, leads, conversion rate** (leads ÷ visits × 100). Shows 0% when a source has visits but no leads, and "—" when it has leads but no visits.
- Time ranges: **Last 30 days** (default) and **All time** (D4).
- **Tracking link maker** (D5): type a source like `flyer` and copy a ready link for flyers, Instagram, business cards, and so on. The link uses the site's current address (e.g. `…/?utm_source=flyer`), so it stays right whether the domain is `mainstreetsitessd.com` (not confirmed yet) or the Replit address.

**Info document status and resend (D2)**
The team hub sends the info document, and it doesn't report back to this site. So this admin can't honestly show "info doc sent" or resend one. Each lead shows whether it reached the hub; doc status and resend happen in the hub. The spec §8 lines for these change to match.

**Look**: the same Day to Dusk design system: cream page, cards, forest buttons, readable on a phone.

## 4. Safety rules for real customer data

- Every admin response is protected server-side and sent with `Cache-Control: no-store`, so browsers don't keep copies.
- Lead text (names, messages) is always shown as plain text, never as HTML, so a message containing code can't run in the admin page.
- Changes (status, note, delete) only accept JSON from the admin page itself (SameSite cookie + JSON check).
- No lead data is ever written to logs, code, tests, commits, or GitHub. All testing uses fake data on a local server with the hub turned off.
- No new packages. Node's built-in `crypto` handles the password check and cookie signing.

## 5. Build plan and checks (after approval)

One commit per item, one PR, merged with a merge commit:
1. Spec + this CR
2. `POST /api/visits` + the page script
3. Admin login and session
4. Leads API (list, status, note, delete)
5. Dashboard API
6. `admin.html` + `admin.js` (leads, filters, dashboard, link maker)
7. Replit notes: add `ADMIN_PASSWORD` to Secrets

**Checks**
- Login: wrong password, right password, logout, the 5-attempt limit, admin locked when the secret is missing.
- Every admin API refuses requests without login.
- A fake lead with `<script>` in its message shows as plain text.
- `?utm_source=test` records a visit with source `test`, and later pages keep it (spec §9 acceptance).
- Conversion math, including 0 visits and 0 leads.
- The contact form payload is unchanged, and the public pages look the same.
- The admin page works on a 375px phone and on desktop.

## 6. Decisions needing confirmation

| # | Decision | Recommendation |
| --- | --- | --- |
| D1 | Count a visit once per browser session, or every page view? (Spec §3 says "every page records a visit".) | Once per session, so the conversion rate means something. Spec §3 wording updated. |
| D2 | Info doc status and resend live in the team hub, not here. | Yes. This admin shows "reached the team hub" instead. |
| D3 | One shared admin password (`ADMIN_PASSWORD` Secret) for Kevin, Kayden, and Cheyenne. | Yes. Separate logins can come later if needed. |
| D4 | Dashboard time ranges. | Last 30 days (default) + All time. |
| D5 | Add the tracking link maker. | Yes. It makes the marketing-sources decision (spec §11) easy: pick names like `flyer`, `instagram`, `card`. |
| D6 | Allow deleting a lead from the admin (for "please delete my info" requests). | Yes, with a confirm step. |
| D7 | Download leads as a spreadsheet (CSV)? | No, for now. Real customer data is safer staying in the admin and the hub. |
| D8 | The 30-day backup cleanup (spec §8). | Separate small CR next. |
