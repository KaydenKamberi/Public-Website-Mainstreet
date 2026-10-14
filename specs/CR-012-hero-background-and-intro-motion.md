# CR-012 (public site): Home hero: "sketch to live" device stage and a synced work carousel

| | |
| --- | --- |
| **Status** | `APPROVED` by Kevin, 2026-10-14, with D1-D6 as recommended: "alright go ahead and start the building". |
| **Requested by** | Kevin, 2026-10-13. First: "change the landing page background… add some animation" (reference: fraxBIT TikTok, UI/UX "Before → After"). Then, after the first mockups: "some sort of website design building process which then leads to the final image… like a phone or laptop… the background gradually fades into different websites we've made… an arrow… to point at the 3 website example boxes… the main box… the 2 side boxes [show] the background website example that the background is about to switch to." |
| **Prototype** | Built in a scratch copy first and shown as videos (desktop 1440 px, phone 390 px) before approval. |
| **Does not change** | The words, the 2 hero buttons, the price line, the fact lines, the other pages, the form, or the analytics rules. |

## 1. The hero stage
- **Computer (1280 px and up):** the hero becomes **text on the left, devices on the right** (D1). The devices are a laptop with a phone in front of it, both showing the same concept site.
- **Tablet and phone:** the devices sit under the buttons. The build animation starts when they scroll into view.
- **Background behind the devices:**
  - a faint dot grid, like a design canvas
  - a soft color glow taken from the site on screen, which fades to the next site's colors at each switch
- **Status chip** above the laptop: "Sketch → Design → Live" during the build, then "● Concept restaurant" (the site on screen).
- **Arrow:** a hand-drawn marigold arrow with "Our work" draws itself from the devices down to the 3 storefronts.

## 2. Intro: sketch → design → live (about 4 s, once per browser session)

| Time | What happens |
| --- | --- |
| 0.0 s | Header, heading, gold rule (draws left to right), lead, buttons and price line rise into place. Everything is readable and tappable within about 0.6 s. |
| 0.5 s | **Sketch.** A wireframe of the restaurant site draws itself, line by line, inside the laptop. |
| 1.0 s | A designer cursor labelled "Mainstreet" glides in, selects the headline, and drags it into place, where it snaps with a small overshoot. |
| 2.3 s | **Design.** The gray blocks take on the site's colors. |
| 3.0 s | **Live.** The finished site renders top to bottom behind a glowing line. |
| 3.9 s | The phone "drives" in beside the laptop and settles. The arrow draws itself, and the chip switches to "Concept restaurant". |

## 3. The loop (all in sync)
Every **7 s** the showcase moves to the next concept site: restaurant → barbershop → bakery.
- **Laptop and phone:** each site slowly scrolls from top to bottom, like someone browsing it. The next site then dissolves in.
- **Storefronts:**
  - **Center = the site on screen.** It is lifted and lit, with a "● Now showing" tag and a marigold progress line.
  - **Right = "Up next →".** At each switch the storefronts slide one place left, and the one that wraps around fades in on the right.
  - The center window scrolls in sync with the laptop.
- **Clicking or tapping** a side storefront shows that site right away. Phones can also **swipe**.
- **Pause** (D3): a Pause/Play button with 3 dots under the storefronts (next to the fact lines on computers). It also pauses while the mouse is over the storefronts, while one is focused with the keyboard, when the hero is off screen, and when the tab is hidden.

## 4. Rules
- **Reduced motion:** no intro and no loop. The laptop shows the restaurant, and clicking a storefront swaps the site instantly.
- **No JavaScript:** the finished laptop, phone and storefronts show, and nothing moves.
- **Return visits:** the intro is skipped (once per session), and the loop starts right away.
- **Speed:**
  - No libraries (no GSAP). Only the browser's own CSS and Web Animations, transforms and opacity.
  - Only the first site's images load up front. The other 2 load after the intro.
  - Images go from 0.87 MB today to 1.1 MB in total.
- **Accessibility:** the device stage is decorative (hidden from screen readers). The storefronts become buttons named "Example: concept … site (not a real business). Show it in the laptop." Picking one is announced politely ("Now showing the concept … site"). Keyboard focus stays on the storefront that was picked, and focusing one with the keyboard pauses the loop.
- **Honesty:** every site shown is labelled "concept", as today.

## 5. Design system additions
- **Motion:** `--ease-settle` (small overshoot), `--ease-glide` (slow in and out), `--ease-out-expo`.
- **Type:** `--text-hero-split` (44 → 68 px), the hero heading when it shares the row with the device stage (1280 px and up).
- **Components:**
  - the CR-002 **Device frames**, reused and sized to the stage (no new device colors)
  - device stage (dot grid, ambient glow, status chip, arrow)
  - storefront tags ("Now showing", "Up next →") and the progress line
  - Pause control on night: icon + "Pause"/"Play" text with no pill or border, like the phone Menu button, so it doesn't count as a button in the CTA map
- **Showcase wireframe colors:** `--concept-ink`, `--concept-photo`, `--concept-glass`, `--concept-dim`. They are the concept restaurant's own colors, used only in the "Design" step. See-through shades of our colors use `color-mix()` on the tokens, not new hex values.

## 6. Checks
- 320, 375, 768, 1024, 1280, 1440 px: no sideways scroll.
- Reduced motion and no JavaScript show the finished state, without the Pause control, tags or progress line.
- The intro plays once per session, and clicks, taps, swipes and the keyboard keep the laptop, phone, glow and storefronts in sync.
- Keyboard focus order (left to right), focus kept after a pick, and tag contrast on the screenshots.
- Taps are counted as `body-showcase` and `body-pause`, and the sections are still `hero` and `examples`.

## 7. Decisions (approved 2026-10-14)

| # | Decision | Recommendation |
| --- | --- | --- |
| D1 | Hero on computers becomes text left, devices right. On phones the devices go under the buttons. Text on top of a moving website would be hard to read. | Yes |
| D2 | Intro about 4 s, replacing the approved 1.4 s, because it now tells the build story. Text and buttons are ready within about 0.6 s. Still once per session. | Yes |
| D3 | Switch every 7 s, with a Pause button and automatic pausing (needed for anything that moves longer than 5 s). | Yes |
| D4 | Cursor label "Mainstreet" (not a team member's name). | Yes |
| D5 | Restaurant goes in the middle storefront and starts as "Now showing", so the storefront order becomes bakery, restaurant, barbershop. | Yes |
| D6 | Name the new taps `body-showcase` (a storefront was picked) and `body-pause`, so they show up on the hub's Marketing page. The hub already accepts any valid name. | Yes |
| D7 | Figma for client sites stays as approved (its own CR per client). | No change |
