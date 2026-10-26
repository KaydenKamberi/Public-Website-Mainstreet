# CR-013 (public site): Move to Cloudflare Pages, with a bot check, real rate limits, and security headers

| | |
| --- | --- |
| **Status** | `APPROVED` by Kevin, 2026-10-24, for **D1–D9** (D9 changed: no Replit fallback), and **D10** on 2026-10-25 (the domain isn't bought yet; buy it at Cloudflare). **Phase 2 (the code) is built** (2026-10-25, branch `cr-013-cloudflare-pages`); phases 1, 3–5 wait for the repo's Cloudflare connection and the domain. The hub moves to Railway first; this move starts after that. |
| **Requested by** | Kevin, 2026-10-24: "Public site → Cloudflare Pages, Private hub → Railway" (approved hosting decision), and fixes #2–#4 from the public site security check (2026-10-24) left for this move. |
| **Builds on** | CR-009 (no database, the site only relays to the hub), CR-010 and CR-011 (visits and visitor events to the hub), the hub's intake contract v4, and hub CR-015 (the hub's new Railway address). |
| **Changes** | `specs/constitution.md` §9 and §10 say the site "must run reliably on Replit" with Node.js and Express. After this CR the pages run on Cloudflare Pages and the form relay runs as **Pages Functions**. |
| **Does not change** | Any page's words or design, the form's fields and checks, the visitor messages, the honeypot, the intake contract's fields and signatures, or the analytics rules. |

## 1. How it works after

```
Visitor's browser → Cloudflare (static pages from public/)
                  → POST /api/leads  → Pages Function: check Turnstile → check the form → sign with INTAKE_SECRET → hub on Railway
                  → POST /api/visits, /api/events → Pages Functions: same checks as today → sign → hub
```

- `server.js` (Express) is replaced by three small files in `functions/api/`: `leads.js`, `visits.js`, `events.js`, sharing one helper (`functions/_lib/hub.js`) for signing and sending.
- Same rules as `server.js` today: the same field checks, the 10 KB / 1 KB / 8 KB size limits, the bot user-agent skip, the `submission_id` reuse, the 10-second wait for the hub, and the same visitor messages.
- Signing uses the Web Crypto API (HMAC-SHA256 of `"<timestamp>.<body>"`), which Pages Functions support. The signature is byte-for-byte the same as today.
- No database, nothing stored, as in CR-009.

## 2. Secrets and settings (never in public files)

| Name | Kind | Where | Notes |
| --- | --- | --- | --- |
| `INTAKE_SECRET` | **Encrypted secret** | Cloudflare → Pages project → Settings → Variables and Secrets ("Encrypt") | The same value as the hub's. Typed there by Kevin, never in a chat, never in `wrangler.toml`, `public/`, or Git |
| `TURNSTILE_SECRET_KEY` | **Encrypted secret** | Same place | From Cloudflare → Turnstile |
| `HUB_URL` | Setting (plain text) | Same place | The hub's address, so it can point to the new Railway URL (`https://hub.<domain>` or the `*.up.railway.app` address) without a code change |
| Turnstile **site key** | Public | In `contact.html` | Meant to be public; it only works on our hostnames |

- **Production and Preview get separate values.** Preview deployments (every pull request gets a `*.pages.dev` link) must never send test forms to the real hub (D3).
- `/api/health` keeps saying only whether the hub is set up, never the values.

## 3. Turnstile bot check on the contact form (fixes security check #2)

- A Cloudflare **Turnstile** widget on the contact form, "Managed" mode (most people see nothing or one checkbox). Free, unlimited checks.
- The browser sends the Turnstile token with the form. `functions/api/leads.js` checks it with Cloudflare (`siteverify`, with the visitor's address from `CF-Connecting-IP`) **before** anything is signed or sent to the hub.
- Failed or missing check → the visitor sees the normal "Sorry, your message could not be sent…" message, and nothing reaches the hub.
- A token works once and for 5 minutes, so after a failed send the widget resets and "try again" gets a fresh token. The `submission_id` stays the same, so the hub still saves it only once.
- The hidden "website" honeypot stays, as a second check.
- Visits and events don't use Turnstile (they're counts only and are dropped quietly, as today).
- **Privacy page:** add one line that Cloudflare Turnstile checks the form for bots (Cloudflare processes the visitor's device and connection details for this). Needs Kevin's OK on the wording (D5).

## 4. Rate limits that work on Cloudflare (fixes security check #3)

Today's limits live in `server.js` memory, keyed on `X-Forwarded-For`. That can't move as is: each request to a Pages Function can run in a different copy, so memory isn't shared. Instead:

1. **Turnstile** (section 3): the main protection against floods of form sends.
2. **One Cloudflare rate limiting rule** (the free plan allows 1 rule: counted by IP, a 10-second window, a 10-second block, matched by path but not by method): `/api/` paths, more than **10 requests in 10 seconds** from one address → blocked for 10 seconds. One page view sends at most a visit, an events batch, and a form, so real visitors never get near it.
3. **The Rate Limiting binding**, if Pages Functions support it (Cloudflare's docs only show Workers; checked 2026-10-24): **5 form sends per 60 seconds** per address in `leads.js`. If it isn't supported, rules 1 and 2 plus the hub's own limit cover it (D4).
4. **The hub's own limit** (60 per 15 minutes) stays as the last line.

- The visitor's address comes from `CF-Connecting-IP`, which Cloudflare sets and a visitor can't fake. `X-Forwarded-For` is no longer trusted.
- Rule 2 needs the domain's DNS on Cloudflare (section 7). It doesn't work on the `*.pages.dev` test address.

## 5. Security headers (fixes security check #4)

A `public/_headers` file for the pages, and the same headers set in code on the Function answers (Cloudflare doesn't apply `_headers` to Function responses):

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'sha256-<hash of the one-line "js" class script>' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-src https://challenges.cloudflare.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests
  Strict-Transport-Security: max-age=300
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()

https://:project.pages.dev/*
  X-Robots-Tag: noindex
```

- **CSP:** only our own files, Google Fonts, and Turnstile. Each page's one-line inline script (it adds the `js` class) is allowed by its hash, so it keeps running before the page paints (D6). Inline `style="…"` attributes (the hero's animation delays and background images) need `'unsafe-inline'` for styles only. That's a low risk because scripts stay locked down.
- **HSTS** (always use HTTPS): starts at 5 minutes while testing, then 1 year (`max-age=31536000; includeSubDomains`) after a week on the real domain. No preload list for now.
- **No framing** (`frame-ancestors 'none'` + `X-Frame-Options: DENY`). Replit's preview pane is no longer needed.
- **`*.pages.dev` isn't indexed by Google**, so only the real domain shows up in search results.

## 6. Keep the Replit site live until the new one is fully tested

- The Replit site stays published, connected to the hub, until the Cloudflare site is live and tested. Cloudflare starts on its `*.pages.dev` address only.
- **Test checklist on `*.pages.dev`** (Production settings, pointed at the Railway hub):
  - All 5 pages + 404, at 375 px and desktop; the hero animation; `prefers-reduced-motion`
  - The form: JSON and plain post, the special request, missing fields, the honeypot, Turnstile pass and fail (Cloudflare's test keys), the hub saying no, and "try again" not making a duplicate
  - Visits and events reach the hub's Marketing page
  - Headers checked with `curl -I`; no CSP errors in the browser console
- Only after every check passes: switch the domain (section 7), then run the same checks once more on the real domain.
- **No Replit fallback (D9):** as soon as the Cloudflare site is live on the domain and those checks pass, unpublish the Replit site. Then remove `server.js`, `.replit`, and the Express package in a small clean-up PR.
- ⚠️ With no fallback, a problem found after the switch is fixed forward on Cloudflare: a fix in a PR, or Cloudflare's "Rollback" to an earlier Pages deployment. Git keeps `server.js` in its history if it's ever needed again.

## 7. Domain and DNS for mainstreetsitessd.com

✅ **Kevin, 2026-10-25: not bought yet; buy it at Cloudflare (D10).** The site runs on the address Replit's Core plan gives it, which **stops working when the Replit site is unpublished**. So `mainstreetsitessd.com` must be bought **before** that (phase 1), or shared links break. A public registry check (2026-10-25) showed `mainstreetsitessd.com` **not registered yet** (`mainstreetsites.com` is taken).

The steps for each case (we're in the first row):

| If it's… | Steps |
| --- | --- |
| **Not bought yet** ✅ (this one) | Buy it in **Cloudflare → Domain Registration** (sold at cost, no markup; about $10–12 a year). DNS is then on Cloudflare already. |
| **Registered at Cloudflare** | Nothing to move. Add it in the Pages project → Custom domains. |
| **Registered elsewhere** (Namecheap, GoDaddy, Squarespace, Google/Squarespace Domains…) | 1. Add the site in Cloudflare (free plan). 2. Check that Cloudflare copied every existing DNS record, especially any email (MX/TXT) records. 3. At the registrar, change the nameservers to the two Cloudflare gives. 4. Wait for "Active" (minutes to a day). The domain can stay registered there. Moving the registration to Cloudflare is optional, later. |

Then, for every case:
1. Pages project → **Custom domains** → add `mainstreetsitessd.com` and `www.mainstreetsitessd.com`. Cloudflare makes the records and the HTTPS certificate.
2. Send `www` to the main address with a redirect rule (one address for Google).
3. Add both hostnames to the Turnstile widget.
4. Turn on the rate limiting rule (section 4).
5. The hub's address (`hub.<domain>`, hub CR-015) is a separate DNS record pointing to Railway. It doesn't affect this site.

## 8. Phases

| Phase | Who | What |
| --- | --- | --- |
| **0** | — | Wait for the hub to be live on Railway (hub CR-015) |
| **1** | Kevin (step by step) | Cloudflare account access, a Pages project from this GitHub repo, a Turnstile widget, the secrets and settings (section 2). Answer section 7 |
| **2** | Claude Code, one branch | `functions/api/*`, `functions/_lib/hub.js`, `public/_headers`, Turnstile on the form, `script.js` changes, the privacy line, `wrangler.toml` (no secrets), local tests with `wrangler pages dev`, a fake hub, and Turnstile test keys ✅ **Built 2026-10-25** |
| **3** | Kevin + Claude Code | The test checklist on `*.pages.dev` (section 6) |
| **4** | Kevin (step by step) | Domain and DNS (section 7), the rate limiting rule, HSTS raised to 1 year after a week |
| **5** | Kevin + Claude Code | Right after the checks pass on the real domain: Kevin unpublishes Replit; Claude Code removes `server.js`, `.replit`, and Express; update README, `handoff.md`, `replit.md`, `CLAUDE.md`, and `constitution.md` §9–§10 |

## Phase 2 notes (built 2026-10-25)

- **Form change folded in (Kevin, 2026-10-25, hub CR-017):** an optional "Business name" field after "Your name" (renamed from "Name"), sent as `business_name` (intake contract v5). Also added to `server.js`, so the Replit version stays the same until it's retired. The hub accepts it once hub PR #61 is merged.

- **The Turnstile site key in `contact.html` is Cloudflare's always-pass TEST key** (`1x00000000000000000000AA`) until the real widget is made in phase 1. Swapping it is a one-line change (the site key is public).
- **The Rate Limiting binding works with Pages locally** (`wrangler pages dev`: 5 sends, then 429, per address). Whether live Pages honors it is checked on `*.pages.dev` in phase 3. Without it, `leads.js` skips that check; Turnstile, the Cloudflare rule, and the hub's limit still apply.
- **Without JavaScript the form can't pass the bot check** (Turnstile needs it), so a plain form post gets the "could not be sent… text us" message. Today's form already needs JavaScript for its checks.
- Cloudflare Pages serves `/contact` for `contact.html` and redirects `/contact.html` there (308). The site's own links still say `.html`; they keep working.
- `wrangler` is a **development tool only** (`npm run pages:dev`). `npm audit` flags 3 issues inside wrangler's own packages; the live site's packages have 0.
- **D5 wording for Kevin's OK** (privacy page, new "Spam protection" section): "Our contact form uses Cloudflare Turnstile to check that a real person is sending it. For this check, Cloudflare sees basic details about your browser and connection, and uses them only to stop spam. It does not see what you type in the form." The policy's effective date changes when the Cloudflare site goes live.

## 9. Every place that changes

| Place | Change |
| --- | --- |
| `functions/api/leads.js`, `visits.js`, `events.js`, `functions/_lib/hub.js` (new) | The relay, as Pages Functions |
| `public/_headers` (new) | Security headers (section 5) |
| `public/contact.html`, `public/script.js` | Turnstile widget and token; widget reset after a failed send |
| `public/privacy.html` | One line about Turnstile (D5) |
| `wrangler.toml` (new) | Project name and build output (`public`). **No secrets** |
| `package.json` | `wrangler` as a dev tool for local tests; Express removed in Phase 5 |
| `server.js`, `.replit` | Kept until Phase 5, then removed |
| README, `specs/handoff.md`, `replit.md`, `CLAUDE.md`, `specs/constitution.md` | Hosting, settings, how to run and test |
| Hub repo | Nothing. The intake contract stays v4. The hub's own CR-015 handles its address |

Cost: **$0** (Pages, Functions, Turnstile, and one rate limiting rule are on Cloudflare's free plan). Only the domain costs money, if it isn't bought yet.

## 10. Decisions (D1–D9 approved by Kevin 2026-10-24; D10 on 2026-10-25)

| # | Question | Recommended |
| --- | --- | --- |
| D1 | Where the site runs | ✅ Cloudflare Pages + Pages Functions (approved 2026-10-24) |
| D2 | When | ✅ After the hub is live on Railway |
| D3 | Preview deployments | ✅ No `INTAKE_SECRET` on Preview, so pull-request previews can't send to the real hub (their forms show "could not be sent"); full tests use the Production settings on the `*.pages.dev` address before the domain switch |
| D4 | Rate limits | ✅ Turnstile + 1 Cloudflare rule (10 per 10 s on `/api/`) + the binding (5 form sends per 60 s) if Pages supports it + the hub's limit |
| D5 | Privacy page | ✅ Add one line about Cloudflare Turnstile |
| D6 | The inline "js" script | ✅ Allow it by its hash in the CSP (keeps the no-flash load), rather than moving it to a file |
| D7 | Inline styles | ✅ `'unsafe-inline'` for styles only, rather than rewriting the hero's `style="…"` attributes |
| D8 | HSTS | ✅ 5 minutes while testing, then 1 year with `includeSubDomains`; no preload |
| D9 | Keeping Replit | ✅ **No Replit fallback.** Unpublish the Replit site as soon as the Cloudflare site is live and tested (Kevin, 2026-10-24) |
| D10 | The domain | ✅ **Not bought yet: buy `mainstreetsitessd.com` in Cloudflare → Domain Registration** in phase 1, before the Replit site is unpublished (Kevin, 2026-10-25) |
