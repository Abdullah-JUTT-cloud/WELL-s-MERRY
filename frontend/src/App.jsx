import { Suspense, lazy } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppFloat from "./components/WhatsAppFloat.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Real pages, added incrementally as each one is built.
// Using React.lazy means each page is its own JS chunk — the browser
// only downloads the Home page's code on first load, not the entire
// site's worth of pages upfront. Meaningful for mobile users on slower
// connections, which matters given a large part of our audience will
// be on mobile in Pakistan.
const Home = lazy(() => import("./pages/Home.jsx"));
const Shop = lazy(() => import("./pages/Shop.jsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Outlets = lazy(() => import("./pages/Outlets.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));

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
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/order-confirmation/:id"
            element={<OrderConfirmation />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/outlets" element={<Outlets />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/account/orders" element={<Orders />} />
          </Route>
          <Route path="*" element={<ComingSoon label="Page Not Found" />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
