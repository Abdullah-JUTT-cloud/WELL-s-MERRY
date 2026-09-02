/* =====================================================================
   Unit specs for the unprefixed-API compatibility shim.

   Kept separate from the HTTP specs because these assert the rewrite
   itself (including query-string handling) without needing a server.
   ===================================================================== */

import test from "node:test";
import assert from "node:assert/strict";
import { legacyApiPrefix } from "../middleware/legacyApiPrefix.js";

const run = (url, segments) => {
  const req = { url, originalUrl: url };
  let called = false;
  legacyApiPrefix(segments)(req, {}, () => {
    called = true;
  });
  return { req, called };
};

test("rewrites a bare resource path onto /api", () => {
  const { req, called } = run("/orders");
  assert.equal(req.url, "/api/orders");
  assert.equal(req.usedLegacyApiPath, true);
  assert.equal(called, true);
});

test("preserves the query string through the rewrite", () => {
  const { req } = run("/products?page=2&category=hair-care");
  assert.equal(req.url, "/api/products?page=2&category=hair-care");
});

test("leaves already-prefixed paths untouched", () => {
  const { req } = run("/api/orders");
  assert.equal(req.url, "/api/orders");
  assert.equal(req.usedLegacyApiPath, undefined);
});

test("leaves non-API paths alone so they still 404 normally", () => {
  for (const path of ["/shop", "/", "/checkout", "/orders-extra"]) {
    const { req } = run(path);
    assert.equal(req.url, path, `${path} must not be rewritten`);
  }
});

test("matching is case-insensitive", () => {
  assert.equal(run("/ORDERS").req.url, "/api/orders");
});

test("does not rewrite unknown resources", () => {
  assert.equal(run("/metrics").req.url, "/metrics");
});

test("honours an injected segment list", () => {
  assert.equal(run("/orders", ["health"]).req.url, "/orders");
  assert.equal(run("/health", ["health"]).req.url, "/api/health");
});
