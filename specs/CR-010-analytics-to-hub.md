# CR-010 (public site): Send visits and lead sources to the hub's Marketing page

| | |
| --- | --- |
| **Status** | `APPROVED` by Kevin, 2026-10-13, with D1-D3 ("the 3 decisions are approved") plus section 1A ("Add 'how they found us' to CR-010 now: Yes"). |
| **Requested by** | Kevin, 2026-10-13: "I want to still have an analytics page." |
| **Matches** | Hub CR-011, built and merged (hub PR #45), and hub intake contract v3 (`specs/intake-contract.md` in the hub repo). The rules were read from the hub chat's history on 2026-10-13, because its message to this chat failed to send. |
| **Does not change** | Any page, the design, the form fields, or how a form is sent (CR-009). |

## 1. What the visitor's browser already does (unchanged)
- It keeps the first `utm_source` it arrived with (for example `?utm_source=instagram`), or `direct` when there is none.
- It sends one visit per browser session (page + source) to this site's `POST /api/visits`, without slowing the page.

## 1A. How they found us (added 2026-10-13)
When the link has no `utm_source`, the browser works out the source from the site that sent the visitor (the referrer). It only uses the site's name, never the full address or search words.

| Sent from | Source |
| --- | --- |
| Google (search, Maps, the Google app) | `google` |
| Bing, DuckDuckGo, Yahoo | `bing`, `duckduckgo`, `yahoo` |
| Instagram, Facebook, TikTok, X/Twitter, LinkedIn | `instagram`, `facebook`, `tiktok`, `x`, `linkedin` |
| Yelp, Nextdoor | `yelp`, `nextdoor` |
| Any other website | `other-site` |
| Typed in, a bookmark, or an app that hides it | `direct` |

- A `utm_source` link always wins.
- The first known source is kept for the browser, so later pages and the form carry it. `direct` is never kept, so a later visit from Google still counts as `google`.
- **Privacy Policy, "Website visits":** "We record which link or website brought you to our site (for example, a flyer, Google, or social media) to see which marketing works. This does not include your name or contact information."

## 2. What this site's server will do

**Visits.** The server passes each visit to the hub, so the secret never reaches the browser.
- It answers the browser right away (204) and then sends `POST <HUB_URL>/api/intake/visit`.
  - The body is `{"page": "...", "source": "...", "visited_at": "<now>"}`.
  - It uses the same signature and headers as the form, and waits at most 5 seconds.
- It sends nothing when the page isn't one of home, offerings, about, contact or privacy.
- It also skips browsers that say they're a bot (bot, crawl, spider, preview, headless, lighthouse) (D2), and anything over 30 visits a minute from one visitor (D3).
- The hub's answer is only logged, never retried: a visit is just a count.
- Nothing is stored here: no IP address, name or device information.

**Lead source.** Each form sent to the hub adds `"source": "..."`.

**Source cleaning (both).**

| What the source is | What's sent |
| --- | --- |
| Valid (`a-z 0-9 _ -`, 1–40 characters) | As is |
| Empty or missing | `direct` |
| Anything else | `unknown` (D1), the same rule the hub uses |

## 3. Where Kevin sees it
- **Hub → Requests → Marketing:** visits, website requests, conversion rate and "Became clients" by source, for the last 30 days and all time, plus visits by page.
- Each website request in the hub shows **"Came from: <source>"**.

## 4. Spec updates
- **§9 Marketing Attribution:** visits and lead sources go to the hub as above.
- **§9 Acceptance:** visiting any page with `?utm_source=test` adds one visit with source `test` on the hub's Marketing page, and a form sent later in the same browser shows "Came from: test".
- **Privacy Policy:** "Website visits" gets the wording in section 1A.

## 5. Order (hub first)
1. **Hub:** Pull → Run → check Requests → Marketing → Republish (migration 040 is approved).
2. **This CR:** build and merge, then Pull → Run on this site.
3. **Test** against the published hub, then **Publish** this site (setup Step 5).

Sending visits or `source` before the hub is republished is harmless: the old hub ignores the new field, and the visit just gets an error that is dropped.

## 6. Checks (fake hub, made-up data)
- **Visits:** a visit reaches the fake hub with a valid signature and the right body. Bad pages and bots send nothing. The 31st visit in a minute is dropped. A hub that's down or slow never slows the page.
- **Forms:** a form carries `source`. Valid, empty and invalid sources are sent as the value, `direct` and `unknown`.
- **Layout:** 375px and desktop, with no change to any page.

## 7. Decisions needing confirmation

| # | Decision | Recommendation |
| --- | --- | --- |
| D1 | An invalid source (spaces, symbols, too long) is sent as `unknown`, matching the hub, instead of `direct`. | Yes |
| D2 | Skip visits from browsers that say they're bots or link previews, as before (CR-004). | Yes |
| D3 | Keep this site's limit of 30 visits a minute per visitor, as before (CR-004). The hub also caps all visits at 600 per 15 minutes. | Yes |
