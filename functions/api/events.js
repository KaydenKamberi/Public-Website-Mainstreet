// POST /api/events (CR-011): one batch per page view (taps, sections reached, time on screen, form steps, plus
// phone/tablet/computer). Only known kinds and short names pass; the hub keeps daily totals. Like visits,
// failures are dropped, nothing is kept here, and the hub is told in the background.
import { cleanSource } from "../_lib/lead.js";
import { hubUrl, postToHub } from "../_lib/hub.js";
import { BOT_PATTERN, VISIT_PAGES, empty, json, readText } from "../_lib/respond.js";

const EVENT_TYPES = new Set(["tap", "section", "time", "form"]);
const DEVICES = new Set(["phone", "tablet", "computer"]);
const EVENT_NAME = /^[a-z0-9_-]{1,40}$/;
const EVENTS_PER_BATCH = 60;

export async function onRequestPost({ request, env, waitUntil }) {
  const url = hubUrl(env, "/api/intake/events");
  if (!url || !env.INTAKE_SECRET || BOT_PATTERN.test(request.headers.get("User-Agent") || "")) return empty();
  const raw = await readText(request, 8 * 1024);
  let body;
  try {
    body = JSON.parse(raw ?? "");
  } catch {
    return empty();
  }
  if (!body || !VISIT_PAGES.has(body.page) || !Array.isArray(body.events)) return empty();
  const events = body.events
    .slice(0, EVENTS_PER_BATCH)
    .filter((event) => event && EVENT_TYPES.has(event.type) && EVENT_NAME.test(event.name))
    .map((event) => ({ type: event.type, name: event.name }));
  if (!events.length) return empty();

  waitUntil(postToHub(env, url, {
    page: body.page,
    source: cleanSource(body.source),
    ...(DEVICES.has(body.device) ? { device: body.device } : {}),
    events,
  }, `events on ${body.page}`, 5000));
  return empty();
}

export function onRequest() {
  return json(405, { error: "method not allowed" });
}
