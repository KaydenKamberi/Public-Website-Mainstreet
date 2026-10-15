# Handoff: Mainstreet Sites SD public website

Last updated 2026-10-14 (Pacific time), when Kevin moved to a new Claude account. A new Claude session can pick up from here. Read this first, then `CLAUDE.md` and `specs/spec.md`.

> 🔒 This file holds **no keys, no real client data and no personal emails**. Secrets are named, never shown.

---

## 1. What the site is
- **The public website for Mainstreet Sites SD.** We build and manage websites for local San Diego businesses, starting with family-owned restaurants. Pricing comes from the spec.
- **Team:** Kevin (owner), Kayden (co-founder), Cheyenne (team member).
- **Goal:** get visitors to the contact form ("Get My Info Doc →"). The hub then emails them an info doc for their type of business.
- **Pages:** Home, Offerings, About, Contact, Privacy, and a branded 404. All live in `public/`.
- **Stack:**
  - Plain HTML, CSS and JavaScript, plus a small Node/Express relay (`server.js`).
  - The only dependency is `express`. No database (CR-009), no framework, no build step.
- **Where things live:**
  - Code: GitHub `KaydenKamberi/Public-Website-Mainstreet`, branch `main`.
  - Hosting: Replit, published on 2026-10-14 (Autoscale).
  - Only Claude Code edits code. Never Replit Agent.
- **Source of truth:**
  - `specs/spec.md` (APPROVED)
  - `specs/design-system/DESIGN-SYSTEM.md` and `tokens.css` (Day to Dusk)
  - `specs/constitution.md`
  - the CR files in `specs/`
  - The chat is never the source of truth.

## 2. How it connects to the team hub
- **The hub** is a separate private repo and Replit app, with its own Claude chat. It owns:
  - leads and the info doc emails
  - the Marketing analytics
  - special prices (hub only, never shown on this site)
- **Never mix the two projects or copy code between them.** This site only talks to the hub through the signed intake endpoints below.
- **Contract:** the hub's intake contract **v4**. The hub repo's `specs/intake-contract.md` is the source of truth.

### Secrets (names only)
| Name | What it is | Where it's set |
| --- | --- | --- |
| `HUB_URL` | The hub's base URL (https, no trailing slash) | Replit Secrets, in both the workspace and the deployment |
| `INTAKE_SECRET` | Shared signing secret, the same value as the hub's | Replit Secrets, in both the workspace and the deployment |

- Never put either one in code, commits, tests or chat replies.
- `GET /api/health` answers `{"status":"ok","hub":"set up"}` when both are set (it never shows the values), and `"not set up"` otherwise.

### Signing (every hub call)
- `POST` with a JSON body.
- Header `X-Intake-Timestamp`: Unix seconds.
- Header `X-Intake-Signature`: `sha256=<hex HMAC-SHA256 of "<timestamp>.<raw body>" using INTAKE_SECRET>`.
- The hub refuses a timestamp more than 5 minutes off.

### The three flows
| Flow | Browser → this server | This server → hub | Body sent to the hub | Rules |
| --- | --- | --- | --- | --- |
| **Contact form** | `POST /api/leads` | `POST /api/intake/website` | `submission_id`, `name`, `business_type`, `contact_method`, `email`, `phone`, `message`, `location`, `links` (only if any), `consent`, `source`, `submitted_at` | See below |
| **Visits** | `POST /api/visits` (once per browser session) | `POST /api/intake/visit` | `{page, source, visited_at}` | See below |
| **Events** | `POST /api/events` (one batch per page view) | `POST /api/intake/events` | `{page, source, device?, events: [{type, name}]}` | See below |

- **Contact form rules:**
  - The visitor waits up to 10 s for the hub.
  - 201 (new) or 200 (`"duplicate": true`) means sent. Anything else shows "Sorry, your message could not be sent. Please try again, or text us at …".
  - A retry reuses the browser-made `submission_id` (`ms_` + 32 hex), so the hub never saves a lead twice.
  - Limits: 5 sends per 15 min per connection, 10 KB per request. A hidden `website` honeypot field catches spam bots.
- **Visit rules:**
  - This server answers 204 right away, then forwards with a 5 s timeout. Failures are dropped, never retried.
  - Bots are skipped. Limit: 30 a minute per visitor.
- **Event rules:**
  - The browser sends with `sendBeacon` when the page is hidden or closed.
  - Up to 60 events per batch, 8 KB. Types: `tap`, `section`, `time`, `form`.
  - Limit: 30 batches a minute. Bots are skipped and failures dropped.

- **Pages:** `home`, `offerings`, `about`, `contact`, `privacy`.
- **Source** (CR-010):
  - It comes from `utm_source`, or else from the referring site. Referrers map to `google`, `bing`, `duckduckgo`, `yahoo`, `instagram`, `facebook`, `tiktok`, `x`, `linkedin`, `yelp`, `nextdoor`, or `other-site`. Anything else is `direct`.
  - The **first** known source is kept in localStorage (`mainstreet_source`), so the first touch wins. `direct` is never stored.
  - The server sends a valid source (a-z 0-9 _ -, 1–40 characters) as is, a missing one as `direct`, and anything else as `unknown`.
- **Event names** (CR-011, plus CR-012):
  - Taps are `zone-target`.
    - Zones: nav, header, hero, sticky, closing, footer, form, body.
    - Targets: home, offerings, about, contact, privacy, text, email, call, jump, other-site, other, menu, add-link, send, button, plus `showcase` and `pause` (CR-012).
  - Sections use each page's `data-section` names.
  - Time buckets: `0-10s`, `10-30s`, `30s-2m`, `2-5m`, `5m-plus`.
  - Form steps: `start`, `sent`, `error`.
  - Device: phone under 768 px, tablet under 1024 px, otherwise computer.
- **Hub status (2026-10-14):** the hub's own CR-011 and CR-012 (contract v4, events endpoint, Marketing → "On our website") are built and published. The hub chat was told about the new taps `body-showcase` and `body-pause`. It needs no change; friendly labels for them are optional.

## 3. Change requests and what's built
Everything below is merged into `main`, always with a merge commit.

| Step | What it did |
| --- | --- |
| Phases 1, 2, 4 | Technical foundation, page structure and wording, the contact form and forwarding it to the hub |
| CR-001 | Day to Dusk rebuild, $45 a month pricing, Venmo, reservations |
| CR-002 | Design polish, custom section images, concept sites, work wall, reviews section (hidden until real reviews), 404 page |
| CR-003 | Wording for all business types, slimmer footer with payment badges, closing band refresh |
| CR-004, CR-005 | Admin area and visit tracking, then hidden behind a team link. **Removed by CR-009.** |
| CR-006, CR-007, CR-008 | Location and links on the form, business phone number, "Send again" in the admin (PR #6). The admin parts were removed by CR-009. |
| Security fixes (PR #7) | Security headers, no stack traces in errors, 5 sends per 15 min per connection, safe redirects, cleaned sources |
| CR-009 (PR #8) | **No database.** The server became a small signed relay to the hub. Admin and backups removed. |
| CR-010 (PR #9) | Visits and lead sources (utm and referrer) go to the hub's Marketing page |
| CR-011 (PR #10) | Detailed analytics: taps, sections, time on page, form steps, device |
| CR-012 (PR #11, #13) | Home hero "Sketch → Design → Live" device stage, plus storefronts synced with it, with a Pause control. Heading tops out at 68 px beside the stage (D8). |
| Privacy date (PR #12) | Privacy Policy effective date: October 14, 2026 |

## 4. Where we left off (2026-10-14)
- ✅ **Published on Replit** (Autoscale), with both Secrets set in the deployment.
- ✅ **Launch test passed:**
  - The form reached the hub, and the info doc email went out.
  - The business type and location showed up.
  - Marketing counts visits, and "On our website" shows the events.
- ⚠️ **The test request showed "Came from: other-site", not `launch-test`.** This is expected with first-touch: that browser first arrived from a link on another site (Replit), so it kept that source. To see a clean `launch-test`, use a private window with `?utm_source=launch-test`.
- 👉 Kevin still needs to delete his test requests in the hub, so they don't count in Marketing.

## 5. What's next (in this order)
1. 🌐 **Domain first:**
   - Confirm `mainstreetsitessd.com` (spec "Needs Decision") and buy it if needed.
   - Link it in Replit: Deployments → Settings → link a domain, then add the DNS records Replit shows.
   - Check that https works on the new address.
   - Walk Kevin through it one action at a time.
2. 🎨 **Logo:** `logo.svg`, `logo-on-dark.svg`, `logo-mono.svg`, `mark.svg` (spec "Needs Asset"). These replace the stand-in in the header and footer.
3. 🔗 **Campaign links:**
   - Kevin picks the `utm_source` names, for example `flyer`, `instagram-bio`, `google-profile`, `door-visit`.
   - Make the links and QR codes, and record the names in spec §9.
4. 📄 **Cancellation handoff:** what a client gets when they cancel (spec "Needs Decision").
5. 📍 **Google Business Profile and Instagram:** once the handles exist, turn on the hidden "Follow us" footer row (CR-003 D3).
6. 🍽️ **Get clients:** research leads and build the first real demo site. Client sites are separate projects, designed in Figma first (CR-012 D7).

**Open small decisions** (they can wait):
- Keep 5 form sends per 15 min per connection?
- Allow other sites to frame the public pages? Today there's no site-wide `X-Frame-Options`, so the Replit preview works.
- Should a new campaign link replace the remembered source? Today the first one sticks. This would be a small CR.

**Housekeeping:**
- `replit.md` is partly out of date: it still says contract v2, and that visits are dropped. Refresh it in the next CR.
- Other spec items:
  - approval of the 9 info docs (`specs/info-docs/`)
  - screenshots of tradesitessd.com and Kevin's dad's site
  - real demo sites to replace the concept sites
  - reviews (none yet)

## 6. Kevin's working style
**Process**
- Every change starts as a CR file (`specs/CR-0NN-….md`) with "Decisions needing confirmation". Show it, and **don't commit until Kevin approves**. Record his approval quote in the CR's status.
- Then build on one branch, in small commits, one per feature. Make one PR, **merge with a merge commit (never squash)**, and stop for review. List each commit in the report.
- **Ask before changing anything.** A choice the spec doesn't cover is a "Decision needing confirmation", not done.
- If something fails 3 times in a row, stop and report what was tried, the exact error, and the best guess.

**Rules**
- Never put keys or secrets in code or replies. Never let Replit Agent change code. Never mix this site with the hub.
- Use made-up data only. Never put real form submissions in code, tests, commits or GitHub.
- Never invent business facts (prices, reviews, claims); unknowns stay `[placeholders]`. Special prices live in the hub only.
- Check every changed page at 375 px and desktop.

**Design and motion**
- Kevin wants custom, professional design and motion, not template or "vibe-coded" looks.
- For visual work, show a **working prototype with a video** before asking for approval.

**Report format** (Kevin reads on his phone)
- Start every report or answer with: `🕒 <Day>, <Month> <date> · <h:mm> <AM/PM> PT · <Task>`. Get the time with `TZ=America/Los_Angeles date`, never UTC. Example: `🕒 Tuesday, October 13 · 5:49 PM PT · CR-012 merged`.
- Then a short title with an emoji, and short bullets instead of paragraphs (about 10 lines unless he asks for more).
- Markers: ✅ done · ⚠️ needs attention · ❓ question · 👉 next step. Steps are numbered, one action each.
- End with a model-check line: 🟢 Light / 🟡 Medium / 🔴 Heavy, plus whether the current model fits the work.
- He's token-conscious: **no multi-agent workflows** unless he asks.

## 7. Running and testing in a fresh session
### Start the site
```bash
npm ci                      # Node 20+, installs express
PORT=3000 node server.js    # no Secrets: /api/health says "not set up", and the form answers 503
```

### Test against a fake hub (never the real hub, never the real secret)
Save this outside the repo (for example in the session's scratchpad) as `fake-hub.js`:
```js
// Local stand-in for the team hub: checks the signature and answers 201.
const http = require("node:http");
const crypto = require("node:crypto");
const SECRET = process.env.INTAKE_SECRET;
http.createServer((req, res) => {
  let raw = "";
  req.on("data", (chunk) => (raw += chunk));
  req.on("end", () => {
    const ts = req.headers["x-intake-timestamp"] || "";
    const expected = "sha256=" + crypto.createHmac("sha256", SECRET).update(`${ts}.${raw}`).digest("hex");
    const ok = req.headers["x-intake-signature"] === expected && Math.abs(Date.now() / 1000 - Number(ts)) < 300;
    console.log(req.url, ok ? "signed OK" : "BAD SIGNATURE", raw);
    res.writeHead(ok ? 201 : 401, { "content-type": "application/json" });
    res.end(ok ? '{"ok":true}' : '{"error":"bad signature"}');
  });
}).listen(4001, () => console.log("fake hub on 4001"));
```
```bash
export INTAKE_SECRET=test-only-not-a-real-secret
node fake-hub.js &
HUB_URL=http://127.0.0.1:4001 NO_PROXY=127.0.0.1,localhost PORT=3000 node server.js
```
`NO_PROXY` is there because cloud sessions send outbound traffic through a proxy.

### Browser tests (Playwright, Chromium is preinstalled in Claude cloud sessions)
- **User agent:** headless Chrome's user agent contains `HeadlessChrome`, which the server treats as a bot (no visits or events forwarded). Set a normal Chrome user agent.
- **Event batches** are sent on `pagehide` or when the page is hidden. `context.close()` doesn't fire `pagehide`, so go to `about:blank` first.
- **Lead limit:** 5 sends per 15 min per connection. Restart the server between test runs.
- **Home intro:** it plays once per browser session (sessionStorage `mainstreet_intro`), and storefront picks are ignored while it runs (about 4.5 s). For loop tests, set that key and reload, or wait about 5 s.
- **Fonts:** Google Fonts can be blocked in headless runs. Route the font requests through `curl`, or ignore font differences.
- **Reduced motion and no JavaScript:** `newContext({ reducedMotion: "reduce" })` and `newContext({ javaScriptEnabled: false })`.

### Check before calling a change done
- Every page at 320, 375, 768, 1024, 1279, 1280 and 1440 px:
  - no sideways scroll
  - at most 2 `.button`s visible per screen (not counting the header button)
  - no tap target under 44 px
  - no console errors
- Reduced motion and no JavaScript still show the finished page.
- Taps, sections, time and form steps reach the fake hub with valid signatures, using made-up data only.
- Screenshots (or a short video, for motion) at 375 px and desktop go to Kevin.

### Replit (Kevin does these)
- Git → Pull, then Run, then check `/api/health`.
- To publish: Publish → Autoscale, with both Secrets in the deployment.

### New account checklist
- Connect GitHub with access to `KaydenKamberi/Public-Website-Mainstreet` and the hub repo.
- Create a cloud environment for this repo. Optionally, add a setup script that writes Kevin's report format (section 6) into `~/.claude/CLAUDE.md`.
- Start a **separate** chat for the hub repo; never work on both in one chat. Claude sessions on the same account can message each other with `send_message`. In the old setup the hub chat had no tool to reply, so its answers were read from its transcript (`list_events`).
- Optional design plugins: Figma, frontend-design, Design.
