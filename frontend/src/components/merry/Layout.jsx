import { useState, useCallback, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import CartDrawer from "./CartDrawer.jsx";

/* =====================================================================
   MerryLayout — the organic-theme page shell.

   • Applies `.theme-merry` (defined in tailwind.config.js), which flips
     h1–h4 to the heavy display slab serif and body copy to clean sans —
     scoped, so the existing gold/apocalypse pages are untouched.
   • Owns the cart drawer state: the Navbar's cart button opens it,
     backdrop / Escape / route-change close it.
   • Works both as a router layout (renders <Outlet />) and as a plain
     wrapper (<MerryLayout>{page}</MerryLayout>).

   Router usage:
     <Route element={<MerryLayout />}>
       <Route path="/" element={<Home />} />
       ...
     </Route>
   ===================================================================== */
const MerryLayout = ({ children }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const { pathname } = useLocation();

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  // Fresh pages start at the top — same contract as the gold Layout.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="theme-merry flex min-h-screen flex-col bg-merry-cream text-merry-forest antialiased">
      <Navbar onCartOpen={openCart} />
      <main className="flex-1">{children ?? <Outlet />}</main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={closeCart} />
    </div>
  );
};

export default MerryLayout;
