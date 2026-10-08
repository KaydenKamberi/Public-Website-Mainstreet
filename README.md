# Mainstreet Sites SD: public website (APPROVED package, 2026-09-29)

For the public website repo (built with Claude Code on GitHub, run on Replit). **Kayden builds this one.**

- `specs/spec.md`: the approved website spec (source of truth)
- `specs/design-system/`: Day to Dusk design system (`DESIGN-SYSTEM.md` + `tokens.css`), the source of truth for the look
- `specs/info-docs/`: the 9 approved info documents
- `specs/constitution.md`, `specs/business-brief.md`, `specs/design-reference.webp`: background
- `brand/`: logo files and favicons
- `CLAUDE.md`: rules Claude Code reads automatically

## Start the build (Kayden)
1. On GitHub, create a new empty repo, e.g. `mainstreet-public-site`. Add Kevin as a collaborator.
2. Clone it, unzip this package into it (`CLAUDE.md`, `specs/`, `brand/` at the top level), commit, and push.
3. Add `.claude/settings.json` with the same git permissions Kevin uses for the hub.
4. Open Claude Code in the repo and send the first message below.
5. In Replit: Create → Import from GitHub, add PostgreSQL and the Secrets Claude Code lists, then Run. Replit only pulls; it never commits.

## First message for Claude Code
"Read CLAUDE.md and everything in specs/. Build the site in the phases from specs/constitution.md (Phase 1: Technical Foundation through Phase 6). Start with Phase 1 only. Tell me which Replit Secrets and database setup I need. Merge to main when it runs without errors, then stop for my review."

Note: the hub's intake endpoint (`/api/intake/website`) is built in the hub's CR-001 Phase D. Until it exists, the contact form saves submissions here and keeps them flagged as "not forwarded".

If your class gives a `build-prompt.md`, add it to `specs/` too.
