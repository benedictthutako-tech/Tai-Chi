const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const videoModal = document.getElementById("videoModal") || document.querySelector("[data-video-modal]");
const videoFrame = videoModal?.querySelector("[data-video-frame], iframe, video") || document.querySelector("[data-video-frame]");
const videoTriggers = document.querySelectorAll("[data-video-trigger]");
const modalCloseControls = document.querySelectorAll("[data-modal-close], .close-btn");
const filterTabs = document.querySelectorAll("[data-filter]");
const resourceCards = document.querySelectorAll("[data-category]");
const portalPanel = document.querySelector("[data-portal-panel]");
const portalTriggers = document.querySelectorAll("[data-portal-trigger]");
const portalClose = document.querySelector("[data-portal-close]");
const portalForm = document.querySelector("[data-portal-form]");
const portalMessage = document.querySelector("[data-portal-message]");
const demoLoginButtons = document.querySelectorAll("[data-demo-login]");
const demoLogoutButtons = document.querySelectorAll("[data-demo-logout]");
const quizForm = document.querySelector("[data-quiz-form]");
const quizResult = document.querySelector("[data-quiz-result]");
const revealTargets = document.querySelectorAll(".reveal");
const toTop = document.getElementById("toTop");

/**
 * Adds visual depth to the sticky header once the page has moved.
 */
function updateScrolledHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 12);
}

/**
 * Opens or closes the mobile navigation and keeps ARIA state in sync.
 */
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

/**
 * Opens the video overlay for the homepage intro video.
 */
function openVideoModal() {
  if (!videoModal) return;

  if (videoFrame instanceof HTMLIFrameElement && videoFrame.dataset.videoSrc) {
    if (window.TCESecurity?.isAllowedEmbedUrl(videoFrame.dataset.videoSrc)) {
      videoFrame.src = videoFrame.dataset.videoSrc;
    }
  }

  if (videoFrame instanceof HTMLVideoElement && videoFrame.dataset.videoSrc) {
    videoFrame.src = videoFrame.dataset.videoSrc;
    videoFrame.load();
  }

  videoModal.classList.add("open");
  videoModal.style.display = "block";
  videoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeVideoModal() {
  if (!videoModal) return;

  videoModal.classList.remove("open");
  videoModal.style.display = "none";
  videoModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (videoFrame instanceof HTMLIFrameElement) {
    videoFrame.removeAttribute("src");
  }

  if (videoFrame instanceof HTMLVideoElement) {
    videoFrame.pause();
    videoFrame.removeAttribute("src");
    videoFrame.load();
  }
}

window.openModal = openVideoModal;
window.closeModal = closeVideoModal;

function initVideoModal() {
  videoTriggers.forEach((trigger) => {
    trigger.addEventListener("click", openVideoModal);
  });

  modalCloseControls.forEach((control) => {
    control.addEventListener("click", closeVideoModal);
  });

  videoModal?.addEventListener("click", (event) => {
    if (event.target === videoModal) {
      closeVideoModal();
    }
  });
}

/**
 * Filters resource cards by matching the selected category against each card's
 * space-separated data-category list.
 */
function filterResources(category) {
  resourceCards.forEach((card) => {
    const categories = card.dataset.category?.split(" ") || [];
    const shouldShow = category === "all" || categories.includes(category);

    card.hidden = !shouldShow;
    card.classList.toggle("is-filtered-out", !shouldShow);
  });
}

function initResourceFilters() {
  if (!filterTabs.length || !resourceCards.length) return;

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const category = tab.dataset.filter || "all";

      filterTabs.forEach((item) => {
        item.classList.toggle("is-active", item === tab);
        item.setAttribute("aria-pressed", String(item === tab));
      });

      filterResources(category);
    });
  });

  filterTabs.forEach((tab) => {
    tab.setAttribute("aria-pressed", String(tab.classList.contains("is-active")));
  });
}

/**
 * Simulates a secure client portal without navigating away from the homepage.
 * Production must verify access on the server (MemberSpace, Supabase Auth, etc.).
 */
function openPortalPanel(event) {
  event?.preventDefault();
  if (!portalPanel) return;

  portalPanel.classList.add("open");
  portalPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("portal-open");
  portalPanel.querySelector("input")?.focus();
}

function closePortalPanel() {
  if (!portalPanel) return;

  portalPanel.classList.remove("open");
  portalPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("portal-open");
}

function initPortalMockup() {
  portalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", openPortalPanel);
  });

  portalClose?.addEventListener("click", closePortalPanel);

  portalForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (window.TCESecurity?.isHoneypotTriggered(portalForm)) {
      return;
    }

    const emailInput = portalForm.querySelector("input[type='email'], input[name='email']");
    const email = window.TCESecurity?.sanitizeText(emailInput?.value || "", 254) || "";

    if (!window.TCESecurity?.isValidEmail(email)) {
      if (portalMessage) {
        portalMessage.textContent = "Please enter a valid email address to continue.";
      }
      emailInput?.focus();
      return;
    }

    if (portalMessage) {
      portalMessage.textContent = "Access confirmed. Opening your student dashboard...";
    }

    window.TCESecurity?.grantAccess();
    window.location.href = "dashboard.html";
  });
}

/**
 * Demo-only access flow for this static prototype.
 * Replace with verified backend auth before production launch.
 */
function grantDemoDashboardAccess() {
  window.TCESecurity?.grantAccess();
  window.location.href = "dashboard.html";
}

function revokeDemoDashboardAccess() {
  window.TCESecurity?.revokeAccess();
  window.location.href = "index.html#courses";
}

function guardDashboardAccess() {
  const isDashboardPage = document.body.classList.contains("dashboard-page");
  if (!isDashboardPage) return;

  if (window.TCESecurity?.hasValidAccess()) return;

  window.alert("Please enroll or log in before accessing the course dashboard.");
  window.location.replace("index.html#courses");
}

function initDemoAccessControls() {
  demoLoginButtons.forEach((button) => {
    button.addEventListener("click", grantDemoDashboardAccess);
  });

  demoLogoutButtons.forEach((button) => {
    button.addEventListener("click", revokeDemoDashboardAccess);
  });
}

/**
 * Soft reveal animation with a no-JS-risk fallback for older browsers.
 */
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

/**
 * Scores the course quiz by comparing each selected radio value with the
 * correct answer stored on its fieldset.
 */
function initCourseQuiz() {
  if (!quizForm || !quizResult) return;

  quizForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const questions = Array.from(quizForm.querySelectorAll("[data-answer]"));
    let score = 0;

    questions.forEach((question) => {
      const selected = question.querySelector("input[type='radio']:checked");

      if (selected?.value === question.dataset.answer) {
        score += 1;
      }
    });

    quizResult.classList.add("show");

    if (score === questions.length) {
      quizResult.replaceChildren();

      const lead = document.createTextNode("Congratulations, you passed! ");
      const link = document.createElement("a");
      link.href = "#";
      link.setAttribute("aria-label", "Download your CPD Certificate");
      link.textContent = "Click here to download your CPD Certificate";

      quizResult.append(lead, link);
      return;
    }

    quizResult.textContent = `You scored ${score} out of ${questions.length}. Review the lesson and try again.`;
  });
}

function handleEscapeKey(event) {
  if (event.key !== "Escape") return;

  closeVideoModal();
  closePortalPanel();
  setMobileMenu(false);
}

window.addEventListener("scroll", () => {
  updateScrolledHeader();
  toTop?.classList.toggle("show", window.scrollY > 500);
});

document.addEventListener("keydown", handleEscapeKey);

guardDashboardAccess();
updateScrolledHeader();
initMobileMenu();
initVideoModal();
initResourceFilters();
initPortalMockup();
initDemoAccessControls();
initRevealAnimations();
initBackToTop();
initStripeCheckoutButtons();
initCourseQuiz();
