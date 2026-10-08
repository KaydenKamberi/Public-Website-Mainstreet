# CR-003 (public site): Wording for all business types, a slimmer footer, and a closing band refresh

| | |
| --- | --- |
| **Status** | `APPROVED` by Kevin, 2026-10-08, with every recommended decision (D1-D4): "approve CR-003 build it and merge it". |
| **Requested by** | Kevin, 2026-10-08 |
| **Rules** | No change to the contact form, hub intake, `INTAKE_SECRET`, `server.js`, or the database. No invented facts. |

## 1. Wording for every business type we serve (not just restaurants)

The site offers websites to 9 business types (the contact form's dropdown), but several lines only speak to restaurants.

| Where | Now | After (draft, needs your OK) |
| --- | --- | --- |
| Home meta description | "…in San Diego, starting with family-owned restaurants." | "Mainstreet Sites SD builds and manages websites for San Diego's local businesses: restaurants, barbershops, bakeries, home services, and more." |
| Home lead | "…for local businesses, starting with San Diego's family-owned restaurants." | "…for local businesses, from San Diego's family-owned restaurants to barbershops, bakeries, and home services." (spec §4 acceptance still holds: it mentions family-owned restaurants) |
| Home "What's included" | "For restaurants, your website includes:" | "Every website is built for your type of business. It includes:" |
| Website features (Home, Offerings) | Menu · Prices · Deals and combos · Location · Reviews · Optional reservations service, at no extra cost from us | Your menu or services · Prices · Deals and specials · Location and hours · Reviews · Optional reservations or booking service, at no extra cost from us |
| Monthly management (Home, Offerings) | "Content updates (hours, menu changes, prices, photos, specials)" | "Content updates (hours, menu or service changes, prices, photos, specials)" |
| Offerings lead + plan description | "a website built for your restaurant" | "a website built for your business" |
| Offerings "How it starts" | "a demo of your restaurant's website" | "a demo of your business's website" |
| About "How we work" | "Every restaurant owner sees a demo…" | "Every business owner sees a demo…" |
| About story (bug fix) | "very difficult,, so" (double comma, live since CR-002) | "very difficult, so" |

**Spec changes**: §1 Target Customer becomes "Local small businesses in San Diego (restaurants, HVAC, barbershops, car detailing, gyms and martial arts studios, lash studios, house cleaning, bakeries, and tattoo shops) that aren't big chains. Family-owned restaurants are the first focus" (D1). The §4 item 6 and §5 feature lists, plus their acceptance lines, change to the new feature names. The "Why we started" story stays as it is (it's history: trade workers → restaurants).

## 2. Footer: slimmer, payment methods, socials ready

- **Slimmer**: desktop footer goes from about 340px to about 296px tall. Three columns: name/tagline + service area, hours, email | page links in 2 columns | "We accept" + "Follow us". The copyright sits on one line underneath.
- **We accept: Venmo · Cash** as small badges (new wording, D2). Text badges only, not the Venmo logo, so no brand-guideline issues.
- **Follow us (Instagram, Facebook)**: built and **hidden** until the accounts exist, as spec §3 requires ("No social media icons or links appear until accounts exist"). To turn it on: add the links and remove `hidden` (one small change, D3).
- Links lose the heavy underline and get a thin underline that grows on hover. Every link is still at least 44px tall.

## 3. Closing band ("Want a website for your business?")

- A thin marigold-and-cream **awning stripe** along the top (the brand's storefront signature).
- On desktop, the heading and sentence on the left with the **button on the right**; stacked on phones.
- A bigger 56px button with a soft marigold glow ring on hover and an arrow that slides right. The label is unchanged.

## 4. Checks done on the mockup
Every page at 320-1440px: no sideways scrolling, max 2 buttons, 44px tap targets, no errors. Content stays visible if `script.js` fails. Reduced motion shows no animation. The contact form payload is byte-identical.

## 5. Decisions needing confirmation

| # | Decision | Recommendation |
| --- | --- | --- |
| D1 | Broaden spec §1 Target Customer to all 9 business types, keeping family-owned restaurants as the first focus. | Yes. |
| D2 | Approve the new wording in section 1 and the "We accept" / "Follow us" labels. | Approve as written, or edit any line. |
| D3 | Socials stay hidden until the Instagram/Facebook accounts exist; Kevin sends the links. | Yes. |
| D4 | The search image in "Why a website matters" and the info doc preview on Contact still show restaurant examples. | Keep them (they're labeled examples). Make versions for other types later, with the concept sites. |
