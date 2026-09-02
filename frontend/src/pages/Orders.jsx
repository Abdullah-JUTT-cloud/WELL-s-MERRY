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
import { SkeletonBox, SkeletonText } from "../components/Skeleton.jsx";
import { LeafIcon } from "../components/merry/icons.jsx";

/* =====================================================================
   TRACK ORDER — Merry theme.

   Same data contract and fulfilment logic as before, rebuilt on the
   organic palette: Deep Forest (#1A2E24) surfaces, Cream (#F9F6F0)
   page, Terracotta (#C17754) accents. The legacy gold/ivory ("orange")
   tokens — gold-1 icons, ink page-banner, cream-dim hairlines — are
   gone; every edge is a 4px forest rule.

   Rendered inside MerryLayout (App.jsx) so the organic Navbar/Footer
   wrap it instead of the old shell.
   ===================================================================== */

const STATUS_STYLES = {
  placed: "border-merry-forest bg-merry-oat text-merry-forest",
  confirmed: "border-merry-clay bg-merry-clay text-merry-cream",
  shipped: "border-merry-moss bg-merry-moss text-merry-cream",
  delivered: "border-merry-forest bg-merry-forest text-merry-cream",
  cancelled: "border-red-700 bg-red-50 text-red-700",
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

/* Merry-skinned loading state — blocky cards, not rounded ivory ones. */
const OrdersSkeleton = ({ count = 3 }) => (
  <div role="status" aria-label="Loading your orders" className="space-y-5">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="flex flex-wrap items-center justify-between gap-4 border-4 border-merry-forest/20 bg-merry-oat p-5 sm:p-6"
      >
        <div className="space-y-2.5">
          <SkeletonText className="h-3 w-32" />
          <SkeletonText className="h-3.5 w-44" />
        </div>
        <div className="flex items-center gap-4">
          <SkeletonBox className="h-7 w-24" />
          <SkeletonText className="h-4 w-20" />
        </div>
      </div>
    ))}
  </div>
);

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
      <div className="flex items-start gap-3 border-4 border-red-700 bg-red-50 p-4">
        <HiOutlineXCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />
        <div>
          <p className="font-slab text-[13px] uppercase tracking-wide text-red-800">
            Order cancelled
          </p>
          <p className="mt-1 text-[12.5px] font-medium text-red-700/80">
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
          <li key={step.key} className="relative flex gap-4 pb-7 last:pb-0">
            {/* Connector line between markers */}
            {!isLast && (
              <span
                aria-hidden="true"
                className={`absolute bottom-0 left-[18px] top-10 w-1 ${
                  i < currentIndex ? "bg-merry-clay" : "bg-merry-forest/15"
                }`}
              />
            )}

            <span
              className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center border-4 transition-colors ${
                done
                  ? "border-merry-forest bg-merry-clay text-merry-cream"
                  : "border-merry-forest/25 bg-merry-cream text-merry-forest/30"
              } ${isCurrent ? "shadow-hard-merry-sm" : ""}`}
            >
              <Icon className="h-4 w-4" strokeWidth={2.2} />
            </span>

            <div className="pt-1.5">
              <p
                className={`flex flex-wrap items-center gap-2 font-slab text-[13px] uppercase tracking-wide ${
                  done ? "text-merry-forest" : "text-merry-forest/40"
                }`}
              >
                {step.label}
                {isCurrent && (
                  <span className="border-2 border-merry-clay px-2 py-0.5 text-[9px] font-bold tracking-widest2 text-merry-clay">
                    Current
                  </span>
                )}
              </p>
              <p
                className={`mt-1 text-[12.5px] font-medium ${
                  done ? "text-merry-forest/65" : "text-merry-forest/35"
                }`}
              >
                {step.blurb}
              </p>
              {stamp && (
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-merry-forest/40">
                  {stamp}
                </p>
              )}
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
    <div className="space-y-1.5 text-[13px] font-medium">
      <div className="flex justify-between">
        <span className="text-merry-forest/55">Items</span>
        <span>{money(order.itemsPrice)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-merry-forest/55">Shipping</span>
        <span>{order.shippingPrice > 0 ? money(order.shippingPrice) : "Free"}</span>
      </div>

      {/* Admin-applied line items. Rendered from the array so any number of
          named charges shows up without changing this component. */}
      {(order.extraCharges || []).map((charge, i) => (
        <div key={i} className="flex justify-between">
          <span className="text-merry-forest/55">{charge.label}</span>
          <span>{money(charge.amount)}</span>
        </div>
      ))}

      {order.discount > 0 && (
        <div className="flex justify-between text-merry-moss">
          <span>Discount</span>
          <span>-{money(order.discount)}</span>
        </div>
      )}

      <div className="mt-2 flex items-center justify-between border-t-4 border-merry-forest pt-3">
        <span className="font-slab text-sm uppercase">Total</span>
        <span className="font-slab text-lg text-merry-clay">{money(order.totalPrice)}</span>
      </div>

      {/* Sanity hint if the stored total ever drifts from its parts. Cheap to
          show, and surfaces a data problem instead of hiding it. */}
      {Math.abs(
        order.itemsPrice + order.shippingPrice + extraTotal - order.discount - order.totalPrice
      ) > 0.5 && (
        <p className="pt-1 text-[11px] text-merry-forest/45">
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
    <div className="border-4 border-merry-forest bg-merry-cream shadow-hard-merry-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left transition-colors hover:bg-merry-oat sm:p-6"
      >
        <div className="min-w-0">
          <p className="font-slab text-[11px] uppercase tracking-widest2 text-merry-clay">
            Order #{order._id.slice(-8).toUpperCase()}
          </p>
          <p className="mt-1.5 text-[13px] font-medium text-merry-forest/65">
            {formatDate(order.createdAt)}
            {" · "}
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <span
            className={`border-2 px-3 py-1.5 font-slab text-[10px] uppercase tracking-widest2 ${
              STATUS_STYLES[order.orderStatus] || STATUS_STYLES.placed
            }`}
          >
            {order.orderStatus}
          </span>
          <span className="font-slab text-base text-merry-clay">{money(order.totalPrice)}</span>
          <HiOutlineChevronDown
            className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
            strokeWidth={2.4}
          />
        </div>
      </button>

      {open && (
        <div className="border-t-4 border-merry-forest">
          {/* Tracking */}
          <div className="border-b-4 border-merry-forest/15 bg-merry-oat p-5 sm:p-6">
            <p className="mb-5 font-slab text-[10px] uppercase tracking-widest2 text-merry-forest/50">
              Tracking
            </p>
            <StatusTracker order={order} />
          </div>

          {/* Items */}
          <div className="space-y-4 border-b-4 border-merry-forest/15 p-5 sm:p-6">
            <p className="font-slab text-[10px] uppercase tracking-widest2 text-merry-forest/50">
              Items
            </p>
            {order.orderItems.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden border-4 border-merry-forest bg-merry-oat">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-slab text-[13px] uppercase tracking-wide">
                    {item.name}
                  </p>
                  <p className="mt-1 text-[12.5px] font-medium text-merry-forest/50">
                    Qty {item.qty}
                    {item.size ? ` · ${item.size}` : ""}
                    {" · "}
                    {money(item.price)} each
                  </p>
                </div>
                <span className="shrink-0 font-slab text-[13px]">
                  {money(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          {/* Delivery + payment + totals */}
          <div className="grid gap-8 p-5 sm:grid-cols-2 sm:p-6">
            <div className="space-y-6">
              <div>
                <p className="mb-2.5 font-slab text-[10px] uppercase tracking-widest2 text-merry-forest/50">
                  Delivery address
                </p>
                <div className="flex items-start gap-2 text-[13px] font-medium text-merry-forest/75">
                  <HiOutlineMapPin className="mt-0.5 h-4 w-4 shrink-0 text-merry-clay" strokeWidth={2} />
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
                <div className="mt-2 flex items-center gap-2 text-[13px] font-medium text-merry-forest/75">
                  <HiOutlinePhone className="h-4 w-4 shrink-0 text-merry-clay" strokeWidth={2} />
                  <a href={`tel:${order.shippingAddress.phone}`} className="hover:text-merry-clay">
                    {order.shippingAddress.phone}
                  </a>
                </div>
              </div>

              <div>
                <p className="mb-2.5 font-slab text-[10px] uppercase tracking-widest2 text-merry-forest/50">
                  Payment
                </p>
                <div className="flex items-center gap-2 text-[13px] font-medium text-merry-forest/75">
                  <HiOutlineCreditCard className="h-4 w-4 shrink-0 text-merry-clay" strokeWidth={2} />
                  <span>
                    {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                    {" · "}
                    <span
                      className={
                        order.paymentStatus === "paid"
                          ? "font-bold text-merry-moss"
                          : order.paymentStatus === "failed"
                          ? "font-bold text-red-700"
                          : "text-merry-forest/50"
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
                  <p className="mt-1 pl-6 text-[12.5px] font-medium capitalize text-merry-forest/50">
                    via {order.onlinePayment.provider}
                  </p>
                )}
              </div>

              {order.notes && (
                <div>
                  <p className="mb-2.5 font-slab text-[10px] uppercase tracking-widest2 text-merry-forest/50">
                    Order notes
                  </p>
                  <p className="text-[13px] font-medium leading-relaxed text-merry-forest/65">
                    {order.notes}
                  </p>
                </div>
              )}
            </div>

            <div>
              <p className="mb-3 font-slab text-[10px] uppercase tracking-widest2 text-merry-forest/50">
                Summary
              </p>
              <PriceBreakdown order={order} />

              <div className="mt-5 space-y-2.5 border-t-4 border-merry-forest/15 pt-4">
                <Link
                  to="/shipping"
                  className="block font-slab text-[11px] uppercase tracking-widest2 text-merry-forest transition-colors hover:text-merry-clay"
                >
                  Shipping &amp; returns policy
                </Link>
                <Link
                  to="/contact"
                  className="block font-slab text-[11px] uppercase tracking-widest2 text-merry-forest transition-colors hover:text-merry-clay"
                >
                  Need help with this order?
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
    <div className="min-h-screen bg-merry-cream">
      {/* ── Page banner ─────────────────────────────────────────────── */}
      <div className="border-b-4 border-merry-forest bg-merry-forest text-merry-cream">
        <div className="mx-auto max-w-[1440px] px-6 py-12 sm:px-10 sm:py-16">
          <p className="flex items-center gap-2.5 font-slab text-[11px] uppercase tracking-widest2 text-merry-clay">
            <LeafIcon className="h-4 w-4" />
            Your account
          </p>
          <h1 className="mt-4 text-5xl uppercase leading-[0.92] text-merry-cream sm:text-6xl">
            Track your
            <br />
            <span className="text-merry-clay">order.</span>
          </h1>
          <p className="mt-5 max-w-md text-sm font-medium leading-relaxed text-merry-sage sm:text-base">
            Follow every order from the moment it's placed through to the knock
            on your door.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-10 sm:py-16">
        {loading ? (
          <OrdersSkeleton count={3} />
        ) : error ? (
          <div className="border-4 border-merry-forest bg-merry-oat p-10 text-center shadow-hard-merry-sm">
            <p className="mb-6 font-slab text-lg uppercase">Couldn't load your orders</p>
            <button
              onClick={() => window.location.reload()}
              className="pressable inline-flex items-center gap-2 border-4 border-merry-forest bg-merry-cream px-7 py-3.5 font-slab text-sm uppercase tracking-wide shadow-hard-merry-sm hover:bg-merry-oat"
            >
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="border-4 border-merry-forest bg-merry-oat p-10 text-center shadow-hard-merry sm:p-14">
            <div className="mx-auto grid h-16 w-16 place-items-center border-4 border-merry-forest bg-merry-cream text-merry-forest">
              <HiOutlineShoppingBag className="h-7 w-7" />
            </div>
            <h2 className="mt-7 text-3xl uppercase leading-[0.98]">No orders yet</h2>
            <p className="mx-auto mt-4 max-w-sm text-sm font-medium text-merry-forest/65">
              When you place an order, its live tracking lands right here.
            </p>
            <Link
              to="/shop"
              className="pressable mt-8 inline-flex items-center gap-3 border-4 border-merry-forest bg-merry-clay px-8 py-4 font-slab text-base uppercase tracking-wide text-merry-cream shadow-hard-merry"
            >
              Start shopping
              <LeafIcon className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Active orders — the first one is expanded so the most recent
                order's tracking is visible without an extra click. */}
            <section>
              <h2 className="mb-5 flex items-center gap-2.5 font-slab text-[11px] uppercase tracking-widest2 text-merry-forest">
                <LeafIcon className="h-3.5 w-3.5 text-merry-clay" />
                In progress
                {active.length > 0 && (
                  <span className="text-merry-forest/40">({active.length})</span>
                )}
              </h2>

              {active.length === 0 ? (
                <div className="border-4 border-merry-forest/20 bg-merry-oat p-8 text-center">
                  <p className="mb-5 text-sm font-medium text-merry-forest/65">
                    Nothing on the way right now.
                  </p>
                  <Link
                    to="/shop"
                    className="pressable inline-flex items-center gap-2 border-4 border-merry-forest bg-merry-cream px-7 py-3.5 font-slab text-sm uppercase tracking-wide shadow-hard-merry-sm hover:bg-merry-cream"
                  >
                    Shop the collection
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
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
                  className="flex w-full items-center justify-between gap-3 border-4 border-merry-forest bg-merry-oat px-5 py-4 transition-colors hover:bg-merry-cream"
                >
                  <span className="flex items-center gap-2.5">
                    <HiOutlineCheckCircle className="h-5 w-5 shrink-0 text-merry-clay" strokeWidth={2} />
                    <span className="font-slab text-[12px] uppercase tracking-widest2 text-merry-forest">
                      Order history
                    </span>
                    <span className="text-[12px] font-medium text-merry-forest/45">
                      ({history.length} completed)
                    </span>
                  </span>
                  <HiOutlineChevronDown
                    className={`h-5 w-5 shrink-0 text-merry-forest transition-transform duration-300 ${
                      historyOpen ? "rotate-180" : ""
                    }`}
                    strokeWidth={2.4}
                  />
                </button>

                {historyOpen && (
                  <div className="mt-5 space-y-5">
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
