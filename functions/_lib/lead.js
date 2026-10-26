// The contact form's checks (CR-013: the same rules server.js used on Replit, now for Cloudflare Pages Functions).

// Form label -> the hub's business_type key (team hub specs/intake-contract.md).
export const HUB_BUSINESS_TYPES = {
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
export const SPECIAL_REQUEST = "Other (special request)";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCATION_MAX = 120;
const LINKS_MAX = 5;
const LINK_MAX = 500;
// Keeps the signed request to the hub well under its 20 KB limit.
const HUB_TEXT_BYTES_MAX = 16 * 1024;

export const MESSAGES = {
  sent: "Thanks! Your message was sent.",
  special: "Thanks! Kevin or Kayden will contact you personally.",
  failed: "Sorry, your message could not be sent. Please try again, or text us at (619) 786-7135.",
};

export const text = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");

// Returns "+1XXXXXXXXXX" for a valid U.S. number, or null.
function normalizeUsPhone(value) {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return digits.length === 10 ? `+1${digits}` : null;
}

// Marketing source (CR-010): the utm_source or referring site from the visitor's browser.
// Same rule as the hub: missing means "direct", anything outside a-z 0-9 _ - (1-40) is "unknown".
export function cleanSource(value) {
  const source = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!source) return "direct";
  return /^[a-z0-9_-]{1,40}$/.test(source) ? source : "unknown";
}

export function validateLead(body) {
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
    source: cleanSource(body.source),
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

  const textBytes = new TextEncoder().encode(JSON.stringify([lead.name, lead.location, lead.links, lead.message])).length;
  if (textBytes > HUB_TEXT_BYTES_MAX) errors.message = "The form is too long.";

  return { lead, errors };
}

// One id per filled-in form, made in the visitor's browser and reused if they try again,
// so the hub saves a lead once even when its first answer got lost.
const SUBMISSION_ID = /^ms_[a-f0-9]{32}$/;

export function submissionId(value) {
  return typeof value === "string" && SUBMISSION_ID.test(value) ? value : `ms_${crypto.randomUUID().replace(/-/g, "")}`;
}
