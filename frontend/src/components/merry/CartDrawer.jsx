import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark, HiOutlineTrash, HiMinus, HiPlus } from "react-icons/hi2";
import { useCart } from "../../context/CartContext.jsx";
import { LeafIcon, BottleIcon } from "./icons.jsx";

/* =====================================================================
   CartDrawer — thick-bordered side drawer, opened from the Navbar's
   cart button (state lives in MerryLayout). Springs in from the right
   over a blurred forest backdrop. Reads/writes the global cart context,
   so it stays in sync with every MagneticProductCard quick-add.
   ===================================================================== */

const CartDrawer = ({ open, onClose }) => {
  const { items, itemCount, subtotal, setQty, removeItem } = useCart();
  const { pathname } = useLocation();

  // Close when the route changes (e.g. user clicks "Checkout").
  useEffect(() => {
    onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close cart"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] cursor-default bg-merry-forest/60 backdrop-blur-[2px]"
          />

          {/* Panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col border-l-4 border-merry-forest bg-merry-cream text-merry-forest"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-4 border-merry-forest p-5">
              <p className="flex items-center gap-2.5 font-slab text-xl uppercase">
                <LeafIcon className="h-5 w-5 text-merry-clay" />
                Your cart
                <span className="border-2 border-merry-forest bg-merry-clay px-2 py-0.5 font-slab text-xs text-merry-cream">
                  {itemCount}
                </span>
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="border-2 border-merry-forest p-1.5 transition-colors hover:bg-merry-forest hover:text-merry-cream"
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
                    onClick={onClose}
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
              <div className="space-y-4 border-t-4 border-merry-forest p-5">
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
                  onClick={onClose}
                  className="block w-full border-4 border-merry-forest bg-merry-forest py-4 text-center font-slab text-base uppercase tracking-wide text-merry-cream shadow-hard-merry-clay transition-[transform,box-shadow] duration-150 hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
                >
                  Checkout
                </Link>
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="block text-center text-xs uppercase tracking-widest2 text-merry-forest/60 underline underline-offset-4 hover:text-merry-clay-deep"
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
