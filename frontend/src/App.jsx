import { Suspense, lazy } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppFloat from "./components/WhatsAppFloat.jsx";


// Real pages, added incrementally as each one is built.
// Using React.lazy means each page is its own JS chunk — the browser
// only downloads the Home page's code on first load, not the entire
// site's worth of pages upfront. Meaningful for mobile users on slower
// connections, which matters given a large part of our audience will
// be on mobile in Pakistan.
const Home = lazy(() => import("./pages/Home.jsx"));
const Shop = lazy(() => import("./pages/Shop.jsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.jsx"));

// Temporary stand-in for pages not yet built. Once a real page exists,
// its <Route> below gets updated to import the real component instead —
// this placeholder is never meant to ship.
const ComingSoon = ({ label }) => (
  <div className="container-content min-h-[50vh] flex flex-col items-center justify-center text-center py-24">
    <p className="eyebrow mb-3">Well's Merry</p>
    <h1 className="font-display text-3xl sm:text-4xl mb-3">{label}</h1>
    <p className="text-ink/50">This page is being built. Check back soon.</p>
  </div>
);

// React Router doesn't auto-scroll to top on navigation like a traditional
// multi-page site would — without this, clicking from a long Shop page
// into a Product page would land the user mid-scroll on the new page,
// which reads as broken.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

// Shared shell: Header + Footer render once and persist across route
// changes; only the <Outlet /> content swaps. Avoids Header/Footer
// remounting (and re-running their effects/animations) on every navigation.
const Layout = () => (
  <div className="flex flex-col min-h-screen">
    <ScrollToTop />
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <WhatsAppFloat />
  </div>
);

const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-gold-2 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<ComingSoon label="Cart" />} />
          <Route path="/checkout" element={<ComingSoon label="Checkout" />} />
          <Route path="/about" element={<ComingSoon label="About Us" />} />
          <Route path="/contact" element={<ComingSoon label="Contact" />} />
          <Route path="/outlets" element={<ComingSoon label="Our Outlets" />} />
          <Route path="/login" element={<ComingSoon label="Log In" />} />
          <Route path="/register" element={<ComingSoon label="Create Account" />} />
          <Route path="/verify-otp" element={<ComingSoon label="Verify Email" />} />
          <Route path="/forgot-password" element={<ComingSoon label="Forgot Password" />} />
          <Route path="/account/orders" element={<ComingSoon label="My Orders" />} />
          <Route path="*" element={<ComingSoon label="Page Not Found" />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;