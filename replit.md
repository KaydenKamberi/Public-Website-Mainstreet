# Running the imported project

- Keep the existing plain HTML/CSS/JavaScript and Node.js/Express structure. Repository rules in `CLAUDE.md` reserve application-code changes for the GitHub/Claude Code workflow; this setup only configures Replit.
- Install dependencies with `npm ci`.
- Use Replit's Run workflow, **Start application**, which executes `PORT=5000 npm start`.
- The workflow explicitly sets `PORT=5000`, mapped to external port `80`. The shared `PORT` environment variable is also `5000`. The server listens on `0.0.0.0`.
- **No database (CR-009).** This site stores nothing. Each contact form goes straight to the private team hub, and the visitor sees whether it got there. Leads, the admin view and analytics all live in the hub.
- **Secrets (only two):** `HUB_URL` = `https://mainstreet-team-hub.replit.app` (https, no trailing slash) and `INTAKE_SECRET` = the same value as the hub's. Never put them in code. Without them, the startup warning appears and the form answers "could not be sent".
- Check `/api/health`: it reports `{"status":"ok","hub":"set up"}` when both Secrets are set (it never shows their values).
- There is no build step. Public pages are served directly from `public/`; extensionless routes such as `/contact` also work.
- Contact submissions go to `POST /api/leads`, which signs them and sends them to `HUB_URL/api/intake/website` (hub intake contract v2). If the hub doesn't answer 200/201, the visitor is asked to try again or text us; trying again reuses the same `submission_id`, so the hub never saves a lead twice.
- `POST /api/visits` (one per browser session) is accepted and dropped until the hub has a visits endpoint (CR-010).
- Setup verification: `/api/health` reports `{"status":"ok","hub":"set up"}`; Home, About, Offerings, Contact, and Privacy return HTTP 200; a test form with made-up data appears in the hub.
