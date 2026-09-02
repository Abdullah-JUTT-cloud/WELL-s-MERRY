/* =====================================================================
   Unprefixed-API compatibility shim.

   The canonical mount points are /api/<resource> (see app.js). This exists
   because the frontend's base URL is an environment variable, and that
   variable is easy to get subtly wrong: set VITE_API_URL to the bare
   origin (https://well-s-merry.onrender.com) instead of the API root
   (https://well-s-merry.onrender.com/api) and every call silently loses
   its prefix — the checkout POSTs to /orders, nothing is mounted there,
   and the shopper gets "Route not found - /orders".

   Production checkout being down is the expensive kind of bug, so the
   server absorbs the mistake instead of the customer: a request whose
   first path segment names a real API resource is rewritten onto its
   /api/… equivalent and served exactly as before.

   Deliberately NOT a blanket rewrite of every unknown path — /shop or
   /about must still 404 normally rather than being pulled into the API
   namespace.
   ===================================================================== */

/** First path segment of every mounted API router (plus the health probe). */
export const API_SEGMENTS = ["auth", "products", "orders", "outlets", "admin", "health"];

const API_PREFIX = "/api";

/**
 * @param {string[]} segments resources to rewrite. Injectable so tests can
 *   exercise the matcher without mounting the real route table.
 */
export const legacyApiPrefix = (segments = API_SEGMENTS) => (req, res, next) => {
  // req.url is the path Express routes on; rewriting it is what makes the
  // downstream /api mounts match. req.originalUrl is left untouched so logs
  // and the 404 handler still report what the client actually asked for.
  const [pathname, ...rest] = req.url.split("?");
  const query = rest.length ? `?${rest.join("?")}` : "";

  // Already prefixed (/api/orders) — nothing to do.
  if (pathname === API_PREFIX || pathname.startsWith(`${API_PREFIX}/`)) {
    return next();
  }

  const parts = pathname.split("/");
  const firstSegment = parts[1]?.toLowerCase();
  if (!firstSegment || !segments.includes(firstSegment)) {
    return next();
  }

  // Substitute the canonical (lower-case) segment so "/ORDERS" and "/orders"
  // both land on the same mount.
  parts[1] = firstSegment;
  req.url = `${API_PREFIX}${parts.join("/")}${query}`;
  // Flag it so a spike in rewritten traffic is visible in logs/monitoring
  // instead of hiding behind "working" requests.
  req.usedLegacyApiPath = true;

  next();
};

export default legacyApiPrefix;
