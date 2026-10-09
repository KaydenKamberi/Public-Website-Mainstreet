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

  -- Hub intake contract: a permanent id per submission, and a flag for leads the hub refused.
  ALTER TABLE leads ADD COLUMN IF NOT EXISTS submission_id TEXT UNIQUE;
  ALTER TABLE leads ADD COLUMN IF NOT EXISTS forward_rejected BOOLEAN NOT NULL DEFAULT false;
  UPDATE leads SET submission_id = 'ms_' || replace(gen_random_uuid()::text, '-', '')
   WHERE submission_id IS NULL;

  -- CR-006 (hub intake contract v2): where the business is, and links to it online.
  ALTER TABLE leads ADD COLUMN IF NOT EXISTS location TEXT;
  ALTER TABLE leads ADD COLUMN IF NOT EXISTS links JSONB NOT NULL DEFAULT '[]'::jsonb;

  -- CR-008: the hub's last answer for each lead ({ status, error, duplicate, at }), shown in the admin.
  ALTER TABLE leads ADD COLUMN IF NOT EXISTS forward_last_answer JSONB;
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
    location: typeof body.location === "string" ? body.location.trim() : "",
    links: [],
    message: text(body.message, 2000) || null,
    consent: body.consent === true || body.consent === "yes",
    source: text(body.source, 100).toLowerCase() || "direct",
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

// ---------- Forwarding to the private team hub ----------
// Follows the team hub's specs/intake-contract.md: each lead is POSTed to
// HUB_URL + /api/intake/website, signed with INTAKE_SECRET as
// X-Intake-Signature: sha256=<hex HMAC-SHA256 of "<timestamp>.<body>">.
// 200/201 = received (200 may say "duplicate": true), 400 = refused (stop retrying, keep the copy),
// anything else (401, 403, 429, 503, other errors, no answer) = retry. The answer is saved on the
// lead so the admin can show why it is stuck (CR-008).

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

// Retries and "Send all again" send at most this many leads per 15 minutes, under the hub's
// limit of 60. New form submissions always go right away.
const HUB_BATCH_LIMIT = 50;
const HUB_WINDOW_MS = 15 * 60 * 1000;
const hubSends = []; // times of recent sends, kept in memory only

function hubBudgetLeft() {
  const since = Date.now() - HUB_WINDOW_MS;
  while (hubSends.length && hubSends[0] < since) hubSends.shift();
  return HUB_BATCH_LIMIT - hubSends.length;
}

// Each call signs the same body again with a fresh timestamp, so a resend is safe:
// the hub saves each submission_id once.
async function forwardLead(row) {
  if (!HUB_INTAKE_URL || !INTAKE_SECRET) return { ok: false, rejected: false, answer: null };

  const body = JSON.stringify({
    submission_id: row.submission_id,
    name: row.name,
    business_type: HUB_BUSINESS_TYPES[row.business_type],
    contact_method: row.contact_method,
    email: row.email,
    phone: row.phone,
    message: row.message,
    // Older leads (before CR-006) have no location or links; those keys are left out.
    ...(row.location ? { location: row.location } : {}),
    ...(row.links && row.links.length ? { links: row.links } : {}),
    consent: row.consent,
    submitted_at: new Date(row.created_at).toISOString(),
  });
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = crypto.createHmac("sha256", INTAKE_SECRET)
    .update(`${timestamp}.${body}`)
    .digest("hex");

  let ok = false;
  let rejected = false;
  let answer;
  hubSends.push(Date.now());
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
    ok = response.status === 200 || response.status === 201;
    rejected = response.status === 400;
    const detail = await response.text().catch(() => "");
    let data = {};
    try {
      data = JSON.parse(detail) || {};
    } catch (err) {
      // Not JSON (for example a proxy error page): only the status code is kept.
    }
    answer = {
      status: response.status,
      error: !ok && typeof data.error === "string" ? data.error.slice(0, 200) : null,
      duplicate: data.duplicate === true,
    };
    if (!ok) console.warn(`Hub answered HTTP ${response.status} for lead ${row.id}: ${detail.slice(0, 200)}`);
  } catch (err) {
    const reason = err.name === "TimeoutError" ? "timed out after 10 seconds" : (err.cause && err.cause.code) || err.message;
    answer = { status: null, error: String(reason).slice(0, 200), duplicate: false };
    console.warn(`Hub unreachable for lead ${row.id}: ${reason}`);
  }
  answer.at = new Date().toISOString();

  await pool.query(
    `UPDATE leads
        SET forward_attempts = forward_attempts + 1,
            forwarded = $2,
            forwarded_at = CASE WHEN $2 THEN now() ELSE forwarded_at END,
            forward_rejected = $3,
            forward_last_answer = $4
      WHERE id = $1`,
    [row.id, ok, rejected, JSON.stringify(answer)]
  );
  return { ok, rejected, answer };
}

// Sends leads one at a time. Stops early when the hub isn't taking leads right now
// (no answer, 401, 403, 429, 503, ...), since the rest would fail the same way.
async function sendBatch(rows) {
  const result = { delivered: 0, refused: 0, left: rows.length, stoppedBy: null };
  for (const row of rows) {
    if (hubBudgetLeft() <= 0) {
      result.stoppedBy = { limit: true };
      break;
    }
    const { ok, rejected, answer } = await forwardLead(row);
    result.left -= 1;
    if (ok) result.delivered += 1;
    else if (rejected) result.refused += 1;
    else {
      result.stoppedBy = answer;
      break;
    }
  }
  return result;
}

// Retries leads that have not reached the hub: every 5 minutes for their first 24 hours,
// then once an hour until they get through (CR-008). Leads the hub refused (400) are not retried.
// Leads younger than a minute are skipped: their first send may still be in progress.
let sendingBatch = false;
let retryRuns = 0;
async function retryUnforwarded() {
  if (!pool || !HUB_INTAKE_URL || !INTAKE_SECRET || sendingBatch) return;
  const includeOlder = retryRuns % 12 === 0; // every 12th 5-minute run = once an hour
  retryRuns += 1;
  sendingBatch = true;
  try {
    const { rows } = await pool.query(
      `SELECT * FROM leads
        WHERE forwarded = false
          AND forward_rejected = false
          AND created_at < now() - interval '1 minute'
          AND ($1 OR created_at > now() - interval '24 hours')
        ORDER BY created_at`,
      [includeOlder]
    );
    await sendBatch(rows);
  } catch (err) {
    console.error("Hub retry failed:", err.message);
  } finally {
    sendingBatch = false;
  }
}

const app = express();

// Replit serves the app behind one proxy; this makes req.ip the visitor's
// address (used only in memory for rate limits) and req.secure accurate.
app.set("trust proxy", 1);

// ---------- Visits (CR-004) ----------
// One visit per browser session: source + page only. No IP, name, or device
// info is stored. Bots that identify themselves are skipped.
const VISIT_PAGES = new Set(["home", "offerings", "about", "contact", "privacy"]);
const BOT_PATTERN = /bot|crawl|spider|slurp|preview|headless|lighthouse/i;
const VISITS_PER_MINUTE = 30;
const visitCounts = new Map(); // address -> { count, resetAt }, kept in memory only

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

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of visitCounts) if (entry.resetAt < now) visitCounts.delete(key);
  for (const [key, entry] of loginFailures) if (entry.resetAt < now) loginFailures.delete(key);
}, 60 * 1000).unref();

function cleanSource(value) {
  const source = String(value || "").trim().toLowerCase();
  return /^[a-z0-9_-]{1,40}$/.test(source) ? source : "direct";
}

app.post(
  "/api/visits",
  express.text({ type: ["text/plain", "application/json"], limit: "1kb" }),
  (req, res) => {
    res.status(204).end();
    if (!pool || BOT_PATTERN.test(req.get("user-agent") || "")) return;
    if (!underLimit(visitCounts, req.ip, VISITS_PER_MINUTE, 60 * 1000)) return;

    let body;
    try {
      body = JSON.parse(typeof req.body === "string" ? req.body : "");
    } catch (err) {
      return;
    }
    if (!body || !VISIT_PAGES.has(body.page)) return;

    pool.query("INSERT INTO visits (source, page) VALUES ($1, $2)", [cleanSource(body.source), body.page])
      .catch((err) => console.error("Saving visit failed:", err.message));
  }
);

app.use("/api/visits", (err, req, res, next) => {
  res.status(204).end();
});

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
        `INSERT INTO leads (submission_id, name, business_type, contact_method, email, phone, location, links,
                            message, consent, source)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [`ms_${crypto.randomUUID().replace(/-/g, "")}`, lead.name, lead.businessType, lead.contactMethod,
          lead.email, lead.phone, lead.location, JSON.stringify(lead.links), lead.message, lead.consent, lead.source]
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

// ---------- Team-only access (CR-005) ----------
// The admin is invisible unless this device opened the private team link
// /team/<ADMIN_ACCESS_KEY> once. Everyone else gets the normal "Page not found".
const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || null;
const DEVICE_COOKIE = "ms_team";
const DEVICE_MS = 180 * 24 * 60 * 60 * 1000;
const TEAM_LINK_LIMIT = 5;
const TEAM_LINK_WINDOW_MS = 15 * 60 * 1000;
const deviceKey = ADMIN_ACCESS_KEY
  ? crypto.createHash("sha256").update(`mainstreet-team-device:${ADMIN_ACCESS_KEY}`).digest()
  : null;
const teamLinkFailures = new Map(); // address -> { count, resetAt }, kept in memory only

function signDevice(value) {
  return crypto.createHmac("sha256", deviceKey).update(value).digest("base64url");
}

function sameSecret(a, b) {
  const hashA = crypto.createHash("sha256").update(String(a)).digest();
  const hashB = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function isTeamDevice(req) {
  if (!deviceKey) return false;
  const match = (req.headers.cookie || "").match(new RegExp(`(?:^|;\\s*)${DEVICE_COOKIE}=([^;]+)`));
  if (!match) return false;
  const [expires, signature] = match[1].split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return sameSecret(signature, signDevice(`device.${expires}`));
}

function sendNotFound(req, res) {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of teamLinkFailures) if (entry.resetAt < now) teamLinkFailures.delete(key);
}, 60 * 1000).unref();

app.get("/team/:key", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  const entry = teamLinkFailures.get(req.ip);
  const blocked = entry && entry.resetAt > Date.now() && entry.count >= TEAM_LINK_LIMIT;
  if (!ADMIN_ACCESS_KEY || blocked || !sameSecret(req.params.key, ADMIN_ACCESS_KEY)) {
    if (ADMIN_ACCESS_KEY && !blocked) underLimit(teamLinkFailures, req.ip, TEAM_LINK_LIMIT, TEAM_LINK_WINDOW_MS);
    return sendNotFound(req, res);
  }
  const expires = Date.now() + DEVICE_MS;
  const parts = [`${DEVICE_COOKIE}=${expires}.${signDevice(`device.${expires}`)}`, "Path=/", "HttpOnly", "SameSite=Lax", `Max-Age=${DEVICE_MS / 1000}`];
  if (req.secure) parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
  res.redirect(303, "/admin");
});

app.use((req, res, next) => {
  // Normalize first, so /ADMIN, /%61dmin.html, or //admin.html can't slip past.
  let clean;
  try {
    clean = path.posix.normalize(decodeURIComponent(req.path)).toLowerCase();
  } catch (err) {
    return sendNotFound(req, res);
  }
  const adminRequest = /^\/admin(\.html|\.js)?\/?$/.test(clean) || clean.startsWith("/api/admin");
  if (adminRequest && !isTeamDevice(req)) return sendNotFound(req, res);
  if (adminRequest) res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

// ---------- Admin (CR-004) ----------
// One shared team password from the Replit Secret ADMIN_PASSWORD. Without it,
// the admin stays locked. Sessions are signed cookies that last 12 hours.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || null;
const SESSION_COOKIE = "ms_admin";
const SESSION_MS = 12 * 60 * 60 * 1000;
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const sessionKey = ADMIN_PASSWORD
  ? crypto.createHash("sha256").update(`mainstreet-admin-session:${ADMIN_PASSWORD}`).digest()
  : null;
const loginFailures = new Map(); // address -> { count, resetAt }, kept in memory only
const revokedSessions = new Set(); // nonces of logged-out sessions, until they expire

function sign(value) {
  return crypto.createHmac("sha256", sessionKey).update(value).digest("base64url");
}

function sameText(a, b) {
  const hashA = crypto.createHash("sha256").update(String(a)).digest();
  const hashB = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function readCookie(req, name) {
  const header = req.headers.cookie || "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}

function sessionFrom(req) {
  const token = readCookie(req, SESSION_COOKIE);
  if (!sessionKey || !token) return null;
  const [expires, nonce, signature] = token.split(".");
  if (!expires || !nonce || !signature) return null;
  if (!sameText(signature, sign(`${expires}.${nonce}`))) return null;
  if (Number(expires) < Date.now() || revokedSessions.has(nonce)) return null;
  return { expires: Number(expires), nonce };
}

function setSessionCookie(req, res, value, maxAgeSeconds) {
  const parts = [`${SESSION_COOKIE}=${value}`, "Path=/", "HttpOnly", "SameSite=Strict", `Max-Age=${maxAgeSeconds}`];
  if (req.secure) parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}

const adminJson = express.json({ limit: "10kb" });

// Every admin API response: never cached, admin must be set up.
app.use("/api/admin", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  if (!ADMIN_PASSWORD) return res.status(503).json({ error: "not set up" });
  // Changes only come from the admin page's own JSON requests.
  if (req.method !== "GET" && !req.is("application/json")) {
    return res.status(415).json({ error: "json only" });
  }
  next();
});

function requireAdmin(req, res, next) {
  if (!sessionFrom(req)) return res.status(401).json({ error: "login required" });
  next();
}

app.get("/api/admin/session", (req, res) => {
  res.json({ loggedIn: Boolean(sessionFrom(req)) });
});

app.post("/api/admin/login", adminJson, (req, res) => {
  const entry = loginFailures.get(req.ip);
  if (entry && entry.resetAt > Date.now() && entry.count >= LOGIN_LIMIT) {
    return res.status(429).json({ error: "too many tries" });
  }
  const password = req.body && typeof req.body.password === "string" ? req.body.password : "";
  if (!sameText(password, ADMIN_PASSWORD)) {
    underLimit(loginFailures, req.ip, LOGIN_LIMIT, LOGIN_WINDOW_MS);
    return res.status(401).json({ error: "wrong password" });
  }
  loginFailures.delete(req.ip);
  const expires = Date.now() + SESSION_MS;
  const nonce = crypto.randomBytes(16).toString("base64url");
  setSessionCookie(req, res, `${expires}.${nonce}.${sign(`${expires}.${nonce}`)}`, SESSION_MS / 1000);
  res.json({ loggedIn: true });
});

app.post("/api/admin/logout", adminJson, (req, res) => {
  const session = sessionFrom(req);
  if (session) {
    revokedSessions.add(session.nonce);
    setTimeout(() => revokedSessions.delete(session.nonce), session.expires - Date.now()).unref();
  }
  setSessionCookie(req, res, "", 0);
  res.json({ loggedIn: false });
});

const LEAD_COLUMNS = `id, name, business_type, contact_method, email, phone, location, links, message, consent, source,
  status, response_note, created_at, responded_at, forwarded, forwarded_at, forward_rejected, forward_attempts,
  forward_last_answer`;
const LEAD_FILTERS = {
  all: "TRUE",
  new: "status = 'new'",
  responded: "status = 'responded'",
  unforwarded: "forwarded = false",
};

function leadId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

app.get("/api/admin/leads", requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ error: "database not configured" });
  const where = LEAD_FILTERS[req.query.filter] || LEAD_FILTERS.all;
  try {
    const { rows } = await pool.query(
      `SELECT ${LEAD_COLUMNS} FROM leads WHERE ${where} ORDER BY created_at DESC LIMIT 500`
    );
    res.json({ leads: rows });
  } catch (err) {
    console.error("Loading leads failed:", err.message);
    res.status(500).json({ error: "load failed" });
  }
});

app.patch("/api/admin/leads/:id", requireAdmin, adminJson, async (req, res) => {
  const id = leadId(req);
  const body = req.body || {};
  if (!id || !pool) return res.status(400).json({ error: "bad request" });
  const status = body.status === undefined ? null : body.status;
  if (status !== null && status !== "new" && status !== "responded") {
    return res.status(400).json({ error: "bad status" });
  }
  const note = body.responseNote === undefined ? null : text(body.responseNote, 2000);
  try {
    const { rows } = await pool.query(
      `UPDATE leads
          SET status = COALESCE($2, status),
              responded_at = CASE
                WHEN $2 = 'responded' AND status <> 'responded' THEN now()
                WHEN $2 = 'new' THEN NULL
                ELSE responded_at END,
              response_note = CASE WHEN $3::boolean THEN $4 ELSE response_note END
        WHERE id = $1
        RETURNING ${LEAD_COLUMNS}`,
      [id, status, body.responseNote !== undefined, note]
    );
    if (!rows.length) return res.status(404).json({ error: "not found" });
    res.json({ lead: rows[0] });
  } catch (err) {
    console.error("Updating lead failed:", err.message);
    res.status(500).json({ error: "update failed" });
  }
});

app.delete("/api/admin/leads/:id", requireAdmin, async (req, res) => {
  const id = leadId(req);
  if (!id || !pool) return res.status(400).json({ error: "bad request" });
  try {
    const { rowCount } = await pool.query("DELETE FROM leads WHERE id = $1", [id]);
    if (!rowCount) return res.status(404).json({ error: "not found" });
    res.json({ deleted: true });
  } catch (err) {
    console.error("Deleting lead failed:", err.message);
    res.status(500).json({ error: "delete failed" });
  }
});

// "Send again" (CR-008): sends one lead to the hub now. Works on any lead not in the hub yet,
// including one the hub refused (for example after the hub fixes a check).
app.post("/api/admin/leads/:id/forward", requireAdmin, adminJson, async (req, res) => {
  const id = leadId(req);
  if (!id || !pool) return res.status(400).json({ error: "bad request" });
  if (!HUB_INTAKE_URL || !INTAKE_SECRET) return res.status(503).json({ error: "hub not set up" });
  if (hubBudgetLeft() <= 0) return res.status(429).json({ error: "hub limit" });
  try {
    const { rows } = await pool.query("SELECT * FROM leads WHERE id = $1", [id]);
    if (!rows.length) return res.status(404).json({ error: "not found" });
    if (!rows[0].forwarded) await forwardLead(rows[0]);
    const updated = await pool.query(`SELECT ${LEAD_COLUMNS} FROM leads WHERE id = $1`, [id]);
    res.json({ lead: updated.rows[0] });
  } catch (err) {
    console.error("Sending lead again failed:", err.message);
    res.status(500).json({ error: "send failed" });
  }
});

// "Send all again" (CR-008): every lead not in the hub yet, except ones the hub refused.
app.post("/api/admin/leads/forward-all", requireAdmin, adminJson, async (req, res) => {
  if (!pool) return res.status(400).json({ error: "bad request" });
  if (!HUB_INTAKE_URL || !INTAKE_SECRET) return res.status(503).json({ error: "hub not set up" });
  if (sendingBatch) return res.status(409).json({ error: "already sending" });
  sendingBatch = true;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM leads WHERE forwarded = false AND forward_rejected = false ORDER BY created_at"
    );
    res.json(await sendBatch(rows));
  } catch (err) {
    console.error("Sending all again failed:", err.message);
    res.status(500).json({ error: "send failed" });
  } finally {
    sendingBatch = false;
  }
});

// Marketing dashboard: visits, leads, and conversion rate by source.
app.get("/api/admin/stats", requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ error: "database not configured" });
  const allTime = req.query.range === "all";
  try {
    const { rows } = await pool.query(
      `WITH v AS (
         SELECT source, count(*)::int AS visits FROM visits
          WHERE $1::boolean OR created_at > now() - interval '30 days' GROUP BY source),
       l AS (
         SELECT source, count(*)::int AS leads FROM leads
          WHERE $1::boolean OR created_at > now() - interval '30 days' GROUP BY source)
       SELECT COALESCE(v.source, l.source) AS source,
              COALESCE(v.visits, 0) AS visits,
              COALESCE(l.leads, 0) AS leads
         FROM v FULL OUTER JOIN l ON v.source = l.source
        ORDER BY visits DESC, leads DESC, source`,
      [allTime]
    );
    const rate = (leads, visits) => (visits > 0 ? Math.round((leads / visits) * 1000) / 10 : null);
    const sources = rows.map((row) => ({ ...row, conversion: rate(row.leads, row.visits) }));
    const visits = sources.reduce((sum, row) => sum + row.visits, 0);
    const leads = sources.reduce((sum, row) => sum + row.leads, 0);
    res.json({ range: allTime ? "all" : "30d", sources, total: { visits, leads, conversion: rate(leads, visits) } });
  } catch (err) {
    console.error("Loading stats failed:", err.message);
    res.status(500).json({ error: "load failed" });
  }
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
// "/contact/" works like "/contact" (CR-002 D15). Leading slashes are collapsed
// so a path like "//example.com/" can never redirect to another site.
app.use((req, res, next) => {
  if (req.path.length > 1 && req.path.endsWith("/") && !req.path.startsWith("/api/")) {
    const clean = "/" + req.path.replace(/^\/+/, "").replace(/\/+$/, "");
    return res.redirect(301, clean + req.url.slice(req.path.length));
  }
  next();
});

app.use(express.static(path.join(__dirname, "public"), { extensions: ["html"] }));

app.use(sendNotFound);

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
