# Project Constitution

## Purpose

This file contains the rules that apply to every website in the project.

`constitution.md` defines how every project must be built.

`spec.md` defines what the individual student's business website must contain.

If the two conflict, this constitution wins and the conflict must be reported.

The AI coding agent must never edit `constitution.md`.

## 1\. Student Ownership

The student is the product owner.

AI may help:

- organize information  
- draft wording from student-provided facts  
- design  
- code  
- test  
- debug  
- manage routine technical implementation

AI must not make important business decisions for the student.

The student is responsible for business facts, business decisions, review, changes, testing, and phase approval.

## 2\. Content Integrity

Never invent business facts.

Do not invent:

- testimonials or reviews  
- customer names or counts  
- sales numbers  
- credentials or certifications  
- awards  
- years in business  
- experience  
- guarantees  
- statistics  
- prices  
- business history  
- contact information  
- other factual claims

Missing information must be flagged as:

`[NEEDS DECISION: ...]`

`[NEEDS CONTENT: ...]`

`[NEEDS ASSET: ...]`

Unknowns may continue through planning, but a build phase cannot pass if an unresolved item is required for that phase.

## 3\. Required Website

Every project must include four public pages:

1. Home  
2. Offerings  
3. About  
4. Contact

The site must also include a protected admin area for the student business owner.

## 4\. Sitewide Requirements

Every public page must have:

- clear business identity  
- consistent navigation  
- consistent footer  
- consistent visual system  
- readable headings and text  
- appropriate visual content  
- clear paths toward important customer actions  
- working links  
- responsive behavior on phone and desktop screens

A visitor should be able to understand what the business is, what it offers, who it serves, and what to do next.

## 5\. Home Page

The Home page must include:

- business identity  
- clear primary heading  
- concise explanation of the business  
- value or relevance to the target customer  
- relevant visual content  
- primary call to action  
- introduction or path to the offerings

The student's `spec.md` determines the actual content and layout.

## 6\. Offerings Page

The Offerings page must clearly explain what the business sells or provides.

It must support the structure appropriate for the business, including:

- individual products  
- product categories  
- individual services  
- service categories  
- packages  
- combinations of these

Offerings should include the information a customer reasonably needs, such as name, description, image, pricing approach, conditions, and CTA when appropriate.

Do not force every business into the same offering structure.

## 7\. About Page

The About page must help visitors understand the business and the person or people behind it.

It may include:

- business story  
- reason the business exists  
- owner information  
- relevant skills or experience  
- factual trust-building information  
- appropriate visual content  
- call to action

Only student-supplied or student-approved facts may be used.

## 8\. Contact Page

The Contact page must provide a clear way for a potential customer to express interest.

It must include:

- clear heading  
- short contact invitation  
- working contact form  
- direct contact method when available  
- response expectation when defined  
- clear submit action

The public contact form collects only:

- name  
- email  
- message

All customer activity in this project is simulated classroom data.

## 9\. Technical Platform

The complete project must run reliably on Replit.

Replit is the authoritative environment for:

- runtime  
- PostgreSQL  
- secrets and environment variables  
- QA testing  
- deployment

Default stack:

- plain HTML  
- CSS  
- JavaScript  
- Node.js  
- Express  
- Replit PostgreSQL

Do not add frameworks, build systems, or major dependencies unless they are necessary and the reason is stated.

## 10\. Replit Server Requirements

The server must:

- read the port from `process.env.PORT` with a local fallback  
- listen on `0.0.0.0`  
- read database connections and secrets from environment variables  
- never expose secrets in client-side code  
- run on Replit without source-code changes

Persistent application data must be stored in PostgreSQL, not written to the deployed filesystem.

## 11\. Application Structure

Use this simple source structure unless Replit requires normal configuration files in addition:

/public  
  index.html  
  offerings.html  
  about.html  
  contact.html  
  admin.html  
  style.css  
  script.js  
  admin.js  
  /images  
server.js  
/specs  
  constitution.md  
  spec.md  
  build-prompt.md  
Normal files such as `package.json`, `package-lock.json`, `.replit`, and `.gitignore` are allowed.

Do not create extra public pages without an approved requirement.

## 12\. Database Requirements

Use PostgreSQL for persistent application data.

The application needs two logical data sets.

### Leads

Each lead must support:

- id  
- name  
- email  
- message  
- source  
- status  
- response note  
- created date and time  
- responded date and time when applicable

Lead status must support at least:

- `new`  
- `responded`

### Visits

Each visit must support:

- id  
- source  
- created date and time

The AI engineer may choose the exact SQL types and routine implementation details.

## 13\. Admin Area

The admin area must allow the student owner to:

- view simulated leads  
- see lead source  
- see submission date and time  
- see lead status  
- mark a lead responded  
- add or edit a response note

Admin lead data and actions must be protected server-side.

Use a password stored in a Replit Secret or other approved environment variable.

The password must never appear in browser-accessible source code.

This is a classroom exercise with simulated data. Keep authentication simple and do not describe it as production-grade security.

## 14\. Marketing Attribution

Use `utm_source` for basic marketing attribution.

The website must:

- read `utm_source` from the URL  
- preserve the first source for the current browser using a simple client-side method such as local storage  
- use `direct` when no source is available  
- record a visit with its source  
- save the source with each submitted lead

The admin dashboard must show by source:

- visits  
- leads  
- conversion rate

Conversion rate is:

`leads / visits x 100`

Do not add third-party analytics unless the teacher specifically approves it.

## 15\. Images and Assets

Use student-provided or student-approved assets whenever available.

Do not use images that falsely represent:

- customers  
- staff  
- completed work  
- facilities  
- products  
- business history

If an important asset is not available, use an obvious temporary placeholder and preserve the `[NEEDS ASSET]` flag.

The relevant phase cannot pass until the student makes the required asset decision.

## 16\. Accessibility and Responsive Design

Every website must:

- work at common phone and desktop sizes  
- remain usable at 375 pixels wide  
- use readable text  
- maintain readable color contrast  
- use a meaningful heading structure  
- use real labels for form fields  
- use appropriate buttons and links  
- provide meaningful alt text for informational images  
- avoid normal horizontal scrolling on a phone

## 17\. Privacy and Classroom Data

All names, emails, messages, leads, visits, and campaign activity used for testing are simulated.

Do not collect or enter:

- real customer information  
- payment information  
- credit card information  
- home addresses  
- sensitive personal information

Do not include a student's personal home address.

No real payment processing is allowed.

## 18\. Scope

Unless specifically required, do not add:

- customer accounts  
- visitor registration  
- shopping carts  
- payment processing  
- live chat  
- blogs  
- comments  
- customer file uploads  
- complex third-party integrations  
- unnecessary pages  
- unnecessary analytics systems

Build a focused marketing website, not a full commercial platform.

## 19\. Source of Truth

During development:

- `constitution.md` defines universal rules  
- approved `spec.md` defines this business's requirements

The AI conversation is not the source of truth.

If the student makes a meaningful change to what the website should contain or accomplish, the student must update `spec.md` before the change is considered approved.

## 20\. Phased Development

Development follows the phases in `build-prompt.md`.

The AI agent must stop after each phase and wait for explicit student approval.

A phase cannot pass if:

- required functionality does not work  
- the implementation conflicts with `spec.md`  
- relevant unresolved items remain  
- the student has not personally reviewed the phase

Only the student may issue the phase approval command.