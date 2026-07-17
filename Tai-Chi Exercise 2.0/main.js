const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const revealTargets = document.querySelectorAll(".reveal");
const toTop = document.getElementById("toTop");

function updateScrolledHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 12);
}

function setMobileMenu(open) {
  if (!menuToggle || !nav) return;

  nav.classList.toggle("open", open);
  menuToggle.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
}

function initMobileMenu() {
  if (!menuToggle || !nav) return;

  menuToggle.addEventListener("click", () => {
    setMobileMenu(!nav.classList.contains("open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMobileMenu(false));
  });
}

function initRevealAnimations() {
  if (!revealTargets.length) return;

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("in"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

function initBackToTop() {
  toTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initStripeCheckoutButtons() {
  const stripeButtons = document.querySelectorAll(".btn-stripe-checkout");

  stripeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const originalText = button.dataset.originalText || button.textContent;

      button.dataset.originalText = originalText;
      button.textContent = "Redirecting to Stripe...";
      button.classList.add("btn-loading");
      button.setAttribute("aria-busy", "true");

      window.setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("btn-loading");
        button.removeAttribute("aria-busy");
      }, 2200);
    });
  });
}

window.addEventListener("scroll", () => {
  updateScrolledHeader();
  toTop?.classList.toggle("show", window.scrollY > 500);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMobileMenu(false);
  }
});

updateScrolledHeader();
initMobileMenu();
initRevealAnimations();
initBackToTop();
initStripeCheckoutButtons();
