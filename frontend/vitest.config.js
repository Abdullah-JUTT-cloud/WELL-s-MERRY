import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

/* =====================================================================
   Vitest config — kept separate from vite.config.js so the production
   build config stays free of test-only settings.

   jsdom environment: the cart-drawer specs drive real DOM events
   (click the X, click the backdrop, click Checkout) against the actual
   components, so a regression in the open/close wiring fails the build.
   ===================================================================== */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    css: false,
    setupFiles: ["./src/test/setup.js"],
    include: ["src/**/*.test.{js,jsx}"],
  },
});
