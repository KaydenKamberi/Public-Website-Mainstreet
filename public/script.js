// Public site behavior: marketing source, phone menu, sticky phone button,
// contact form, footer year.

document.documentElement.classList.add("js");

// Marketing source: keep the first utm_source or referring site this browser arrived
// with (CR-010). Only the site's name is used, never the full address or search words.
const SOURCE_KEY = "mainstreet_source";
const REFERRER_SOURCES = [
  [/(^|\.)google\.|googlequicksearchbox/, "google"],
  [/(^|\.)bing\.com$/, "bing"],
  [/(^|\.)duckduckgo\.com$/, "duckduckgo"],
  [/(^|\.)yahoo\./, "yahoo"],
  [/(^|\.)instagram\.com$/, "instagram"],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me|messenger\.com)$/, "facebook"],
  [/(^|\.)tiktok\.com$/, "tiktok"],
  [/(^|\.)(twitter\.com|x\.com|t\.co)$/, "x"],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, "linkedin"],
  [/(^|\.)yelp\./, "yelp"],
  [/(^|\.)nextdoor\./, "nextdoor"],
];

function sourceFromReferrer() {
  let host = "";
  try {
    host = new URL(document.referrer).hostname.toLowerCase();
  } catch (err) {
    return ""; // No referrer: typed in, a bookmark, or an app that hides it.
  }
  if (!host || host === location.hostname) return "";
  const known = REFERRER_SOURCES.find(([pattern]) => pattern.test(host));
  return known ? known[1] : "other-site";
}

function getSource() {
  let saved = null;
  try {
    saved = localStorage.getItem(SOURCE_KEY);
  } catch (err) {
    // Storage can be blocked (private mode); fall back to this page's link and referrer.
  }
  if (saved) return saved;

  const fromUrl = (new URLSearchParams(location.search).get("utm_source") || "")
    .trim()
    .toLowerCase()
    .slice(0, 100);
  const found = fromUrl || sourceFromReferrer();
  if (found) {
    try {
      localStorage.setItem(SOURCE_KEY, found);
    } catch (err) {
      // Ignore: the source still applies to this page.
    }
  }
  return found || "direct";
}

const visitorSource = getSource();

// Visit tracking (CR-010): one visit per browser session, with only the
// source and the page, passed on to the team hub. Nothing personal is sent.
(function recordVisit() {
  const match = location.pathname.match(/^\/(index|offerings|about|contact|privacy)?(?:\.html)?$/);
  if (!match) return;
  const page = !match[1] || match[1] === "index" ? "home" : match[1];
  try {
    if (sessionStorage.getItem("mainstreet_visit")) return;
    sessionStorage.setItem("mainstreet_visit", "1");
  } catch (err) {
    // Storage blocked: still count this page.
  }
  const body = JSON.stringify({ source: visitorSource, page });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/visits", body);
  } else {
    fetch("/api/visits", { method: "POST", body, keepalive: true }).catch(() => {});
  }
})();

// Detailed analytics (CR-011): counts only, never tied to a person. Each page view
// collects taps, sections reached, time on screen and form steps in memory, and sends
// them in one batch when the visitor leaves or switches apps. Nothing typed is sent.
const trackEvent = (function setupAnalytics() {
  const match = location.pathname.match(/^\/(index|offerings|about|contact|privacy)?(?:\.html)?$/);
  if (!match) return () => {};
  const page = !match[1] || match[1] === "index" ? "home" : match[1];
  const device = innerWidth < 768 ? "phone" : innerWidth < 1024 ? "tablet" : "computer";
  const MAX_EVENTS = 60;
  const events = [];
  const once = new Set();
  let sentUpTo = 0;
  let timeSent = false;

  function track(type, name) {
    // Leaves room for the time event, so a page view never sends more than MAX_EVENTS.
    if (!/^[a-z0-9_-]{1,40}$/.test(name) || events.length >= MAX_EVENTS - 1) return;
    if (type !== "tap") {
      if (once.has(`${type}:${name}`)) return;
      once.add(`${type}:${name}`);
    }
    events.push({ type, name });
  }

  // Taps: where the link or button is, plus where it goes.
  const ZONES = [
    ["#site-nav", "nav"], [".site-header", "header"], ["[data-hero]", "hero"], [".sticky-cta", "sticky"],
    ["[data-closing-band]", "closing"], [".site-footer", "footer"], [".contact-form", "form"],
  ];
  function tapTarget(el) {
    if (el.matches(".menu-toggle")) return "menu";
    if (el.matches("[data-add-link]")) return "add-link";
    if (el.matches('button[type="submit"]')) return "send";
    const href = el.getAttribute("href");
    if (!href) return "button";
    if (href.startsWith("sms:")) return "text";
    if (href.startsWith("mailto:")) return "email";
    if (href.startsWith("tel:")) return "call";
    if (href.startsWith("#")) return "jump";
    let url;
    try {
      url = new URL(href, location.href);
    } catch (err) {
      return "other";
    }
    if (url.host !== location.host) return "other-site";
    const path = url.pathname.match(/^\/(index|offerings|about|contact|privacy)?(?:\.html)?\/?$/);
    return path ? (!path[1] || path[1] === "index" ? "home" : path[1]) : "other";
  }
  document.addEventListener("click", (event) => {
    const el = event.target.closest("a[href], button");
    if (!el) return;
    const zone = ZONES.find(([selector]) => el.closest(selector));
    track("tap", `${zone ? zone[1] : "body"}-${tapTarget(el)}`);
  }, true);

  // Sections: counted once when half of a section is on screen, or, for a section taller
  // than two screens, when it fills half the screen.
  if ("IntersectionObserver" in window) {
    const seen = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio < 0.5 && entry.intersectionRect.height < innerHeight / 2) return;
        track("section", entry.target.dataset.section);
        seen.unobserve(entry.target);
      });
    }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) });
    document.querySelectorAll("[data-section]:not([hidden])").forEach((section) => seen.observe(section));
  }

  // Time: only while the page is actually on screen.
  let visibleMs = 0;
  let shownAt = document.visibilityState === "visible" ? performance.now() : null;
  function timeBucket() {
    const seconds = (visibleMs + (shownAt === null ? 0 : performance.now() - shownAt)) / 1000;
    if (seconds < 10) return "0-10s";
    if (seconds < 30) return "10-30s";
    if (seconds < 120) return "30s-2m";
    if (seconds < 300) return "2-5m";
    return "5m-plus";
  }

  function flush() {
    if (!timeSent) {
      timeSent = true;
      events.push({ type: "time", name: timeBucket() });
    }
    const batch = events.slice(sentUpTo);
    sentUpTo = events.length;
    if (!batch.length) return;
    const body = JSON.stringify({ page, source: visitorSource, device, events: batch });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/events", body);
    else fetch("/api/events", { method: "POST", body, keepalive: true }).catch(() => {});
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      if (shownAt !== null) visibleMs += performance.now() - shownAt;
      shownAt = null;
      flush();
    } else {
      shownAt = performance.now();
    }
  });
  addEventListener("pagehide", () => {
    if (shownAt !== null) {
      visibleMs += performance.now() - shownAt;
      shownAt = null;
    }
    flush();
  });

  return track;
})();

// Phone menu
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.getElementById("site-nav");

function setMenuOpen(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  siteNav.classList.toggle("is-open", open);
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
}

// Sticky phone button: shows after the visitor scrolls past the hero,
// and hides while the closing band (which has its own button) is on screen.
const stickyCta = document.querySelector("[data-sticky-cta]");
const hero = document.querySelector("[data-hero]");
const closingBand = document.querySelector("[data-closing-band]");

if (stickyCta && hero && "IntersectionObserver" in window) {
  let pastHero = false;
  let closingVisible = false;

  const updateSticky = () => {
    stickyCta.classList.toggle("is-visible", pastHero && !closingVisible);
  };

  new IntersectionObserver(([entry]) => {
    pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    updateSticky();
  }).observe(hero);

  if (closingBand) {
    new IntersectionObserver(([entry]) => {
      closingVisible = entry.isIntersecting;
      updateSticky();
    }).observe(closingBand);
  }
}

// Contact form
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const fields = contactForm.elements;
  const status = document.getElementById("form-status");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const methodFields = contactForm.querySelectorAll("[data-method-field]");
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const linkBoxes = contactForm.querySelector("[data-link-boxes]");
  const addLink = contactForm.querySelector("[data-add-link]");
  const MAX_LINKS = 5;

  const chosenMethod = () => fields.contactMethod.value;

  // One id per filled-in form, kept if the visitor tries again after an error, so the
  // team hub saves the lead only once (CR-009).
  const newSubmissionId = () => "ms_" + [...crypto.getRandomValues(new Uint8Array(16))]
    .map((byte) => byte.toString(16).padStart(2, "0")).join("");
  let submissionId = newSubmissionId();
  const linkInputs = () => [...linkBoxes.querySelectorAll("input")];

  // Links: one box to start, "Add another link" adds up to 5 (CR-006).
  function showAddLink() {
    addLink.hidden = linkInputs().length >= MAX_LINKS;
  }

  function resetLinks() {
    linkInputs().slice(1).forEach((input) => input.remove());
    showAddLink();
  }

  addLink.addEventListener("click", () => {
    const inputs = linkInputs();
    if (inputs.length >= MAX_LINKS) return;
    const input = inputs[0].cloneNode();
    input.value = "";
    input.removeAttribute("aria-invalid");
    input.setAttribute("aria-label", `Link ${inputs.length + 1}`);
    linkBoxes.append(input);
    showAddLink();
    input.focus();
  });

  function showMethodField() {
    methodFields.forEach((field) => {
      field.hidden = field.dataset.methodField !== chosenMethod();
    });
  }

  function usPhoneDigits(value) {
    let digits = value.replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
    return digits.length === 10 ? digits : null;
  }

  function setError(input, errorId, message) {
    const error = document.getElementById(errorId);
    error.textContent = message;
    error.hidden = !message;
    if (input instanceof Element) {
      input.toggleAttribute("aria-invalid", Boolean(message));
    }
  }

  function validate() {
    const problems = [];
    const check = (input, errorId, message) => {
      setError(input, errorId, message);
      if (message) problems.push(input instanceof Element ? input : input[0]);
    };

    check(fields.name, "name-error", fields.name.value.trim() ? "" : "Please enter your name.");
    check(fields.businessType, "business-type-error",
      fields.businessType.value ? "" : "Please choose your business type.");

    const location = fields.location.value.trim();
    check(fields.location, "location-error", !location
      ? "Please tell us where your business is."
      : location.length > 120 ? "Please keep this to 120 characters." : "");

    const longLink = linkInputs().find((input) => input.value.trim().length > 500);
    linkInputs().forEach((input) => input.removeAttribute("aria-invalid"));
    check(longLink || linkInputs()[0], "links-error", longLink ? "Each link can be up to 500 characters." : "");
    check(fields.contactMethod, "contact-method-error",
      chosenMethod() ? "" : "Please choose Email or Text.");

    const email = fields.email.value.trim();
    let emailMessage = "";
    if (chosenMethod() === "email") {
      if (!email) emailMessage = "Please enter your email.";
      else if (!EMAIL_PATTERN.test(email)) emailMessage = "Please enter a valid email, like name@example.com.";
    }
    check(fields.email, "email-error", emailMessage);

    const phone = fields.phone.value.trim();
    let phoneMessage = "";
    if (chosenMethod() === "text") {
      if (!phone) phoneMessage = "Please enter your phone number.";
      else if (!usPhoneDigits(phone)) phoneMessage = "Please enter a valid 10-digit U.S. phone number.";
    }
    check(fields.phone, "phone-error", phoneMessage);

    check(fields.consent, "consent-error",
      fields.consent.checked ? "" : "Please check the box so we can send your info document.");

    return problems;
  }

  contactForm.addEventListener("change", (event) => {
    if (event.target.name === "contactMethod") showMethodField();
  });

  // Analytics (CR-011): the first time someone types or picks something.
  ["input", "change"].forEach((type) => contactForm.addEventListener(type, (event) => {
    if (event.target.name !== "website") trackEvent("form", "start");
  }));

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";
    status.className = "form-status";

    const problems = validate();
    if (problems.length) {
      problems[0].focus();
      return;
    }

    const method = chosenMethod();
    const payload = {
      name: fields.name.value.trim(),
      businessType: fields.businessType.value,
      contactMethod: method,
      email: method === "email" ? fields.email.value.trim() : "",
      phone: method === "text" ? fields.phone.value.trim() : "",
      location: fields.location.value.trim(),
      links: linkInputs().map((input) => input.value.trim()).filter(Boolean),
      message: fields.message.value.trim(),
      consent: fields.consent.checked,
      website: fields.website.value,
      source: visitorSource,
      submissionId,
    };

    // The site waits for the team hub's answer (CR-009), so show that it's working.
    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Request failed");

      contactForm.reset();
      resetLinks();
      submissionId = newSubmissionId();
      trackEvent("form", "sent");
      showMethodField();
      status.textContent = result.message;
      status.classList.add("is-success");
    } catch (err) {
      status.textContent = "Sorry, your message could not be sent. Please try again, or text us at (619) 786-7135.";
      trackEvent("form", "error");
      status.classList.add("is-error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
      status.focus();
    }
  });

  showMethodField();
  showAddLink();
}

// Animations only hide content once this script is running, so a failed
// script load never leaves sections invisible.
document.documentElement.classList.add("motion-ready");

// Storefront street: windows light up once when scrolled into view.
const street = document.querySelector(".street");

if (street) {
  if ("IntersectionObserver" in window) {
    const glow = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        street.classList.add("is-lit");
        glow.disconnect();
      }
    }, { threshold: 0.3 });
    glow.observe(street);
  } else {
    street.classList.add("is-lit");
  }
}

// CR-002: reveal on scroll, staggered lists, header shadow.
document.querySelectorAll("[data-stagger]").forEach((list) => {
  [...list.children].forEach((child, i) => child.style.setProperty("--i", i));
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        reveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealItems.forEach((el) => reveal.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add("is-in"));
}

const siteHeader = document.querySelector(".site-header");
if (siteHeader) {
  const onScroll = () => siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// Footer year
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

// CR-012: Home device stage and storefronts, in sync. Every 7 seconds the laptop,
// phone, glow and storefronts move to the next concept site. Nothing moves under
// reduced motion; picking a storefront still shows it in the laptop.
(function showcase() {
  const stage = document.querySelector("[data-stage]");
  const list = document.querySelector("[data-carousel]");
  if (!stage || !list || !stage.animate) return;

  const street = list.closest(".street");
  const items = [...list.children];
  // Shown in this order: restaurant, barbershop, bakery.
  const SITES = ["restaurant", "barber", "bakery"].map((key) => items.find((li) => li.dataset.site === key)).filter(Boolean);
  const DWELL = 7000;
  const EXPO = "cubic-bezier(.16, 1, .3, 1)";
  const GLIDE = "cubic-bezier(.65, 0, .35, 1)";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const src = (li, view) => `/images/work/showcase/${li.dataset.site}-${view}.jpg`;

  const laptop = stage.querySelector('[data-screen="desktop"]');
  const phone = stage.querySelector('[data-screen="phone"]');
  const ambient = stage.querySelectorAll(".stage-ambient span");
  const controls = document.querySelector("[data-controls]");
  const pauseButton = document.querySelector("[data-pause]");
  const dots = document.querySelectorAll(".street-dots i");
  const status = document.createElement("p");
  status.className = "visually-hidden";
  status.setAttribute("aria-live", "polite");
  street.append(status);

  let current = Math.max(0, SITES.findIndex((li) => li.classList.contains("is-now")));
  let running = [];
  let looping = false;
  let userPaused = false;
  let holding = false;
  let onScreen = true;
  let nowFrame = 0;

  // Each screen gets a second page so a new site can fade in over the old one.
  [laptop, phone].forEach((screen) => {
    const twin = screen.querySelector(".screen-page").cloneNode(true);
    twin.classList.remove("is-on");
    twin.querySelector("img").removeAttribute("fetchpriority");
    screen.append(twin);
  });

  // A button over each window shows that site in the laptop.
  SITES.forEach((li) => {
    const pick = document.createElement("button");
    pick.type = "button";
    pick.className = "window-pick";
    pick.setAttribute("data-showcase-pick", "");
    pick.setAttribute("aria-label", `Show the concept ${li.dataset.label} site in the laptop`);
    li.querySelector(".storefront-window").append(pick);
  });

  function swapScreen(screen, url, instant) {
    const on = screen.querySelector(".screen-page.is-on");
    const off = [...screen.querySelectorAll(".screen-page")].find((page) => page !== on);
    const img = off.querySelector("img");
    img.getAnimations().forEach((a) => a.cancel());
    img.style.transform = "";
    img.src = url;
    return img.decode().catch(() => {}).then(() => {
      off.style.zIndex = 1;
      on.style.zIndex = 0;
      off.classList.add("is-on");
      on.classList.remove("is-on");
      if (instant) return;
      off.animate(
        [{ opacity: 0, transform: "scale(1.045)", filter: "blur(8px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }],
        { duration: 1000, easing: EXPO }
      );
      on.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1000, easing: "ease" });
    });
  }

  // Slowly scroll a page inside its frame, like someone browsing it.
  function browse(img, frameHeight, delay) {
    const distance = img.offsetHeight - frameHeight;
    if (distance <= 0) return;
    running.push(img.animate(
      [{ transform: "translateY(0)" }, { transform: `translateY(${-distance}px)` }],
      { duration: DWELL - 2400, delay, easing: "cubic-bezier(.45, 0, .2, 1)", fill: "both" }
    ));
  }

  // Order the storefronts as [previous, current, next], sliding them into place.
  function arrange(animate) {
    const n = SITES.length;
    const order = [SITES[(current - 1 + n) % n], SITES[current], SITES[(current + 1) % n]];
    const before = new Map(items.map((li) => [li, li.getBoundingClientRect().left]));
    const focused = list.contains(document.activeElement) ? document.activeElement : null;
    order.forEach((li) => list.append(li));
    if (focused) focused.focus({ preventScroll: true });
    order.forEach((li, slot) => {
      li.classList.toggle("is-now", slot === 1);
      li.classList.toggle("is-next", slot === 2);
      li.querySelector(".window-pick").toggleAttribute("aria-current", slot === 1);
      const img = li.querySelector(".window-scroll img");
      if (slot !== 1 && img.style.transform) {
        img.animate([{ transform: img.style.transform }, { transform: "translateY(0)" }], { duration: 900, easing: GLIDE });
        img.style.transform = "";
      }
    });
    dots.forEach((dot, i) => dot.classList.toggle("is-on", i === current));
    if (!animate) return;
    const width = order[1].getBoundingClientRect().width;
    order.forEach((li) => {
      const dx = before.get(li) - li.getBoundingClientRect().left;
      if (!dx) return;
      if (Math.abs(dx) > width * 1.5) {
        // The store that wraps around fades in on the far side instead of sliding across.
        li.animate(
          [{ opacity: 0, transform: `translateX(${dx > 0 ? -40 : 40}px)` }, { opacity: 1, transform: "none" }],
          { duration: 700, delay: 300, easing: EXPO, fill: "backwards" }
        );
      } else {
        li.animate([{ transform: `translateX(${dx}px)` }, { transform: "none" }], { duration: 900, easing: GLIDE });
      }
    });
  }

  function stopLoop() {
    running.forEach((a) => {
      try { a.commitStyles(); } catch (err) { /* not rendered */ }
      a.onfinish = null;
      a.cancel();
    });
    running = [];
  }

  function applyPause() {
    const stop = userPaused || holding || !onScreen || document.hidden;
    running.forEach((a) => {
      if (stop && a.playState === "running") a.pause();
      else if (!stop && a.playState === "paused") a.play();
    });
  }

  function startLoop(delay) {
    stopLoop();
    if (reduce) return;
    looping = true;
    street.classList.add("is-moving");
    const now = SITES[current];
    browse(laptop.querySelector(".screen-page.is-on img"), laptop.clientHeight, delay);
    browse(phone.querySelector(".screen-page.is-on img"), phone.clientHeight, delay + 250);
    // The center window may still be growing, so use its measured "now" height.
    browse(now.querySelector(".window-scroll img"), nowFrame, delay);
    const clock = now.querySelector(".window-progress i").animate(
      [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
      { duration: DWELL, easing: "linear", fill: "both" }
    );
    clock.onfinish = () => go(current + 1);
    running.push(clock);
    applyPause();
  }

  function go(index, picked) {
    const next = (index + SITES.length) % SITES.length;
    if (next === current) return;
    stopLoop();
    current = next;
    const li = SITES[current];
    stage.querySelectorAll("[data-now]").forEach((el) => {
      el.textContent = `Concept ${li.dataset.label}`;
      if (!reduce) el.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 500, easing: EXPO });
    });
    if (picked) status.textContent = `Now showing the concept ${li.dataset.label} site.`;
    ambient.forEach((layer) => layer.classList.toggle("is-on"));
    const fresh = [...ambient].find((layer) => layer.classList.contains("is-on"));
    if (fresh) fresh.style.backgroundImage = `url(${src(li, "ambient")})`;
    arrange(!reduce);
    Promise.all([
      swapScreen(laptop, src(li, "desktop"), reduce),
      swapScreen(phone, src(li, "phone"), reduce),
    ]).then(() => startLoop(1100));
  }

  // Pause: the button, hovering or keyboard-focusing a storefront, off screen, hidden tab.
  if (pauseButton) {
    pauseButton.addEventListener("click", () => {
      userPaused = !userPaused;
      pauseButton.classList.toggle("is-paused", userPaused);
      pauseButton.setAttribute("aria-label", userPaused ? "Play the example sites" : "Pause the example sites");
      pauseButton.querySelector("[data-pause-label]").textContent = userPaused ? "Play" : "Pause";
      applyPause();
    });
  }
  list.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") { holding = true; applyPause(); }
  });
  list.addEventListener("pointerleave", () => { holding = false; applyPause(); });
  list.addEventListener("focusin", (event) => {
    if (event.target.matches(":focus-visible")) { holding = true; applyPause(); }
  });
  list.addEventListener("focusout", (event) => {
    if (!list.contains(event.relatedTarget)) { holding = false; applyPause(); }
  });
  document.addEventListener("visibilitychange", applyPause);

  list.addEventListener("click", (event) => {
    const li = event.target.closest(".storefront");
    if (li) go(SITES.indexOf(li), true);
  });

  // Swipe on touch screens.
  let startX = null;
  list.addEventListener("pointerdown", (event) => { if (event.pointerType !== "mouse") startX = event.clientX; });
  list.addEventListener("pointerup", (event) => {
    if (startX === null) return;
    const dx = event.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1), true);
  });

  function measure() {
    nowFrame = list.querySelector(".is-now .window-scroll").clientHeight;
  }

  function preload() {
    SITES.forEach((li) => ["desktop", "phone", "ambient"].forEach((view) => { new Image().src = src(li, view); }));
  }

  street.classList.add("is-showcase");
  arrange(false);
  measure();
  let resizeTimer;
  addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(measure, 1000); });
  if (controls && !reduce) controls.hidden = false;

  // Starts once the stage is on screen (on phones it sits under the buttons).
  function begin() {
    preload();
    startLoop(600);
  }

  if ("IntersectionObserver" in window) {
    const start = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      start.disconnect();
      begin();
    }, { threshold: 0.45 });
    start.observe(stage);
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (looping) applyPause();
    }).observe(stage.closest(".first-screen") || stage);
  } else {
    begin();
  }
})();
