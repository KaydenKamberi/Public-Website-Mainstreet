// GET /api/health: whether the relay is set up. Says yes or no only, never the values.
import { json } from "../_lib/respond.js";

export function onRequestGet({ env }) {
  return json(200, {
    status: "ok",
    hub: env.HUB_URL && env.INTAKE_SECRET ? "set up" : "not set up",
    botCheck: env.TURNSTILE_SECRET_KEY ? "set up" : "not set up",
  });
}
