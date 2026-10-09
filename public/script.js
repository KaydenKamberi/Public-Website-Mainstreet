// Public site behavior: marketing source, phone menu, sticky phone button,
// contact form, footer year.

document.documentElement.classList.add("js");

// Marketing source: keep the first utm_source this browser arrived with.
const SOURCE_KEY = "mainstreet_source";

function getSource() {
  let saved = null;
  try {
    saved = localStorage.getItem(SOURCE_KEY);
  } catch (err) {
    // Storage can be blocked (private mode); fall back to the current URL.
  }
  if (saved) return saved;

  const fromUrl = (new URLSearchParams(location.search).get("utm_source") || "")
    .trim()
    .toLowerCase()
    .slice(0, 100);
  const source = fromUrl || "direct";
  if (fromUrl) {
    try {
      localStorage.setItem(SOURCE_KEY, source);
    } catch (err) {
      // Ignore: the source still applies to this page.
    }
  }
  return source;
}

const visitorSource = getSource();

// Visit tracking (CR-004): one visit per browser session, with only the
// source and the page. Nothing personal is sent.
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
    };

    submitButton.disabled = true;
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
      showMethodField();
      status.textContent = result.message;
      status.classList.add("is-success");
    } catch (err) {
      status.textContent = "Sorry, your message could not be sent. Please try again.";
      status.classList.add("is-error");
    } finally {
      submitButton.disabled = false;
      status.focus();
    }
  });

  showMethodField();
  showAddLink();
}

// Animations only hide content once this script is running, so a failed
// script load never leaves sections invisible.
document.documentElement.classList.add("motion-ready");

// Storefront street: windows light up once when scrolled into view, and the
// phone-only sideways scroller can take keyboard focus.
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

  const scroller = street.querySelector(".street-scroll");
  const phone = window.matchMedia("(max-width: 767px)");
  const setScrollFocus = () => {
    if (phone.matches) scroller.setAttribute("tabindex", "0");
    else scroller.removeAttribute("tabindex");
  };
  if (scroller) {
    setScrollFocus();
    phone.addEventListener("change", setScrollFocus);
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
