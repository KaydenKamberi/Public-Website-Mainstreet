// Cloudflare Turnstile, the contact form's bot check (CR-013 section 3, security check #2).
// The browser sends the widget's one-time token; it's checked with Cloudflare before anything goes to the hub.
// TURNSTILE_SECRET_KEY is an encrypted Cloudflare secret. Without it the form refuses (it never skips the check).
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function turnstileOk(env, token, ip) {
  if (!env.TURNSTILE_SECRET_KEY || typeof token !== "string" || !token || token.length > 2048) return false;
  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET_KEY);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  try {
    const response = await fetch(VERIFY_URL, { method: "POST", body: form, signal: AbortSignal.timeout(5000) });
    const result = await response.json();
    if (!result.success) console.warn(`Turnstile refused the form: ${(result["error-codes"] || []).join(", ") || "no reason"}.`);
    return result.success === true;
  } catch (err) {
    console.warn(`Turnstile check failed: ${err.name}.`);
    return false;
  }
}
