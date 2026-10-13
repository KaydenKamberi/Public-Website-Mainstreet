# CR-011 (public site): Detailed analytics: taps, sections, time on page, form starts, device

| | |
| --- | --- |
| **Status** | `APPROVED` by Kevin, 2026-10-13, with D1-D5: "approve CR-011 on the 5 decisions". |
| **Requested by** | Kevin, 2026-10-13: "like we cant collect where they spend the most time what links they tapped what buttons they tapped, what sections they were in most… I feel like the analytics dont cover everything." He chose to build it **before launch**. |
| **Needs** | A matching hub CR: a new signed endpoint `POST /api/intake/events`. Proposed in section 4; the hub chat writes and builds its own CR, and Kevin approves it there. Until it exists, batches get an error answer and are dropped. |
| **Builds on** | CR-010 (visits and sources go to the hub). |

## 1. What gets counted (counts only, never tied to a person)

| What | Example in the hub | How |
| --- | --- | --- |
| 👆 **Taps** on buttons and links | "hero → contact: 42 taps", "footer → text us: 7" | Every tap on a link or button gets a short name: where it is (header, hero, body, sticky, closing, footer, nav) plus where it goes (contact, offerings, about, privacy, home, text, email, other-site), or a fixed name for a few controls (menu, add-link). |
| 📜 **Sections reached** | "Home → Pricing: 61% of visits" | Each page section gets a short name (for example `how-it-works`, `pricing`, `faq`). It counts once per page view when at least half of it has been on screen, or, for a section taller than two screens, when it fills half the screen. |
| ⏱️ **Time on page** | "Offerings: 30 s–2 min: 18" | The time the page was actually on screen, in a bucket: `0-10s`, `10-30s`, `30s-2m`, `2-5m`, `5m-plus`. |
| 📝 **Form** | "Started 20, sent 9" | `start` (first time someone types or picks something), `sent` (the hub said yes), `error` (it failed). Started but not sent = dropped off. |
| 📱 **Device** | "Phone 70%, computer 25%" | Phone (under 768 px wide), tablet (768–1023 px), or computer, from the screen width only. Sent with each batch (not with the visit, so the hub's live visit endpoint doesn't change). |

🔒 There are no cookies, IP addresses, names, typed text, search words, recordings or heatmaps. The hub stores **daily totals** only.

## 2. How it's sent
- The browser collects the counts for one page view in memory.
- When the visitor leaves the page or switches apps, it sends **one batch** to this site's `POST /api/events`, the same way visits are sent, so the page never slows down.
- This site's server checks the batch, signs it and passes it to the hub, like visits (CR-010):
  - only known pages, types and names
  - at most 60 events per batch
  - skips bots
  - at most 30 batches a minute per visitor
- If the hub doesn't answer, the counts are dropped and never retried.

## 3. Privacy Policy, "Website visits"
"We record which link or website brought you to our site, and count which pages, sections and buttons are used, how long pages stay open, and whether visitors use a phone or computer, to see what works. These are totals: they never include your name, contact information, or what you type."

## 4. Proposed hub contract (the hub chat decides the final version)
- `POST <HUB_URL>/api/intake/events`, with the same headers, signature and 5-minute window as the other intake endpoints. Body up to 8 KB:
  ```json
  {"page": "home", "source": "google", "device": "phone",
   "events": [{"type": "tap", "name": "hero-contact"},
              {"type": "section", "name": "pricing"},
              {"type": "time", "name": "30s-2m"},
              {"type": "form", "name": "start"}]}
  ```
  - `type`: one of tap, section, time, form.
  - `name`: 1–40 characters of a-z, 0-9, _ or -.
  - At most 60 events.
  - Answers: 201 counted; 400 bad body (don't retry); 401, 403, 413, 429 and 503 as on the other endpoints.
- `device` (phone, tablet or computer) is optional and top-level on each batch. The visit endpoint is unchanged.
- The hub keeps daily counts per (day, page, type, name) and page views per device. Its Marketing page adds:
  - top taps
  - sections reached (% of that page's visits)
  - a time-on-page mix
  - form start → sent
  - page views by device

## 4A. Names used (built 2026-10-13)
- **Sections** (`data-section` on each page's sections):
  - **Home:** hero, examples, who-its-for, why-a-website, whats-included, how-it-works, reviews (while hidden, never counted), closing
  - **Offerings:** hero, plan-and-pricing, your-website-includes, reservations, how-it-starts, faq, closing
  - **About:** hero, our-story, work-wall, how-we-work, reviews, closing
  - **Contact:** hero, form
  - **Privacy:** hero, policy
- **Taps** are named zone + target, for example `hero-contact`, `nav-offerings`, `header-menu`, `footer-text`, `form-send`, `form-add-link`, `body-other-site`.
  - **Zones:** nav, header, hero, sticky, closing, footer, form, body
  - **Targets:** home, offerings, about, contact, privacy, text, email, call, jump, other-site, other, menu, add-link, send, button
- **Form:** `start`, `sent`, `error`. **Time:** `0-10s`, `10-30s`, `30s-2m`, `2-5m`, `5m-plus` (time on screen until the visitor first leaves or switches apps).

## 5. Checks (made-up data, fake hub)
- Each kind of event is collected and sent once per page view, with the right names, when the page is hidden or closed.
- The server rejects unknown pages, types and names, more than 60 events, and bots, and respects the per-visitor limit.
- A hub that's down never slows the page.
- 375px and desktop: no visible change. With JavaScript off, nothing is sent and nothing breaks.

## 6. Decisions needing confirmation

| # | Decision | Recommendation |
| --- | --- | --- |
| D1 | Build the 5 kinds above (taps, sections, time, form, device). | Yes |
| D2 | Count a section when half of it has been on screen (once per page view). | Yes |
| D3 | The time buckets in section 1. | Yes |
| D4 | The Privacy Policy wording in section 3. | Approve |
| D5 | Send the hub the proposal in section 4 so it can write its CR. | Yes |
