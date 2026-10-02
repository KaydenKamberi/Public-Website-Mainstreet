// Mainstreet Sites SD public website server.
// Serves the pages in /public and stores leads and visits in PostgreSQL.

const crypto = require("crypto");
const path = require("path");
const express = require("express");
const { Pool } = require("pg");

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

// Replit creates DATABASE_URL when PostgreSQL is added to the project.
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS leads (
    id              SERIAL PRIMARY KEY,
    name            TEXT        NOT NULL,
    business_type   TEXT        NOT NULL,
    contact_method  TEXT        NOT NULL CHECK (contact_method IN ('email', 'text')),
    email           TEXT,
    phone           TEXT,
    message         TEXT,
    consent         BOOLEAN     NOT NULL,
    source          TEXT        NOT NULL DEFAULT 'direct',
    status          TEXT        NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'responded')),
    response_note   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    responded_at    TIMESTAMPTZ,
    forwarded       BOOLEAN     NOT NULL DEFAULT false,
    forwarded_at    TIMESTAMPTZ,
    forward_attempts INTEGER    NOT NULL DEFAULT 0,
    info_doc_status TEXT,
    info_doc_method TEXT,
    info_doc_sent_at TIMESTAMPTZ
  );

  CREATE TABLE IF NOT EXISTS visits (
    id         SERIAL PRIMARY KEY,
    source     TEXT        NOT NULL DEFAULT 'direct',
    page       TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
  CREATE INDEX IF NOT EXISTS visits_source_idx ON visits (source);
`;

async function initDatabase() {
  if (!pool) {
    console.warn("DATABASE_URL is not set. Add PostgreSQL in Replit to enable the database.");
    return;
  }
  await pool.query(SCHEMA);
  console.log("Database ready.");
}

// ---------- Contact form leads ----------

const BUSINESS_TYPES = [
  "Restaurant",
  "HVAC",
  "Barbershop",
  "Car detailing",
  "Gym / martial arts studio",
  "Lash studio",
  "House cleaning service",
  "Bakery",
  "Tattoo shop",
  "Other (special request)",
];
const SPECIAL_REQUEST = "Other (special request)";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MESSAGES = {
  sent: "Thanks! Your message was sent.",
  special: "Thanks! Kevin or Kayden will contact you personally.",
  failed: "Sorry, your message could not be sent. Please try again.",
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
    message: text(body.message, 2000) || null,
    consent: body.consent === true || body.consent === "yes",
    source: text(body.source, 100).toLowerCase() || "direct",
  };

  if (!lead.name) errors.name = "Name is required.";
  if (!BUSINESS_TYPES.includes(lead.businessType)) errors.businessType = "Choose a business type.";
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

  return { lead, errors };
}

// ---------- Forwarding to the private team hub ----------
// Each lead is POSTed to HUB_URL + /api/intake/website, signed with INTAKE_SECRET.
// Signature: HMAC-SHA256 of "<timestamp>.<body>", sent as X-Intake-Signature: sha256=<hex>.

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
const RETRY_EVERY_MS = 5 * 60 * 1000;

async function forwardLead(row) {
  if (!HUB_INTAKE_URL || !INTAKE_SECRET) return false;

  const body = JSON.stringify({
    id: row.id,
    name: row.name,
    businessType: row.business_type,
    contactMethod: row.contact_method,
    email: row.email,
    phone: row.phone,
    message: row.message,
    consent: row.consent,
    source: row.source,
    specialRequest: row.business_type === SPECIAL_REQUEST,
    createdAt: row.created_at,
  });
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = crypto.createHmac("sha256", INTAKE_SECRET)
    .update(`${timestamp}.${body}`)
    .digest("hex");

  let ok = false;
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
    ok = response.ok;
    if (!ok) console.warn(`Hub rejected lead ${row.id}: HTTP ${response.status}`);
  } catch (err) {
    console.warn(`Hub unreachable for lead ${row.id}: ${err.message}`);
  }

  await pool.query(
    `UPDATE leads
        SET forward_attempts = forward_attempts + 1,
            forwarded = $2,
            forwarded_at = CASE WHEN $2 THEN now() ELSE forwarded_at END
      WHERE id = $1`,
    [row.id, ok]
  );
  return ok;
}

// Retries leads that have not reached the hub, for up to 24 hours after submission.
// Leads younger than a minute are skipped: their first send may still be in progress.
let retrying = false;
async function retryUnforwarded() {
  if (!pool || !HUB_INTAKE_URL || !INTAKE_SECRET || retrying) return;
  retrying = true;
  try {
    const { rows } = await pool.query(
      `SELECT * FROM leads
        WHERE forwarded = false
          AND created_at > now() - interval '24 hours'
          AND created_at < now() - interval '1 minute'
        ORDER BY created_at`
    );
    for (const row of rows) await forwardLead(row);
  } catch (err) {
    console.error("Hub retry failed:", err.message);
  } finally {
    retrying = false;
  }
}

const app = express();

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

    const { lead, errors } = validateLead(body);
    if (Object.keys(errors).length) {
      return reply(400, MESSAGES.failed, { error: "invalid", fields: errors });
    }
    if (!pool) return reply(503, MESSAGES.failed, { error: "database not configured" });

    let row;
    try {
      const result = await pool.query(
        `INSERT INTO leads (name, business_type, contact_method, email, phone, message, consent, source)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [lead.name, lead.businessType, lead.contactMethod, lead.email, lead.phone,
          lead.message, lead.consent, lead.source]
      );
      row = result.rows[0];
    } catch (err) {
      console.error("Saving lead failed:", err.message);
      return reply(500, MESSAGES.failed, { error: "save failed" });
    }

    reply(201, lead.businessType === SPECIAL_REQUEST ? MESSAGES.special : MESSAGES.sent);

    // Send to the hub after replying, so the visitor never waits on it.
    forwardLead(row).catch((err) => console.error("Forwarding failed:", err.message));
  }
);

app.use("/api/leads", (err, req, res, next) => {
  res.status(400).json({ message: MESSAGES.failed, error: "bad request" });
});

app.get("/api/health", async (req, res) => {
  let database = "not configured";
  if (pool) {
    try {
      await pool.query("SELECT 1");
      database = "connected";
    } catch (err) {
      database = "error";
    }
  }
  res.json({ status: "ok", database });
});

// Lets /offerings serve offerings.html, so links work with or without ".html".
app.use(express.static(path.join(__dirname, "public"), { extensions: ["html"] }));

app.use((req, res) => {
  res.status(404).type("text").send("Page not found.");
});

initDatabase()
  .catch((err) => {
    console.error("Database setup failed:", err.message);
  })
  .finally(() => {
    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    });
    if (!HUB_INTAKE_URL || !INTAKE_SECRET) {
      console.warn("HUB_URL or INTAKE_SECRET is not set. Leads are saved here and marked not forwarded.");
    }
    setInterval(retryUnforwarded, RETRY_EVERY_MS);
  });
