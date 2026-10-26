// POST /api/visits (CR-010): one visit per browser session (page + source), passed on to the hub's Marketing page.
// Nothing is kept here, and no IP, name, or device info is sent. Self-identified bots are skipped; a visit is
// only a count, so failures are dropped. The answer comes first; the hub is told in the background.
import { cleanSource } from "../_lib/lead.js";
import { hubUrl, postToHub } from "../_lib/hub.js";
import { BOT_PATTERN, VISIT_PAGES, empty, json, readText } from "../_lib/respond.js";

export async function onRequestPost({ request, env, waitUntil }) {
  const url = hubUrl(env, "/api/intake/visit");
  if (!url || !env.INTAKE_SECRET || BOT_PATTERN.test(request.headers.get("User-Agent") || "")) return empty();
  const raw = await readText(request, 1024);
  let body;
  try {
    body = JSON.parse(raw ?? "");
  } catch {
    return empty();
  }
  if (!body || !VISIT_PAGES.has(body.page)) return empty();
  waitUntil(postToHub(env, url, { page: body.page, source: cleanSource(body.source), visited_at: new Date().toISOString() }, `visit to ${body.page}`, 5000));
  return empty();
}

export function onRequest() {
  return json(405, { error: "method not allowed" });
}
