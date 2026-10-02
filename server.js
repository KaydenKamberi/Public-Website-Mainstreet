// Mainstreet Sites SD public website server.
// Serves the pages in /public and stores leads and visits in PostgreSQL.

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

const app = express();

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
  });
