# CR-001 (public site): Day to Dusk rebuild, new pricing, and reservations

| | |
| --- | --- |
| **Status** | `APPROVED` by Kevin, 2026-10-08, with every recommended decision (D1-D31). Kevin also asked for the merge to happen when the build is done (this replaces D25). |
| **Requested by** | Kevin, 2026-10-08 |
| **Repo** | KaydenKamberi/Public-Website-Mainstreet (this site only; the team hub has its own CR numbers) |
| **Changes** | Part A: pricing, payment methods, reservations (spec and wording). Part B: design, layout, and page structure (no wording changes). |
| **Design source** | `design-system/r3-3-day-to-dusk-home.webp` (the locked R3-3 Home artboard, added by this CR) + `design-system/DESIGN-SYSTEM.md` + `design-system/tokens.css` |

## Why

1. **The prices changed.** The monthly price goes from $40 to $45, payment is cash or Venmo (not Zelle), and every plan can now include a reservations service at no extra cost.
2. **The site never got its design.** It was built as the Phase 2 structure (`public/style.css:64`: *"The full Day to Dusk look is built in Phase 3"*), and Phase 3 was never built. The locked R3-3 artboard shows what Home should look like. The Step 1 comparison found the fonts, logo, storefront street, gradient, and most of the layout missing.

**About the R3-3 image:** it is the reference for **look and layout only**. Its wording is out of date: it shows "$40 a month", buttons without arrows, no "San Diego", and different window labels. All wording comes from `spec.md` and this CR.

---

# Part A: Pricing, payment, and reservations

## A1. The new facts (decided by Kevin, 2026-10-08)

- **Price:** $60 for the first month, then $45 a month.
- **Minimum:** 4 payments and 4 months: $60 + $45 + $45 + $45 = **$195 total**.
- **Payment methods:** cash or Venmo. Not Zelle.
- **Reservations service (optional, every plan, no extra cost from us).** During onboarding we ask, yes or no: *"Do you want a reservations service connected to your website?"* If yes, it is **one** of:
  1. A "Reserve" or "Book now" button, or an embedded widget, linking to a booking service **in the client's name** (OpenTable, Resy, Tock, Yelp, Square Appointments, Calendly, Booksy, Vagaro, etc.). The client pays any service fees.
  2. A "reservation request" form that emails the owner, clearly labeled as a **request, not a confirmed booking**.
- **Limits:** Mainstreet Sites SD never builds its own booking system and never stores customers' booking information.
- **Edits:** setting up the reservations service does **not** count toward the client's 2 edits a month.
- **This public site gets no booking system and no reservation form.** Reservations are only for client sites; this site only describes the option.

**Standard wording used everywhere below** (so the same fact reads the same way):
- List item: "Optional reservations service, at no extra cost from us". The words "from us" are there because booking services like OpenTable charge the business their own fees.
- Description: "We can add a Reserve or Book Now button (or a booking widget) linked to a booking service in your name, like OpenTable, Resy, or Square Appointments (you pay any service fees), or a reservation request form that emails you. A request is not a confirmed booking."

## A2. Every place that changes

Draft wording is approved together with this CR (decision **D27**).

### `specs/spec.md`

| Where | Now | After |
| --- | --- | --- |
| Line 5 (status) | `APPROVED` 2026-09-29, updated 2026-10-01 | Add: "Updated 2026-10-08 by CR-001: $45 a month, payment methods, reservations service, Day to Dusk build decisions." |
| Conflicts and Scope Notes (after line 23) | — | New bullet: "**Reservations are for client sites only (decided 2026-10-08).** This site describes the optional reservations service but has no booking system or reservation form. Mainstreet Sites SD never builds its own booking system or stores booking information." |
| §2 line 64 | Names artboard R3-3 | Add: "A screenshot of the R3-3 Home artboard is in `design-system/r3-3-day-to-dusk-home.webp`. It is the layout reference only; its wording is out of date (for example, it shows $40 a month). All wording comes from this spec." |
| §3 CTA map, line 151 | "$60 the first month, then $40 a month." | "$60 the first month, then $45 a month." |
| §4 item 6, line 205 | "(for restaurants: menu, prices, deals and combos, location, reviews)" | "(for restaurants: menu, prices, deals and combos, location, reviews, and an optional reservations service at no extra cost from us)" |
| §4 acceptance, line 236 | "The five website features (menu, prices, deals and combos, location, reviews) are listed." | "…are listed, plus the optional reservations service." |
| §4 acceptance, line 237 | "reads exactly '$60 the first month, then $40 a month'" | "reads exactly '$60 the first month, then $45 a month'" |
| §5 "Your website includes" (lines 258-263) | 5 features | Add a 6th item: "Optional reservations service, at no extra cost from us" |
| §5 management, line 272 | "Content updates and seasonal refreshes do **not** count toward the 2 edits." | "Content updates, seasonal refreshes, and setting up the reservations service do **not** count toward the 2 edits." |
| §5 pricing, lines 274-275 | "$60 for the first month" / "$40 a month after that" | "$60 for the first month" / "$45 a month after that" |
| §5 conditions, line 278 | "Minimum: 4 payments ($60 + $40 + $40 + $40) and 4 months before you can cancel" | "Minimum: 4 payments ($60 + $45 + $45 + $45 = $195 total) and 4 months before you can cancel" |
| §5 conditions (new, after line 280) | — | "Payment methods: cash or Venmo." Shown on the Offerings page only if **D26** is approved; otherwise it appears only in the info docs (§7). |
| §5 (new block after the package description) | — | "**Reservations service (optional, no extra cost from us).** Shown on the Offerings page inside the package card, under the two lists, with exactly the A1 description." The onboarding question (§7) and the never-build, never-store rule (Scope Notes, §12) are not shown on the page. |
| §5 acceptance, line 299 | "'$60' for the first month and '$40' a month after." | "'$60' for the first month, '$45' a month after, and the $195 minimum total." |
| §5 acceptance, line 302 | "All five website features and all seven management items appear." | "All five website features, the optional reservations service, and all seven management items appear." |
| §5 acceptance, line 303 | "…with the note that content updates and seasonal refreshes don't count toward them." | "…with the note that content updates, seasonal refreshes, and reservations setup don't count toward them." |
| §5 acceptance (new) | — | "The reservations block appears with the approved wording, and the page has no booking widget, booking link, or reservation form." If D26: "Payment methods read 'cash or Venmo'." |
| §7 info documents, line 396 | "pricing ($60 the first month, then $40 a month, 4-payment and 4-month minimum)" | "pricing ($60 the first month, then $45 a month, 4-payment and 4-month minimum, $195 total), payment methods (cash or Venmo), what's included, and the optional reservations service" |
| §7 info documents (new bullet) | — | "The onboarding question 'Do you want a reservations service connected to your website?' in the 'What we need from you' list." |
| §12 (new bullet) | — | "Never add a booking system or a reservation form to this site. Never store anyone's booking information." |

**Asset status corrections** (the spec says these are "Available", but they are not in the repo):

| Where | Now | After |
| --- | --- | --- |
| §2 Logo, lines 79 and 87 | "Available." / "Files are in `brand/` … `logo.svg` … `mark.svg` …" | "Favicons are in `brand/`. `[NEEDS ASSET: logo.svg, logo-on-dark.svg, logo-mono.svg, mark.svg]`: not in the repo yet. Until then, the header and footer use a temporary stand-in (CR-001 D5)." |
| §4 Visual Content line 212, §10 line 542 | "Logo (available)" / "Logo: Available" | "Logo: `[NEEDS ASSET: logo.svg, logo-on-dark.svg, logo-mono.svg, mark.svg]` (temporary stand-in until provided)" |
| §2 Image Direction lines 91-94, §6 line 339, §10 line 544 | Screenshots of tradesitessd.com and Kevin's dad's site "available" | Move to Needed: `[NEEDS ASSET: screenshots of tradesitessd.com and Kevin's dad's site]` (CR-001 D8) |
| §11 Needs Asset (after line 582) | — | Add both items above, each with "Must be resolved before: Phase 6" (see **D30**) |

**Spec edits from the design decisions** (each one only if that decision is approved):

| Decision | Spec line | After |
| --- | --- | --- |
| D1 | §3 line 158 | "No more than 2 buttons visible on the screen at once (the sticky bar counts; the header button does not)." |
| D1 | §4 acceptance line 235 | "No more than 2 buttons are visible on any screen, not counting the header button." |
| D2 | §4 line 197 | "1. **Header:** logo, navigation, header button." |
| D4 | §2 line 98 + §10 line 544 + §11 line 579 | Add `[NEEDS ASSET: example barbershop website (demo site)]` and `[NEEDS ASSET: example bakery website (demo site)]` |
| D6 | §11 line 579-580 | Add: "CR-001 D6: the design ships with labeled placeholder windows; real demos replace them later." Must be resolved before Phase 6. |
| D7 | §6 line 340, §10 line 543, §11 lines 555-556 and 581-582 | "No team photo for now (CR-001 D7)." The decision is resolved. |
| D11 | §3 line 150 | "Header, right side (every page except Contact; hidden on phones under 768 px, where the sticky bar replaces it)" |
| D12 | §3 line 125 | "The logo in the header links to Home. Under 1024 px, navigation collapses into a menu button with a real `<button>` element and an accessible label." |
| D13 | §3 line 151 | "…side by side (stacked at equal full width on phones under 768 px)…" |
| D14 | §4 acceptance line 232 | "The two hero buttons are the same height and share a left edge with the heading on phone and tablet, and with the lead text on desktop." |
| D15 | §4 line 203 | "Built for San Diego's local businesses." with "local businesses" as the highlight phrase (marigold-text, not italic). |
| D17 | §4 acceptance line 231 | "At 1280 px and wider, the heading is on the left and the lead text and buttons on the right…; below 1280 px they stack…" |
| D19 | §2 line 73 + `README.md` line 8 | `design-reference.png` → `design-reference.webp` |

### Site wording (`public/`), Part A only

| Where | Now | After |
| --- | --- | --- |
| `index.html:51` price line | "$60 the first month, then $40 a month." | "$60 the first month, then $45 a month." |
| `index.html` "Your website" list (after line 106) | 5 items | Add: "Optional reservations service, at no extra cost from us" |
| `offerings.html:7` meta description | "…$60 the first month, then $40 a month." | "…$60 the first month, then $45 a month." |
| `offerings.html:57` | "**$40 a month** after that" | "**$45 a month** after that" |
| `offerings.html:64` | "**4 payments** ($60 + $40 + $40 + $40) and **4 months** before you can cancel." | "**4 payments** ($60 + $45 + $45 + $45 = $195) and **4 months** before you can cancel." |
| `offerings.html` Price block (new line, only if D26) | — | "Pay by cash or Venmo." |
| `offerings.html` "Your website includes" (after line 80) | 5 items | Add: "Optional reservations service, at no extra cost from us" |
| `offerings.html` new block under the two lists | — | **Reservations (optional, no extra cost).** + the A1 description. |
| `offerings.html:94` edits note | "Content updates and seasonal refreshes do not count toward the 2 edits." | "Content updates, seasonal refreshes, and setting up reservations do not count toward the 2 edits." (rest unchanged) |

No reservation form, booking widget, or booking link is added to this site.

### `specs/business-brief.md` (D29)

| Where | Now | After |
| --- | --- | --- |
| Line 30 | "Website includes: menu, prices, deals and combos, location, and reviews." | Add: "…and an optional reservations service at no extra cost from us (a button or widget to a booking service in the client's name, with the client paying any service fees, or a reservation request form; a request is not a confirmed booking)." |
| Line 39 | "$60 for the first month, then $40 a month." | "$60 for the first month, then $45 a month." |
| Line 42 | "4 payments ($60 + $40 + $40 + $40)" | "4 payments ($60 + $45 + $45 + $45 = $195 total)" |
| Section 3 (new bullet) | — | "Payment methods: cash or Venmo." |
| Lines 44 and 114 | "[NEEDS DECISION: whether content updates and seasonal refreshes count toward the 2 edits a month]" | Line 44: "Content updates, seasonal refreshes, and reservations setup do not count toward the 2 edits (decided; see spec §5)." Line 114: removed. |

### `specs/info-docs/` (all 9 files)

The same edits in each file. Line numbers are for the bakery file; the others are 0-3 lines later (restaurant +3; barbershop, HVAC, car detailing +2; gym, house cleaning +1). Match on the quoted text, not the line number.

| Where | Now | After |
| --- | --- | --- |
| Line 3 (status) | "Status: APPROVED by Kevin, 2026-09-29" | "Status: APPROVED by Kevin, 2026-09-29 · Updated 2026-10-08 by CR-001 ($45 a month, cash or Venmo, reservations)" |
| Price, line 42 | "**$40 a month** after that" | "**$45 a month** after that" |
| Price, line 44 | "4 payments ($60 + $40 + $40 + $40) and 4 months." | "4 payments ($60 + $45 + $45 + $45 = $195 total) and 4 months." |
| Price, line 48 | "**How to pay:** cash or Zelle." | "**How to pay:** cash or Venmo." |
| "Every month, we handle" (edits line) | "(content updates and seasonal refreshes don't count toward these)" | "(content updates, seasonal refreshes, and setting up reservations don't count toward these)" |
| New section after "What you get" | — | "**Reservations (optional, no extra cost from us):** If you want, we connect a reservations service to your website: a Reserve or Book Now button (or a booking widget) linked to a booking service in your name, like OpenTable, Resy, Tock, Yelp, Square Appointments, Calendly, Booksy, or Vagaro (you pay any service fees), or a reservation request form that emails you. A request is not a confirmed booking. We never store your customers' booking information." |
| "The basics" (new item) | — | "Yes or no: Do you want a reservations service connected to your website? If yes, which booking service you use (or want), or whether you'd rather have a request form." |

Booking items that already exist:
- **Barbershop and lash studio** (D28): line 20 ("Online booking (from your booking app)" / "Online booking") becomes "Book Now button linked to your booking app (optional, see Reservations below)". In these two docs the new basics item reads "Yes or no: Do you want a reservations service connected to your website? If yes, send your booking link below, or tell us if you'd rather have a request form." That way the booking link isn't asked for twice. Their existing booking-link items (barbershop line 76, lash line 73) stay.
- **Tattoo shop** ("How booking and consultations work", lines 21 and 73) and **car detailing** ("How customers book with you now", line 77) stay as they are.

### Outside this repo (not changed by this CR, listed so nothing is missed)

- The **team hub's copies of the 9 info docs** (the hub sends them, spec §7) need the same edits, or new leads will still be told $40 and Zelle (D29).
- Any flyers, the client-site template or skill, or pitch notes that say $40 or Zelle.

---

# Part B: Design, layout, and page structure

## B0. Rules for Part B

**Changes:** CSS, HTML structure, layout, the Google Fonts link, decorative markup (awnings, street line, menu icon), a one-line `<head>` script that sets the `js` class, and small front-end scripts (window glow, menu icon). New class names are allowed for new parts.

**Does NOT change:**
- Any wording, except Part A and the decisions marked "(wording)" that you approve.
- The contact form: its fields, ids, names, order, `required` rules, validation, messages, `action="/api/leads" method="post" novalidate`, every `data-method-field` and `aria-describedby`, and `#form-status` with `role="status" tabindex="-1"`.
- The honeypot stays off-screen, `aria-hidden`, and out of the tab order (the `.honeypot` rule stays). The `[hidden] { display: none !important; }` rule stays.
- The script hooks: `.menu-toggle` (with `aria-expanded` and `aria-controls="site-nav"`), `#site-nav`, `[data-hero]` (on Home's `.hero` section and each inner `.page-hero`, never on a wrapper that also holds the dusk band), `[data-closing-band]`, `[data-sticky-cta]`, `[data-year]`, and the `js`, `is-open` and `is-visible` classes. If one must be renamed, `script.js` changes in the same commit.
- In `script.js`, the marketing-source block and the contact-form block are unchanged. New code checks that its elements exist and sits outside those blocks, so it can never stop the form code.
- How the form submits: the same payload to `POST /api/leads`, and `server.js` forwards it to the hub's `POST /api/intake/website` exactly as today (intake contract unchanged).
- `INTAKE_SECRET`, the admin password, the database, retries, `utm_source` tracking, and all other backend behavior. `server.js`, `package.json`, `package-lock.json`, `.replit`, and `replit.md` are not edited. No new dependencies.
- `admin.html` / `admin.js` (Phase 5 work). They share `style.css`, so they are only checked so they don't break.
- Every `[NEEDS …]` flag (15 today) stays in its file. The only flag changes are the logo flag (B3) and the ones the approved decisions add.
- No booking system or reservation form is added to this site.

**Design system first (DS rule 2 and §8):** every new token or component is added to `DESIGN-SYSTEM.md` / `tokens.css` first, then built.

## B1. What R3-3 shows (1440 × 900 artboard)

- **Header:** the logo (outline storefront mark + "Mainstreet Sites SD" wordmark, Fraunces 600, about 24px) on the left. The nav sits halfway between the logo and the button, items about 32px apart. The current page ("Home") is forest and the others are body gray, all the same weight, with no underline. The button on the right is about 48px tall. There's no border under the header, **no "San Diego"** (D2), and **no arrows** (D3).
- **Content edges:** 88px side padding, so the content is the full 1264px wide (today it's 1091px).
- **Hero:** the heading and gold rule on the left. The right column starts at 55% of the content width (x ≈ 780, about 572px wide) and holds the bold-start lead, two 52px pill buttons with larger labels than the header button, and the price line. The content sits at the top under the header, leaving about 215px of cream above the band. Hero and band together fill the first screen.
- **Dusk band:** cream fades to `#1A2B33` about 30% of the way down, then to night: about 300px of gradient, then a night-3 street line. The gradient and street line run the full window width.
- **Storefront street:** 3 storefronts plus a fact-line column make **4 equal columns** across the 1264px content (about 295px each, about 28px apart).
  - Awnings are about 26px tall: 15 equal stripes (forest/cream, marigold/cream, brick/cream), color at both ends, rounded top corners, the same width as the body.
  - Bodies are night-2. Windows are **solid glow panels** (no dashed border) with a soft marigold glow, inset about 12px, with a centered bracketed label (D4).
  - The **middle storefront is about 30px taller.** Window bottoms sit about 12px above the street line.
- **Fact lines:** the 4th column, stacked, 16px, about 8px apart, bottom-aligned with the window bottoms. Marigold-bright labels on night text.
- **3 buttons on the first screen** (header + hero pair). The locked design itself breaks the "max 2 buttons" rule (D1).
- **Out of date in the image:** "$40" (Part A), no arrows (D3), no "San Diego" (D2).

## B2. Design-system additions (built first)

**New tokens in `tokens.css`** (and the copy at the top of `style.css`, which stays identical):

| Token | Value | Why |
| --- | --- | --- |
| `--color-dusk-mid` | `#1A2B33` | The gradient's middle stop (DS §3 writes the hex; it has no token). |
| `--gradient-dusk` | `linear-gradient(var(--color-cream) 0%, var(--color-dusk-mid) 30%, var(--color-night) 100%)` | Used once, on Home. |
| `--radius-field` | `10px` | Form fields (DS §5 says 10px; today it exists only in `style.css`). |
| `--duration-fast` | `150ms`; `0ms` under reduced motion | Button hover (DS §7). Today it's hard-coded and doesn't turn off. |
| `--measure` | `30em` | DS §4 "max ~65 characters". 16px Instrument Sans averages about 7.4px per character, so 65 characters ≈ 30em. Today's `65ch` (715px) gives 91-102 characters with the real fonts. At the 19px lead, 30em is about 570px, the same as R3-3's lead column. Re-checked in commit 7; if lines land outside 60-70 characters, the value changes here and in `tokens.css` before the page commits. |
| `--leading-heading` | `1.15` | Two-line h2/h3. 1.03 stays for the hero heading. |
| `--focus-light` / `--focus-dark` | `var(--color-forest)` / `var(--color-marigold)` | Focus ring (D16). |
| `--awning-height` | `var(--space-5)` (24px) | R3-3 ≈ 26px |
| `--storefront-lift` | `var(--space-6)` (32px) | The middle storefront's extra height; R3-3 ≈ 29px |
| `--street-gap` | `var(--space-5)` (24px) | Gap between the 4 street columns; R3-3 ≈ 28px |
| `--street-line` | `var(--space-2)` (8px) | Street line height |

**New or updated components in `DESIGN-SYSTEM.md` §5** (plus the DS text edits listed at the end):

| Component | Look |
| --- | --- |
| Header (updated) | Cream, no bottom border, the same height on every page. 1024px and up: logo left; nav centered in the space between the logo and the button, items `--space-6` apart; button right. On Contact, the right slot keeps the button's width so the nav doesn't move. 768-1023px: logo left; header button, then "Menu", on the right; one row (D12). Under 768px: logo left, "Menu" right, one row, header button hidden (D11). At 320px it still fits one row: a `--space-2` gap, "Menu" as icon plus text, logo at least 32px tall. |
| Nav link (new) | Instrument Sans 500, `--color-body`. Current page: `--color-forest`, 600 weight (D18), `aria-current="page"`, no underline. Hover: forest. |
| Header button (updated Primary) | 48px tall, `--text-body` label. |
| Hero buttons (updated Primary + Secondary) | 52px tall, `--text-lead` label (R3-3). |
| Secondary button (updated) | Hover: `--color-cream` background over `--duration-fast` (D23). |
| Closing band button (updated) | Hover: `--color-glow` background (today's behavior, now written down) (D23). |
| Phone menu (new) | The same `<button type="button" class="menu-toggle" aria-expanded="false" aria-controls="site-nav">` with the visible text "Menu" in both states. Only its look changes: no pill border or fill (so it doesn't count as a button), plus a decorative open/close icon drawn in CSS or an inline SVG with `aria-hidden="true"`, switched by `aria-expanded`. The open nav is a full-width cream panel under the header: 48px rows, line-soft dividers, current page marked. With JavaScript off, the nav shows as today's expanded list. |
| Storefront (updated) | Awning (`--awning-height`, 15 equal stripes with the color at both ends, `--radius-awning` top corners, one stripe color per store plus cream), night-2 body, and a window inset `--space-3`. **Placeholder state:** a solid `--color-glow` panel with a `--color-glow-shadow` glow and a centered `[Example: …]` label in `--text-small` ink. No dashed border; the `placeholder` class comes off the windows; the `[NEEDS ASSET]` comments stay. Where: Home dusk band only (business types stay plain text, spec §4 item 4). |
| Storefront street (new) | See the B4 width table. 1280px and up: 4 equal columns on the content grid (3 storefronts + fact lines), the middle store raised `--storefront-lift`, windows bottom-aligned on the `--street-line`, fact lines bottom-aligned with the window bottoms, the gradient starting about `--space-8` above the tallest awning. Under 768px: a sideways-scrolling row with scroll-snap, each store 80% of the row so the next one peeks, the middle store still taller, the street line under the row, and the fact lines stacked under it on solid night. The gradient sits behind the storefront row only. The scrolling element is a wrapper `<div>` around the `<ul>` (the list keeps its list role) with `tabindex="0"`, `role="region"`, `aria-label="Example sites"` (D31) and the focus ring. From 768px up it doesn't scroll and isn't focusable. |
| Fact line (updated) | `--text-body`, `--leading-heading`, `--space-2` apart. |
| Inner page hero (new) | Heading + gold rule + lead, stacked, lead held to `--measure`, no gradient (D10, D21). |
| Split section (new) | Heading on the left (about 40%), text or list on the right, from 1024px. Stacked below that. |
| Statement section (new) | Section heading (with the highlight phrase) + one line of body text, left-aligned, no box or background. |
| Check list (new) | List items with a small marigold check mark drawn in CSS (DS: marigold is for icons). The text is unchanged. |
| Step card (updated Card) | A Card with a 32px marigold circle badge holding the step number in ink, 600 weight (about 7.5:1). Never marigold text on cream or paper. |
| Placeholder (new) | The existing dashed box for `[NEEDS …]` items on cream pages (Offerings image, About screenshots, Cheyenne box). Never inside storefront windows. |
| Info card (new) | The Card component used beside a form (Contact: service area and availability). |
| Terms panel (new) | Price and minimum term side by side inside the package card, separated by a line-soft rule instead of nested boxes. Stacked on phones. |
| Choice (new) | Radio and checkbox rows: 20px control, forest accent, 44px label row (today's look, written down). |
| Form field (updated) | Inputs and select exactly 48px tall. Focus uses the Focus ring. Placeholder text `--color-subtle`. |
| Form feedback (new) | Today's error text, invalid border, success/error box, and sending state, written down with tokens. The look stays almost the same. |
| Focus ring (new) | 2px `--focus-light` outline on light backgrounds and 2px `--focus-dark` on night, with a 3px offset (D16). |
| Footer (updated) | Night. From 768px: three columns (logo + name/tagline; page links; service area, hours, email) plus a bottom row (copyright, Privacy Policy). Stacked on phones. Every link at least 44 × 44px. |

**DS §7 Motion** adds: the sticky phone bar slides up over 400ms (already built; D24). Button hover uses `--duration-fast`. Everything turns off under reduced motion.

**DS text edits:**

| DS line | After |
| --- | --- |
| 3 | Add: "Screenshot: `r3-3-day-to-dusk-home.webp` (layout reference; wording comes from spec.md)." |
| 17 | Add: "The SVG files are not in the repo yet (spec §11); a temporary stand-in is used until they are." |
| 27 (forest) | Use: "Headings, primary buttons, the current nav item (other nav items use body)" |
| 39 | "Used once, on the Home page, at the bottom of the hero, leading into the storefront street." (D10) |
| 62 (Highlight phrase) | Where: "Hero heading; Home 'Who it's for' heading" (D15) |
| 66 (Storefront) | Where: "Example sites (Home dusk band)" |
| 71 (Form field) | Focus: "the Focus ring" (D16) |
| 76 | "Content width 1264px max, not counting the side padding of 24px (phone) to 88px (desktop)." |
| 77 | "Hero (1280px and up): …" (D17) |
| §4 (new row) | "Package name (Offerings) \| Fraunces 500 \| 32 → 44px \| The page's main card title" (D20) |

## B3. Sitewide (all 5 public pages)

| Change | Details |
| --- | --- |
| Fonts | Add the Google Fonts link (Fraunces 500/600, Instrument Sans 400/500/600, `display=swap`) to every page head, before `style.css` (D9). Bold text uses the 600 weight. |
| Content width | 1264px of content plus 24-88px padding (R3-3) on `.container`, the header, and the footer. |
| Header + nav | Built per the B2 Header, Nav link, and Phone menu rows. |
| Logo | The SVG files aren't in the repo. Until `logo.svg` and `logo-on-dark.svg` arrive: keep the favicon mark at 32px. If D5 (a) is approved, set the stand-in name "Mainstreet Sites SD" in `--font-display`, 600, `--text-h3`, forest, `--space-4` after the mark, to look like R3-3's wordmark (20px on phones so the header fits one row). Change the HTML comment to `[NEEDS ASSET: logo.svg, logo-on-dark.svg]`. The logo is not redrawn. |
| "js" class | A one-line script in each page `<head>` sets it before first paint, so the phone menu doesn't flash open. |
| Footer | Per the B2 Footer row. Same text as today. The footer logo waits on D5. |
| Line length | Body text, leads, and list items use `--measure`. |
| Spacing | Sections are exactly `--section-gap` apart. Today inner pages have 136-216px of empty space under the page heading. |
| Headings | Hero heading 1.03; h2/h3 `--leading-heading`. Small sub-headings (Contact, Privacy) use weight 600. |
| Focus and tap targets | Focus ring per B2. Standalone links, footer links, and the skip link are at least 44px. |
| Motion | Button hover uses `--duration-fast`; nothing moves under reduced motion. |
| Sticky phone bar | Same rules. Add bottom scroll padding so it never covers a link you tab to. The footer's extra bottom room only appears on pages with the bar (not Contact). |

## B4. Home (`index.html`)

**Layout by width (D17):**

| Width | Hero | Storefront street |
| --- | --- | --- |
| Under 768px | Heading, gold rule, lead, buttons (equal full width, D13), price line | Scrolling row, fact lines under it (B2) |
| 768-1279px | Stacked; buttons side by side | 3 storefronts in one row (fluid width, middle still taller); the 3 fact lines in a row under them |
| 1280px and up | 55% / 45% columns with no gap (right column at x ≈ 780 at 1440), both top-aligned (today's `align-items: end` goes). Content right under the header; hero + band fill the first screen (`min-height: 100svh` for both together), with the band pinned to the bottom. | 4 equal columns (R3-3) |

| Section | Change (same wording unless noted) |
| --- | --- |
| Hero | Per the table. The price-line link never breaks across lines. |
| Dusk band | `--gradient-dusk` from the bottom of the hero to the street line. Used only here. `data-hero` stays on the `.hero` section. |
| Storefront street | Per B1 and B2. Labels per D4 (wording). Windows fade their glow in once (400ms) when scrolled into view; they are lit when JavaScript is off or motion is reduced. |
| Fact lines | The same three lines. |
| Who it's for | Statement section. "local businesses" keeps the marigold highlight (D15). The 9 business types stay plain text. |
| Why a website matters | Split section. |
| What's included | Two Check lists side by side + the "See what's included" text link. The Part A reservations item is added in commit 4. |
| How it works | The same 4 Step cards. |
| Closing band | The same night band and marigold-bright button, in the real fonts. |

## B5. Offerings (`offerings.html`)

- Inner page hero.
- The package card fills the content width. Inside it, in order: the Terms panel (price left, minimum term right, the same screen area as now); the two Check lists side by side; the Reservations block; "How it starts"; the Placeholder image; and "Get Started →" at the bottom of the card.
- Part A wording is added in commit 4; this commit only lays it out. No booking form or widget.
- The package name keeps its larger size (D20).

## B6. About (`about.html`)

- Inner page hero.
- Desktop (1024px and up): "Why we started" as a split section; "Our experience" next to the screenshots slot; "How we work" and "Meet Cheyenne" side by side. Phone: one column.
- Screenshots slot: per D8, a visible Placeholder box with the existing flag text until the files arrive.
- No team photo and no photo placeholder (D7).

## B7. Contact (`contact.html`)

- Inner page hero (no header button, as now).
- Desktop: the form on the left (about 7/12) and an Info card with "Service area" and "Availability" on the right, top-aligned with the form. Phone: the form first, then the reply line and "Email us", then the Info card.
- Text inputs are exactly 48px tall (today 51.6px; the select is already 48px). The textarea stays taller.
- **Fields, ids, names, order, validation, messages, and submission are unchanged.**

## B8. Privacy (`privacy.html`)

- Inner page hero with the effective-date placeholder still visible.
- Prose held to `--measure`, with weight-600 sub-headings. Same wording.

## B9. Build plan (Step 3, after approval)

On branch `claude/great-tesla-vkevqp`, one commit per item, then one PR, merged with a merge commit (not squash). The merge timing follows D25.

1. This CR (status `APPROVED`) + `design-system/r3-3-day-to-dusk-home.webp`.
2. `spec.md` + `README.md`: Part A edits, asset-status corrections, and the edits for the approved decisions.
3. `business-brief.md` + the 9 info docs: Part A edits.
4. Site wording, Part A only: `index.html` (price line, reservations item) and `offerings.html` (meta, $45, $195, payment line if D26, list item, Reservations block, edits note). No CSS or layout changes.
5. Approved wording decisions only (D2, D4, D8). No CSS or layout changes. (D31's screen-reader label goes in with the storefront street, commit 10.)
6. Design system: tokens + components + DS text edits (B2).
7. Fonts, base type, `style.css` tokens, focus ring; measure and set `--measure`.
8. Header + nav + phone menu.
9. Footer.
10. Home hero + dusk band + storefront street.
11. Home lower sections.
12. Offerings layout.
13. About.
14. Contact.
15. Privacy + final spacing pass.

Commits 6-15 change no visible wording (checked in B10).

## B10. How it will be checked

- **Widths:** every page at 320, 375, 768, 1024, 1279, 1280, and 1440px. No page-level sideways scrolling (the storefront row's own scroll is expected), max 2 buttons per screen (not counting the header button if D1), 44px tap targets, and visible focus.
- **R3-3:** Home at 1440 × 900 compared side by side with R3-3. Expected differences: the $45 price line (Part A), the arrows (D3), the logo mark until the SVGs arrive (D5), and "San Diego" if D2 is not approved.
- **Wording check:** before commit 6, save from `main` for each public page: `document.title`, the meta description, every `alt` and `aria-label`, `document.body.textContent` (whitespace collapsed), and `innerText` at 375px (menu open) and 1440px. Save the same on the finished branch. The only differences allowed are the A2 site-wording rows and the approved wording decisions (D2, D4, D8, D31). No visible words come from CSS `content:` except the step numbers. The diff goes in the report.
- **Form (fake data only):** tested on a local server with `HUB_URL` and `INTAKE_SECRET` unset, using a throwaway local PostgreSQL, or with `POST /api/leads` intercepted in the test browser and answered with `server.js`'s own reply. Never sent to the live Replit site or the team hub. (If Kevin or Kayden test on Replit, the test lead goes to the hub like a real one.)
  - For the same fake inputs (Email and Text), the request body is captured on `main` and on the branch and compared byte for byte.
  - Validation messages, the Email/Text switch, and the success and error messages all show.
  - "Other (special request)" shows its own message.
  - Focus goes to the first invalid field, and to the status line after sending.
  - `/?utm_source=test` in a fresh browser, then Contact → the payload has `source: "test"`.
  - The honeypot isn't visible or reachable by Tab.
- **Untouched files:** `git diff main -- server.js package.json package-lock.json .replit replit.md public/admin.html public/admin.js` is empty. No secrets in any file. In `script.js`, the marketing-source and contact-form blocks are unchanged.
- **Flags and behavior:** every `[NEEDS …]` flag on `main` is still in its file. No console errors on the 6 pages (5 public + admin). The phone menu opens and closes (tap and Escape). The sticky bar still appears right after the hero on phones. `admin.html` still looks right at 375 and 1440px.
- **Screenshots:** before/after of every page, phone and desktop, shown to you before the merge.

---

# Decisions needing confirmation

Each decision has a recommendation. You can answer "approve with the recommendations", or change any number.

**Design**

| # | Decision | Recommendation |
| --- | --- | --- |
| D1 | The spec says "max 2 buttons on screen", but Home's first screen has 3 (header button + hero pair). R3-3 shows 3 too. | Change the rule: the header button doesn't count. This matches R3-3. |
| D2 | The spec puts "San Diego" in small text beside the logo; R3-3 doesn't show it, and it makes the phone header wrap to 2 rows. | Follow R3-3 and remove it from the header ("San Diego" is still in the hero heading and footer). (wording) Other option with no wording change: stack it in small text under the logo. It fits one row at 375px, but it differs from R3-3. |
| D3 | The spec's button labels have an arrow ("Get My Info Doc →"); R3-3's don't. | Keep the arrows (approved spec wording). Say so if you want them removed. |
| D4 | Storefront window labels: today "Example restaurant site coming soon" ×3; R3-3 shows "[Example: restaurant]", "[Example: barbershop]", "[Example: bakery]". | Use the R3-3 labels. (wording) The brackets mark them as temporary (spec §2 line 106); real demos later get captions starting "Example:" (line 107). This adds two assets: window 2's flag becomes `[NEEDS ASSET: example barbershop website (demo site)]` and window 3's becomes `[NEEDS ASSET: example bakery website (demo site)]`. If you want restaurant demos only, use "[Example: restaurant]" in all three windows. |
| D5 | Logo SVGs (`logo.svg`, `logo-on-dark.svg`, `logo-mono.svg`, `mark.svg`) are missing; only PNG favicons were committed. (a) Until they arrive, should the stand-in name be set in Fraunces 600 to look like R3-3's wordmark (today it's Instrument Sans 16px)? It stays a temporary stand-in, not a retyped logo file. (b) R3-3 shows the logo about 26px tall; DS §2 says at least 32px. | Kevin uploads the SVGs to `brand/`. (a) Yes. (b) 32px (DS). |
| D6 | Demo-site screenshots (`[NEEDS ASSET]`, due before Phase 3). When real screenshots replace the placeholders, where does the required "Example: [business type]" caption go? R3-3 only shows the placeholder state. | Ship with the glowing placeholder windows now. Later, put the caption in a strip along the bottom edge inside the window (glow background, small ink text); confirm before the screenshots go in. |
| D7 | Team photo (`[NEEDS DECISION]`, due before Phase 3). | No team photo for now. |
| D8 | About page screenshots (tradesitessd.com, Kevin's dad's site) aren't in the repo. | Send the two files. Until then, show a visible box with the existing flag "[NEEDS ASSET: screenshots of tradesitessd.com and Kevin's dad's site, labeled accurately]". (wording) If you'd rather not show it, the flag stays a hidden comment and "Our experience" stays one column. |
| D9 | Fonts from Google Fonts (DS §4) send each visitor's IP to Google, which the Privacy Policy doesn't mention. The other option is hosting the same fonts ourselves. | Use Google Fonts as the DS says. |
| D10 | DS says the gradient is used "once per page". Should inner pages get one? | No. It belongs to the Home storefront street. Inner pages stay cream down to the night closing band or footer. |
| D11 | The header button is hidden on phones (the sticky bar replaces it), but the CTA map doesn't say so. | Keep it hidden and write that into the CTA map. |
| D12 | The tablet (768-1023px) header doesn't fit on one row with the full nav. | Use "Menu" up to 1023px, keep the header button from 768px, and show the full nav from 1024px. |
| D13 | Spec says the hero buttons are "side by side"; on a 375px phone they don't fit. | Stack them at equal full width on phones, side by side from 768px. |
| D14 | Acceptance: "hero buttons share a left edge with the heading." On desktop the spec puts them in the right column, so they can't. | Reword it as in A2. |
| D15 | "Built for San Diego's *local businesses*.": the spec shows italics, and the DS allows the highlight phrase only in the hero heading. | Keep the marigold highlight (not italic) and add this heading to the DS. |
| D16 | Focus ring: DS says marigold, but on cream it's hard to see (1.9:1). | Forest ring on light backgrounds, marigold on night. |
| D17 | Where the desktop hero starts. Today it splits at 1024px, but the button pair only fits the right column from about 1280px. | Split at 1280px (R3-3 layout); stack from 768-1279px (B4 table). Reword the §4 acceptance as in A2. |
| D18 | Nav current page: R3-3 shows it only by color (forest vs. gray, 1.6:1 apart, which is hard to tell apart). | Also make it 600 weight so it doesn't rely on color alone. |
| D19 | Spec line 73 and README say `design-reference.png`; the file is `.webp`. | Fix the name in both. |
| D20 | Offerings package name: DS card heading (20-24px), or keep it larger as the page's main title? | Keep it larger (32-44px) and add it to the DS. |
| D21 | Inner page heroes: stacked, or Home's 55/45 split? | Stacked (heading, gold rule, lead). |
| D22 | Field borders use the light line color (1.4:1 against cream). | Keep the DS line border; the labels and white fields make the fields clear. Revisit if a tester has trouble. |
| D23 | The secondary button has no visible hover; the closing button's hover (glow) isn't in the DS. | Secondary: cream background on hover. Closing: keep glow. |
| D24 | The sticky bar's 400ms slide-up isn't in DS §7. | Keep it and add it to §7 (off under reduced motion). |
| D25 | CLAUDE.md says merge to main once a phase runs, then stop. Replit deploys from main. | For this CR, hold the merge until you approve the before/after screenshots. |

**Content (Part A)**

| # | Decision | Recommendation |
| --- | --- | --- |
| D26 | Show "Pay by cash or Venmo." on the public Offerings page, or only in the info docs? | Show it on Offerings, in the Price block. |
| D27 | Approve the drafted wording in A2: the reservations list item, the Offerings Reservations block, the edits notes, the info-doc section and onboarding question, and the brief lines. | Approve as written, or edit any line. |
| D28 | Barbershop and lash info docs list "Online booking" as always included and already ask for the booking link. | Reword their line 20 and the new basics item as in A2. (wording) |
| D29 | The team hub's copies of the info docs also say $40 and Zelle. `business-brief.md` too. | Kevin updates the hub's copies in the hub repo before or with this release. Update `business-brief.md` here, as in A2. |
| D30 | The new `[NEEDS ASSET]` items (logo SVGs, About screenshots, and D4's demo sites) need a deadline. | Must be resolved before Phase 6 (launch). |
| D31 | On phones the storefront row scrolls sideways, so it needs a screen-reader name to be reachable by keyboard: "Example sites" (not visible; it shortens the band's existing label "Example sites and key facts"). | Approve. (wording, screen-reader only) |

---

## Approval

Approved by Kevin on 2026-10-08 ("approve CR-001 build it and merge it when you're done"). All recommendations accepted.
