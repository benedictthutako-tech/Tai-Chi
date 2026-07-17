/**
 * Shared client-side security helpers for the static Tai Chi Exercises site.
 * Replace demo access controls with server-verified auth (MemberSpace, Supabase, etc.) in production.
 */
(function initSecurityHelpers(global) {
  const ACCESS_KEY = "taiChiCourseAccess";
  const ACCESS_TTL_MS = 12 * 60 * 60 * 1000;
  const ALLOWED_CHECKOUT_COURSES = new Set(["part1", "part2"]);
  const ALLOWED_PAYMENT_METHODS = new Set(["apple-pay", "google-pay"]);
  const ALLOWED_VIDEO_HOSTS = ["www.youtube.com", "youtube.com", "www.youtube-nocookie.com"];

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function sanitizeText(value, maxLength) {
    return String(value)
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .trim()
      .slice(0, maxLength);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
  }

  function isHoneypotTriggered(form) {
    const trap = form?.querySelector("[data-honeypot]");
    return Boolean(trap && trap.value.trim());
  }

  function readAllowedSearchParam(name, allowedValues, fallback) {
    const value = new URLSearchParams(global.location.search).get(name);
    return allowedValues.has(value) ? value : fallback;
  }

  function isAllowedEmbedUrl(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" && ALLOWED_VIDEO_HOSTS.includes(parsed.hostname);
    } catch {
      return false;
    }
  }

  function createAccessToken() {
    return JSON.stringify({ v: 1, exp: Date.now() + ACCESS_TTL_MS });
  }

  function hasValidAccess() {
    try {
      const raw = global.sessionStorage.getItem(ACCESS_KEY);
      if (!raw) return false;

      const token = JSON.parse(raw);
      return token.v === 1 && typeof token.exp === "number" && Date.now() < token.exp;
    } catch {
      return false;
    }
  }

  function grantAccess() {
    global.sessionStorage.setItem(ACCESS_KEY, createAccessToken());
    global.localStorage.removeItem(ACCESS_KEY);
  }

  function revokeAccess() {
    global.sessionStorage.removeItem(ACCESS_KEY);
    global.localStorage.removeItem(ACCESS_KEY);
  }

  // Remove legacy demo tokens that were easy to set manually in DevTools.
  global.localStorage.removeItem(ACCESS_KEY);

  global.TCESecurity = {
    ACCESS_KEY,
    escapeHtml,
    sanitizeText,
    isValidEmail,
    isHoneypotTriggered,
    readAllowedSearchParam,
    isAllowedEmbedUrl,
    grantAccess,
    revokeAccess,
    hasValidAccess,
    ALLOWED_CHECKOUT_COURSES,
    ALLOWED_PAYMENT_METHODS,
  };
})(window);
