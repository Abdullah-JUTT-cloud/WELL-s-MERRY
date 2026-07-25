import { useEffect, useState } from "react";
import { useParams, useLocation, Link, Navigate } from "react-router-dom";
import { HiOutlineCheckCircle, HiOutlineTruck } from "react-icons/hi2";
import { getOrderById } from "../api/orders.js";
import { useAuth } from "../context/AuthContext.jsx";
import { buildWhatsAppLink } from "../config/siteConfig.js";

const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const { isAuthenticated, authLoading } = useAuth();

  // If Checkout.jsx navigated here right after placing the order, it
  // already has the full order object in memory — use that instantly
  // instead of re-fetching. Falling back to a real API call only covers
  // the case where someone refreshes this page or opens it as a direct
  // link (e.g. from a saved "My Orders" list later).
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (order) return; // already have it from navigation state
    if (authLoading) return; // wait for session restore before deciding access

    let ignore = false;
    (async () => {
      try {
        const data = await getOrderById(id);
        if (!ignore) setOrder(data);
      } catch {
        if (!ignore) setError(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id, order, authLoading]);

  // getOrderById requires a logged-in owner or admin (per orderController.js).
  // A guest who just placed a COD order and immediately lands here via
  // navigation state is fine — they never hit this fetch at all. But if
  // they refresh the page or share the link, a guest has no way to
  // re-authenticate against it, so send them somewhere sensible instead
  // of showing a raw 403.
  if (!order && !loading && !isAuthenticated && !authLoading) {
    return <Navigate to="/" replace />;
  }

  if (loading || authLoading) {
    return (
      <div className="container-content py-24 flex justify-center">
        <div className="w-8 h-8 border-2 border-gold-2 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container-content py-24 text-center">
        <h1 className="font-display text-3xl mb-3">Order Not Found</h1>
        <p className="text-ink/55 mb-8">We couldn't find that order. It may not belong to this account.</p>
        <Link to="/" className="btn btn-dark">Back to Home</Link>
      </div>
    );
  }

  const whatsappFollowUp = buildWhatsAppLink(
    `Hi Well's Merry! Following up on my order #${order._id.slice(-8).toUpperCase()}.`
  );

  return (
    <div className="container-content py-14 sm:py-20 max-w-2xl mx-auto text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-moss/10 flex items-center justify-center text-moss">
        <HiOutlineCheckCircle className="w-9 h-9" />
      </div>

      <span className="eyebrow mb-3">Order Confirmed</span>
      <h1 className="font-display text-3xl sm:text-4xl mb-3">Thank You!</h1>
      <p className="text-ink/60 mb-2">
        Your order <strong className="text-ink">#{order._id.slice(-8).toUpperCase()}</strong> has been placed.
      </p>
      <p className="text-ink/60 mb-10">
        We'll contact you at <strong className="text-ink">{order.shippingAddress.phone}</strong> to confirm delivery.
      </p>

      {/* Order summary card */}
      <div className="text-left bg-cream border border-cream-dim p-7 sm:p-8 mb-8">
        <div className="space-y-4 mb-6">
          {order.orderItems.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3 min-w-0">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-sm object-cover shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-ink/45 text-[12.5px]">Qty {item.qty} &middot; {item.size}</p>
                </div>
              </div>
              <span>Rs.{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-cream-dim pt-5 flex justify-between font-display text-lg mb-6">
          <span>Total</span>
          <span>Rs.{order.totalPrice.toLocaleString()}</span>
        </div>

        <div className="border-t border-cream-dim pt-5 grid sm:grid-cols-2 gap-5 text-[13.5px]">
          <div>
            <p className="text-[11px] tracking-[0.1em] uppercase text-ink/40 mb-1.5">Shipping To</p>
            <p className="text-ink/75">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.street}, {order.shippingAddress.city}
              {order.shippingAddress.postalCode ? ` ${order.shippingAddress.postalCode}` : ""}
            </p>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.1em] uppercase text-ink/40 mb-1.5">Payment Method</p>
            <p className="flex items-center gap-2 text-ink/75">
              <HiOutlineTruck className="w-4 h-4 text-gold-1" />
              {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
        <a href={whatsappFollowUp} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
          Message Us About This Order
        </a>
      </div>
    </div>
  );
};

export default OrderConfirmation;