# CLAUDE.md: Mainstreet Sites SD public website

The public website for Mainstreet Sites SD (mainstreetsitessd.com). Restaurants and other local businesses find us here and fill out the contact form. Team: Kevin (owner), Kayden (co-founder), Cheyenne (team member).

## Source of truth
- `specs/spec.md` (APPROVED). Build only what it says.
- `specs/design-system/DESIGN-SYSTEM.md` + `tokens.css` (Day to Dusk) for every color, font, size, and component.
- `specs/constitution.md` for the technical rules, except where `spec.md`'s "Conflicts and Scope Notes" say the student decided otherwise (real business data, phone + business type fields, automatic info doc, Privacy Policy page).
- The chat is not the source of truth. Changes go in the spec first, and Kevin or Kayden approves them.

## Stack and where things run
- Plain HTML, CSS, JavaScript + Node.js/Express + Replit PostgreSQL (per the constitution). No frameworks or build step unless the spec allows it.
- Code lives on GitHub; Claude Code is the only thing that edits it. Replit runs it (database, Secrets, deployment): Git → Pull, then Run. Never let Replit Agent change code.
- Keys and passwords (admin password, `INTAKE_SECRET`, hub URL) come from Replit Secrets, never code.
- The private team hub is a separate repo. This site only talks to it through `POST /api/intake/website` (see spec section 7).

## How to work
- One branch per phase. Small commits, one per feature, with clear messages. List each commit in your report.
- When a phase builds and runs without errors, merge it into main (merge commit, not squash), push, and stop for review.
- If you make a choice the spec doesn't cover, list it as "Decision needing confirmation", not as done.
- If something fails 3 times in a row, stop and report: what you tried, the exact error, what you think is wrong.
- Before calling a phase done, re-read your changes and check every page at 375px (phone) and desktop.
- Never put real form submissions in code, tests, commits, or GitHub. Use fake data.
- Never invent business facts (prices, reviews, claims). Unknowns stay [placeholders].
- Report each phase in short bullets (under 10 lines).
