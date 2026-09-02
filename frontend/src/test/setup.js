/* =====================================================================
   Vitest setup — jsdom is missing a couple of browser APIs the app uses
   at render time. Stubbing them here keeps the test output free of
   "Not implemented" noise so real failures stand out.
   ===================================================================== */

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
