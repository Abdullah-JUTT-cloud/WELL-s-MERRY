import { Suspense, lazy } from "react";
import { Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppFloat from "./components/WhatsAppFloat.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAdmin } from "./context/AdminContext.jsx";
import MerryLayout from "./components/merry/Layout.jsx";

/* ── Merry design-system pages (organic theme takeover) ────────────── */
const HomeMerry = lazy(() => import("./pages/merry/HomeMerry.jsx"));
const ShopMerry = lazy(() => import("./pages/merry/ShopMerry.jsx"));
const StoryMerry = lazy(() => import("./pages/merry/StoryMerry.jsx"));
const QuizMerry = lazy(() => import("./pages/merry/QuizMerry.jsx"));
const OutletsMerry = lazy(() => import("./pages/merry/OutletsMerry.jsx"));

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
const Blog = lazy(() => import("./pages/Blog.jsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.jsx"));
const Outlets = lazy(() => import("./pages/Outlets.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));
const Shipping = lazy(() => import("./pages/Shipping.jsx"));

// Admin pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts.jsx"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders.jsx"));
const AdminOrderDetail = lazy(() => import("./pages/admin/AdminOrderDetail.jsx"));

const ComingSoon = ({ label }) => (
  <div className="container-content min-h-[50vh] flex flex-col items-center justify-center text-center py-24">
    <p className="eyebrow mb-3">Well's Merry</p>
    <h1 className="font-display text-3xl sm:text-4xl mb-3">{label}</h1>
    <p className="text-ink/50">This page is being built. Check back soon.</p>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

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

// Guard for admin-only routes
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAdmin();
  if (loading) return <PageFallback />;
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Merry — the organic theme owns the primary shopping routes.
            Declared before the gold Layout so these exact paths win. */}
        <Route element={<MerryLayout />}>
          <Route path="/" element={<HomeMerry />} />
          <Route path="/shop" element={<ShopMerry />} />
          <Route path="/story" element={<StoryMerry />} />
          <Route path="/quiz" element={<QuizMerry />} />
          <Route path="/outlets" element={<OutletsMerry />} />
        </Route>

        {/* Public site */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/outlets" element={<Outlets />} />
          {/* Public policy page — linked from the footer, product pages and
              each order's summary, so it deliberately sits outside the
              ProtectedRoute block. */}
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/account/orders" element={<Orders />} />
          </Route>
          <Route path="*" element={<ComingSoon label="Page Not Found" />} />
        </Route>

        {/* Admin — no site Header/Footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetail /></AdminRoute>} />
      </Routes>
    </Suspense>
  );
}

export default App;
