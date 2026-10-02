// Public site behavior: phone menu, sticky phone button, footer year.

document.documentElement.classList.add("js");

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

// Footer year
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});
