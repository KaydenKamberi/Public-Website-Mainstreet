# Running the imported project

- Keep the existing plain HTML/CSS/JavaScript and Node.js/Express structure. Repository rules in `CLAUDE.md` reserve application-code changes for the GitHub/Claude Code workflow; this setup only configures Replit.
- Install dependencies with `npm ci`.
- Use Replit's Run workflow, **Start application**, which executes `PORT=5000 npm start`.
- The workflow explicitly sets `PORT=5000`, mapped to external port `80`. The shared `PORT` environment variable is also `5000`. The server listens on `0.0.0.0`.
- Replit supplies `DATABASE_URL`. On startup, the imported server creates its development `leads` and `visits` tables if needed.
- Check `/api/health` for server and database status.
- There is no build step. Public pages are served directly from `public/`; extensionless routes such as `/contact` also work.
- Contact submissions are implemented at `POST /api/leads` and saved in PostgreSQL. Admin behavior is not implemented. No admin password or hub credentials are needed to run the public site.
- Optional hub forwarding requires `HUB_URL` and `INTAKE_SECRET` in Replit Secrets. Without them, submissions remain saved locally and marked not forwarded; the startup warning is expected. Do not invent these values.
- Setup verification: `/api/health` reports `{"status":"ok","database":"connected"}`; Home, About, Offerings, Contact, and Privacy return HTTP 200. Desktop Home and the 375px Contact layout render in preview. No application-code changes were needed.
- Before publishing, review the imported startup schema creation against Replit's managed production schema process; production schema changes should be applied through Publish, not startup DDL.