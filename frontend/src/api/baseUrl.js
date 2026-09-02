/* =====================================================================
   Single source of truth for the backend base URL.

   Every API client in the app (axios.js for shoppers, admin.js for the
   dashboard) reads its baseURL from here, so a mis-configured deploy
   fails in one predictable place instead of one file at a time.

   The rule: a base URL is the API ROOT, i.e. it always ends in /api.
   VITE_API_URL is an env var typed by a human at deploy time, and the
   two mistakes it invites are both silent and both take checkout down:

     1. Bare origin   — https://well-s-merry.onrender.com
        Every call drops the /api prefix, so checkout POSTs to /orders
        and the server answers 404 "Route not found".

     2. Over-specific — https://well-s-merry.onrender.com/api/orders
        Calls become /api/orders/orders and 404 the same way.

   `resolveApiBaseUrl` normalises both (and trailing slashes, and a
   missing scheme) so the app works no matter which spelling ships.
   ===================================================================== */

/** Live backend, used when VITE_API_URL is unset in a production build. */
export const PRODUCTION_API_ORIGIN = "https://well-s-merry.onrender.com";

/** Local dev backend, used when VITE_API_URL is unset while developing. */
export const DEVELOPMENT_API_ORIGIN = "http://localhost:5000";

/** Every mounted API router lives under this prefix (see backend/app.js). */
export const API_PATH = "api";

const SCHEME_RE = /^[a-z][a-z0-9+.-]*:\/\//i;

const normaliseRelative = (path) => {
  const segments = path.split("/").filter(Boolean);
  const apiIndex = segments.indexOf(API_PATH);
  const trimmed =
    apiIndex === -1
      ? [...segments, API_PATH]
      : segments.slice(0, apiIndex + 1);
  return `/${trimmed.join("/")}`;
};

/**
 * Turn whatever VITE_API_URL holds into a usable API root.
 *
 * Pure and dependency-free so it can be unit-tested (see baseUrl.test.js).
 *
 * @param {string} [raw]          value of import.meta.env.VITE_API_URL
 * @param {object} [options]
 * @param {boolean} [options.isProduction] pick the production fallback when
 *   no value is configured — a production build pointed at localhost would
 *   silently send every shopper's request to their own machine.
 * @returns {string} base URL ending in /api
 */
export const resolveApiBaseUrl = (raw, { isProduction = false } = {}) => {
  const fallbackOrigin = isProduction
    ? PRODUCTION_API_ORIGIN
    : DEVELOPMENT_API_ORIGIN;
  const fallback = `${fallbackOrigin}/${API_PATH}`;

  const value = (raw ?? "").trim();
  if (!value) return fallback;

  // Relative root ("/api") — used when the frontend is served through a
  // proxy on the same origin as the API.
  if (value.startsWith("/")) return normaliseRelative(value);

  // A host without a scheme ("well-s-merry.onrender.com") is a plain string
  // to URL, not a URL. Assume https; localhost is the only sane exception.
  const candidate = SCHEME_RE.test(value)
    ? value
    : `https://${value.replace(/^\/+/, "")}`;

  let url;
  try {
    url = new URL(candidate);
  } catch {
    return fallback;
  }

  url.pathname = normaliseRelative(url.pathname);
  url.search = "";
  url.hash = "";

  return url.toString().replace(/\/+$/, "");
};

/** Resolved once at module load — this is what the clients mount. */
export const API_BASE_URL = resolveApiBaseUrl(import.meta.env.VITE_API_URL, {
  isProduction: import.meta.env.PROD,
});

if (import.meta.env.PROD && /localhost|127\.0\.0\.1/.test(API_BASE_URL)) {
  // Not thrown: the app still runs (a local preview build is legitimate),
  // but a broken deploy should be loud in the console.
  console.warn(
    `[api] Built for production but the API base URL is ${API_BASE_URL}. ` +
      "Set VITE_API_URL to the Render API root, e.g. https://well-s-merry.onrender.com/api"
  );
}

export default API_BASE_URL;
