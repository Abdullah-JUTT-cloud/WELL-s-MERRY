import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineShoppingBag, HiBars3, HiXMark } from "react-icons/hi2";
import { useCart } from "../../context/CartContext.jsx";
import { LeafIcon } from "./icons.jsx";

/* =====================================================================
   Navbar — sticky, thick-bordered top bar.
   Left: logo block. Right: cart button (opens the side drawer via the
   `onCartOpen` prop wired up in MerryLayout) + menu toggle that opens a
   full-screen forest-green overlay with giant staggered links.
   ===================================================================== */

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Outlets", to: "/outlets" },
  { label: "Contact", to: "/contact" },
];

/* Neo-brutalist "press" interaction shared by the nav buttons:
   the button slides into its own hard shadow on hover/active. */
const pressable =
  "transition-[transform,box-shadow] duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none";

const overlayVariants = {
  closed: { clipPath: "inset(0 0 100% 0)", transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } },
  open: { clipPath: "inset(0 0 0% 0)", transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } },
};

const listVariants = {
  open: { transition: { staggerChildren: 0.06, delayChildren: 0.18 } },
  closed: {},
};

const itemVariants = {
  closed: { y: 48, opacity: 0 },
  open: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 220, damping: 24 } },
};

const Navbar = ({ onCartOpen }) => {
  const { itemCount } = useCart();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the overlay on navigation and lock body scroll while it's open.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b-4 border-merry-forest bg-merry-cream">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:h-20 sm:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" aria-label="Well's Merry — home">
            <span className="grid h-10 w-10 place-items-center border-4 border-merry-forest bg-merry-clay text-merry-cream shadow-hard-merry-sm sm:h-11 sm:w-11">
              <LeafIcon className="h-5 w-5" />
            </span>
            <span className="leading-none">
              <span className="block font-slab text-lg uppercase tracking-tight sm:text-xl">
                Well&rsquo;s Merry
              </span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-widest2 text-merry-clay">
                Organic hair care
              </span>
            </span>
          </Link>

          {/* Cart + menu toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onCartOpen}
              aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
              className={`relative border-4 border-merry-forest bg-merry-cream p-2 text-merry-forest shadow-hard-merry-sm sm:p-2.5 ${pressable}`}
            >
              <HiOutlineShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
              {itemCount > 0 && (
                <span className="absolute -right-2.5 -top-2.5 grid h-5 min-w-[20px] place-items-center border-2 border-merry-forest bg-merry-clay px-1 font-slab text-[10px] text-merry-cream">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className={`border-4 border-merry-forest bg-merry-forest p-2 text-merry-cream shadow-hard-merry-clay-sm sm:p-2.5 ${pressable}`}
            >
              <HiBars3 className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-merry-forest text-merry-cream"
          >
            {/* Overlay top bar mirrors the navbar so the close button lands
                exactly where the open button was. */}
            <div className="flex h-16 items-center justify-between border-b-4 border-merry-cream/15 px-4 sm:h-20 sm:px-8">
              <span className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center border-4 border-merry-cream/30 bg-merry-clay text-merry-cream sm:h-11 sm:w-11">
                  <LeafIcon className="h-5 w-5" />
                </span>
                <span className="font-slab text-lg uppercase sm:text-xl">Well&rsquo;s Merry</span>
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className={`border-4 border-merry-cream bg-merry-cream p-2 text-merry-forest shadow-hard-merry-clay-sm sm:p-2.5 ${pressable}`}
              >
                <HiXMark className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
              </button>
            </div>

            <motion.nav
              variants={listVariants}
              initial="closed"
              animate="open"
              className="flex flex-1 flex-col justify-center gap-1 px-6 py-10 sm:px-12"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link.to} variants={itemVariants} className="overflow-hidden">
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `group flex items-baseline gap-4 font-slab text-4xl uppercase leading-[1.15] transition-colors duration-150 sm:text-6xl lg:text-7xl ${
                        isActive ? "text-merry-clay" : "text-merry-cream hover:text-merry-clay"
                      }`
                    }
                  >
                    <span className="font-slab text-sm text-merry-sage sm:text-base">
                      0{i + 1}
                    </span>
                    {link.label}
                    <LeafIcon className="h-6 w-6 -translate-x-2 text-merry-clay opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 sm:h-9 sm:w-9" />
                  </NavLink>
                </motion.div>
              ))}
            </motion.nav>

            <div className="flex flex-col gap-2 border-t-4 border-merry-cream/15 px-6 py-5 text-xs uppercase tracking-widest2 text-merry-sage sm:flex-row sm:items-center sm:justify-between sm:px-12">
              <span>100% organic &middot; Cold-pressed &middot; Cash on delivery</span>
              <span>hello@wellsmerry.com</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
