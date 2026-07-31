import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineShoppingBag,
  HiOutlineChevronDown,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineClipboardDocumentCheck,
  HiOutlineArchiveBox,
  HiOutlineXCircle,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineCreditCard,
} from "react-icons/hi2";
import { getMyOrders } from "../api/orders.js";
import { OrderListSkeleton } from "../components/Skeleton.jsx";

const STATUS_STYLES = {
  placed: "bg-cream text-ink/70",
  confirmed: "bg-gold-2/20 text-gold-1",
  shipped: "bg-moss/15 text-moss",
  delivered: "bg-moss text-ivory",
  cancelled: "bg-red-100 text-red-600",
};

// The fulfilment journey, in order. Mirrors the `orderStatus` enum in
// backend/models/Order.js minus "cancelled", which is an exit from the flow
// rather than a step along it and so gets its own treatment below.
const TRACK_STEPS = [
  {
    key: "placed",
    label: "Order Placed",
    icon: HiOutlineClipboardDocumentCheck,
    blurb: "We've received your order.",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: HiOutlineArchiveBox,
    blurb: "Packed and ready to hand to the courier.",
  },
  {
    key: "shipped",
    label: "Shipped",
    icon: HiOutlineTruck,
    blurb: "On its way to your address.",
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: HiOutlineCheckCircle,
    blurb: "Handed over. Enjoy!",
  },
];

const PAYMENT_LABELS = {
  cod: "Cash on Delivery",
  whatsapp: "WhatsApp Order",
  online: "Online Transfer",
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatDateTime = (value) =>
  new Date(value).toLocaleString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const money = (n) => `Rs.${Number(n || 0).toLocaleString()}`;

/**
 * Vertical progress tracker for a single order.
 *
 * Only `createdAt` and `deliveredAt` are timestamped on the model, so those
 * are the only two steps that can show a real date. The rest deliberately
 * show no date rather than a guessed one.
 */
const StatusTracker = ({ order }) => {
  const currentIndex = TRACK_STEPS.findIndex((s) => s.key === order.orderStatus);

  if (order.orderStatus === "cancelled") {
    return (
      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-sm">
        <HiOutlineXCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-[13.5px] font-semibold text-red-700">Order Cancelled</p>
          <p className="text-[12.5px] text-red-600/80 mt-0.5">
            If this wasn't expected, get in touch and we'll sort it out.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ol className="relative">
      {TRACK_STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const Icon = step.icon;
        const isLast = i === TRACK_STEPS.length - 1;

        let stamp = null;
        if (step.key === "placed") stamp = formatDateTime(order.createdAt);
        else if (step.key === "delivered" && order.deliveredAt)
          stamp = formatDateTime(order.deliveredAt);

        return (
          <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Connector line between markers */}
            {!isLast && (
              <span
                aria-hidden="true"
                className={`absolute left-[15px] top-8 bottom-0 w-[2px] ${
                  i < currentIndex ? "bg-moss" : "bg-cream-dim"
                }`}
              />
            )}

            <span
              className={`relative z-10 w-8 h-8 shrink-0 rounded-full border flex items-center justify-center transition-colors ${
                done
                  ? "bg-moss border-moss text-ivory"
                  : "bg-white border-cream-dim text-ink/30"
              } ${isCurrent ? "ring-4 ring-moss/15" : ""}`}
            >
              <Icon className="w-4 h-4" />
            </span>

            <div className="pt-1">
              <p
                className={`text-[13.5px] font-semibold ${
                  done ? "text-ink" : "text-ink/40"
                }`}
              >
                {step.label}
                {isCurrent && (
                  <span className="ml-2 text-[10px] tracking-[0.1em] uppercase font-bold text-moss">
                    Current
                  </span>
                )}
              </p>
              <p className={`text-[12.5px] mt-0.5 ${done ? "text-ink/55" : "text-ink/35"}`}>
                {step.blurb}
              </p>
              {stamp && <p className="text-[11.5px] text-ink/40 mt-1">{stamp}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

const PriceBreakdown = ({ order }) => {
  const extraTotal = (order.extraCharges || []).reduce(
    (sum, c) => sum + Number(c.amount || 0),
    0
  );

  return (
    <div className="text-[13px] space-y-1.5">
      <div className="flex justify-between">
        <span className="text-ink/55">Items</span>
        <span>{money(order.itemsPrice)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-ink/55">Shipping</span>
        <span>{order.shippingPrice > 0 ? money(order.shippingPrice) : "Free"}</span>
      </div>

      {/* Admin-applied line items. Rendered from the array so any number of
          named charges shows up without changing this component. */}
      {(order.extraCharges || []).map((charge, i) => (
        <div key={i} className="flex justify-between">
          <span className="text-ink/55">{charge.label}</span>
          <span>{money(charge.amount)}</span>
        </div>
      ))}

      {order.discount > 0 && (
        <div className="flex justify-between text-moss">
          <span>Discount</span>
          <span>-{money(order.discount)}</span>
        </div>
      )}

      <div className="flex justify-between pt-2.5 mt-1.5 border-t border-cream-dim font-display text-[16px]">
        <span>Total</span>
        <span>{money(order.totalPrice)}</span>
      </div>

      {/* Sanity hint if the stored total ever drifts from its parts. Cheap to
          show, and surfaces a data problem instead of hiding it. */}
      {Math.abs(
        order.itemsPrice + order.shippingPrice + extraTotal - order.discount - order.totalPrice
      ) > 0.5 && (
        <p className="text-[11.5px] text-ink/40 pt-1">
          Totals were adjusted after this order was placed.
        </p>
      )}
    </div>
  );
};

const OrderCard = ({ order, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const itemCount = order.orderItems.reduce((n, i) => n + i.qty, 0);

  return (
    <div className="border border-cream-dim bg-white rounded-sm overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6 text-left hover:bg-cream/30 transition-colors"
      >
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.1em] uppercase text-ink/40 mb-1">
            Order #{order._id.slice(-8).toUpperCase()}
          </p>
          <p className="text-[13.5px] text-ink/60">
            {formatDate(order.createdAt)}
            {" · "}
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <span
            className={`px-3 py-1.5 rounded-full text-[11px] tracking-[0.06em] uppercase font-medium ${
              STATUS_STYLES[order.orderStatus] || STATUS_STYLES.placed
            }`}
          >
            {order.orderStatus}
          </span>
          <span className="font-display text-[16px]">{money(order.totalPrice)}</span>
          <HiOutlineChevronDown
            className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-cream-dim">
          {/* Tracking */}
          <div className="p-5 sm:p-6 bg-cream/20 border-b border-cream-dim">
            <p className="text-[11px] tracking-[0.1em] uppercase text-ink/40 mb-4">
              Tracking
            </p>
            <StatusTracker order={order} />
          </div>

          {/* Items */}
          <div className="p-5 sm:p-6 space-y-4 border-b border-cream-dim">
            <p className="text-[11px] tracking-[0.1em] uppercase text-ink/40">Items</p>
            {order.orderItems.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-14 h-14 rounded-sm object-cover shrink-0 bg-cream"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium truncate">{item.name}</p>
                  <p className="text-[12.5px] text-ink/45">
                    Qty {item.qty}
                    {item.size ? ` · ${item.size}` : ""}
                    {" · "}
                    {money(item.price)} each
                  </p>
                </div>
                <span className="text-[13.5px] shrink-0">
                  {money(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          {/* Delivery + payment + totals */}
          <div className="p-5 sm:p-6 grid sm:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <p className="text-[11px] tracking-[0.1em] uppercase text-ink/40 mb-2">
                  Delivery Address
                </p>
                <div className="flex items-start gap-2 text-[13px] text-ink/70">
                  <HiOutlineMapPin className="w-4 h-4 text-gold-1 shrink-0 mt-0.5" />
                  <span>
                    {order.shippingAddress.fullName}
                    <br />
                    {order.shippingAddress.street}
                    <br />
                    {order.shippingAddress.city}
                    {order.shippingAddress.postalCode
                      ? ` ${order.shippingAddress.postalCode}`
                      : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-ink/70 mt-2">
                  <HiOutlinePhone className="w-4 h-4 text-gold-1 shrink-0" />
                  <a
                    href={`tel:${order.shippingAddress.phone}`}
                    className="hover:text-ink"
                  >
                    {order.shippingAddress.phone}
                  </a>
                </div>
              </div>

              <div>
                <p className="text-[11px] tracking-[0.1em] uppercase text-ink/40 mb-2">
                  Payment
                </p>
                <div className="flex items-center gap-2 text-[13px] text-ink/70">
                  <HiOutlineCreditCard className="w-4 h-4 text-gold-1 shrink-0" />
                  <span>
                    {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                    {" · "}
                    <span
                      className={
                        order.paymentStatus === "paid"
                          ? "text-moss font-medium"
                          : order.paymentStatus === "failed"
                          ? "text-red-600 font-medium"
                          : "text-ink/50"
                      }
                    >
                      {order.paymentStatus === "paid"
                        ? "Paid"
                        : order.paymentStatus === "failed"
                        ? "Failed"
                        : "Pending"}
                    </span>
                  </span>
                </div>
                {order.onlinePayment?.provider && (
                  <p className="text-[12.5px] text-ink/50 mt-1 pl-6 capitalize">
                    via {order.onlinePayment.provider}
                  </p>
                )}
              </div>

              {order.notes && (
                <div>
                  <p className="text-[11px] tracking-[0.1em] uppercase text-ink/40 mb-2">
                    Order Notes
                  </p>
                  <p className="text-[13px] text-ink/65 leading-relaxed">{order.notes}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-[11px] tracking-[0.1em] uppercase text-ink/40 mb-3">
                Summary
              </p>
              <PriceBreakdown order={order} />

              <div className="mt-5 pt-4 border-t border-cream-dim space-y-2">
                <Link
                  to="/shipping"
                  className="block text-[12px] tracking-[0.1em] uppercase font-semibold text-ink hover:text-gold-1 transition-colors"
                >
                  Shipping &amp; Returns Policy
                </Link>
                <Link
                  to="/contact"
                  className="block text-[12px] tracking-[0.1em] uppercase font-semibold text-ink hover:text-gold-1 transition-colors"
                >
                  Need Help With This Order?
                </Link>
              </div>
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
  const [historyOpen, setHistoryOpen] = useState(false);

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

  // Split into "in progress" and "finished". Delivered and cancelled orders
  // are done business — they'd otherwise push the order the customer actually
  // wants to track further down the page the longer they shop with us.
  const { active, history } = useMemo(() => {
    const sorted = [...orders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return {
      active: sorted.filter(
        (o) => o.orderStatus !== "delivered" && o.orderStatus !== "cancelled"
      ),
      history: sorted.filter(
        (o) => o.orderStatus === "delivered" || o.orderStatus === "cancelled"
      ),
    };
  }, [orders]);

  return (
    <div className="bg-ivory min-h-screen">
      <div className="page-banner">
        <span className="eyebrow mb-3">Your Account</span>
        <h1 className="font-display text-3xl sm:text-4xl text-ivory">Track Your Order</h1>
        <p className="text-cream/60 max-w-md mx-auto mt-3 px-6 text-[14px] leading-relaxed">
          Follow each order from the moment it's placed through to delivery.
        </p>
      </div>

      <div className="container-content py-12 sm:py-16 max-w-3xl mx-auto">
        {loading ? (
          <OrderListSkeleton count={3} />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-ink/60 mb-4">Couldn't load your orders right now.</p>
            <button onClick={() => window.location.reload()} className="btn btn-outline">
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
              When you place an order, you'll be able to track it here.
            </p>
            <Link to="/shop" className="btn btn-dark">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Active orders — the first one is expanded so the most recent
                order's tracking is visible without an extra click. */}
            <section>
              <h2 className="text-[11px] tracking-[0.14em] uppercase text-ink/45 font-semibold mb-4">
                In Progress
                {active.length > 0 && (
                  <span className="ml-2 text-ink/30">({active.length})</span>
                )}
              </h2>

              {active.length === 0 ? (
                <div className="border border-cream-dim bg-white rounded-sm p-8 text-center">
                  <p className="text-ink/55 text-[14px] mb-5">
                    Nothing on the way right now.
                  </p>
                  <Link to="/shop" className="btn btn-outline">
                    Shop the Collection
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {active.map((order, i) => (
                    <OrderCard key={order._id} order={order} defaultOpen={i === 0} />
                  ))}
                </div>
              )}
            </section>

            {/* Completed orders, tucked behind a disclosure */}
            {history.length > 0 && (
              <section>
                <button
                  onClick={() => setHistoryOpen((v) => !v)}
                  aria-expanded={historyOpen}
                  className="w-full flex items-center justify-between gap-3 border border-cream-dim bg-white rounded-sm px-5 py-4 hover:bg-cream/30 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HiOutlineCheckCircle className="w-5 h-5 text-moss shrink-0" />
                    <span className="text-[13px] tracking-[0.1em] uppercase font-semibold text-ink">
                      Order History
                    </span>
                    <span className="text-[12.5px] text-ink/45">
                      ({history.length} completed)
                    </span>
                  </span>
                  <HiOutlineChevronDown
                    className={`w-4 h-4 shrink-0 text-ink/50 transition-transform duration-300 ${
                      historyOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {historyOpen && (
                  <div className="space-y-4 mt-4">
                    {history.map((order) => (
                      <OrderCard key={order._id} order={order} />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
