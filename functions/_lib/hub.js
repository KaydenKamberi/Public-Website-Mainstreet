// Sending to the private team hub (CR-013). Follows the hub's specs/intake-contract.md (v4): each body is
// POSTed to HUB_URL + the path, signed with INTAKE_SECRET as
// X-Intake-Signature: sha256=<hex HMAC-SHA256 of "<timestamp>.<body>">.
// INTAKE_SECRET is an encrypted Cloudflare secret; HUB_URL is a Cloudflare setting. Neither ever reaches the browser.

export function hubUrl(env, pathname) {
  if (!env.HUB_URL) return null;
  try {
    return new URL(pathname, env.HUB_URL).toString();
  } catch {
    console.warn("HUB_URL is not a valid URL.");
    return null;
  }
}

async function sign(secret, message) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Signs a JSON body like every hub intake endpoint expects and sends it.
// Returns the hub's HTTP status, or null when there was no answer.
export async function postToHub(env, url, payload, label, timeoutMs) {
  const body = JSON.stringify(payload);
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = await sign(env.INTAKE_SECRET, `${timestamp}.${body}`);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Intake-Timestamp": timestamp,
        "X-Intake-Signature": `sha256=${signature}`,
      },
      body,
      signal: AbortSignal.timeout(timeoutMs),
    });
    // The status only: the hub's reply can repeat what the visitor typed.
    if (response.status !== 200 && response.status !== 201) console.warn(`Hub answered HTTP ${response.status} for ${label}.`);
    return response.status;
  } catch (err) {
    console.warn(`Hub unreachable for ${label}: ${err.name === "TimeoutError" ? `timed out after ${timeoutMs / 1000} seconds` : err.name}`);
    return null;
  }
}
