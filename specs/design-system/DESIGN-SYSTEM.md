# Design System: Mainstreet Sites SD Public Website

**Name:** Day to Dusk · **Status:** LOCKED (chosen by Kevin, 2026-09-27) · **Source design:** artboard `R3-3 Day to Dusk` on the Design Directions canvas · **Tokens:** `tokens.css`

The look: a friendly Main Street in San Diego. The top of each page is **daytime** (cream, forest green, marigold). As you scroll, it turns to **dusk**: a dark street where example websites glow in shop windows.

## 1. Rules for anyone building with this (Claude Code, Replit, people)

1. **Use tokens only.** Every color, font, size, space, and radius comes from `tokens.css`. No hard-coded values.
2. **Build from components.** Every section is made from the components in section 5. If something new is needed, **add a component here first**, then use it.
3. **New sections adapt automatically** because they use the same tokens and components. Never create a one-off style for one section.
4. **Don't copy other companies' designs.** The storefront, awning, and dusk street are this brand's signatures.
5. **Accessibility is part of the design:** text contrast 4.5:1 (3:1 for 24px+), real labels, 44px minimum tap targets, works at 375px wide.

## 2. Logo

Files in `/brand/`: `logo.svg` (light backgrounds), `logo-on-dark.svg` (night backgrounds), `logo-mono.svg` (one color), `mark.svg` (storefront icon only), favicons (`favicon-32.png`, `favicon-192.png`, `favicon-512.png`, `apple-touch-icon.png`).

- Colors: forest green and marigold (recolored from the original navy and gold, 2026-09-27).
- Don't redraw, stretch, recolor, or retype it. Minimum height: 32px for the full logo, 24px for the mark.
- Header uses `logo.svg`; footer and dusk areas use `logo-on-dark.svg`.

## 3. Color

| Token | Hex | Use |
| --- | --- | --- |
| forest | #1F3A2E | Headings, primary buttons, nav text |
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

The day-to-dusk gradient: `linear-gradient(var(--color-cream) 0%, #1A2B33 30%, var(--color-night) 100%)`. Used **once per page**, at the bottom of the hero, leading into the storefront street.

## 4. Typography

| Role | Font | Size (phone → desktop) | Notes |
| --- | --- | --- | --- |
| Hero heading | Fraunces 500 | 44 → 74px | Line height 1.03. One phrase may be highlighted in marigold-text. |
| Section heading | Fraunces 500 | 32 → 44px | |
| Card heading | Fraunces 600 or Instrument Sans 600 | 20 → 24px | |
| Lead text | Instrument Sans 400 | 17 → 19px | First phrase may be bold ink. |
| Body | Instrument Sans 400 | 16px | Line height 1.6, max ~65 characters per line |
| Small print, captions | Instrument Sans 400/500 | 14px | subtle color |

Load from Google Fonts: Fraunces (500, 600) and Instrument Sans (400, 500, 600).

## 5. Components

| Component | Look | Where |
| --- | --- | --- |
| **Header** | Logo left, nav center (Home, Offerings, About, Contact), primary pill button right. Cream background. | Every page |
| **Primary button** | Forest pill, white text, 600 weight, 48–52px tall. Hover: forest-hover. | Main actions |
| **Secondary button** | White pill, forest text, 1px line border. | Next to a primary button only |
| **Text link** | Forest, underlined. Hover: marigold-deep. | Inside text |
| **Highlight phrase** | Words in marigold-text inside a heading. One per heading, max. | Hero heading |
| **Gold rule** | 120 × 6px marigold bar, rounded. | Under the hero heading |
| **Price line** | Small subtle text + "See full pricing" link. | Under hero buttons |
| **Dusk band** | The day-to-dusk gradient holding the storefront street. | Bottom of Home hero |
| **Storefront** | Striped awning (forest, marigold, or brick with cream) on top of a night-2 body, with a glowing window holding a site screenshot. Caption starts with "Example:". | Example sites, business types |
| **Fact line** | Bold marigold-bright label + night-text sentence ("**Demo first.** See your site before you decide."). | On the dusk band |
| **Card** | Paper background, line border, 12px radius, 24px padding. | Offerings package, How it works steps |
| **Closing band** | Night background, Fraunces heading, one sentence, one primary button (marigold-bright background, night text on dusk). | Bottom of Home, Offerings, About |
| **Footer** | Night background, `logo-on-dark.svg`, links, service area, hours, email/phone, Privacy Policy link. | Every page |
| **Form field** | Paper background, line border, 10px radius, 48px tall, visible label above. Focus: 2px marigold outline. | Contact |
| **Sticky phone bar** | Fixed bottom bar with one primary button, cream background, top border. Phones only, after the hero, never on Contact. | Phones |

## 6. Layout

- Content width 1264px max, side padding 24px (phone) to 88px (desktop).
- Hero (desktop): heading on the left (about 55%), lead text + buttons on the right, then the dusk band with storefronts across the full width.
- Hero (phone): heading, then lead, then buttons, then a horizontally scrollable storefront street.
- Space between sections: 72px (phone) to 120px (desktop).
- Button placement follows the **CTA Placement Map** in `spec.md`.

## 7. Motion

- Shop windows fade their glow in once when scrolled into view (400ms).
- Buttons: 150ms background change on hover.
- Everything turns off under `prefers-reduced-motion`.

## 8. Adding something new

1. Check section 5 for a component that fits. Use it with tokens.
2. If nothing fits, add a new row to section 5 describing it (built only from tokens), then build it.
3. Never change a token value just for one section. Changing a token changes the whole site, on purpose.
