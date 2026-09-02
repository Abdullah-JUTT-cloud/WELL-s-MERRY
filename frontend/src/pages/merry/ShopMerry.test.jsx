import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ShopMerry from "./ShopMerry.jsx";
import { CartProvider } from "../../context/CartContext.jsx";

/* =====================================================================
   Shop inventory specs.

   The shop used to render a hardcoded catalogue. These specs pin down the
   three states of the live version:

     • products arrive  → a card per product, each keyed by its MongoDB _id
     • the shelf is empty → "New batches coming soon…", never a fake grid
     • the API is down   → a retryable error, never a fake grid

   The last two matter as much as the first: a page that falls back to
   placeholder products is a page that sells things the database has
   never heard of, which is how checkout ended up 404ing.
   ===================================================================== */

vi.mock("../../api/products.js", () => ({
  getProducts: vi.fn(),
}));

const { getProducts } = await import("../../api/products.js");

const product = (overrides = {}) => ({
  _id: "64f1a2b3c4d5e6f7a8b9c0d1",
  slug: "hair-care-oil",
  name: "Hair Care Oil",
  category: "hair-care",
  price: 1880,
  size: "200ml",
  stock: 12,
  images: ["https://cdn.test/bottle.jpg"],
  ...overrides,
});

const renderShop = () =>
  render(
    <MemoryRouter>
      <CartProvider>
        <ShopMerry />
      </CartProvider>
    </MemoryRouter>
  );

beforeEach(() => {
  getProducts.mockReset();
  localStorage.clear();
});

describe("ShopMerry", () => {
  it("renders a card per product returned by the API", async () => {
    getProducts.mockResolvedValue([
      product(),
      product({ _id: "64f1a2b3c4d5e6f7a8b9c0d2", slug: "midnight-scalp-oil", name: "Midnight Scalp Oil", category: "hair-care" }),
      product({ _id: "64f1a2b3c4d5e6f7a8b9c0d3", slug: "rosemary-scalp-serum", name: "Rosemary Scalp Serum", category: "skin-care" }),
    ]);

    renderShop();

    expect(await screen.findByText("Hair Care Oil")).toBeTruthy();
    expect(screen.getByText("Midnight Scalp Oil")).toBeTruthy();
    expect(screen.getByText("Rosemary Scalp Serum")).toBeTruthy();

    await waitFor(() =>
      expect(screen.getByText(/3 potions/)).toBeTruthy(),
    );
  });

  it("filters the shelf client-side without refetching", async () => {
    const user = userEvent.setup();
    getProducts.mockResolvedValue([
      product(),
      product({ _id: "64f1a2b3c4d5e6f7a8b9c0d3", slug: "rosemary-scalp-serum", name: "Rosemary Scalp Serum", category: "skin-care" }),
    ]);

    renderShop();
    await screen.findByText("Hair Care Oil");

    await user.click(screen.getByRole("tab", { name: "Skin Care" }));

    // The count settles immediately; the outgoing card animates out first
    // (AnimatePresence), so give it a tick before asserting it's gone.
    await waitFor(() => expect(screen.getByText(/1 potion\b/)).toBeTruthy());
    await waitFor(() => expect(screen.queryByText("Hair Care Oil")).toBeNull());
    expect(screen.getByText("Rosemary Scalp Serum")).toBeTruthy();
    expect(getProducts).toHaveBeenCalledTimes(1, "the tab is a view over one fetch");
  });

  it("shows an empty state when the catalogue has nothing in it", async () => {
    getProducts.mockResolvedValue([]);

    renderShop();

    expect(await screen.findByText(/New batches/)).toBeTruthy();
    expect(screen.getByText(/coming soon/i)).toBeTruthy();
    expect(screen.queryByText("Hair Care Oil")).toBeNull();
  });

  it("surfaces a retryable error instead of inventing products", async () => {
    const user = userEvent.setup();
    getProducts.mockRejectedValue(new Error("Network Error"));
    renderShop();

    const alert = await screen.findByText(/The shelf didn't load/i);
    expect(alert).toBeTruthy();
    expect(screen.queryByText("Hair Care Oil")).toBeNull();

    getProducts.mockResolvedValue([product()]);
    await user.click(screen.getByRole("button", { name: /try again/i }));

    expect(await screen.findByText("Hair Care Oil")).toBeTruthy();
  });

  it("adds the product's real _id to the cart from a grid card", async () => {
    const user = userEvent.setup();
    getProducts.mockResolvedValue([product()]);
    renderShop();

    const card = (await screen.findByText("Hair Care Oil")).closest("article");
    await user.hover(card);
    await user.click(within(card).getByRole("button", { name: "200ml" }));

    const saved = JSON.parse(localStorage.getItem("wm_cart_v1"));
    expect(saved[0].productId).toBe("64f1a2b3c4d5e6f7a8b9c0d1");
  });
});
