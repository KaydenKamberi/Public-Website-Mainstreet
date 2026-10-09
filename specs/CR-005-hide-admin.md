# CR-005 (public site): Hide the admin from everyone outside the team

| | |
| --- | --- |
| **Status** | `APPROVED` by Kevin, 2026-10-09, with every recommended decision (D1-D4): "okay thats fine now go ahead and make this CR". |
| **Requested by** | Kevin, 2026-10-08 |
| **Builds on** | CR-004 (admin area) |
| **Does not change** | The public pages, contact form, hub intake, visit tracking, or how the admin works once you're in. |

## 1. The problem

Anyone who types `yoursite/admin` sees the team login page. They can't see any leads without the password (the server checks it on every request), but:
- it tells outsiders an admin exists and invites password guessing;
- bots that scan for `/admin` pages find it.

## 2. The fix: a private "team link" + the password (two locks)

**Lock 1: only team devices can see the admin at all.**
- A new Replit Secret, **`ADMIN_ACCESS_KEY`**, holds a long random code (about 32 characters). It never goes in code or GitHub.
- The team's private entry link is `yoursite/team/<that code>`. Opening it once on a phone or laptop marks that device as a team device. It sets a signed, HttpOnly, secure cookie that lasts 180 days (D2), then goes straight to the login.
- For everyone else, **`/admin`, `/admin.html`, `/admin.js`, and every `/api/admin/…` request answer exactly like a page that doesn't exist** (the normal "Page not found" page, or a plain 404 for the API). Outsiders can't tell an admin is there.
- A wrong `/team/<code>` also shows "Page not found". After 5 wrong tries in 15 minutes, that connection stops being checked, so guessing is pointless (the code is long anyway).

**Lock 2: the team password (unchanged).** Even on a team device you still log in with `ADMIN_PASSWORD`, and logins still pause after 5 wrong tries.

**Turning a device off / starting fresh:** change `ADMIN_ACCESS_KEY` in Replit Secrets and restart. Every device has to use the new link once. Do this if a phone is lost or the link was shared by mistake.

**If `ADMIN_ACCESS_KEY` isn't set**, the admin is completely hidden: safest by default.

## 3. Setting it up (Kevin, once)
1. In the Replit Shell, make a random code: `node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"`.
2. Add it as a Secret named `ADMIN_ACCESS_KEY` (keep `ADMIN_PASSWORD` too), then restart.
3. Your team link is `https://<your site>/team/<code>`. Open it on each team device once and bookmark the admin. Share the link only privately (in person or a private message). Never put it in GitHub, the site, flyers, or group chats.

## 4. Other options considered

| Option | Why not (for now) |
| --- | --- |
| Rename `/admin` to a hard-to-guess address only | Better than nothing, but an address can leak (browser history, screenshots), and anyone with it sees the login. The device link does the same job and can be revoked. |
| Only allow our home/school internet addresses | Your internet addresses change (school Wi-Fi, phone data), so you'd get locked out. |
| A code sent to the business email each login (two-factor) | Needs an email-sending service; more moving parts. A good later upgrade. |
| Move the admin into the team hub and remove it from this site | The cleanest long-term setup, since the hub is already private. But the hub isn't finished, and this backup view is useful now. Revisit when the hub is done (D3). |

## 5. Checks (after approval)
- Without the team cookie: `/admin`, `/admin.html`, `/admin.js`, and `/api/admin/*` all look identical to a missing page.
- A wrong team link → "Page not found"; after 5 wrong tries, even the right link stops working for 15 minutes from that connection.
- The right team link → device marked → login → everything from CR-004 still works.
- Changing `ADMIN_ACCESS_KEY` locks out old devices.
- Public pages and the contact form are unchanged.

## 6. Decisions needing confirmation

| # | Decision | Recommendation |
| --- | --- | --- |
| D1 | Use the private team link + password (two locks). | Yes. |
| D2 | How long a device stays marked as a team device. | 180 days (then open the team link again). |
| D3 | Later, move the admin into the team hub once it's finished. | Yes, as its own CR then. |
| D4 | Keep the address `/admin` for team devices (it's invisible to everyone else). | Yes. |
