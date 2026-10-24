# CLAUDE.md: Mainstreet Sites SD public website
<!-- Location: ~/Mainstreet/Public-Website-Mainstreet/CLAUDE.md -->

> **New session or new Claude account? Read [`specs/handoff.md`](specs/handoff.md) first:** where we left off, the hub connection, Kevin's working style, and how to run and test.

The public website for Mainstreet Sites SD (mainstreetsitessd.com). Restaurants and other local businesses find us here and fill out the contact form. Team: Kevin (owner), Kayden (co-founder), Cheyenne (team member). Kayden owns this repo, so coordinate changes with him.

## Source of truth
- `specs/spec.md` (APPROVED). Build only what it says.
- `specs/design-system/DESIGN-SYSTEM.md` + `tokens.css` (Day to Dusk) for every color, font, size, and component.
- `specs/constitution.md` for the technical rules, except where `spec.md`'s "Conflicts and Scope Notes" say the student decided otherwise (real business data, phone + business type fields, automatic info doc, Privacy Policy page).
- The chat is not the source of truth. Changes go in the spec first, and Kevin or Kayden approves them.

## Design
- "Day to Dusk" theme: a Main Street storefront going from day to evening.
- Colors: forest green + marigold.
- **No animation libraries** on this site. Use CSS only.
- Must work on phone first.

## Contact
- The contact form is the main action. Also list mainstreetsitessd@gmail.com and the business Google Voice number.
- Promise a personal reply within 24 hours.
- Inquiry form: visitors pick a business type (restaurants, HVAC, barbershops, car detailing, gyms/martial arts, lash studios, house cleaning, bakeries, tattoo shops, Other). Each type gets its own info doc by email or text.
- All submissions go to the hub's Requests page (CR-006).

## Stack and where things run
- Plain HTML, CSS, JavaScript + a small Node.js/Express server. No database (CR-009): the server only passes contact forms to the private team hub. No frameworks or build step unless the spec allows it.
- Code lives on GitHub; Claude Code is the only thing that edits it. Replit runs it (Secrets, deployment): Git → Pull, then Run. Never let Replit Agent change code.
- Keys and passwords (`INTAKE_SECRET`, hub URL) come from Replit Secrets, never code.
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

## Never
- No admin, team-hub, or login links.
- No special prices.
- No invented testimonials, reviews, or client names.
