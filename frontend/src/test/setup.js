/* =====================================================================
   Vitest setup — jsdom is missing a couple of browser APIs the app uses
   at render time. Stubbing them here keeps the test output free of
   "Not implemented" noise so real failures stand out.
   ===================================================================== */

import { beforeEach, vi } from "vitest";
import { clearAccessToken } from "../api/tokenStore.js";

// AuthProvider silently POSTs /auth/refresh on mount. Without a stub,
// jsdom's XHR to localhost:5000 dumps AggregateError noise into every
// Navbar / CartDrawer spec. A rejected promise is the logged-out path.
vi.mock("../api/axios.js", () => {
  const reject = () => Promise.reject(new Error("no session"));
  return {
    default: {
      post: vi.fn(reject),
      get: vi.fn(reject),
      interceptors: {
        request: { use: () => 0 },
        response: { use: () => 0 },
      },
    },
  };
});

window.scrollTo = () => {};

if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  });
}

beforeEach(() => {
  localStorage.clear();
  clearAccessToken();
});
