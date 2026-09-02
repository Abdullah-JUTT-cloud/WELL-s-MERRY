import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import CartDrawer from "./CartDrawer.jsx";

/* =====================================================================
   MerryLayout — the organic-theme page shell.

   • Applies `.theme-merry` (defined in tailwind.config.js), which flips
     h1–h4 to the heavy display slab serif and body copy to clean sans —
     scoped, so the existing gold/apocalypse pages are untouched.
   • Renders the cart drawer. The drawer's open state lives in
     CartContext (`isCartOpen`), so the Navbar opens it and the drawer's
     "X" / backdrop / Escape / navigation close it without this component
     threading props between the two.
   • Works both as a router layout (renders <Outlet />) and as a plain
     wrapper (<MerryLayout>{page}</MerryLayout>).

   Router usage:
     <Route element={<MerryLayout />}>
       <Route path="/" element={<Home />} />
       ...
     </Route>
   ===================================================================== */
const MerryLayout = ({ children }) => {
  const { pathname } = useLocation();

  // Fresh pages start at the top — same contract as the gold Layout.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="theme-merry flex min-h-screen flex-col bg-merry-cream text-merry-forest antialiased">
      <Navbar />
      <main className="flex-1">{children ?? <Outlet />}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default MerryLayout;
