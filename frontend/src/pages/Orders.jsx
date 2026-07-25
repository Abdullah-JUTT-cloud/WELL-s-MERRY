import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineChevronDown } from "react-icons/hi2";
import { getMyOrders } from "../api/orders.js";

const STATUS_STYLES = {
  placed: "bg-cream text-ink/70",
  confirmed: "bg-gold-2/20 text-gold-1",
  shipped: "bg-moss/15 text-moss",
  delivered: "bg-moss text-ivory",
  cancelled: "bg-red-100 text-red-600",
};

const OrderRow = ({ order }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-cream-dim bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6 text-left"
      >
        <div>
          <p className="text-[11px] tracking-[0.1em] uppercase text-ink/40 mb-1">
            Order #{order._id.slice(-8).toUpperCase()}
          </p>
          <p className="text-[13.5px] text-ink/60">
            {new Date(order.createdAt).toLocaleDateString("en-PK", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            {" · "}
            {order.orderItems.length} item
            {order.orderItems.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1.5 rounded-full text-[11px] tracking-[0.06em] uppercase font-medium ${
              STATUS_STYLES[order.orderStatus] || STATUS_STYLES.placed
            }`}
          >
            {order.orderStatus}
          </span>
          <span className="font-display text-[16px]">
            Rs.{order.totalPrice.toLocaleString()}
          </span>
          <HiOutlineChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-cream-dim p-5 sm:p-6 space-y-4">
          {order.orderItems.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 rounded-sm object-cover shrink-0 bg-cream"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium truncate">{item.name}</p>
                <p className="text-[12.5px] text-ink/45">
                  Qty {item.qty} &middot; {item.size}
                </p>
              </div>
              <span className="text-[13.5px]">
                Rs.{(item.price * item.qty).toLocaleString()}
              </span>
            </div>
          ))}

          <div className="border-t border-cream-dim pt-4 grid sm:grid-cols-2 gap-4 text-[13px]">
            <div>
              <p className="text-[11px] tracking-[0.1em] uppercase text-ink/40 mb-1">
                Shipping To
              </p>
              <p className="text-ink/70">
                {order.shippingAddress.fullName}, {order.shippingAddress.street}
                , {order.shippingAddress.city}
              </p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.1em] uppercase text-ink/40 mb-1">
                Payment
              </p>
              <p className="text-ink/70">
                {order.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : order.paymentMethod}
                {" · "}
                <span
                  className={
                    order.paymentStatus === "paid" ? "text-moss" : "text-ink/50"
                  }
                >
                  {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await getMyOrders();
        if (!ignore) setOrders(data);
      } catch {
        if (!ignore) setError(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div>
      <div className="bg-ink text-ivory py-14 sm:py-16 text-center">
        <span className="eyebrow mb-3">Your Account</span>
        <h1 className="font-display text-3xl sm:text-4xl">My Orders</h1>
      </div>

      <div className="container-content py-12 sm:py-16 max-w-3xl mx-auto">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 border border-cream-dim bg-cream animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-ink/60 mb-4">
              Couldn't load your orders right now.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-outline"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 mx-auto mb-6 rounded-full border border-cream-dim flex items-center justify-center text-ink/30">
              <HiOutlineShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl mb-3">No Orders Yet</h3>
            <p className="text-ink/55 mb-8">
              When you place an order, it'll show up here.
            </p>
            <Link to="/shop" className="btn btn-dark">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderRow key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
