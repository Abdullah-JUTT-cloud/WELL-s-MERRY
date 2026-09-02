import { useCallback, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark, HiOutlineTrash, HiMinus, HiPlus } from "react-icons/hi2";
import { useCart } from "../../context/CartContext.jsx";
import { LeafIcon, BottleIcon } from "./icons.jsx";

/* =====================================================================
   CartDrawer — thick-bordered side drawer. Springs in from the right
   over a dimmed forest backdrop. Reads/writes the global cart context,
   so it stays in sync with every MagneticProductCard quick-add.

   Open/close state lives in CartContext (`isCartOpen`) — NOT in this
   component and NOT in a prop threaded down from the layout. That is a
   deliberate fix: the drawer used to depend on an `onClose` prop, so any
   render path that missed it produced a panel whose "X" was dead. Every
   exit below is the same explicit `setIsCartOpen(false)`:

     • header "X" button
     • backdrop click (anywhere outside the panel)
     • Escape key
     • "View full cart" / "Checkout" / "Shop the oil" — closed *before*
       the route changes, so the panel can never be left sitting on top
       of the page it just navigated to
     • any other navigation, as a safety net
   ===================================================================== */

const CartDrawer = () => {
  const {
    items,
    itemCount,
    subtotal,
    setQty,
    removeItem,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const closeRef = useRef(null);

  /* Close first, navigate second — in that order, in one handler.
     Relying on a <Link>'s default navigation racing the close is what
     left the panel stuck over /cart and /checkout. */
  const closeAndGo = useCallback(
    (to) => (e) => {
      e.preventDefault();
      setIsCartOpen(false);
      navigate(to);
    },
    [navigate, setIsCartOpen]
  );

  // Safety net: if anything at all changes the route while the drawer is
  // open, it goes away.
  useEffect(() => {
    setIsCartOpen(false);
  }, [pathname, setIsCartOpen]);

  // While open: lock body scroll, close on Escape, hand focus to the "X"
  // so keyboard users land inside the dialog.
  useEffect(() => {
    if (!isCartOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      // Restore whatever was there before, instead of blindly clearing —
      // another overlay (the fullscreen nav menu) may hold the lock.
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isCartOpen, setIsCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop — clicking anywhere outside the panel closes it. */}
          <motion.button
            type="button"
            aria-label="Close cart — click outside"
            onClick={() => setIsCartOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] cursor-default bg-merry-forest/60 backdrop-blur-[2px]"
          />

          {/* Panel */}
          <motion.aside
            id="wm-cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 z-[100] flex h-full max-w-md flex-col border-l-4 border-merry-forest bg-merry-cream text-merry-forest supports-[height:100dvh]:h-[100dvh]"
          >
            {/* Header. Top padding respects the notch/Dynamic Island —
                index.html sets viewport-fit=cover, so without it the "X"
                sat under the status bar on iPhones. */}
            <div className="flex items-center justify-between border-b-4 border-merry-forest p-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
              <p className="flex items-center gap-2.5 font-slab text-xl uppercase">
                <LeafIcon className="h-5 w-5 text-merry-clay" />
                Your cart
                <span className="border-2 border-merry-forest bg-merry-clay px-2 py-0.5 font-slab text-xs text-merry-cream">
                  {itemCount}
                </span>
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart"
                className="grid h-11 w-11 shrink-0 place-items-center border-2 border-merry-forest transition-colors hover:bg-merry-forest hover:text-merry-cream"
              >
                <HiXMark className="h-5 w-5" strokeWidth={2.2} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <BottleIcon className="h-16 w-16 text-merry-forest/15" />
                  <p className="font-slab text-lg uppercase">Your cart is empty</p>
                  <p className="max-w-[240px] text-sm text-merry-forest/60">
                    Your hair, however, is not going to oil itself.
                  </p>
                  <Link
                    to="/shop"
                    onClick={closeAndGo("/shop")}
                    className="mt-2 border-4 border-merry-forest bg-merry-clay px-6 py-3 font-slab text-sm uppercase text-merry-cream shadow-hard-merry-sm transition-[transform,box-shadow] duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
                  >
                    Shop the oil
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-3 border-4 border-merry-forest bg-merry-oat p-3"
                  >
                    <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden border-2 border-merry-forest bg-merry-cream">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <BottleIcon className="h-9 w-9 text-merry-forest/25" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-slab text-sm uppercase leading-tight">{item.name}</p>
                      {item.size && (
                        <p className="mt-0.5 text-[11px] uppercase tracking-widest2 text-merry-forest/50">
                          {item.size}
                        </p>
                      )}
                      {/* Qty stepper */}
                      <div className="mt-2 inline-flex items-center border-2 border-merry-forest bg-merry-cream">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => setQty(item.productId, item.qty - 1)}
                          className="p-1.5 transition-colors hover:bg-merry-forest hover:text-merry-cream"
                        >
                          <HiMinus className="h-3.5 w-3.5" strokeWidth={2.4} />
                        </button>
                        <span className="min-w-[2rem] text-center font-slab text-sm">{item.qty}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setQty(item.productId, item.qty + 1)}
                          className="p-1.5 transition-colors hover:bg-merry-forest hover:text-merry-cream"
                        >
                          <HiPlus className="h-3.5 w-3.5" strokeWidth={2.4} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <p className="whitespace-nowrap font-slab text-sm text-merry-clay">
                        Rs. {(item.price * item.qty).toLocaleString()}
                      </p>
                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeItem(item.productId)}
                        className="p-1 text-merry-forest/40 transition-colors hover:text-merry-clay-deep"
                      >
                        <HiOutlineTrash className="h-[18px] w-[18px]" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="space-y-4 border-t-4 border-merry-forest p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-widest2 text-merry-forest/60">
                    Subtotal
                  </span>
                  <span className="font-slab text-2xl">Rs. {subtotal.toLocaleString()}</span>
                </div>

                <p className="flex items-center gap-2 border-2 border-merry-forest bg-merry-clay px-3 py-2 font-slab text-[11px] uppercase tracking-wider text-merry-cream">
                  <LeafIcon className="h-3.5 w-3.5" />
                  Cash on delivery &middot; Pay when it arrives
                </p>

                <Link
                  to="/checkout"
                  onClick={closeAndGo("/checkout")}
                  className="block w-full border-4 border-merry-forest bg-merry-forest py-4 text-center font-slab text-base uppercase tracking-wide text-merry-cream shadow-hard-merry-clay transition-[transform,box-shadow] duration-150 hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
                >
                  Checkout
                </Link>
                <Link
                  to="/cart"
                  onClick={closeAndGo("/cart")}
                  className="block py-2 text-center text-xs uppercase tracking-widest2 text-merry-forest/60 underline underline-offset-4 hover:text-merry-clay-deep"
                >
                  View full cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
