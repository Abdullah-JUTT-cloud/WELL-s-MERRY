/* =====================================================================
   SSR smoke check — executes every Merry page module through Vite's
   SSR transform and renderToString's each route inside a MemoryRouter
   + CartProvider. Catches broken imports, bad prop shapes and
   render-time crashes without needing a browser.
   (Dev tooling only — not imported by the app.)
   ===================================================================== */
import { createServer } from "vite";

// Browser shims for code that runs during render in the browser.
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};
globalThis.matchMedia ||= () => ({
  matches: false,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
});

const vite = await createServer({
  root: process.cwd(),
  logLevel: "error",
  server: { middlewareMode: true },
  appType: "custom",
  ssr: { noExternal: ["leaflet"] },
  /* Leaflet touches `window` at import time — it's a browser-only module.
     The real app loads it in the browser; here we stub it so the SSR
     harness can render the map shell. */
  plugins: [
    {
      name: "ssr-stub-leaflet",
      enforce: "pre",
      resolveId(id) {
        if (id === "leaflet") return "\0virtual:stub-leaflet";
        if (id === "leaflet/dist/leaflet.css") return "\0virtual:stub-empty.css";
        return null;
      },
      load(id) {
        if (id === "\0virtual:stub-empty.css") return "";
        if (id === "\0virtual:stub-leaflet") {
          return `
            const noop = () => {};
            const chainable = () => ({ addTo: chainable, bindPopup: chainable, on: chainable, openPopup: noop, getElement: () => null });
            export const Map = function () { return { setView: chainable, getPane: () => ({ style: {} }), remove: noop, flyTo: noop, fitBounds: noop, invalidateSize: noop }; };
            export const tileLayer = () => chainable();
            export const marker = () => chainable();
            export const divIcon = () => ({});
            export const latLngBounds = () => ({ pad: () => ({}) });
            export default { Map, tileLayer, marker, divIcon, latLngBounds };
          `;
        }
        return null;
      },
    },
  ],
});

const entry = `
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "./src/context/CartContext.jsx";
import MerryLayout from "./src/components/merry/Layout.jsx";
import HomeMerry from "./src/pages/merry/HomeMerry.jsx";
import ShopMerry from "./src/pages/merry/ShopMerry.jsx";
import StoryMerry from "./src/pages/merry/StoryMerry.jsx";
import QuizMerry from "./src/pages/merry/QuizMerry.jsx";
import OutletsMerry from "./src/pages/merry/OutletsMerry.jsx";
import MerryMap from "./src/components/merry/MerryMap.jsx";
import { MERRY_OUTLETS } from "./src/data/merry/mock.js";

const routes = {
  "/ (HomeMerry)": HomeMerry,
  "/shop (ShopMerry)": ShopMerry,
  "/story (StoryMerry)": StoryMerry,
  "/quiz (QuizMerry)": QuizMerry,
  "/outlets (OutletsMerry)": OutletsMerry,
};

const results = [];
for (const [label, Page] of Object.entries(routes)) {
  try {
    const html = renderToString(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/"] },
        React.createElement(CartProvider, null, React.createElement(Page))
      )
    );
    if (!html || html.length < 500) throw new Error("suspiciously small render: " + html.length + " chars");
    results.push([label, "OK", html.length + " chars"]);
  } catch (e) {
    results.push([label, "FAIL", e.stack.split("\\n").slice(0, 4).join(" | ")]);
  }
}

// Layout + map render
try {
  const html = renderToString(
    React.createElement(
      MemoryRouter,
      { initialEntries: ["/"] },
      React.createElement(CartProvider, null,
        React.createElement(MerryLayout, null,
          React.createElement(OutletsMerry)))
    )
  );
  results.push(["MerryLayout wrapper", html.length > 1000 ? "OK" : "FAIL", html.length + " chars"]);
} catch (e) {
  results.push(["MerryLayout wrapper", "FAIL", e.stack.split("\\n").slice(0, 4).join(" | ")]);
}
try {
  const html = renderToString(
    React.createElement(MerryMap, { outlets: MERRY_OUTLETS, activeId: null, onSelect: () => {} })
  );
  results.push(["MerryMap shell", html.includes("merry-map") ? "OK" : "FAIL", html.length + " chars"]);
} catch (e) {
  results.push(["MerryMap shell", "FAIL", e.stack.split("\\n").slice(0, 4).join(" | ")]);
}

console.log("\\n===== SSR SMOKE RESULTS =====");
let failed = false;
for (const [label, status, info] of results) {
  if (status === "FAIL") failed = true;
  console.log(status === "OK" ? " ✓" : " ✗", label.padEnd(24), "—", info);
}
process.exitCode = failed ? 1 : 0;
`;

// Load the entry through Vite by writing it into node_modules (ignored by git).
import { writeFileSync, mkdirSync } from "fs";
mkdirSync("node_modules/.ssr-check", { recursive: true });
writeFileSync("node_modules/.ssr-check/entry.jsx", entry);
await vite.ssrLoadModule("/node_modules/.ssr-check/entry.jsx");

await vite.close();
