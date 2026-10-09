# CR-008 (public site): "Send again" for stuck leads, and the hub's answers handled exactly per contract v2

| | |
| --- | --- |
| **Status** | `APPROVED` by Kevin, 2026-10-09, with every recommended decision (D1-D3): "approve CR-006, CR-007, CR-008 build them and merge". |
| **Requested by** | Kevin, 2026-10-09 |
| **Matches** | Hub `specs/intake-contract.md` v2 (answers 200/201/400/401/403/429/503) |
| **Does not change** | The signature, headers, body, or the contact form. |

## 1. The gap today
- If the hub doesn't answer, the site retries every 5 minutes, but **only for 24 hours**. After that the lead sits in the admin as "Not in the hub yet" forever, with no way to push it again. The spec says leads are kept "until they do" reach the hub.
- The admin can't tell **why** a lead is stuck (a wrong `INTAKE_SECRET` gives 401, a hub not set up gives 503, a down hub gives no answer).

## 2. The fix

**"Send again" button (admin)**
- On every lead marked **Not in the hub yet**, a **Send again** button sends it to the hub right away, with a **fresh timestamp and signature** and the **same body and `submission_id`**.
- That's safe: the hub saves each `submission_id` once and answers `200` with `"duplicate": true` if it already has it, which counts as delivered.
- The card then updates to "In the team hub" or shows the hub's answer.
- On the **Not in the hub yet** filter, a **Send all again** button does the same for every stuck lead, one at a time (staying under the hub's 60-per-15-minutes limit) (D2).

**Automatic retries**
- First 24 hours: every 5 minutes (unchanged).
- After 24 hours: **once an hour, until it gets through** (D1). It stops automatically for leads the hub refused (400).

**Every hub answer, handled as the contract says**

| Hub answer | Today | After |
| --- | --- | --- |
| 201 saved / 200 (incl. `"duplicate": true`) | Delivered ✓ | Same |
| 400 invalid body | Stop retrying, keep backup ✓ | Same, plus the hub's `error` reason shown on the card |
| 401 signature/timestamp | Retried ✓ | Retried with a fresh signature; the card says "Hub rejected the signature: check INTAKE_SECRET matches in both apps" |
| 403 not HTTPS | Retried (pointless) | Card says "Hub address must start with https://, check HUB_URL"; still retried in case it's fixed |
| 503 hub not set up | Retried ✓ | Retried; card says "The hub's INTAKE_SECRET isn't set yet" |
| 429 / other 5xx / no answer | Retried ✓ | Same; the card shows the answer |

- To show those reasons, the site saves **the hub's last answer** on each lead (one new column, `forward_last_answer`: the status code plus the hub's short `error` text, never any secret).

## 3. Checks (fake hub, made-up leads)
- Each answer (201, 200 duplicate, 400, 401, 403, 429, 503, no answer, timeout) is marked and shown correctly.
- Send again uses a new timestamp/signature and an identical body; Send all respects the rate limit.
- Retries switch to hourly after 24 hours and stop after a 400.
- Admin buttons only work on a logged-in team device (CR-004/005 rules).

## 4. Decisions needing confirmation

| # | Decision | Recommendation |
| --- | --- | --- |
| D1 | After 24 hours, keep retrying hourly until it gets through? | Yes. Plus the button for when you don't want to wait. |
| D2 | Add "Send all again" for all stuck leads. | Yes, handy after fixing a wrong secret. |
| D3 | Save and show the hub's last answer on each lead. | Yes. It makes setup problems obvious. |
