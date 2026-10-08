# Design System: Mainstreet Sites SD Public Website

**Name:** Day to Dusk · **Status:** LOCKED (chosen by Kevin, 2026-09-27) · **Source design:** artboard `R3-3 Day to Dusk` on the Design Directions canvas (screenshot: `r3-3-day-to-dusk-home.webp`, layout reference only; wording comes from `spec.md`) · **Tokens:** `tokens.css`

The look: a friendly Main Street in San Diego. The top of each page is **daytime** (cream, forest green, marigold). As you scroll, it turns to **dusk**: a dark street where example websites glow in shop windows.

## 1. Rules for anyone building with this (Claude Code, Replit, people)

1. **Use tokens only.** Every color, font, size, space, and radius comes from `tokens.css`. No hard-coded values.
2. **Build from components.** Every section is made from the components in section 5. If something new is needed, **add a component here first**, then use it.
3. **New sections adapt automatically** because they use the same tokens and components. Never create a one-off style for one section.
4. **Don't copy other companies' designs.** The storefront, awning, and dusk street are this brand's signatures.
5. **Accessibility is part of the design:** text contrast 4.5:1 (3:1 for 24px+), real labels, 44px minimum tap targets, works at 375px wide.

## 2. Logo

Files in `/brand/`: `logo.svg` (light backgrounds), `logo-on-dark.svg` (night backgrounds), `logo-mono.svg` (one color), `mark.svg` (storefront icon only), favicons (`favicon-32.png`, `favicon-192.png`, `favicon-512.png`, `apple-touch-icon.png`). The SVG files are not in the repo yet (spec §11); a temporary stand-in (favicon mark + the name in Fraunces 600) is used until they are.

- Colors: forest green and marigold (recolored from the original navy and gold, 2026-09-27).
- Don't redraw, stretch, recolor, or retype it. Minimum height: 32px for the full logo, 24px for the mark.
- Header uses `logo.svg`; footer and dusk areas use `logo-on-dark.svg`.

## 3. Color

| Token | Hex | Use |
| --- | --- | --- |
| forest | #1F3A2E | Headings, primary buttons, the current nav item (other nav items use body) |
| marigold | #E0A93B | Awnings, the gold rule under headings, icons. **Never small text on light backgrounds.** |
| marigold-text | #B7791F | The highlighted words in big headings ("local businesses") |
| marigold-deep | #8A5E12 | Small accent text and link hover on light backgrounds |
| brick | #B5563B | Awning stripes only |
| cream | #F3F0E6 | Page background (day) |
| paper | #FFFFFF | Cards, inputs, secondary buttons |
| ink / body / subtle | #1B241F / #4B554F / #5F675F | Text: strong / normal / small print |
| night / night-2 | #0F1A24 / #1A2A38 | Dusk band, footer, storefront bodies |
| glow | #FBEBC4 | Lit shop windows (with a soft marigold glow) |
| marigold-bright | #F5C66B | Accent text **on night only** |

The day-to-dusk gradient: `linear-gradient(var(--color-cream) 0%, #1A2B33 30%, var(--color-night) 100%)`. Token: `--gradient-dusk` (middle stop `--color-dusk-mid`). Used **once**, on the Home page, at the bottom of the hero, leading into the storefront street.

## 4. Typography

| Role | Font | Size (phone → desktop) | Notes |
| --- | --- | --- | --- |
| Hero heading | Fraunces 500 | 44 → 74px | Line height 1.03. One phrase may be highlighted in marigold-text. |
| Section heading | Fraunces 500 | 32 → 44px | |
| Card heading | Fraunces 600 or Instrument Sans 600 | 20 → 24px | |
| Lead text | Instrument Sans 400 | 17 → 19px | First phrase may be bold ink. |
| Body | Instrument Sans 400 | 16px | Line height 1.6, max ~65 characters per line (`--measure`) |
| Package name (Offerings) | Fraunces 500 | 32 → 44px | The page's main card title |
| Nav link | Instrument Sans 500 | 16px | Body color; current page forest 600 |
| Small print, captions | Instrument Sans 400/500 | 14px | subtle color |

Load from Google Fonts: Fraunces (500, 600) and Instrument Sans (400, 500, 600).

## 5. Components

| Component | Look | Where |
| --- | --- | --- |
| **Header** | Logo left, nav center (Home, Offerings, About, Contact), primary pill button right. Cream background. | Every page |
| **Primary button** | Forest pill, white text, 600 weight, 48–52px tall. Hover: forest-hover. | Main actions |
| **Secondary button** | White pill, forest text, 1px line border. | Next to a primary button only |
| **Text link** | Forest, underlined. Hover: marigold-deep. | Inside text |
| **Highlight phrase** | Words in marigold-text inside a heading. One per heading, max. | Hero heading; Home "Who it's for" heading |
| **Gold rule** | 120 × 6px marigold bar, rounded. | Under the hero heading |
| **Price line** | Small subtle text + "See full pricing" link. | Under hero buttons |
| **Dusk band** | The day-to-dusk gradient holding the storefront street. | Bottom of Home hero |
| **Storefront** | Striped awning (forest, marigold, or brick with cream) on top of a night-2 body, with a glowing window holding a site screenshot. Caption starts with "Example:". Details below. | Example sites (Home dusk band) |
| **Fact line** | Bold marigold-bright label + night-text sentence ("**Demo first.** See your site before you decide."). | On the dusk band |
| **Card** | Paper background, line border, 12px radius, 24px padding. | Offerings package, How it works steps |
| **Closing band** | Night background, Fraunces heading, one sentence, one primary button (marigold-bright background, night text on dusk). | Bottom of Home, Offerings, About |
| **Footer** | Night background, `logo-on-dark.svg`, links, service area, hours, email/phone, Privacy Policy link. | Every page |
| **Form field** | Paper background, line border, 10px radius, 48px tall, visible label above. Focus: the Focus ring. Placeholder text: subtle. | Contact |
| **Sticky phone bar** | Fixed bottom bar with one primary button, cream background, top border. Phones only, after the hero, never on Contact. | Phones |

### Components added by CR-001 (2026-10-08)

| Component | Look | Where |
| --- | --- | --- |
| **Header (details)** | Cream, no bottom border, same height on every page. 1024px+: logo left, nav centered between logo and button (items `--space-6` apart), button right; on Contact the button's slot stays empty so the nav doesn't move. 768-1023px: logo left; header button then Menu on the right. Under 768px: logo left, Menu right, header button hidden (the sticky bar replaces it). | Every page |
| **Header button / hero buttons** | Header button 48px tall, body-size label. Hero pair 52px tall, lead-size label. | Header, Home hero |
| **Secondary button hover** | Cream background, `--duration-fast`. Closing-band button hover: glow background. | Buttons |
| **Phone menu** | The same `<button class="menu-toggle">` with the text "Menu" in both states; no pill border or fill (not counted as a button); decorative open/close icon (`aria-hidden`). Open nav: full-width cream panel under the header, 48px rows, line-soft dividers. Without JavaScript the nav shows as an expanded list. | Under 1024px |
| **Storefront (details)** | Awning `--awning-height`, 15 equal stripes (color at both ends) of forest, marigold or brick with cream, `--radius-awning` top corners. Night-2 body; window inset `--space-3`. Placeholder state: solid glow panel with `--color-glow-shadow` glow and a centered `[Example: …]` label in small ink text, no dashed border. | Home dusk band |
| **Storefront street** | 1280px+: 4 equal columns (3 storefronts + fact lines) with `--street-gap`, middle store raised `--storefront-lift`, windows bottom-aligned on the `--street-line` (night-3), fact lines bottom-aligned with the windows. Under 768px: a sideways-scrolling row (each store 80% wide, scroll-snap) inside a focusable region labeled "Example sites", fact lines stacked under the street line. | Home dusk band |
| **Inner page hero** | Heading + gold rule + lead (held to `--measure`), stacked, no gradient. | Offerings, About, Contact, Privacy |
| **Split section** | Heading left (about 40%), content right, from 1024px; stacked below. | Home, About |
| **Statement section** | Section heading (may hold the highlight phrase) + one line of body text, no box. | Home "Who it's for" |
| **Check list** | List items with a small marigold check mark drawn in CSS. | Lists of features |
| **Step card** | Card with a 32px marigold circle holding the step number in ink, 600 weight. | Home "How it works" |
| **Placeholder** | Dashed line-color box with small subtle text for `[NEEDS …]` items. Never inside storefront windows. | Cream pages |
| **Info card** | The Card, used beside a form. | Contact |
| **Terms panel** | Price and minimum term side by side inside the package card, split by a line-soft rule; stacked on phones. | Offerings |
| **Choice** | Radio/checkbox rows: 20px control, forest accent, 44px row. | Contact |
| **Form feedback** | Error text in marigold-deep 14px 600; invalid field border 2px marigold-deep; status box paper with a 2px forest (success) or marigold-deep (error) border. | Contact |
| **Focus ring** | 2px `--focus-light` outline on light backgrounds, 2px `--focus-dark` on night, 3px offset. | Every focusable element |
| **Footer (details)** | Night. 768px+: three columns (logo + name/tagline; page links; service area, hours, email) + bottom row (copyright, Privacy Policy). Stacked on phones. Links at least 44 × 44px. | Every page |

### Components added by CR-002 (2026-10-08)

| Component | Look | Where |
| --- | --- | --- |
| **Eyebrow** | `--text-eyebrow`, 600, uppercase, `--tracking-eyebrow`, marigold-deep (marigold-bright on night). | Above section headings |
| **Band** | A section on paper (white) with section-gap padding top and bottom, alternating with cream sections. | Every page |
| **Scene image** | A custom image built in brand colors from our own concept sites (never generic stock), rounded, `--shadow-lift`. | Section visuals |
| **Collage frame** | Photo in an arched or rounded frame with a marigold or forest block offset behind it, plus Stickers. | About story |
| **Sticker** | Small paper pill with a marigold check and a short label, `--shadow-lift`, gentle float. | On collages and scenes |
| **Device frames** | Night-colored laptop and phone frames holding concept-site screenshots; the phone floats gently. | Offerings |
| **Price display** | Display number at hero size ("$45") with smaller text beside it; tabular figures. | Offerings |
| **Payment timeline** | 4 month cards + a forest "Minimum total" card. | Offerings |
| **Tag chip** | Paper pill with a line border, forest 500 text. Not a link or button. | Home "Who it's for" |
| **Step card with image** | Card with a scene image on top, then the marigold number badge, title, and text; lifts on hover. | Home "How it works" |
| **Callout** | Night card split into image + text, marigold-bright eyebrow. | Offerings reservations |
| **FAQ** | `<details>` rows with a forest chevron, 56px tall summaries. | Offerings |
| **Team card** | Paper card with a 56px marigold Monogram (initials) + name + role. No photos. | About |
| **Work wall** | Grid of browser-framed site screenshots with a name and a "Concept … · not a real business" (or client) caption; lifts on hover. | About |
| **What happens next** | Night card with numbered steps and a document preview. | Contact |
| **Review card** | Quote in Fraunces 500, first name, business name/type, optional site link; section hidden until real reviews exist. | Home, About |
| **404 page** | Inner page hero + text links home and to Contact. | Missing pages |

**Motion added by CR-002:** sections and cards fade in and rise `--rise` when scrolled into view (600ms, list items `--stagger` apart). Content is hidden for this only after the page script runs (`motion-ready`), so a failed script never hides content. Buttons lift 1px on hover. Cards lift on hover. The header stays at the top on tablet and desktop with a soft shadow after scrolling. Device phones and stickers float gently. All of it is off under `prefers-reduced-motion`.

## 6. Layout

- Content width 1264px max, not counting the side padding of 24px (phone) to 88px (desktop).
- Hero (1280px and up): heading on the left (55% of the content), lead text + buttons on the right (45%, no column gap, both top-aligned). Header + hero + dusk band fill the first screen; leftover cream sits between the price line and the band.
- Hero (768-1279px): stacked, buttons side by side; storefronts in one row with the fact lines in a row under them.
- Hero (phone): heading, then lead, then buttons, then a horizontally scrollable storefront street.
- Space between sections: 72px (phone) to 120px (desktop).
- Button placement follows the **CTA Placement Map** in `spec.md`.

## 7. Motion

- Shop windows fade their glow in once when scrolled into view (400ms).
- Buttons: 150ms background change on hover (`--duration-fast`).
- Sticky phone bar: slides up over 400ms (`--duration`).
- Everything turns off under `prefers-reduced-motion`.

## 8. Adding something new

1. Check section 5 for a component that fits. Use it with tokens.
2. If nothing fits, add a new row to section 5 describing it (built only from tokens), then build it.
3. Never change a token value just for one section. Changing a token changes the whole site, on purpose.
