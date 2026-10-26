// Answers from the Functions. Cloudflare doesn't apply public/_headers to Function responses, so the same
// security headers are set here (CR-013 section 5). API answers are never cached.
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
  "Cache-Control": "no-store",
};

export function json(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { ...SECURITY_HEADERS, "Content-Type": "application/json; charset=utf-8" } });
}

export function plain(status, message) {
  return new Response(message, { status, headers: { ...SECURITY_HEADERS, "Content-Type": "text/plain; charset=utf-8" } });
}

export function empty(status = 204) {
  return new Response(null, { status, headers: SECURITY_HEADERS });
}

// The body as text, or null when it's bigger than the limit (checked on the real bytes, not just the header).
export async function readText(request, maxBytes) {
  const declared = Number(request.headers.get("Content-Length") || 0);
  if (declared > maxBytes) return null;
  const buffer = await request.arrayBuffer();
  if (buffer.byteLength > maxBytes) return null;
  return new TextDecoder().decode(buffer);
}

// The visitor's address. Cloudflare sets CF-Connecting-IP itself; a visitor can't fake it (CR-013 section 4).
export const visitorIp = (request) => request.headers.get("CF-Connecting-IP") || "";

export const BOT_PATTERN = /bot|crawl|spider|slurp|preview|headless|lighthouse/i;
export const VISIT_PAGES = new Set(["home", "offerings", "about", "contact", "privacy"]);
