# CR-007 (public site): Add the business phone number

| | |
| --- | --- |
| **Status** | `APPROVED` by Kevin, 2026-10-09, with every recommended decision (D1-D2): "approve CR-006, CR-007, CR-008 build them and merge". |
| **Requested by** | Kevin, 2026-10-09 |
| **Fact** | Business phone: **(619) 786-7135**, the business Google Voice number (rings Kevin and Kayden, forwards texts). Kevin confirmed it's fine to publish. |

## 1. Where it goes (the 8 `[NEEDS CONTENT: business phone number]` spots)

| # | Page | Spot | Shows |
| --- | --- | --- | --- |
| 1-6 | Home, Offerings, About, Contact, Privacy, 404 | Footer contact list, under the email | "Text (619) 786-7135", linked as `sms:+16197867135` |
| 7 | Contact | Under the form, next to "Email us" | "Text us", linked as `sms:+16197867135` (spec §3 CTA map: "Text us" once the phone exists) |
| 8 | Privacy Policy | Contact line | "Text: (619) 786-7135", linked as `sms:+16197867135` |

- Text links, not buttons (the 2-button rule stays), each at least 44px tall.
- On a computer without texting, an `sms:` link may do nothing. The number is written out, so it can always be copied.

## 2. Spec and documents
- Spec §3 Footer, §7 Direct Contact Method, §7A Contact, and §11 Needs Content: replace the `[NEEDS CONTENT: business phone number …]` placeholders with the number (resolved).
- The 9 info docs in `specs/info-docs/` ("Text: [NEEDS CONTENT: business phone number]") get the number too. Note: the hub's own copies are the ones it sends.

## 3. Checks
- All 8 spots show the number; all `sms:` links are correct; no `[NEEDS CONTENT: business phone number]` is left in `public/`.
- 375px and desktop: no sideways scrolling, 44px tap targets.

## 4. Decisions needing confirmation

| # | Decision | Recommendation |
| --- | --- | --- |
| D1 | Link type: `sms:` (text) as the spec says, not `tel:` (call). | `sms:`, since texting is how customers reach you. |
| D2 | Also update the 9 info docs in this repo. | Yes, so no copy still has the placeholder. |
