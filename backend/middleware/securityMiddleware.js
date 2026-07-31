import helmet from "helmet";
import hpp from "hpp";

/**
 * General hardening against malicious requests.
 *
 * Everything here is defence-in-depth: none of it replaces the validation in
 * the controllers, it just removes whole categories of attack from the table
 * before a request ever reaches them.
 */

/**
 * Secure HTTP response headers.
 *
 * This API is JSON-only and serves no HTML, so the interesting parts are the
 * headers that stop a browser from *treating* our responses as something they
 * aren't (nosniff), stop us leaking where a user came from (referrer policy),
 * and stop the API being framed (frameguard).
 *
 * A restrictive CSP is set even though we render no markup — if an endpoint is
 * ever tricked into reflecting HTML, the browser still won't run scripts from
 * it. `crossOriginResourcePolicy` is relaxed to cross-origin because the
 * frontend is served from a different origin than the API.
 */
export const secureHeaders = helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'none'"],
      formAction: ["'none'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  referrerPolicy: { policy: "no-referrer" },
  // HSTS only makes sense once we're actually on HTTPS; on a local http dev
  // server it would pin the browser to https://localhost and break things.
  hsts:
    process.env.NODE_ENV === "production"
      ? { maxAge: 31536000, includeSubDomains: true, preload: false }
      : false,
});

/**
 * HTTP Parameter Pollution.
 *
 * `?category=hair-care&category=skin-care` makes Express hand the controller
 * an *array* where it expects a string. Most of our controllers pass query
 * values straight into Mongoose filters, and an unexpected array there changes
 * the shape of the query. hpp keeps only the last value of any repeated key so
 * the type is always what the controller assumes.
 */
export const preventParamPollution = hpp();

// Mongo treats any object key starting with `$` as an operator and `.` as a
// path separator. A JSON body is free to contain those, which is what makes
// operator injection possible in the first place.
const isDangerousKey = (key) => key.startsWith("$") || key.includes(".");

/**
 * Recursively strip Mongo operators out of a parsed body/params object.
 *
 * Returns the number of keys removed so the caller can log that something was
 * actually stripped — a request carrying `$ne` is never an accident, and it's
 * worth knowing it happened.
 *
 * Mutates in place rather than rebuilding: Express 5 exposes `req.query` as a
 * getter-only property, so reassigning it throws. Deleting keys off the
 * existing object works on both Express 4 and 5.
 */
const stripOperators = (value, depth = 0) => {
  // Guard against deeply nested payloads built purely to burn CPU here.
  if (depth > 10 || value === null || typeof value !== "object") return 0;

  let removed = 0;

  if (Array.isArray(value)) {
    for (const entry of value) removed += stripOperators(entry, depth + 1);
    return removed;
  }

  for (const key of Object.keys(value)) {
    if (isDangerousKey(key)) {
      delete value[key];
      removed += 1;
      continue;
    }
    removed += stripOperators(value[key], depth + 1);
  }

  return removed;
};

/**
 * NoSQL injection sanitisation.
 *
 * The attack this closes: `{ "email": { "$ne": null }, "password": "..." }`
 * posted to /api/auth/login. `User.findOne({ email: { $ne: null } })` matches
 * the first user in the collection, turning a login form into "log me in as
 * whoever exists". Same trick works on any `findOne`/`find` that takes a value
 * straight from the request.
 *
 * We use a hand-rolled sanitiser rather than express-mongo-sanitize's default
 * middleware because that package reassigns `req.query`, which throws on
 * Express 5's read-only getter. This walks body/query/params and deletes any
 * key that could be interpreted as an operator, in place.
 */
export const sanitizeRequest = (req, res, next) => {
  const removed =
    stripOperators(req.body) +
    stripOperators(req.query) +
    stripOperators(req.params);

  if (removed > 0) {
    // Deliberately not an error response: the request still gets served, just
    // with the operators gone. Logging it means a probe shows up in the logs
    // instead of passing silently.
    console.warn(
      `[security] Stripped ${removed} Mongo operator key(s) from ${req.method} ${req.originalUrl}`
    );
  }

  next();
};

/**
 * Reject request bodies whose Content-Type isn't something we actually parse.
 *
 * Without this, a POST with `Content-Type: text/plain` sails past
 * express.json() with `req.body` left as `{}` — and a controller reading
 * `req.body.email` sees `undefined` instead of failing loudly. Being explicit
 * here turns a confusing downstream error into a clear 415.
 *
 * Multipart is allowed through untouched because multer handles the admin
 * image upload route.
 */
export const enforceContentType = (req, res, next) => {
  const methodsWithBody = ["POST", "PUT", "PATCH"];
  if (!methodsWithBody.includes(req.method)) return next();

  // No declared body at all (e.g. a bare POST /logout) is fine.
  const hasBody =
    req.headers["content-length"] > 0 || req.headers["transfer-encoding"];
  if (!hasBody) return next();

  const contentType = req.headers["content-type"] || "";
  const allowed = [
    "application/json",
    "application/x-www-form-urlencoded",
    "multipart/form-data",
  ];

  if (!allowed.some((type) => contentType.includes(type))) {
    return res
      .status(415)
      .json({ message: "Unsupported content type for this request." });
  }

  next();
};
