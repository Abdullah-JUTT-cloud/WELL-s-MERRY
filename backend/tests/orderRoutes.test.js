/* =====================================================================
   Route-table regression tests.

   The checkout outage this guards against was a path mismatch, not a
   logic bug: the frontend POSTed to /orders while the router was only
   mounted at /api/orders, so the request fell through to the 404 handler
   and the customer saw "Route not found".

   These specs boot the real Express app on an ephemeral port (no Mongo —
   every request below fails validation before a model is ever touched)
   and assert the request *reaches a route at all*.

   Run with: npm test
   ===================================================================== */

import test, { before, after } from "node:test";
import assert from "node:assert/strict";

process.env.NODE_ENV ??= "test";

const { default: app } = await import("../app.js");

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server?.close();
});

const postJson = (path, body) =>
  fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

test("POST /api/orders reaches the create-order route", async () => {
  const res = await postJson("/api/orders", JSON.stringify({ orderItems: [] }));

  assert.equal(res.status, 400, "expected validation failure, not a route miss");
  const body = await res.json();
  assert.match(body.message, /No order items provided/);
});

test("POST /orders is served by the same route (unprefixed client)", async () => {
  // A frontend whose VITE_API_URL is the bare Render origin hits this path.
  const res = await postJson("/orders", JSON.stringify({ orderItems: [] }));

  assert.notEqual(res.status, 404, "unprefixed order path must not 404");
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.match(body.message, /No order items provided/);
});

test("body-parser runs before the routes (req.body is populated)", async () => {
  // Malformed JSON makes express.json() throw — proof the parser is in the
  // stack ahead of the router. Without it, req.body would simply be
  // undefined and this would 400 on validation instead of on parse.
  const res = await postJson("/api/orders", "not-json");

  assert.equal(res.status, 400);
  const body = await res.json();
  assert.match(body.message, /JSON/i);
});

test("a malformed orderItems payload 400s instead of crashing the route", async () => {
  // `orderItems: 5` is valid JSON but not a cart. It used to reach the
  // `for (const item of orderItems)` loop and throw a TypeError → 500.
  const res = await postJson("/api/orders", JSON.stringify({ orderItems: 5 }));

  assert.equal(res.status, 400);
  const body = await res.json();
  assert.match(body.message, /No order items provided/);
});

test("unknown paths still 404 with the standard message", async () => {
  const res = await postJson("/api/definitely-not-a-route", "{}");

  assert.equal(res.status, 404);
  const body = await res.json();
  assert.match(body.message, /Route not found/);
});

test("non-API paths are not swallowed by the compatibility shim", async () => {
  const res = await fetch(`${baseUrl}/shop`);

  assert.equal(res.status, 404);
  const body = await res.json();
  assert.match(body.message, /Route not found/);
});

test("health check answers on both the prefixed and bare path", async () => {
  const prefixed = await fetch(`${baseUrl}/api/health`);
  assert.equal(prefixed.status, 200);
  assert.deepEqual(await prefixed.json(), {
    status: "ok",
    message: "Well's Merry API is running",
  });

  const bare = await fetch(`${baseUrl}/health`);
  assert.equal(bare.status, 200);
});

test("unsupported content types are rejected before the route runs", async () => {
  const res = await fetch(`${baseUrl}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: "hello",
  });

  assert.equal(res.status, 415, "enforceContentType must sit ahead of the parser");
});
