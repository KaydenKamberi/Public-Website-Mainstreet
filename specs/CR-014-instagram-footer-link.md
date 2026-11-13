# CR-014 (public site): Instagram link in the footer, next to the email

| | |
| --- | --- |
| **Status** | `DRAFT`, waiting for Kevin's approval. |
| **Requested by** | Kevin, 2026-11-13: "can you add this link of my instagram into the website next to the email at the footer. https://www.instagram.com/thewebsitefix/" |
| **Number** | CR-013 is held for the Cloudflare Pages move (see `CLAUDE.md`), so this one is CR-014. |
| **Does not change** | The header, the page content, the form, the hub contract, or the analytics rules. |

## 1. What changes
- Every footer (Home, Offerings, About, Contact, Privacy, 404) gets one new line right after the email: **"Instagram @thewebsitefix"**, linked to `https://www.instagram.com/thewebsitefix/`.
- It uses the same text-link style as the email and text lines. No new component.
- **Computer:** it sits on the same line as the email. **Phone:** the lines wrap, so it sits beside "Text (619) 786-7135" under the email.
- Taps on it are already counted as `footer-other-site` (CR-011). The hub needs no change.
- Spec §3 (Footer) and "Social Media" are updated: the Instagram account now exists.

## 2. Decisions needing confirmation
| # | Decision | Recommendation |
| --- | --- | --- |
| D1 | Link text: "Instagram @thewebsitefix" (plain words, matching "Text (619) 786-7135"), not just an icon. | Yes. |
| D2 | Opens in the same tab, like every other link on the site. | Yes. |
| D3 | The hidden "Follow us" icon row (CR-003 D3) stays hidden, so Instagram doesn't show up twice. Facebook still has no account. | Keep it hidden. |
| D4 | The handle is `@thewebsitefix`, not a Mainstreet name. Confirm this is the business account you want on the site. | Confirm. |
