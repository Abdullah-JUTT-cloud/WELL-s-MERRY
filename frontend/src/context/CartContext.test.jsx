import { beforeEach, describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext.jsx";

/* =====================================================================
   Cart identity specs.

   The bug this guards: the shop rendered a hardcoded catalogue, so carts
   filled up with ids ("merry-p1", or the slider's `${_id}-200ml`
   composite) that exist in no MongoDB collection. `POST /api/orders`
   then looked them up and answered "Resource not found", killing
   checkout after the customer had typed in their address.

   A cart line is therefore only valid if its `productId` is the product's
   real ObjectId, and these specs pin that contract down.
   ===================================================================== */

const REAL_ID = "64f1a2b3c4d5e6f7a8b9c0d1"; // 24-char hex, like MongoDB issues

const product = (overrides = {}) => ({
  _id: REAL_ID,
  slug: "hair-care-oil",
  name: "Hair Care Oil",
  price: 1880,
  size: "200ml",
  stock: 12,
  images: ["https://cdn.test/bottle.jpg"],
  ...overrides,
});

const renderCart = () =>
  renderHook(() => useCart(), { wrapper: CartProvider });

beforeEach(() => {
  localStorage.clear();
});

describe("useCart", () => {
  it("stores the product's real MongoDB _id on the cart line", () => {
    const { result } = renderCart();

    act(() => result.current.addItem(product(), 2));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].productId).toBe(REAL_ID);
    expect(result.current.items[0].qty).toBe(2);
  });

  it("keeps the id untouched when a size variant is added", () => {
    // The apocalypse slider used to mint `${_id}-${size}` — an id that
    // looks right in the UI and 404s at the API.
    const { result } = renderCart();

    act(() =>
      result.current.addItem(product({ size: "100ml", price: 1180 }), 1)
    );

    expect(result.current.items[0].productId).toBe(REAL_ID, "no composite id");
    expect(result.current.items[0].size).toBe("100ml");
  });

  it("refuses a product with no MongoDB _id", () => {
    const { result } = renderCart();

    let added;
    act(() => {
      added = result.current.addItem({ ...product(), _id: "merry-p1" }, 1);
    });

    expect(added).toBe(false);
    expect(result.current.items).toHaveLength(0, "an unorderable line is never stored");
  });

  it("refuses a product with no id at all", () => {
    const { result } = renderCart();

    act(() => result.current.addItem({ name: "Ghost bottle", price: 10 }, 1));

    expect(result.current.items).toHaveLength(0);
  });

  it("drops stale hardcoded ids left in localStorage by the old shop", () => {
    localStorage.setItem(
      "wm_cart_v1",
      JSON.stringify([
        { productId: "merry-p1", name: "Hair Care Oil", price: 1880, qty: 1 },
        { productId: REAL_ID, name: "Rosemary Oil", price: 2500, qty: 1 },
      ])
    );

    const { result } = renderCart();

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].productId).toBe(REAL_ID);
  });

  it("persists the surviving cart back to localStorage", () => {
    const { result } = renderCart();

    act(() => result.current.addItem(product(), 1));

    const saved = JSON.parse(localStorage.getItem("wm_cart_v1"));
    expect(saved[0].productId).toBe(REAL_ID);
  });
});
