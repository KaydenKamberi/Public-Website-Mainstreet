# CR-009 (public site): No database. The site becomes a small relay to the hub

| | |
| --- | --- |
| **Status** | `APPROVED` by Kevin, 2026-10-13, with D1-D4: "for the 4 decisions you need approval on I give you approval". D3 and D4 are adjusted below, because Kevin also asked for an analytics page in the hub. |
| **Requested by** | Kevin, 2026-10-13: "I don't want to use a database for the public site. The whole point was to have all the backend things on the private hub." Chose "Small relay, no database". |
| **Replaces** | The planned 30-day backup cleanup (there is no backup to clean up anymore). |
| **Undoes** | The database, admin area, visit tracking, retries and "Send again" from CR-004, CR-005 and CR-008. |
| **Does not change** | Any page, the design, the contact form's fields and checks, the phone number, or the hub intake contract v2. |

## 1. How it works after

```
Visitor fills the form → this site's small server checks it → signs it with INTAKE_SECRET
→ sends it to the hub → waits for the hub's answer (up to 10 seconds) → tells the visitor
```

- ✅ **Hub says 201 or 200** (including `"duplicate": true`): the visitor sees the normal success message ("Thanks! Your message was sent.", or the special-request message).
- ⚠️ **Any other answer, or no answer:** the visitor sees "Sorry, your message could not be sent. Please try again, or text us at (619) 786-7135." (D1)
- 🔁 **Trying again is safe.** Each filled-in form keeps one `submission_id` until it succeeds, so if the hub saved it but the answer got lost, the hub won't save it twice.
- 🔒 The secret stays on the server and never reaches the browser. That's why a small server is still needed.

## 2. What gets removed

| Removed | Where it lives now |
| --- | --- |
| 💾 PostgreSQL (`leads` and `visits` tables, the `pg` package) | Nothing is stored on this site |
| 🔐 Admin page, `/team/<key>` link, `/api/admin/*` | Leads are viewed in the hub |
| 👀 Visit storage and the Marketing numbers | The hub's analytics page (D3). The browser still sends one visit per session; this site drops it until CR-010 passes it to the hub. |
| 🔁 Automatic retries, "Send again", "Send all again" | The visitor tries again |
| 🔑 Secrets `ADMIN_PASSWORD`, `ADMIN_ACCESS_KEY` | No longer needed |

`/api/health` just reports that the server is up and whether `HUB_URL` and `INTAKE_SECRET` are set (never their values).

## 3. What stays

- All pages, the design, the form fields and their checks (browser and server), and the honeypot.
- The limit of 5 sends per 15 minutes per connection, the security headers, and plain error answers.
- The exact hub intake contract v2 body and signature (fresh timestamp each send).

## 4. Spec and page updates

- **Spec §7 Automatic info document and Acceptance:** the site sends each form straight to the hub. If that fails, the visitor is asked to try again. Remove "saved in this site's database", "retries every 5 minutes", and "the submission stays saved on this site".
- **Spec §8 Lead Management:** all of it moves to the team hub. This site has no admin.
- **Spec §9 Marketing Attribution:** moves to the hub's analytics page (D3).
- **Spec Conflicts and Scope Notes:** the constitution asks for a database, an admin page and a conversion dashboard on this site. The student decided those live in the private team hub instead.
- **Privacy Policy:** change "How long we keep it" to: "This website does not keep a copy of your form. It goes straight to our team." (D4)
  - "Website visits" **stays**, because analytics continue in the hub (adjusted after Kevin asked for an analytics page).
- **`CLAUDE.md` and `replit.md`:** no database; only `HUB_URL` and `INTAKE_SECRET` are needed.
- **Design system:** mark the admin components (CR-004, CR-008) as removed.

## 5. Checks (fake hub, made-up data)

- **Hub answers:** 201, 200 duplicate, 400, 401, 403, 429, 503, a timeout, and hub down each show the right message to the visitor.
- **Trying again:** a second try after a lost answer sends the same `submission_id`.
- **Removed pieces:** `/admin`, `/team/...` and `/api/admin/*` are now normal "Page not found" pages. `/api/visits` answers 204 and keeps nothing.
- **Database:** the server starts and works with no `DATABASE_URL` at all.
- **Layout:** 375px and desktop, no sideways scrolling, and every page works as before.

## 6. Decisions needing confirmation

| # | Decision | Recommendation |
| --- | --- | --- |
| D1 | Add "or text us at (619) 786-7135" to the error message, since there's no backup copy anymore. | Yes |
| D2 | Delete the admin code completely (it stays in GitHub history if ever needed). | Yes |
| D3 | The marketing source (which flyer or link brought the visitor) is lost unless the hub accepts a `source` field. Ask the hub chat to add it to the intake contract (a hub change). | Approved. Extended: the hub chat was also asked (2026-10-13) for a signed visits endpoint and an analytics page. CR-010 wires this site to them once the hub sends the contract. |
| D4 | The Privacy Policy wording in section 4. The hub's own retention rules are for the hub to state. | Approve |
