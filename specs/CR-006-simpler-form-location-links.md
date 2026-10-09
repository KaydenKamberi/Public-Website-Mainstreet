# CR-006 (public site): Simpler contact form: location, links, new message label (hub U3)

| | |
| --- | --- |
| **Status** | `APPROVED` by Kevin, 2026-10-09, with every recommended decision (D1-D4): "approve CR-006, CR-007, CR-008 build them and merge". |
| **Requested by** | Kevin, 2026-10-09 (the hub's U3, intake contract v2 approved 2026-10-08) |
| **Matches** | Hub `specs/intake-contract.md` v2: optional `location` (≤120 characters) and `links` (≤5 strings, each ≤500) |
| **Does not change** | The signature, headers, retries, `submission_id`, business types, Email/Text choice, consent, or the visit tracking. |

## 1. The form, after

| Order | Field | Rules |
| --- | --- | --- |
| 1 | Name | Required (unchanged) |
| 2 | Business type | Required (unchanged) |
| 3 | **Where is your business?** (new) | **Required on the form**, up to 120 characters. Hint: "City, neighborhood, or address." |
| 4 | **Links to your business online** (new, optional) | One box to start, plus a small "Add another link" text button, up to **5** boxes. Hint: "Your Google Maps listing, website, Instagram, or Facebook. An @handle works too." Each box up to 500 characters; empty boxes are left out. |
| 5 | Send my info document by: Email or Text | Unchanged, plus the Email or Phone box |
| 6 | **Anything you want us to know that isn't online?** (renamed from "Message"; optional) | Hint: "Like your catering menu, new prices, or your story. We find the rest on Google." Up to 2,000 characters. |
| 7 | Consent checkbox | Unchanged |

**Removed:** the old message placeholder ("Your business's name and anything you'd like us to know"). Nothing else on the form asks for menus, prices, hours, or other things we can find online.

The "Add another link" control is styled as a text link, not a pill button, so the Contact page still shows at most 2 buttons (the CTA rule).

## 2. Saving and sending

- **The browser checks first:** location is filled in and ≤120 characters; at most 5 links, each ≤500. Errors appear next to the field, like the other fields.
- **The server checks again** (it never trusts the browser): location 1-120 characters is required; `links` must be a list of up to 5 text items, each ≤500, with empties dropped. Anything else gets the normal "Please check the form" error, so nothing is ever sent that the hub would refuse with a 400.
- **Backup copy:** two new columns on this site's `leads` table, `location` (text) and `links` (a list). They're added the same way as earlier columns (`ADD COLUMN IF NOT EXISTS` at startup); old leads just have them empty.
- **Sent to the hub** in the same signed request, adding `"location": "…"` and, only when there are links, `"links": ["…"]`. The hub adds `https://` and keeps `@handles` as text, so this site sends links exactly as typed.
- **Admin:** each lead card shows "Location" and "Links". A link is only clickable if it's a real `http(s)` address, opening in a new tab; `@handles` and anything else show as plain text.

## 3. Spec and Privacy Policy updates (needed so the spec matches)
- Spec §7 Contact Form: the field list above, and the acceptance line "the form collects only name, email, phone, business type, location, links, message, and consent".
- Spec Conflicts and Scope Notes (constitution §8): add location and links to the extra fields.
- **Privacy Policy, "What we collect"** (spec §7A says it must list exactly what the form collects): "…your name, your type of business, where your business is, any links you share, your email address or phone number (whichever you choose), your message if you write one, and your consent to be contacted." (Wording change, D3.)

## 4. Checks (after approval)
- 375px and desktop: no sideways scrolling; at most 2 buttons visible; every field labeled; the error messages work (missing location, a 6th link isn't possible, a 501-character link).
- The request to the hub is captured on a fake hub and checked against the contract: headers, signature over the exact bytes, `location`, `links` (empties dropped), and a body under 20 KB.
- An old-style lead (no location or links) still forwards. Test data uses made-up businesses only.

## 5. Decisions needing confirmation

| # | Decision | Recommendation |
| --- | --- | --- |
| D1 | Link boxes: 1 box + "Add another link" (up to 5), or 5 boxes shown at once? | 1 + "Add another link": shorter form, less scrolling on phones. |
| D2 | "Where is your business?" required on the form (the hub has it optional). | Required, as you asked. |
| D3 | The Privacy Policy wording change in section 3. | Approve. |
| D4 | The info documents (sent by the hub) still ask owners for menus, prices, and hours in "What we need from you". | Out of scope here; the hub's copies are the ones sent. Flag for the hub. |
