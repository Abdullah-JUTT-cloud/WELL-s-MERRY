import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { CartProvider } from "../../context/CartContext.jsx";
import { AuthProvider } from "../../context/AuthContext.jsx";
import MerryLayout from "./Layout.jsx";

/* =====================================================================
   CartDrawer behaviour specs.

   These render the real MerryLayout (Navbar + CartDrawer) inside a
   router that mirrors App.jsx's merry branch, then drive the drawer with
   actual click events. They exist because the drawer shipped with a
   stuck-open panel: the close "X" did nothing in the wild, and "View
   full cart" / "Checkout" navigated with the panel still on screen.
   ===================================================================== */

const ONE_ITEM = JSON.stringify([
  {
    productId: "p-1",
    slug: "hair-care-oil",
    name: "Organic Hair Care Oil",
    image: null,
    price: 2500,
    size: "100ml",
    stock: 50,
    qty: 1,
  },
]);

const renderApp = (initialRoute = "/shop") =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<MerryLayout />}>
              <Route
                path="/shop"
                element={
                  <div>
                    SHOP PAGE
                    {/* Stands in for "navigation from anywhere else" — the
                        drawer must not survive it. */}
                    <Link to="/checkout">GO TO CHECKOUT PAGE</Link>
                  </div>
                }
              />
              <Route path="/cart" element={<div>CART PAGE</div>} />
              <Route path="/checkout" element={<div>CHECKOUT PAGE</div>} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

const openDrawer = async (user) => {
  await user.click(screen.getByRole("button", { name: /open cart/i }));
  return screen.findByRole("dialog", { name: "Shopping cart" });
};

const expectClosed = () =>
  waitFor(
    () =>
      expect(screen.queryByRole("dialog", { name: "Shopping cart" })).toBeNull(),
    { timeout: 4000 }
  );

beforeEach(() => {
  localStorage.clear();
  document.body.style.overflow = "";
});

describe("CartDrawer", () => {
  it("opens from the navbar cart button", async () => {
    const user = userEvent.setup();
    renderApp();

    expect(screen.queryByRole("dialog", { name: "Shopping cart" })).toBeNull();
    await openDrawer(user);

    expect(screen.getByRole("button", { name: /open cart/i }).getAttribute("aria-expanded")).toBe(
      "true"
    );
  });

  it("closes when the header X button is clicked", async () => {
    const user = userEvent.setup();
    renderApp();
    const drawer = await openDrawer(user);

    await user.click(within(drawer).getByRole("button", { name: "Close cart" }));

    await expectClosed();
    expect(screen.getByRole("button", { name: /open cart/i }).getAttribute("aria-expanded")).toBe(
      "false"
    );
  });

  it("closes when the backdrop outside the panel is clicked", async () => {
    const user = userEvent.setup();
    renderApp();
    await openDrawer(user);

    await user.click(screen.getByRole("button", { name: "Close cart — click outside" }));

    await expectClosed();
  });

  it("closes on Escape and locks body scroll only while open", async () => {
    const user = userEvent.setup();
    renderApp();
    await openDrawer(user);
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");

    await expectClosed();
    expect(document.body.style.overflow).toBe("");
  });

  it("puts focus on the close button when it opens", async () => {
    const user = userEvent.setup();
    renderApp();
    const drawer = await openDrawer(user);

    expect(document.activeElement).toBe(
      within(drawer).getByRole("button", { name: "Close cart" })
    );
  });

  it("closes before navigating when 'View full cart' is clicked", async () => {
    localStorage.setItem("wm_cart_v1", ONE_ITEM);
    const user = userEvent.setup();
    renderApp();
    const drawer = await openDrawer(user);

    await user.click(within(drawer).getByRole("link", { name: /view full cart/i }));

    expect(await screen.findByText("CART PAGE")).toBeTruthy();
    await expectClosed();
  });

  it("closes before navigating when 'Checkout' is clicked", async () => {
    localStorage.setItem("wm_cart_v1", ONE_ITEM);
    const user = userEvent.setup();
    renderApp();
    const drawer = await openDrawer(user);

    await user.click(within(drawer).getByRole("link", { name: "Checkout" }));

    expect(await screen.findByText("CHECKOUT PAGE")).toBeTruthy();
    await expectClosed();
  });

  it("closes when 'Shop the oil' is clicked from the empty state", async () => {
    const user = userEvent.setup();
    renderApp("/cart");
    const drawer = await openDrawer(user);

    await user.click(within(drawer).getByRole("link", { name: /shop the oil/i }));

    expect(await screen.findByText("SHOP PAGE")).toBeTruthy();
    await expectClosed();
  });

  it("closes when the route changes by any other means", async () => {
    const user = userEvent.setup();
    renderApp();
    await openDrawer(user);

    await user.click(screen.getByRole("link", { name: "GO TO CHECKOUT PAGE" }));

    expect(await screen.findByText("CHECKOUT PAGE")).toBeTruthy();
    await expectClosed();
  });
});
