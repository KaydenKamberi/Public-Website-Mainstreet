# CR-002 (public site): Design polish, reviews section, and a concept showcase site

| | |
| --- | --- |
| **Status** | `APPROVED` by Kevin, 2026-10-08, with every recommended decision (D1-D18): "approve CR-002 build it and merge it". |
| **Requested by** | Kevin, 2026-10-08 |
| **Builds on** | CR-001 (Day to Dusk rebuild, merged 2026-10-08) |
| **Rules** | Design system first (new tokens and components go into `DESIGN-SYSTEM.md` / `tokens.css` before they're used). No backend changes. The contact form, hub intake, and `INTAKE_SECRET` are untouched. No invented facts or reviews (constitution §2). |

## 1. Designer review: what's holding the site back

Home's first screen now matches R3-3. Everything below it, and the other pages, still read as **stacked blocks of text**:

1. **Offerings buries the price.** "$45 a month" is the same size as body text inside a bullet list. The page is one long card of bullets: price, minimum, 13 list items, reservations, how it starts.
2. **About has no people and no visuals.** Four lists and two dashed placeholder boxes. Visitors can't tell who Kevin, Kayden, and Cheyenne are at a glance.
3. **Every section looks the same.** Heading, then paragraph or list, on cream. There's no rhythm: no alternating backgrounds, no icons, and no labels that say what each section is.
4. **The pages are static.** Only the storefront windows move. Nothing reacts when you scroll or hover.
5. **Contact doesn't show what happens next.** The "info doc in 5 minutes" and "reply within 24 hours" promises are plain sentences.
6. **No social proof yet.** There's nowhere for client reviews or real client sites to go once they exist.

## 2. Proposed changes

### P1. Section rhythm (all pages)
- Alternate **cream** and **paper** (white) section backgrounds so sections read as separate "rooms". Night stays for the dusk band, closing band, and footer.
- **Eyebrow labels**: a short uppercase label above section headings (e.g. "PRICING", "HOW IT WORKS", "THE TEAM") in small, letter-spaced marigold-deep text. (D3: the label words are new wording.)
- More whitespace inside cards on desktop (24px → 32-48px).

### P2. Typography upgrades
Keep Fraunces + Instrument Sans: they fit the brand, and R3-3 uses them. New type roles:
- **Display number**: Fraunces 500 at hero size for prices ("$45"), with a small "/month" beside it. Numbers use tabular figures so prices line up.
- **Eyebrow**: Instrument Sans 600, 13-14px, uppercase, wide letter spacing.
- **Quote**: Fraunces 500, 22-28px, for review quotes.

### P3. Buttons and links
- **Designer recommendation: keep the pill shape for the 2 CTA buttons.** The pill is part of R3-3, the landing page you liked. Changing it would make the first screen and the rest of the site look like two different brands. The "boxy" feeling comes from the text blocks, not the buttons.
- Make buttons feel more alive instead: the arrow slides 4px right on hover, a soft lift and shadow on hover, and a pressed state.
- Section links ("See what's included", "See full pricing") become **arrow links**: forest text + "→", with an underline that grows in on hover.
- If you still want a different shape, **D1** offers rounded rectangles (10px corners) sitewide.

### P4. Motion system (adds to DS §7)
All of it is plain CSS + one small script (no animation libraries; constitution §9), and it all turns off under "reduce motion".
- **Scroll reveal**: sections and cards fade in and rise 16px when they enter the screen (400ms; cards in a row 60ms apart).
- **Sticky header**: after you scroll past the hero, the header stays at the top with a soft shadow (D4).
- **Card hover**: cards lift 2px and get a soft shadow.
- **Timelines draw in**: the "How it works" line and the Offerings payment timeline fill left to right once.
- The storefront glow stays as is.

### P5. Home (below the first screen)
- **Who it's for**: the 9 business types become small tag chips (not links or buttons, so they don't count toward the 2-button rule).
- **What's included**: 6 small icon cards for the website features (menu, prices, deals and combos, location, reviews, reservations) and a 2-column check grid for monthly management. Simple line icons, drawn inline as SVG.
- **How it works**: a horizontal 4-step timeline with a connecting line on desktop; a vertical timeline on phones.
- **Reviews** section (P9) between "How it works" and the closing band, hidden until real reviews exist.

### P6. Offerings
- **Price hero card**: big "$45 /month" display number, "$60 the first month" under it, and a **payment timeline** of 4 blocks: Month 1 $60 → Month 2 $45 → Month 3 $45 → Month 4 $45 = **$195**. Then "After that, you choose how many months to continue" and "You own your finished website". These are existing facts shown visually.
- **What's included**: the same icon cards as Home + the management check grid + the edits note.
- **Reservations**: a highlighted callout card with a small calendar icon. Same approved wording.
- **How it starts**: uses a storefront window (like Home) instead of the dashed box.
- **FAQ** (new, D5): a short accordion (`<details>`, no script) built only from facts already in the spec: "Can I cancel?", "Do I own my website?", "What counts as an edit?", "How do I pay?", "Does the reservations service cost extra?". The question wording is new; the answers reuse the existing sentences.

### P7. About
- **Team cards**: Kevin (co-founder), Kayden (co-founder), Cheyenne (team member), each with a **monogram circle** (initials on marigold), not a photo, so no fake faces and the "no team photo" decision holds. Text from the spec only; Cheyenne's card keeps his `[NEEDS CONTENT]` placeholder.
- **Our story** as a 2-step timeline: "Started with trade workers" → "Switched to restaurants", using the existing "Why we started" text.
- **Experience** as 4 small cards with icons (same 4 facts).
- **How we work** as 3 icon cards (demo first, in person, examples once we have clients).
- The screenshot slots become storefront windows labeled `[NEEDS ASSET]` until the files arrive.

### P8. Contact
- A **"What happens next"** strip beside the form, built from spec facts: 1) You send the form → 2) Your info document arrives within 5 minutes → 3) Kevin or Kayden replies within 24 hours. (D6: the step titles are new wording.)
- The service area / availability card gets small icons.
- **Form fields, validation, messages, and submission stay exactly the same.**

### P9. Reviews section (new)
- **Review card** component: the quote (Quote type), the person's first name, their business name and type, and an optional "See their site" link (only if they agreed). No star ratings unless they come from a real source (D8).
- **Where**: Home (after "How it works") and About.
- **Rule: the section stays hidden until there is at least one real review with written permission.** No placeholder or sample reviews ever appear on this site (constitution §2; spec §6 already says no reviews section until real reviews exist).
- **How reviews get in (D7, recommended)**: after a client's site launches, Kevin or Kayden sends a short message asking for (a) a 1-3 sentence review, (b) permission to show it with their first name and business name, and (c) permission to show their site as an example. A yes is saved as the written permission (kept privately, never in GitHub). Then each approved review is added to the spec and the page through a small CR, the same way client examples are added (spec §12).
- **Client sites as examples**: with permission, a real client's site replaces a placeholder in a Home storefront window (screenshot + "Example: [business type]" caption, linked to the live site).
- Later (optional): once Mainstreet Sites SD has a Google Business Profile, ask clients to leave the review there too, and link to it.

### P10. Concept showcase site ("what we can build")
- **A separate project** (its own repo + Replit), **not a page on this site**. That keeps this site simple (constitution §11) and gives you a sandbox to push design further.
- A **fictional business** (D9 recommends a family restaurant, our main target), with a made-up name that's checked so it isn't a real San Diego business. Placeholder menu, prices, and photos are allowed there because the whole site is labeled. A banner on every page reads: **"Concept site by Mainstreet Sites SD. Not a real business."** Sample reviews there are labeled "Sample review".
- It shows off "insane landing page" patterns: an animated hero, a scroll-driven menu, filters, a reservation-request demo that sends nothing, an "Open now" badge, and micro-interactions.
- **On this site**: one Home storefront window shows its screenshot with the caption "Example: concept site (not a real business)" and a link.
- **Feeding the design system**: when a pattern on the concept site works well (fast, accessible, looks good on phones), it's added to `DESIGN-SYSTEM.md` and to the client-site skill. The skill lives outside this repo, so Kevin updates it. The concept site gets its own spec/CR in its new repo.

### P11. Visuals: custom scenes made from our own work (revised after Kevin's feedback, 2026-10-08)
- **No generic stock photos on our sections.** Each image is a custom scene built in our brand colors (cream, forest, marigold), rendered at 2x so it stays sharp. Each one shows exactly what its section says:
  - *Why a website matters*: a phone search for "family restaurant near me" where the restaurant with a website shows its menu, hours, and Reserve button, and the ones without a website show nothing.
  - *How it works*: 1) a sketch turning into the demo site, 2) the demo on a tablet ("Shown to you in person"), 3) the demo on a phone with "Before you decide" checks (demo first, $60 then $45, you own it), 4) the live site with a **sample** monthly report (site up, hours updated, Google profile, domain).
  - *Offerings, what's included*: a menu card, a deal card, a location map, "Your Google reviews, shown on your site", and a Reserve button. No review quotes on our site.
  - *Reservations*: a phone with a reservation request form ending "This is a request, not a confirmed booking", plus "Emails the owner" and "Or a Book Now button" stickers.
  - *Contact*: a preview of the real restaurant info document.
- **Three concept sites**, each with the banner "Concept site by Mainstreet Sites SD · Not a real business · Sample content and prices", prices shown as "$00": *Olivo & Sal* (restaurant), *Crumb & Co.* (bakery), *Fade & Steel* (barbershop). Their screenshots fill the 3 Home storefront windows ("Example: concept restaurant / barbershop / bakery") and the Offerings device frames. Food and business photos appear **only inside** these concepts (Unsplash License, no people's faces).
- **About, Our work**: the experience list and the screenshot placeholder are replaced by a **wall of websites**: browser-framed screenshots of the 3 concepts, each captioned "Concept ... site · not a real business", under "Concept sites for now. Client sites will be added here, with each owner's permission." Real client sites replace concepts as permission comes in (P9).
- One photo remains: hands sketching layouts on the About story (higher quality, 1600px).

## 2a. Client walkthrough: bugs found and fixed in the mockup
- **Content could disappear**: if `script.js` failed to load (bad signal, blocker), 19 animated sections stayed invisible and the storefront windows stayed dark (the windows bug dates from CR-001). Fixed: content is only hidden for animation after `script.js` runs (`motion-ready` class).
- **About scrolled sideways at 768px** (team cards too wide). Fixed.
- **Offerings on phones**: the floating phone covered the "not a real business" caption. Fixed.
- **About story**: splitting the "Why we started" sentence into two timeline steps read as a broken sentence. Back to one paragraph.
- **Checked and fine**: every link works; the phone menu opens and closes (tap and Escape); bad email, letters in a phone number, and spaces-only names are caught; "+1 (619)…" numbers are accepted; a double-tap sends only 1 request; reduced motion shows everything without animation; the form payload is byte-identical.
- **Still open (needs decisions)**: typing a wrong address (`/pricing`) or adding a trailing slash (`/contact/`) shows a plain "Page not found." text page (D15). Visible `[NEEDS …]` boxes on About look unfinished to a client (D14).

## 3. Design-system additions (built first)

| Kind | Addition |
| --- | --- |
| Tokens | `--text-eyebrow` (13px), `--tracking-eyebrow` (0.12em), `--text-display-number` (= hero size), `--shadow-card` and `--shadow-lift` (soft, forest-tinted), `--rise` (16px), `--stagger` (60ms) |
| Components | Collage frame (arch / rounded + offset block), Sticker, Device frames (laptop, phone), Doc preview, Eyebrow, Display price, Payment timeline, Icon card, Icon (line style, 24px, forest or marigold), Tag chip, Timeline (steps), Team card + Monogram, Callout card, FAQ accordion, Review card, "What happens next" strip, Arrow link, Sticky header state |
| Motion (§7) | Scroll reveal, card hover lift, button arrow nudge, timeline draw-in, sticky header shadow. All off under reduced motion. |

## 4. What does NOT change
- The CTA placement map: still max 2 buttons on screen; chips and arrow links are not buttons.
- Approved wording, except the new labels listed in D3, D5, and D6.
- The contact form, `server.js`, the hub intake contract, `INTAKE_SECRET`, admin, and the database.
- No fake reviews, people photos, client names, or claims on this site.

## 5. Build plan and checks (after approval)
One commit per item on `claude/great-tesla-vkevqp`, then one PR, merged with a merge commit:
1. Spec + this CR (approved). 2. Design system. 3. Section rhythm + typography + buttons. 4. Motion. 5. Home lower sections. 6. Offerings. 7. About. 8. Contact. 9. Reviews component (built, hidden). 10. Storefront slot for the concept site (placeholder until it exists).

Same checks as CR-001: every page at 320-1440px with no sideways scrolling, max 2 buttons, 44px tap targets, and visible focus. A wording diff that allows only the approved new labels. The same form payload. Nothing moves under reduced motion. Before/after screenshots.

## 6. Decisions needing confirmation

| # | Decision | Recommendation |
| --- | --- | --- |
| D1 | Button shape: keep pills, or switch to 10px rounded rectangles sitewide? | Keep pills (R3-3 brand); add hover motion instead. |
| D2 | Alternate cream and white section backgrounds? | Yes. |
| D3 | Eyebrow labels above section headings (new words like "PRICING", "HOW IT WORKS", "THE TEAM", "WHAT'S INCLUDED"). | Yes. The exact label list goes into the spec for approval. |
| D4 | Sticky header after scrolling past the hero (on phones the sticky bottom bar already exists). | Desktop and tablet only. |
| D5 | Add an FAQ on Offerings (new question wording, answers from existing facts). | Yes, the 5 questions in P6. |
| D6 | "What happens next" strip on Contact (new step titles). | Yes. |
| D7 | How reviews are collected and published. | A message after launch asking for a review + permissions; each approved review is added by a small CR. |
| D8 | Star ratings on review cards? | No, unless the review comes from Google with a real rating. |
| D9 | Concept showcase site: business type and fictional name. | A family restaurant. Kevin picks the name; we check it isn't a real San Diego business. |
| D10 | Where the concept site lives. | A new repo + Replit, with its own spec. This site only links to it from a storefront window. |
| D11 | Icons: draw our own simple line icons (inline SVG), or use an icon set? | Draw our own (no new dependency, matches the brand). |
| D12 | Team cards with initials (monograms) instead of photos. | Yes, until a team photo decision changes. |
| D13 | Use custom scene images (built from our own concept sites, brand colors) instead of stock photos on our sections. | Yes. |
| D17 | About: remove the "Our experience" list (tradesitessd.com, Kevin's dad's site, classes) for now and show the "Websites we've made" wall instead. This changes spec §6 (its acceptance asks for the 4 experience items). | Yes, as Kevin asked. The facts stay in the spec, unshown, to bring back later. |
| D18 | Add bakery and barbershop concept sites (with the restaurant) to fill the work wall and storefront windows, replacing the D4 "[Example: ...]" placeholder labels. | Yes. Kevin picks the final names (D16 covers all three). |
| D14 | Visible `[NEEDS …]` boxes on About (screenshots, Cheyenne) look unfinished to clients. | Hide them on the live site until the content arrives (keep the flags as HTML comments). |
| D15 | Wrong URLs show a plain "Page not found." text; `/contact/` (trailing slash) is a 404. | Add a branded 404 page with links home, and accept trailing slashes. Small server change; needs approval because `server.js` is otherwise off-limits. |
| D16 | Concept names "Olivo & Sal", "Crumb & Co.", "Fade & Steel" (placeholders). | Kevin picks the final names; check none is a real San Diego business. |

