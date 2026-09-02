/* =====================================================================
   Base-URL normalisation specs.

   The checkout outage was caused by a base URL that lost its /api
   prefix, so these lock down every spelling of VITE_API_URL that a
   deploy might ship.
   ===================================================================== */

import { describe, it, expect } from "vitest";
import { resolveApiBaseUrl } from "./baseUrl.js";

const PROD = "https://well-s-merry.onrender.com/api";

describe("resolveApiBaseUrl", () => {
  it("adds the /api prefix to a bare origin", () => {
    // The exact mis-configuration that 404'd checkout.
    expect(resolveApiBaseUrl("https://well-s-merry.onrender.com")).toBe(PROD);
  });

  it("keeps a correctly configured API root unchanged", () => {
    expect(resolveApiBaseUrl(PROD)).toBe(PROD);
    expect(resolveApiBaseUrl("http://localhost:5000/api")).toBe(
      "http://localhost:5000/api"
    );
  });

  it("trims an over-specific URL back to the API root", () => {
    expect(resolveApiBaseUrl(`${PROD}/orders`)).toBe(PROD);
    expect(resolveApiBaseUrl("https://well-s-merry.onrender.com/api/orders/")).toBe(
      PROD
    );
  });

  it("handles trailing slashes and stray whitespace", () => {
    expect(resolveApiBaseUrl("  https://well-s-merry.onrender.com/  ")).toBe(PROD);
    expect(resolveApiBaseUrl(`${PROD}/`)).toBe(PROD);
  });

  it("assumes https when the scheme is missing", () => {
    expect(resolveApiBaseUrl("well-s-merry.onrender.com")).toBe(PROD);
  });

  it("drops query strings and hashes", () => {
    expect(resolveApiBaseUrl(`${PROD}?v=2#hash`)).toBe(PROD);
  });

  it("supports a relative root for same-origin proxying", () => {
    expect(resolveApiBaseUrl("/api")).toBe("/api");
    expect(resolveApiBaseUrl("/")).toBe("/api");
  });

  it("falls back to the live backend in production when unset", () => {
    expect(resolveApiBaseUrl("", { isProduction: true })).toBe(PROD);
    expect(resolveApiBaseUrl(undefined, { isProduction: true })).toBe(PROD);
    expect(resolveApiBaseUrl(null, { isProduction: true })).toBe(PROD);
  });

  it("falls back to localhost while developing when unset", () => {
    expect(resolveApiBaseUrl("", { isProduction: false })).toBe(
      "http://localhost:5000/api"
    );
  });

  it("falls back rather than trusting an unparseable value", () => {
    expect(resolveApiBaseUrl("http://", { isProduction: true })).toBe(PROD);
  });
});
