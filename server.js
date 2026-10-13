// Mainstreet Sites SD public website server.
// Serves the pages in /public and passes each contact form straight to the private
// team hub. Nothing is stored here (CR-009): the hub keeps every lead.

const crypto = require("crypto");
const path = require("path");
const express = require("express");

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

// ---------- Contact form leads ----------

// Form label -> the hub's business_type key (team hub specs/intake-contract.md).
const HUB_BUSINESS_TYPES = {
  "Restaurant": "restaurant",
  "HVAC": "hvac",
  "Barbershop": "barbershop",
  "Car detailing": "car-detailing",
  "Gym / martial arts studio": "gym-martial-arts",
  "Lash studio": "lash-studio",
  "House cleaning service": "house-cleaning",
  "Bakery": "bakery",
  "Tattoo shop": "tattoo-shop",
  "Other (special request)": "other",
};
const BUSINESS_TYPES = Object.keys(HUB_BUSINESS_TYPES);
const SPECIAL_REQUEST = "Other (special request)";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCATION_MAX = 120;
const LINKS_MAX = 5;
const LINK_MAX = 500;
// Keeps the signed request to the hub well under its 20 KB limit.
const HUB_TEXT_BYTES_MAX = 16 * 1024;

const MESSAGES = {
  sent: "Thanks! Your message was sent.",
  special: "Thanks! Kevin or Kayden will contact you personally.",
  failed: "Sorry, your message could not be sent. Please try again, or text us at (619) 786-7135.",
};

const text = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");

// Returns "+1XXXXXXXXXX" for a valid U.S. number, or null.
function normalizeUsPhone(value) {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return digits.length === 10 ? `+1${digits}` : null;
}

function validateLead(body) {
  const errors = {};
  const lead = {
    name: text(body.name, 100),
    businessType: text(body.businessType, 100),
    contactMethod: text(body.contactMethod, 10),
    email: null,
    phone: null,
    location: typeof body.location === "string" ? body.location.trim() : "",
    links: [],
    message: text(body.message, 2000) || null,
    consent: body.consent === true || body.consent === "yes",
  };

  if (!lead.name) errors.name = "Name is required.";
  if (!BUSINESS_TYPES.includes(lead.businessType)) errors.businessType = "Choose a business type.";
  if (!lead.location || lead.location.length > LOCATION_MAX) {
    errors.location = `Location is required, up to ${LOCATION_MAX} characters.`;
  }

  // One link arrives as a string (plain form post), several as a list. Empty boxes are dropped.
  const rawLinks = body.links === undefined ? [] : [].concat(body.links);
  if (rawLinks.some((link) => typeof link !== "string")) {
    errors.links = "Links must be text.";
  } else {
    lead.links = rawLinks.map((link) => link.trim()).filter(Boolean);
    if (lead.links.length > LINKS_MAX || lead.links.some((link) => link.length > LINK_MAX)) {
      errors.links = `Up to ${LINKS_MAX} links, each up to ${LINK_MAX} characters.`;
    }
  }
  if (lead.contactMethod === "email") {
    const email = text(body.email, 254);
    if (EMAIL_PATTERN.test(email)) lead.email = email;
    else errors.email = "A valid email is required.";
  } else if (lead.contactMethod === "text") {
    lead.phone = normalizeUsPhone(text(body.phone, 30));
    if (!lead.phone) errors.phone = "A valid U.S. phone number is required.";
  } else {
    errors.contactMethod = "Choose Email or Text.";
  }
  if (!lead.consent) errors.consent = "Consent is required.";

  const textBytes = Buffer.byteLength(JSON.stringify([lead.name, lead.location, lead.links, lead.message]));
  if (textBytes > HUB_TEXT_BYTES_MAX) errors.message = "The form is too long.";

  return { lead, errors };
}

// ---------- Sending to the private team hub ----------
// Follows the team hub's specs/intake-contract.md (v2): each lead is POSTed to
// HUB_URL + /api/intake/website, signed with INTAKE_SECRET as
// X-Intake-Signature: sha256=<hex HMAC-SHA256 of "<timestamp>.<body>">.
// 200/201 = received (200 may say "duplicate": true); anything else = not received,
// and the visitor is asked to try again.

function hubIntakeUrl() {
  if (!process.env.HUB_URL) return null;
  try {
    return new URL("/api/intake/website", process.env.HUB_URL).toString();
  } catch (err) {
    console.warn("HUB_URL is not a valid URL:", process.env.HUB_URL);
    return null;
  }
}

const HUB_INTAKE_URL = hubIntakeUrl();
const INTAKE_SECRET = process.env.INTAKE_SECRET || null;
// One id per filled-in form, made in the visitor's browser and reused if they try again,
// so the hub saves a lead once even when its first answer got lost.
const SUBMISSION_ID = /^ms_[a-f0-9]{32}$/;

function submissionId(value) {
  return typeof value === "string" && SUBMISSION_ID.test(value)
    ? value
    : `ms_${crypto.randomUUID().replace(/-/g, "")}`;
}

// Returns true when the hub has the lead.
async function sendToHub(lead, id) {
  const body = JSON.stringify({
    submission_id: id,
    name: lead.name,
    business_type: HUB_BUSINESS_TYPES[lead.businessType],
    contact_method: lead.contactMethod,
    email: lead.email,
    phone: lead.phone,
    message: lead.message,
    location: lead.location,
    // Empty link boxes are dropped; with none left, the key is left out.
    ...(lead.links.length ? { links: lead.links } : {}),
    consent: lead.consent,
    submitted_at: new Date().toISOString(),
  });
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = crypto.createHmac("sha256", INTAKE_SECRET)
    .update(`${timestamp}.${body}`)
    .digest("hex");

  try {
    const response = await fetch(HUB_INTAKE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Intake-Timestamp": timestamp,
        "X-Intake-Signature": `sha256=${signature}`,
      },
      body,
      signal: AbortSignal.timeout(10000),
    });
    if (response.status === 200 || response.status === 201) return true;
    const detail = await response.text().catch(() => "");
    console.warn(`Hub answered HTTP ${response.status} for ${id}: ${detail.slice(0, 200)}`);
  } catch (err) {
    const reason = err.name === "TimeoutError" ? "timed out after 10 seconds" : (err.cause && err.cause.code) || err.message;
    console.warn(`Hub unreachable for ${id}: ${reason}`);
  }
  return false;
}

const app = express();

// Replit serves the app behind one proxy; this makes req.ip the visitor's
// address (used only in memory for rate limits).
app.set("trust proxy", 1);

// Basic security headers on every response (no extra packages): no MIME sniffing, and
// don't announce the server software. Pages may be framed (Replit's preview pane shows
// the site in a frame).
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Counts requests per address in memory only (nothing is written anywhere).
function underLimit(map, key, limit, windowMs) {
  const now = Date.now();
  const entry = map.get(key);
  if (!entry || entry.resetAt < now) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

// Real visitors send the form once; a flood from one connection would use up the hub's
// limit of 60 per 15 minutes and block real leads.
const LEADS_PER_WINDOW = 5;
const LEAD_WINDOW_MS = 15 * 60 * 1000;
const leadCounts = new Map(); // address -> { count, resetAt }

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of leadCounts) if (entry.resetAt < now) leadCounts.delete(key);
}, 60 * 1000).unref();

app.post(
  "/api/leads",
  express.json({ limit: "10kb" }),
  express.urlencoded({ extended: false, limit: "10kb" }),
  async (req, res) => {
    const wantsJson = req.is("application/json");
    const reply = (status, message, extra = {}) =>
      wantsJson ? res.status(status).json({ message, ...extra }) : res.status(status).type("text").send(message);

    const body = req.body || {};

    // Hidden "website" field: people leave it empty, spam bots fill it in.
    if (text(body.website, 200)) return reply(200, MESSAGES.sent);
    if (!underLimit(leadCounts, req.ip, LEADS_PER_WINDOW, LEAD_WINDOW_MS)) {
      return reply(429, MESSAGES.failed, { error: "too many" });
    }

    const { lead, errors } = validateLead(body);
    if (Object.keys(errors).length) {
      return reply(400, MESSAGES.failed, { error: "invalid", fields: errors });
    }
    if (!HUB_INTAKE_URL || !INTAKE_SECRET) return reply(503, MESSAGES.failed, { error: "hub not set up" });

    // The visitor waits for the hub's answer: there is no copy here to send later.
    if (!(await sendToHub(lead, submissionId(body.submissionId)))) {
      return reply(502, MESSAGES.failed, { error: "not received" });
    }
    reply(201, lead.businessType === SPECIAL_REQUEST ? MESSAGES.special : MESSAGES.sent);
  }
);

app.use("/api/leads", (err, req, res, next) => {
  res.status(400).json({ message: MESSAGES.failed, error: "bad request" });
});

// Visit beacons from script.js (one per browser session). Nothing is kept here; once the
// hub has a visits endpoint for its analytics page, CR-010 passes them on to it.
app.post("/api/visits", (req, res) => res.status(204).end());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", hub: HUB_INTAKE_URL && INTAKE_SECRET ? "set up" : "not set up" });
});

// Lets /offerings serve offerings.html, so links work with or without ".html".
// "/contact/" works like "/contact" (CR-002 D15). Leading slashes and backslashes are
// collapsed so a path like "//example.com/" or "/\example.com/" can never redirect to
// another site (browsers read "/\" in a redirect like "//").
app.use((req, res, next) => {
  if (req.path.length > 1 && req.path.endsWith("/") && !req.path.startsWith("/api/")) {
    const clean = "/" + req.path.replace(/^[\/\\]+/, "").replace(/\/+$/, "");
    return res.redirect(301, clean + req.url.slice(req.path.length));
  }
  next();
});

app.use(express.static(path.join(__dirname, "public"), { extensions: ["html"] }));

function sendNotFound(req, res) {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
}

app.use(sendNotFound);

// Last stop for unexpected errors (for example a broken or oversized request body):
// a short plain answer, never Express's default page with the stack trace.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status >= 400 && err.status < 500 ? err.status : 500;
  if (status === 500) console.error("Request failed:", err.message);
  const message = status === 500 ? "server error" : "bad request";
  if (req.path.startsWith("/api/")) return res.status(status).json({ error: message });
  res.status(status).type("text").send(message);
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  if (!HUB_INTAKE_URL || !INTAKE_SECRET) {
    console.warn("HUB_URL or INTAKE_SECRET is not set. The contact form can't send until both are set.");
  }
});
