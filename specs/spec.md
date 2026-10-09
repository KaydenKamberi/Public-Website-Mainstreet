# Website Specification

## Specification Status

`APPROVED` by Kevin on 2026-09-29. Updated 2026-10-01: Cheyenne joined the team (About page, Privacy Policy). Updated 2026-10-08 by CR-001: $45 a month, payment methods, reservations service, Day to Dusk build decisions. Updated 2026-10-08 by CR-003: wording for all business types, slimmer footer with payment methods, closing band refresh. Updated 2026-10-08 by CR-002: design polish, custom section images, concept sites, work wall, reviews section (hidden until real reviews), 404 page. Updated 2026-10-09 by CR-006 (location and links on the contact form, matching the hub's intake contract v2), CR-007 (business phone number), and CR-008 ("Send again" and the hub's answers in the admin).

This document defines the requirements for this student's business website.

It must follow `constitution.md`.

Business facts must come from the approved `business-brief.md` or later student decisions.

### Conflicts and Scope Notes

- **Real business, student decision.** The student has decided this site is for the real Mainstreet Sites SD business and does not need teacher approval. The following requirements differ from the class `constitution.md`. If this spec is also submitted for the class project, the student must resolve these conflicts with the class rules:
  - Section 8: the contact form collects more than name, email, and message (adds phone, business type, location, links, and consent).
  - Section 17: the site collects real customer contact information, not simulated data.
  - Section 18: the site uses outside services to send emails and texts automatically.
  - Section 3 and 11: the site adds a fifth public page, Privacy Policy (`privacy.html`).
- **Automatic info document (decided).** When a visitor submits the contact form, the system sends them the info document for their business type by email or text within 5 minutes.
- **Texting comes later (decided).** Automatic texts will use Twilio, added once the business has paying clients. Twilio charges per message and requires U.S. carrier registration before texts deliver. At launch, info documents are sent by email from the business Gmail.
- **Operations items in the brief** (50/50 money split, team roles, AI-automated website management) describe how the business runs. They are not website features and must not be built into this site.
- **Connection to the team hub (decided).** Every contact form submission is sent securely to the private team hub, where the team (Kevin, Kayden, and Cheyenne) manages it. The hub, not this site, sends the info document. Details are in the hub's `CR-001` Phase D.
- **Reservations are for client sites only (decided 2026-10-08).** This site describes the optional reservations service but has no booking system or reservation form. Mainstreet Sites SD never builds its own booking system or stores booking information.

# 1. Business Overview

## Business Name

Mainstreet Sites SD

## Business Description

Mainstreet Sites SD builds websites for businesses, mainly family-owned restaurants in San Diego, and manages those websites every month.

## Target Customer

Local small businesses in San Diego that are not big chains: restaurants, HVAC, barbershops, car detailing, gyms and martial arts studios, lash studios, house cleaning, bakeries, and tattoo shops (the contact form's business types). Family-owned restaurants with no website are the first focus (CR-003 D1). Earlier wording: Family-owned restaurants in San Diego that have no website and are not big chain-operated restaurants. The business focuses on smaller restaurants until it has more proof of its work.

## Customer Need

Many people search online and look through a restaurant's website before visiting in person. Without a website, a restaurant can lose customers who lose interest or decide not to make the trip.

## Primary Website Goal

A restaurant owner understands what Mainstreet Sites SD does, sees that the service is made for restaurants like theirs, and fills out the contact form.

## Primary Customer Action

Fill out the contact form on the Contact page.

## Secondary Customer Actions

- Email the business
- Text the business

# 2. Brand and Visual Direction

## Brand Personality

Professional. Visitors should see a professional-level service.

## Design System

**Day to Dusk**, locked by Kevin on 2026-09-27 (source design: artboard `R3-3 Day to Dusk`). The full rules live in `design-system/DESIGN-SYSTEM.md` and every value in `design-system/tokens.css`. **Those two files are the source of truth for all colors, fonts, sizes, spacing, and components.** Nothing in this spec overrides them. A screenshot of the R3-3 Home artboard is in `design-system/r3-3-day-to-dusk-home.webp`. It is the layout reference only; its wording is out of date (for example, it shows $40 a month). All wording comes from this spec.

Summary:

- **Look:** a friendly Main Street. The top of each page is daytime (cream, forest green, marigold). Scrolling down turns to dusk: a dark street where example sites glow in shop windows.
- **Colors:** forest `#1F3A2E` (headings, buttons), marigold `#E0A93B` (accents only, never small text on light), marigold-text `#B7791F` (highlighted heading words), cream `#F3F0E6` (page), night `#0F1A24` (dusk band, footer), glow `#FBEBC4` (lit windows).
- **Type:** Fraunces for headings, Instrument Sans for text.
- **Signature pieces:** striped awnings, the day-to-dusk band, storefront cards with glowing windows, fact lines on the dusk band, night footer.
- **Rules for builders:** use tokens only; build every section from the components in `DESIGN-SYSTEM.md`; if something new is needed, add it to the design system first.
- **Structure reference:** the student likes the clean structure of `design-reference.webp` (a professional studio site). Use its level of craft only, never its text, colors, fonts, or layout.

The student must personally compare Phase 3 against the locked design (R3-3) and approve it.

## Logo

Favicons are in `brand/`. `[NEEDS ASSET: logo.svg, logo-on-dark.svg, logo-mono.svg, mark.svg]`: not in the repo yet. Until then, the header and footer use a temporary stand-in (CR-001 D5). Planned files:

- Full-color logo
- One-color (mono) logo
- Logo for dark backgrounds
- Icon mark (storefront)
- Favicons

When added, the files go in `brand/` (recolored to forest green and marigold on 2026-09-27): `logo.svg` (light backgrounds), `logo-on-dark.svg` (dusk band and footer), `logo-mono.svg`, `mark.svg`, and favicons. Place in `/public/images/`. Do not redraw, recolor, stretch, or retype the logo.

## Image Direction

Available:

- None yet beyond the logo favicons.

Needed:

- `[NEEDS ASSET: screenshots of tradesitessd.com and Kevin's dad's site]` (CR-001 D8)
- `[NEEDS ASSET: example restaurant websites (demo sites)]`
- `[NEEDS ASSET: example barbershop website (demo site)]` and `[NEEDS ASSET: example bakery website (demo site)]` (CR-001 D4)
- `[NEEDS ASSET: team photo, if included]`

Rules:

- Screenshots must be labeled accurately. tradesitessd.com is the business's own earlier site. Kevin's dad's site must be described as in progress unless the student confirms it is finished.
- Example restaurant websites, once created, must be labeled as examples or demos. They must not be presented as paying client work.
- No stock photos of people presented as owners, staff, or customers.
- Temporary placeholders must be obviously temporary (for example, a gray box labeled "Example restaurant site coming soon").
- Example sites are shown inside the **storefront cards** on the dusk band (glowing shop windows), each with a caption starting "Example:".
- Client demos appear only after the owner agrees. Until then, show an anonymized version (for example, "Asian fusion restaurant, National City").
- **Custom section images (CR-002 D13).** Our own sections use custom scenes built in brand colors from our concept sites (a phone search, the demo-to-launch steps, what's included, the reservation request form, the info doc preview), not generic stock photos. Photos of food or shops appear only inside concept or client demo sites.
- **Concept sites (CR-002 D18).** Three concept sites, *Olivo & Sal* (restaurant), *Crumb & Co.* (bakery), and *Fade & Steel* (barbershop), each carry the banner "Concept site by Mainstreet Sites SD · Not a real business · Sample content and prices" and show prices as "$00". Their screenshots fill the Home storefront windows ("Example: concept …") and the About work wall. `[NEEDS DECISION: final concept site names, checked against real San Diego businesses (CR-002 D16)]`

## Other Branding Requirements

- Tagline: "Websites for local business"
- The business name always appears as "Mainstreet Sites SD".
- `[NEEDS DECISION: confirm the domain mainstreetsitessd.com]`

# 3. Sitewide Requirements

## Navigation

- Home
- Offerings
- About
- Contact

The logo in the header links to Home. Under 1024 px, navigation collapses into a menu button with a real `<button>` element and an accessible label.

## Footer

- Business name and tagline: "Mainstreet Sites SD — Websites for local business"
- Service area: "Serving all of San Diego"
- Availability: "Weekends, and weekdays 6:00 pm to 8:00 pm"
- Email: mainstreetsitessd@gmail.com (decided)
- Phone for texts: (619) 786-7135, shown as "Text (619) 786-7135" and linked as `sms:+16197867135` (CR-007; the business Google Voice number, rings Kevin and Kayden and forwards texts)
- Links: Home, Offerings, About, Contact, Privacy Policy
- Copyright line with the current year and business name
- Payment methods: "We accept" with Venmo and Cash badges (CR-003)
- Social media links: Instagram (and possibly Facebook), added once the accounts exist. `[NEEDS CONTENT: Instagram and Facebook handles]` A "Follow us" row is built and hidden in every footer; turn it on by adding the links (CR-003 D3).
- No admin link in the public footer

## Primary CTA

- Label: Get My Info Doc →
- Action or destination: Contact page (`contact.html`)

## CTA Placement Map

Buttons appear **only** in these spots. No other buttons anywhere.

| Where | What |
| --- | --- |
| Header, right side (every page except Contact; hidden on phones under 768 px, where the sticky bar replaces it) | Primary button "Get My Info Doc →" |
| Home hero, under the lead text | Primary "Get My Info Doc →" + secondary "See What's Included" side by side (stacked at equal full width on phones under 768 px). Under them, one small line: "$60 the first month, then $45 a month." followed by a text link "See full pricing" (to Offerings). |
| Offerings, bottom of the package card | Primary "Get Started →" (to Contact) |
| Bottom of Home, Offerings, and About | The same closing band: a short heading, one sentence, and one primary "Get My Info Doc →" button (button on the right on desktop, under a marigold awning stripe) |
| Contact page | Form submit button "Send Message". Under the form: text links "Email us" (`mailto:`) and "Text us" (`sms:+16197867135`, CR-007). |
| Phones only (under 768 px) | A sticky bottom bar with one "Get My Info Doc →" button. It appears only after the visitor scrolls past the hero and never appears on the Contact page. |

Rules:
- No more than 2 buttons visible on the screen at once (the sticky bar counts; the header button does not).
- No buttons in the middle of content sections. Sections in between use text links only, if anything.
- On the Contact page, the header button is hidden.

## Social Media

- Platform 1: Instagram (decided 2026-09-29)
- Account or handle: `[NEEDS CONTENT: Instagram handle]` Account not created yet.
- Platform 2: Facebook (maybe)
- Account or handle: None yet

No social media icons or links appear on the site until accounts exist.

## Other Sitewide Requirements

- Every page sets a unique `<title>` that includes "Mainstreet Sites SD".
- Favicons from the logo set are used on every page.
- Each browser session records one visit with its `utm_source` and the first page seen (see section 9; CR-004 D1). No IP address, name, or device info is stored.
- The email address, once provided, uses a `mailto:` link. The phone number, once provided, uses an `sms:` link for texting.
- Pages remain usable at 375 pixels wide with no horizontal scrolling.
- Section labels (eyebrows) sit above section headings, e.g. "Pricing", "How it works", "The team", "What's included", "Our work" (CR-002 D3).
- The header stays at the top of the screen on tablet and desktop (CR-002 D4). Sections and cards fade in as they scroll into view; nothing moves under reduced motion, and content never depends on the script loading.
- A branded `404.html` page (not in the navigation) links back to Home and Contact; URLs with a trailing slash work (CR-002 D15).

# 4. Home Page

## Purpose

Show a local business owner, within the first screen, that Mainstreet Sites SD builds and manages websites for San Diego's local businesses, starting with family-owned restaurants, and lead them to the contact form.

## Primary Heading

Websites for local businesses in San Diego.

("local businesses" is the highlight phrase, in marigold-text, not italic.)

## Main Message

Lead text under the heading: "**Mainstreet Sites SD builds and manages websites for local businesses,** starting with San Diego's family-owned restaurants. We build a demo of your site before you decide, then keep it up to date every month."

## Required Content (in this order)

1. **Header:** logo, navigation, header button.
2. **Hero (Day to Dusk):** heading on the left with the gold rule under it; lead text, button pair, and price line on the right.
3. **Dusk band with the storefront street:** the day-to-dusk gradient, three storefront cards (example sites in glowing windows, captioned "Example:") and the three fact lines, in marigold-bright labels. Facts only:
   - "**Demo first.** See your site before you decide."
   - "**You own it.** Your website stays yours."
   - "**Updates included.** Managed every month."
4. **Who it's for:** one line, "Built for San Diego's local businesses." ("local businesses" is the highlight phrase, in marigold-text, not italic) followed by the business types from the contact form's dropdown, as plain text: restaurants, HVAC, barbershops, car detailing, gyms and martial arts studios, lash studios, house cleaning, bakeries, and tattoo shops.
5. **Why a website matters:** many people search online before visiting a business; without a site, they may lose interest or not make the trip.
6. **What's included:** the website, built for the visitor's type of business (menu or services, prices, deals and specials, location and hours, reviews, and an optional reservations or booking service at no extra cost from us) and the monthly management, with a "See what's included" text link to Offerings.
7. **How it works:** 4 numbered steps, each with its own image: we build a demo, we show it to you, you decide, we launch and keep it updated.
8. **Reviews** (CR-002 P9): stays hidden until at least one real review with written permission exists.
9. **Closing band** with the primary button.
10. **Footer.**

## Visual Content

- Logo: `[NEEDS ASSET: logo.svg, logo-on-dark.svg, logo-mono.svg, mark.svg]` (temporary stand-in until provided)
- Example restaurant website visual: `[NEEDS ASSET: example restaurant websites (demo sites)]`. Use an obvious temporary placeholder until provided.

## Primary CTA

- Label: Get My Info Doc →
- Action: Opens the Contact page

## Secondary CTA or Path

- Label: See What's Included
- Action: Opens the Offerings page
- Placement: see the CTA Placement Map in section 3

## Acceptance Criteria

- The business name "Mainstreet Sites SD" is visible in the header without scrolling on a 375-pixel-wide screen.
- The primary heading reads "Websites for local businesses in San Diego." with "local businesses" in the marigold-text color.
- The lead text starts with "Mainstreet Sites SD builds and manages websites for local businesses" in bold and mentions family-owned restaurants.
- At 1280 px and wider, the heading is on the left and the lead text and buttons on the right, with the dusk band and storefront street below; below 1280 px they stack, and on a 375 px phone and the storefronts scroll sideways inside their row.
- The two hero buttons are the same height and share a left edge with the heading on phone and tablet, and with the lead text on desktop.
- The dusk band shows exactly the three approved fact lines.
- The "Who it's for" line lists the nine business types from the contact form.
- No more than 2 buttons are visible on any screen, not counting the header button.
- The five website features (menu or services, prices, deals and specials, location and hours, reviews) are listed, plus the optional reservations or booking service.
- The pricing preview reads exactly "$60 the first month, then $45 a month".
- Clicking "Get My Info Doc →" opens the Contact page.
- Clicking "See What's Included" opens the Offerings page.
- Any example-site visual is labeled as an example or demo, not as client work.
- No reviews, customer counts, or client names appear.

# 5. Offerings Page

## Purpose

Explain the single package Mainstreet Sites SD sells: a restaurant website plus monthly management, including exactly what is included, the price, and the conditions.

## Offering Structure

One package (website build plus ongoing monthly management). The cost of building the website is spread over the monthly payments, and monthly management is included.

### Package: Website and Monthly Management Plan

- Name: **Website and Monthly Management Plan**
- Type: Service package
- Description: A website built for your restaurant, then managed by Mainstreet Sites SD every month so you don't have to worry about it.
- Your website includes:
  - Your menu or services
  - Prices
  - Deals and specials
  - Location and hours
  - Reviews
  - Optional reservations or booking service, at no extra cost from us (see below)
- Monthly management includes:
  - Content updates (hours, menu or service changes, prices, photos, specials)
  - Checking that your site is up and its buttons work
  - Domain renewal care
  - Google Business Profile updates
  - A monthly report
  - Up to 2 edits a month
  - Seasonal refreshes (holiday hours, promotions)
  - Content updates, seasonal refreshes, and setting up the reservations service do **not** count toward the 2 edits. An edit is any other change to the site, such as rewording a section, adding a new section, or changing the layout.
- Pricing approach:
  - $60 for the first month
  - $45 a month after that
  - The cost of building the website is included in these monthly payments
- Important details or conditions:
  - Minimum: 4 payments ($60 + $45 + $45 + $45 = $195 total) and 4 months before you can cancel
  - After the minimum, you choose how many months to continue
  - You own your finished website. If you stop paying, you keep it and manage it yourself.
  - Payment methods: cash or Venmo.
  - `[NEEDS DECISION: the handoff process when a client cancels]`
- How it starts: Mainstreet Sites SD builds a demo of your restaurant's website and shows it to you in person before you decide.
- Layout (CR-002): a large "$45 a month" price display, a 4-payment timeline (Month 1 $60, Months 2-4 $45, minimum total $195), the reservations block as a callout, and a short FAQ: "Can I cancel?", "Do I own my website?", "What counts as an edit?", "How do I pay?", "Does the reservations service cost extra?" (answers reuse the facts above).
- Image: `[NEEDS ASSET: example restaurant websites (demo sites)]`
- CTA: "Get Started →" at the bottom of the package card (Contact page)

### Reservations service (optional, no extra cost from us)

Shown on the Offerings page inside the package card, under the two lists, with exactly this text: "We can add a Reserve or Book Now button (or a booking widget) linked to a booking service in your name, like OpenTable, Resy, or Square Appointments (you pay any service fees), or a reservation request form that emails you. A request is not a confirmed booking."

How it works (not shown on the page): during onboarding we ask, yes or no, "Do you want a reservations service connected to your website?" If yes, it is either a Reserve/Book Now button or embedded widget linked to a booking service in the client's name (OpenTable, Resy, Tock, Yelp, Square Appointments, Calendly, Booksy, Vagaro, etc.; the client pays any service fees), or a reservation request form that emails the owner, clearly labeled as a request, not a confirmed booking. Mainstreet Sites SD never builds its own booking system and never stores customers' booking information. Setting it up does not count toward the 2 edits.

## Offering Priority

The one package is the entire focus of the page. Pricing and the minimum term receive equal visibility so conditions are never hidden.

## Page CTA

- Label: Get Started → (on the package card), then the closing band's "Get My Info Doc →"
- Action: Opens the Contact page

## Acceptance Criteria

- Visitors can understand what the business offers.
- The offering structure matches the business (one package, not multiple services).
- Approved pricing information appears correctly: "$60" for the first month, "$45" a month after, and the $195 minimum total.
- Payment methods read "cash or Venmo".
- The reservations block appears with the approved wording, and the page has no booking widget, booking link, or reservation form.
- The minimum of 4 payments and 4 months appears on the same screen area as the pricing, not in fine print.
- The statement that the client owns the finished website appears.
- All five website features, the optional reservations service, and all seven management items appear.
- "Up to 2 edits a month" appears exactly, with the note that content updates, seasonal refreshes, and reservations setup don't count toward them.
- No offerings, prices, or claims are invented.
- No additional packages, discounts, or guarantees appear.
- Clicking "Get My Info Doc →" (or "Get Started →") opens the Contact page.

# 6. About Page

## Purpose

Help a restaurant owner understand who is behind Mainstreet Sites SD, why the business exists, and what real work supports it.

## Business or Owner Story

Mainstreet Sites SD is run by co-founders Kevin and Kayden, with team member Cheyenne. They want to grow the skills available to them into a service for old-fashioned businesses that can't compete and grow with the future.

## Why the Business Exists

Mainstreet Sites SD started as a way to build websites for trade workers. Gathering each customer's information for their site in a limited amount of time was very difficult, so the business turned to restaurants, whose information is easier to gather. Restaurants lose customers when people can't find them online, and Mainstreet Sites SD builds the site they're missing.

## Relevant Experience or Skills

Not shown on the site for now (CR-002 D17); the About page shows the "Websites we've made" wall instead. Kept here to bring back later:

- Built and launched tradesitessd.com
- Building a website for Kevin's dad's contracting business (in progress)
- Taking the Global IT class
- Took a web design class last year

## Trust-Building Information

- Every restaurant owner sees a demo of their own website before committing.
- The team pitches in person, meeting the owner or manager face to face.
- Cheyenne: `[NEEDS CONTENT: Cheyenne's short story and real experience, in his words]`
- Once the business has customers, their websites will be shown as examples on this site.
- Reviews: `[NEEDS CONTENT: customer reviews or testimonials (none yet)]`. The reviews section is built but stays hidden until real reviews exist. After a client's site launches, Kevin or Kayden asks for a short review and written permission to show it (first name, business name) and to show their site as an example; each approved review is added by a small CR (CR-002 D7). No star ratings unless they come from a real source (D8).

## Visual Content

- Screenshots of tradesitessd.com and Kevin's dad's site, labeled accurately: `[NEEDS ASSET: screenshots of tradesitessd.com and Kevin's dad's site]`. Until provided, a visible placeholder box shows the flag (CR-001 D8).
- No team photo for now (CR-001 D7). Show no people photo and no placeholder that implies one.

## CTA

- The closing band with "Get My Info Doc →"
- Action: Opens the Contact page

## Acceptance Criteria

- Kevin and Kayden appear as co-founders and Cheyenne as a team member (team cards with initials, no photos). No last names, ages, schools, or home locations appear.
- The "Websites we've made" wall shows the concept sites, each labeled as a concept and not a real business, with the line "Concept sites for now. Client sites will be added here, with each owner's permission." (CR-002 D17)
- The reason for switching from trade workers to restaurants is stated.
- Screenshots have alt text that names the site shown.
- `[NEEDS …]` placeholders are not shown on the live page; they stay as HTML comments until the content arrives (CR-002 D14).
- No reviews, testimonials, client counts, or years in business appear.
- Clicking "Get My Info Doc →" (or "Get Started →") opens the Contact page.
- No unsupported claims or credentials appear.

# 7. Contact Page

## Purpose

Give a restaurant owner a clear, simple way to reach Mainstreet Sites SD, with the contact form as the main option.

## Contact Invitation

Want a website for your business? Tell us what kind of business you have, and we'll send you an info document made for your type of business within 5 minutes.

## Contact Form

Fields, in this order:

- Name (required)
- Business type (required): a dropdown with these options, in this order: Restaurant, HVAC, Barbershop, Car detailing, Gym / martial arts studio, Lash studio, House cleaning service, Bakery, Tattoo shop, Other (special request)
- "Send my info document by" (required): choose **one**: Email or Text
- Email (shown and required only when Email is chosen)
- Phone number (shown and required only when Text is chosen)
- "Where is your business?" (required, up to 120 characters). Hint: "City, neighborhood, or address." (CR-006)
- "Links to your business online" (optional). One box to start, plus an "Add another link" text link (not a button), up to 5 boxes, each up to 500 characters; empty boxes are left out. Hint: "Your Google Maps listing, website, Instagram, or Facebook. An @handle works too." (CR-006)
- "Anything you want us to know that isn't online?" (optional, up to 2,000 characters; sent to the hub as `message`). Hint: "Like your catering menu, new prices, or your story. We find the rest on Google." No placeholder. (CR-006)
- Consent checkbox (required): "I agree to receive my info document and follow-up messages from Mainstreet Sites SD by email or text. See our Privacy Policy." "Privacy Policy" links to `privacy.html`. Required by law before sending automated texts.

The visitor gives only one contact method. No payment fields. Nothing else on the form asks for menus, prices, hours, or other things the team can find online (CR-006).

### Automatic info document

- Every successful submission is saved in this site's database as a backup and immediately sent to the private team hub (`POST /api/intake/website`, signed with the shared secret `INTAKE_SECRET` from Replit Secrets). The request also carries `location` and, only when there are any, `links` (sent exactly as typed; the hub adds `https://` and keeps @handles as text) (CR-006). If the hub can't be reached, this site retries every 5 minutes for 24 hours, then once an hour until it gets through. A lead the hub refuses as invalid (400) is not retried (CR-008).
- Within 5 minutes of a successful submission, the team hub sends the info document that matches the chosen business type.
- Email choice: the document is sent by email from the business Gmail.
- Text choice: the document is sent by text as a link, through Twilio. **Before Twilio is added (decided):** the Text option stays. The hub marks the lead "Text by hand" and sends a push notification, and Kevin or Kayden texts the info doc link from the business number within 24 hours.
- **Other (special request):** no document is sent. The visitor sees "Thanks! Kevin or Kayden will contact you personally." The lead is marked "Special request" in the admin area for personal follow-up.
- Each sent document is logged on the lead: document sent, method (email or text), date and time, and whether sending failed.
- If sending fails, the lead is marked "Info doc not sent" in the admin area so Kevin or Kayden can send it by hand.

### Info documents (one per business type)

Each business type gets its own tailored info document. They are not the same. Each one includes:

- What Mainstreet Sites SD is (name, what it does, service area: all of San Diego)
- The package, pricing ($60 the first month, then $45 a month, 4-payment and 4-month minimum, $195 total), payment methods (cash or Venmo), what's included, and the optional reservations service
- The onboarding question "Do you want a reservations service connected to your website?" in the "What we need from you" list
- Basic information Mainstreet Sites SD needs from the customer's business: business name, location, hours, and similar basics
- Custom information requests specific to that business type
- How to buy the service

The existing client information guide was written for trade workers and must be rewritten for the rebrand.

- Drafts of all 9 documents exist in `info-docs/` (one file per business type). `[NEEDS CONTENT: student approval of the 9 drafted info documents]`

## Direct Contact Method

- Email: mainstreetsitessd@gmail.com (decided)
- Text: (619) 786-7135 (`sms:+16197867135`, CR-007)

Both appear below the form as text links ("Email us", "Text us"). Never display placeholder numbers such as 555 numbers.

## Response Expectation

- The info document arrives within 5 minutes (automatic).
- Personal reply: "Kevin or Kayden will personally reply within 24 hours." Shown under the form.
- A "What happens next" box beside the form (CR-002 D6): "You send the form." → "Your info document arrives within 5 minutes." → "Kevin or Kayden replies within 24 hours.", with a preview image of the restaurant info document.

## Service Area or Availability

- Service area: All of San Diego
- Availability: Weekends, and weekdays 6:00 pm to 8:00 pm

## Submit Label

Send Message

## Acceptance Criteria

- Contact form can be completed.
- Required fields are validated: an empty Name, no business type, an empty "Where is your business?", no delivery choice, no consent, or an empty Email or Phone (whichever was chosen) prevents submission and shows a message next to the field.
- Choosing Email shows only the Email field; choosing Text shows only the Phone field.
- Email must be a valid email format. Phone must be a valid U.S. phone number. Location is at most 120 characters; at most 5 links, each at most 500 characters. The server checks all of this again and never sends the hub a lead it would refuse (CR-006).
- Choosing "Other (special request)" sends no document and marks the lead "Special request".
- Submitting with an email and business type "Restaurant" sends the Restaurant info document to that email within 5 minutes.
- Once Twilio is added, choosing Text sends a text with a link to the matching info document within 5 minutes.
- A failed send marks the lead "Info doc not sent" in the team hub.
- Every submission appears in the team hub within 1 minute.
- If the hub is unreachable, the submission stays saved on this site and reaches the hub once it's back.
- Each field has a visible `<label>`.
- Successful submission creates a persistent lead.
- The saved lead includes the visitor's `utm_source` (or `direct`).
- Visitor receives clear success or error feedback. Success text: "Thanks! Your message was sent." Error text explains the submission failed and asks the visitor to try again.
- The form collects only name, email, phone, business type, location, links, message, and consent.
- Service area and availability appear on the page.
- No placeholder phone number appears.

# 7A. Privacy Policy Page

## Purpose

Tell visitors exactly what information the contact form collects, why, and how to stop messages or have their information deleted. Required by Twilio before business texting is approved.

## Page

- File: `privacy.html`. Linked from the footer on every page and from the contact form's consent checkbox. Not in the main navigation.
- Heading: Privacy Policy
- Effective date: the date the site launches `[NEEDS CONTENT: effective date, set at launch]`

## Draft Wording

**What we collect.** When you fill out our contact form, we collect your name, your type of business, where your business is, any links you share, your email address or phone number (whichever you choose), your message if you write one, and your consent to be contacted.

**Why we collect it.** To send you the info document for your type of business, and to contact you about our website services.

**How we send messages.** Emails come from our business email. Texts are sent through our texting provider.

**Who sees it.** Only the Mainstreet Sites SD team: Kevin, Kayden, and Cheyenne. We do not sell, rent, or share your information with anyone for their marketing. Text messaging consent and phone numbers are never shared with third parties.

**Text messages.** Message frequency varies. Message and data rates may apply. Reply STOP to stop receiving texts, or HELP for help.

**Website visits.** We record which link brought you to our site (for example, a flyer or social media link) to see which marketing works. This does not include your name or contact information.

**How long we keep it.** This website keeps a backup copy of your form for 30 days after it reaches our team, then deletes it.

**Your choices.** You can ask us to delete your information at any time by contacting us.

**Contact.** Email: mainstreetsitessd@gmail.com · Text: (619) 786-7135

This wording is a starting point, not legal advice. The student may want a parent or adult to review it.

## Acceptance Criteria

- The Privacy Policy link appears in the footer of every page and opens `privacy.html`.
- The consent checkbox text links to `privacy.html`.
- The page lists exactly the fields the contact form collects: name, business type, location, links, email or phone, message, consent.
- The page includes the STOP and HELP texting instructions.
- The page states information is not sold or shared, and that texting consent is not shared with third parties.
- No claims appear beyond the draft wording above.

# 8. Lead Management

## Student-Specific Requirements

- The admin page lists leads newest first.
- Each lead shows name, email, phone, business type, location, links (only real `http(s)` addresses are clickable, opening in a new tab; @handles show as text), message, consent, source, submission date and time, status, response note, and whether it reached the team hub (yes / not yet / refused, with the time), and the hub's last answer for leads that haven't reached it (CR-008). Info document status lives in the team hub, which sends the documents (CR-004 D2).
- Resending an info document happens in the team hub (CR-004 D2). The admin can delete this site's copy of a lead, with a confirm step, when someone asks for their information to be deleted (CR-004 D6).
- Status options: `new` and `responded`. Filters: All, New, Responded, Not in the hub yet.
- "Send again" (CR-008): every lead not in the hub yet has a **Send again** button that sends it to the hub right away (fresh timestamp and signature, same body and `submission_id`; a `200` with `"duplicate": true` counts as delivered). The **Not in the hub yet** filter has a **Send all again** button that sends every stuck lead one at a time, staying under the hub's limit of 60 per 15 minutes.
- The hub's last answer (CR-008) is saved on each lead (`forward_last_answer`: the status code and the hub's short `error` text, never a secret) and shown on the card: 400 shows the hub's reason; 401 "Hub rejected the signature: check INTAKE_SECRET matches in both apps"; 403 "Hub address must start with https://, check HUB_URL"; 503 "The hub's INTAKE_SECRET isn't set yet"; 429, other errors, and no answer are shown as they are.
- Login: one shared team password from the Replit Secret `ADMIN_PASSWORD`; a signed 12-hour session cookie; logins pause for 15 minutes after 5 wrong tries; the admin stays locked if the secret is not set (CR-004 D3).
- Hidden from outsiders (CR-005): `/admin`, `/admin.html`, `/admin.js`, and `/api/admin/*` answer exactly like a missing page unless the device has been marked as a team device by opening the private team link `/team/<ADMIN_ACCESS_KEY>` (Replit Secret) once. The mark is a signed cookie that lasts 180 days. Changing `ADMIN_ACCESS_KEY` unmarks every device. Wrong team links show "Page not found", and after 5 wrong tries in 15 minutes a connection stops being checked. If `ADMIN_ACCESS_KEY` is not set, the admin is completely hidden. The team password is still required on team devices.
- Marking a lead `responded` records the responded date and time.
- Leads are real customer contacts. Store only what the form collects, and never show lead data outside the protected admin area.
- Day-to-day lead management happens in the private team hub. This site's admin area is a backup view that also shows whether each submission reached the hub (`forwarded`: yes or no).
- **Backup retention (matches the hub's CR-003 Data care):** a nightly cleanup deletes this site's backup copy of a submission 30 days after it was forwarded to the hub. Submissions that never reached the hub are kept and flagged until they do. The cleanup runs in report-only mode for its first 7 nights, then Kevin turns on real deletion.
- A Privacy Policy page explains how form information is used (see section 7A).

## Acceptance Criteria

- Authorized admin access works.
- Unauthorized users cannot retrieve lead data.
- Leads appear with source, date/time, and status.
- Response status and response notes persist.
- The admin password is read from a Replit Secret and does not appear in any file in `/public`.

# 9. Marketing Attribution

## Known Campaign Sources

- `direct` (no source provided)

No campaign sources have been selected yet. `[NEEDS DECISION: which marketing campaign sources to track with utm_source]` The admin's tracking link maker builds links like `…/?utm_source=flyer` from any source name (lowercase letters, numbers, `-`, `_`; CR-004 D5).

Do not invent campaign sources the student has not selected.

## Dashboard Requirements

Show by source:

- visits
- leads
- conversion rate

## Acceptance Criteria

- Visits can be associated with a source.
- Leads retain their source.
- Direct traffic is represented appropriately.
- Dashboard calculations are correct.
- Visiting any page with `?utm_source=test` records a visit with source `test`, and later pages in the same browser keep `test` as the source.
- Conversion rate equals leads ÷ visits × 100, and shows 0% (not an error) when a source has visits but no leads, and "—" when it has leads but no visits. The dashboard shows Last 30 days (default) and All time (CR-004 D4).

# 10. Images and Assets

## Available Assets

- Logo: favicons only. `[NEEDS ASSET: logo.svg, logo-on-dark.svg, logo-mono.svg, mark.svg]` (temporary stand-in until provided)
- Business or owner images: None. No team photo for now (CR-001 D7).
- Product or service images: `[NEEDS ASSET: screenshots of tradesitessd.com and Kevin's dad's site]` `[NEEDS ASSET: example restaurant websites (demo sites)]` `[NEEDS ASSET: example barbershop website (demo site)]` `[NEEDS ASSET: example bakery website (demo site)]`
- Graphics: None beyond the logo
- Info documents: drafts for all 9 business types in `info-docs/`, awaiting student approval
- Other: Existing written content (client debrief and client information guide) may be used as reference for wording, but only facts matching `business-brief.md` may appear on the site. The debrief's 555 placeholder phone number must not be used.

# 11. Unresolved Items

Unresolved items may remain during planning but must be resolved before the phase that depends on them can pass.

## Needs Decision

- ~~Whether to include a team photo~~: resolved by CR-001 D7 (no team photo for now).
- `[NEEDS DECISION: which marketing campaign sources to track with utm_source]`
  - Must be resolved before: Phase 6
- `[NEEDS DECISION: the handoff process when a client cancels]`
  - Must be resolved before: Phase 6
- `[NEEDS DECISION: confirm the domain mainstreetsitessd.com]`
  - Must be resolved before: Phase 6

## Needs Content

- mainstreetsitessd@gmail.com
  - Must be resolved before: Phase 2
- ~~Business phone number~~: resolved by CR-007: (619) 786-7135.
- `[NEEDS CONTENT: student approval of the 9 drafted info documents, including each non-restaurant "Your website will include" list]`
  - Must be resolved before: Phase 4
- `[NEEDS CONTENT: Privacy Policy effective date, set at launch]`
  - Must be resolved before: Phase 6
- `[NEEDS CONTENT: customer reviews or testimonials (none yet)]`
  - Must be resolved before: Phase 6 (resolved by confirming the site launches with no reviews section)

## Needs Asset

- `[NEEDS ASSET: example restaurant websites (demo sites)]`, `[NEEDS ASSET: example barbershop website (demo site)]`, `[NEEDS ASSET: example bakery website (demo site)]`
  - CR-001 D6: the design ships with labeled placeholder windows; real demos replace them later.
  - Must be resolved before: Phase 6
- `[NEEDS ASSET: logo.svg, logo-on-dark.svg, logo-mono.svg, mark.svg]`
  - Must be resolved before: Phase 6
- `[NEEDS ASSET: screenshots of tradesitessd.com and Kevin's dad's site]`
  - Must be resolved before: Phase 6

# 12. Additional Student Requirements

- The site focuses on family-owned restaurants in San Diego; wording must not target big chain restaurants.
- The in-person demo process (research, build a demo, meet the owner or manager in person) is described as how the business works.
- Example restaurant websites are always labeled as examples or demos until they belong to real paying clients.
- Once real clients exist, their websites may be shown as examples only after the student adds them to this spec.
- Every contact form submission receives the tailored info document for its business type within 5 minutes, by email or text.
- **Data safety (matches the hub's CR-003):** never put real form submissions in code, tests, commits, or GitHub; use fake data for testing; database exports go in `.gitignore`; keys and the `INTAKE_SECRET` live in Replit Secrets only.
- Never add a booking system or a reservation form to this site. Never store anyone's booking information.
- Contact form submissions stream into the private team hub. Other than that connection, the team hub, AI management tools, and business operations (money split, roles) are separate from this website and must not be added to it.

# 13. Student Review Checklist

Before approval, the student verifies:

- [ ] This accurately represents my business.
- [ ] The target customer is correct.
- [ ] The offerings and pricing are correct.
- [ ] The main website goal is correct.
- [ ] Calls to action match what I want visitors to do.
- [ ] The branding direction reflects my decisions.
- [ ] Phase 3 matches the locked Day to Dusk design (R3-3) and `design-system/DESIGN-SYSTEM.md`.
- [ ] All factual claims are true.
- [ ] AI did not invent business information.
- [ ] Missing decisions, content, and assets are clearly identified.
- [ ] I understand what the AI coding agent will be asked to build.
- [ ] I edited anything I wanted changed.

## Approval

Change the specification status from `DRAFT` to `APPROVED` only after the student has personally reviewed and accepted it.
