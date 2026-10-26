// POST /api/leads: the contact form (CR-009 relay, now a Cloudflare Pages Function: CR-013).
// Checks the form, then the Turnstile bot check, then signs it and waits for the hub's answer.
// Nothing is stored here.
import { HUB_BUSINESS_TYPES, MESSAGES, SPECIAL_REQUEST, submissionId, text, validateLead } from "../_lib/lead.js";
import { hubUrl, postToHub } from "../_lib/hub.js";
import { json, plain, readText, visitorIp } from "../_lib/respond.js";
import { turnstileOk } from "../_lib/turnstile.js";

const MAX_BYTES = 10 * 1024;

// A plain form post sends each field as text; "links" can repeat.
function formBody(raw) {
  const params = new URLSearchParams(raw);
  const body = Object.fromEntries(params);
  const links = params.getAll("links");
  if (links.length) body.links = links;
  return body;
}

export async function onRequestPost({ request, env }) {
  const isJson = (request.headers.get("Content-Type") || "").includes("application/json");
  const reply = (status, message, extra = {}) => (isJson ? json(status, { message, ...extra }) : plain(status, message));

  const raw = await readText(request, MAX_BYTES);
  if (raw === null) return reply(400, MESSAGES.failed, { error: "bad request" });
  let body;
  try {
    body = isJson ? JSON.parse(raw) : formBody(raw);
  } catch {
    return reply(400, MESSAGES.failed, { error: "bad request" });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return reply(400, MESSAGES.failed, { error: "bad request" });

  // Hidden "website" field: people leave it empty, spam bots fill it in. They're told it worked; nothing is sent.
  if (text(body.website, 200)) return reply(200, MESSAGES.sent);

  // Per-address limit, when the Rate Limiting binding is set up (CR-013 D4). The Cloudflare rule and the
  // hub's own limit stay in front of and behind it either way.
  const ip = visitorIp(request);
  if (env.FORM_LIMITER && ip) {
    const { success } = await env.FORM_LIMITER.limit({ key: ip });
    if (!success) return reply(429, MESSAGES.failed, { error: "too many" });
  }

  const { lead, errors } = validateLead(body);
  if (Object.keys(errors).length) return reply(400, MESSAGES.failed, { error: "invalid", fields: errors });

  // The browser's widget puts its token in "cf-turnstile-response"; the site's script also sends it as "turnstile".
  if (!(await turnstileOk(env, body.turnstile ?? body["cf-turnstile-response"], ip))) {
    return reply(400, MESSAGES.failed, { error: "bot check" });
  }

  const url = hubUrl(env, "/api/intake/website");
  if (!url || !env.INTAKE_SECRET) return reply(503, MESSAGES.failed, { error: "hub not set up" });

  // The visitor waits for the hub's answer: there is no copy here to send later.
  const id = submissionId(body.submissionId);
  const status = await postToHub(env, url, {
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
    source: lead.source,
    submitted_at: new Date().toISOString(),
  }, id, 10000);
  if (status !== 200 && status !== 201) return reply(502, MESSAGES.failed, { error: "not received" });

  return reply(201, lead.businessType === SPECIAL_REQUEST ? MESSAGES.special : MESSAGES.sent);
}

export function onRequest() {
  return json(405, { error: "method not allowed" });
}
