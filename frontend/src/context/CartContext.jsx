import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);
const STORAGE_KEY = "wm_cart_v1";

// Cart items store a snapshot of product info (name/price/image/size) at the
// time they're added — NOT just a productId. This means the cart renders
// instantly without extra API calls, and stays visually consistent even if
// a product's price changes elsewhere while it's sitting in someone's cart.
// The price is always re-verified server-side at checkout anyway (see
// orderController.js), so a stale snapshot here is a UX detail, not a
// security concern.
//
// The ONE field that must never be a snapshot is `productId`: it is the
// product's MongoDB _id, verbatim, because it is the only thing checkout
// sends to the server (`POST /api/orders` → `Product.findById`). The shop
// used to render a hardcoded catalogue whose ids ("merry-p1") existed in
// no collection, so every order placed from it 404'd with "Resource not
// found". Two guards below keep that from happening again:
//
//   1. addItem() refuses a product with no _id.
//   2. loadInitialCart() drops lines whose id isn't an ObjectId — those are
//      carts saved by the old mock build, and they can never be ordered.

/** A 24-char hex string — what MongoDB hands out for every document. */
const isObjectId = (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);

const loadInitialCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    // Purge stale lines left over from the hardcoded catalogue. They are
    // unorderable by definition, so keeping them would only send the
    // shopper to a checkout that fails on them.
    const usable = parsed.filter((item) => isObjectId(item?.productId));
    if (usable.length !== parsed.length) {
      console.warn(
        `[cart] Dropped ${parsed.length - usable.length} item(s) with ids that ` +
          "aren't in our catalogue — they were saved by an older version of the shop."
      );
    }
    return usable;
  } catch {
    return []; // corrupted/blocked storage — fail safe to an empty cart, not a crash
  }
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, qty } = action.payload;
      const existing = state.find((i) => i.productId === item.productId);

      if (existing) {
        return state.map((i) =>
          i.productId === item.productId ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...state, { ...item, qty }];
    }

    case "REMOVE_ITEM":
      return state.filter((i) => i.productId !== action.payload.productId);

    case "SET_QTY":
      return state.map((i) =>
        i.productId === action.payload.productId
          ? { ...i, qty: Math.max(1, action.payload.qty) }
          : i
      );

    case "CLEAR":
      return [];

    case "HYDRATE":
      return action.payload;

    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [items, dispatch] = useReducer(cartReducer, [], loadInitialCart);

  /* -------------------------------------------------------------------
     Side-cart drawer open state — ONE source of truth.

     This used to be local `useState` inside MerryLayout, which meant the
     only way to close the drawer was an `onClose` prop threaded down into
     CartDrawer. Anything rendered without that prop (or a second consumer
     that forgot it) produced a drawer whose close button did nothing.
     Owning it here means every consumer — Navbar, CartDrawer, a page, a
     toast action — opens and closes the exact same piece of state via
     `setIsCartOpen(true | false)`.
     ------------------------------------------------------------------- */
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persist to localStorage on every change. Cart contents are not
  // sensitive data (unlike auth tokens), so localStorage is the right
  // tool here — it's the cart's job to survive a closed tab/browser restart.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full or blocked (e.g. private browsing edge cases) —
      // cart still works in-memory for the current session, just won't persist
    }
  }, [items]);

  // Keeps the cart in sync across multiple open tabs of the same browser —
  // e.g. add an item in Tab A, Tab B's cart badge updates without a refresh
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue);
        // Same purge as `loadInitialCart` — another tab could still be
        // running an older build and write stale ids into shared storage.
        const usable = Array.isArray(parsed)
          ? parsed.filter((item) => isObjectId(item?.productId))
          : [];
        dispatch({ type: "HYDRATE", payload: usable });
      } catch {
        // A half-written value from another tab isn't worth crashing for.
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addItem = (product, qty = 1) => {
    // Guard rail, not paranoia: a cart line without a real MongoDB _id is a
    // checkout that fails after the customer has filled in their address.
    if (!isObjectId(product?._id)) {
      console.error(
        "[cart] Refused to add a product with no MongoDB _id — it could not be ordered.",
        product
      );
      toast.error("This item isn't available to order yet. Please refresh the shop.");
      return false;
    }

    dispatch({
      type: "ADD_ITEM",
      payload: {
        qty,
        item: {
          // The product's real _id — copied, never generated, never
          // combined with a size or variant (a `${_id}-200ml` composite
          // looks like an id and behaves like a 404).
          productId: product._id,
          slug: product.slug,
          name: product.name,
          image: product.images?.[0],
          price: product.price,
          size: product.size,
          stock: product.stock,
        },
      },
    });
    toast.success(`${product.name} added to cart`);
    return true;
  };

  const removeItem = (productId) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });
  };

  const setQty = (productId, qty) => {
    dispatch({ type: "SET_QTY", payload: { productId, qty } });
  };

  const clearCart = () => dispatch({ type: "CLEAR" });

  // Derived values recomputed only when `items` actually changes,
  // not on every render of every component that reads them
  const itemCount = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

  const value = {
    items,
    addItem,
    removeItem,
    setQty,
    clearCart,
    itemCount,
    subtotal,
    // Side-cart drawer open state (see note above)
    isCartOpen,
    setIsCartOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};