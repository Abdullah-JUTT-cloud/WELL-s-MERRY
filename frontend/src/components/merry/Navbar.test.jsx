import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { CartProvider } from "../../context/CartContext.jsx";
import { AuthProvider } from "../../context/AuthContext.jsx";
import MerryLayout from "./Layout.jsx";

/* =====================================================================
   Navbar overlay specs.

   The full-screen menu must expose Track Order / Login / Sign Up (the
   production gap) and close *before* those links change the route —
   otherwise the forest overlay sits on top of /login, /register and
   /orders the same way the cart drawer used to sit on /checkout.
   ===================================================================== */

const Page = ({ label }) => <div>{label}</div>;

const renderApp = (initialRoute = "/") =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<MerryLayout />}>
              <Route path="/" element={<Page label="HOME PAGE" />} />
              <Route path="/shop" element={<Page label="SHOP PAGE" />} />
              <Route path="/story" element={<Page label="STORY PAGE" />} />
              <Route path="/quiz" element={<Page label="QUIZ PAGE" />} />
              <Route path="/outlets" element={<Page label="OUTLETS PAGE" />} />
              <Route path="/orders" element={<Page label="ORDERS PAGE" />} />
              <Route path="/login" element={<Page label="LOGIN PAGE" />} />
              <Route path="/register" element={<Page label="REGISTER PAGE" />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

const openMenu = async (user) => {
  await user.click(screen.getByRole("button", { name: /open menu/i }));
  return screen.findByRole("dialog", { name: "Main menu" });
};

const expectMenuClosed = () =>
  waitFor(
    () => expect(screen.queryByRole("dialog", { name: "Main menu" })).toBeNull(),
    { timeout: 4000 }
  );

beforeEach(() => {
  localStorage.clear();
  document.body.style.overflow = "";
});

describe("Navbar overlay", () => {
  it("opens a full-screen menu from the hamburger", async () => {
    const user = userEvent.setup();
    renderApp();

    expect(screen.queryByRole("dialog", { name: "Main menu" })).toBeNull();
    await openMenu(user);

    expect(screen.getByRole("button", { name: /open menu/i }).getAttribute("aria-expanded")).toBe(
      "true"
    );
  });

  it("lists the primary pages plus Track Order, Login and Sign Up", async () => {
    const user = userEvent.setup();
    renderApp();
    const menu = await openMenu(user);

    for (const label of ["Home", "Shop", "Our Story", "Hair Quiz", "Outlets"]) {
      expect(within(menu).getByRole("link", { name: new RegExp(label, "i") })).toBeTruthy();
    }
    expect(within(menu).getByRole("link", { name: /track order/i })).toBeTruthy();
    expect(within(menu).getByRole("link", { name: /^login$/i })).toBeTruthy();
    expect(within(menu).getByRole("link", { name: /sign up/i })).toBeTruthy();
  });

  it("closes when the overlay X is clicked", async () => {
    const user = userEvent.setup();
    renderApp();
    const menu = await openMenu(user);

    await user.click(within(menu).getByRole("button", { name: "Close menu" }));

    await expectMenuClosed();
  });

  it.each([
    ["Track Order", "ORDERS PAGE"],
    ["Login", "LOGIN PAGE"],
    ["Sign Up", "REGISTER PAGE"],
    ["Shop", "SHOP PAGE"],
    ["Our Story", "STORY PAGE"],
    ["Hair Quiz", "QUIZ PAGE"],
    ["Outlets", "OUTLETS PAGE"],
  ])("closes before navigating when '%s' is clicked", async (linkName, pageLabel) => {
    const user = userEvent.setup();
    renderApp();
    const menu = await openMenu(user);

    await user.click(within(menu).getByRole("link", { name: new RegExp(linkName, "i") }));

    expect(await screen.findByText(pageLabel)).toBeTruthy();
    await expectMenuClosed();
  });

  it("closes before navigating when Home is clicked from another page", async () => {
    const user = userEvent.setup();
    renderApp("/shop");
    const menu = await openMenu(user);

    await user.click(within(menu).getByRole("link", { name: /home/i }));

    expect(await screen.findByText("HOME PAGE")).toBeTruthy();
    await expectMenuClosed();
  });
});
