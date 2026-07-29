import { Link } from "react-router-dom";
import {
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineArrowPath,
  HiOutlineChatBubbleLeftRight,
  HiOutlineExclamationTriangle,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { useCart } from "../context/CartContext.jsx";
import { buildWhatsAppLink } from "../config/siteConfig.js";

const TRUST_POINTS = [
  { icon: HiOutlineTruck, title: "Free Delivery", text: "Nationwide, on every order" },
  { icon: HiOutlineShieldCheck, title: "Secure Checkout", text: "COD or verified transfer" },
  { icon: HiOutlineArrowPath, title: "Easy Support", text: "We reply within 24 hours" },
];

const deliveryWindow = () => {
  const fmt = (d) =>
    d.toLocaleDateString("en-PK", { day: "numeric", month: "short" });
  const from = new Date();
  from.setDate(from.getDate() + 3);
  const to = new Date();
  to.setDate(to.getDate() + 5);
  return `${fmt(from)} – ${fmt(to)}`;
};

const Cart = () => {
  const { items, setQty, removeItem, clearCart, subtotal, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-content py-24 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-cream-dim flex items-center justify-center text-ink/30">
          <HiOutlineShoppingBag className="w-7 h-7" />
        </div>
        <h1 className="font-display text-3xl mb-3">Your Cart is Empty</h1>
        <p className="text-ink/55 mb-8 max-w-sm mx-auto">
          Looks like you haven't added anything yet. Explore our organic hair
          care collection to get started.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/shop" className="btn btn-dark">Start Shopping</Link>
          <Link to="/account/orders" className="btn btn-outline">Track an Order</Link>
        </div>
      </div>
    );
  }

  const whatsappOrder = buildWhatsAppLink(
    [
      "Hi Well's Merry! I'd like to place this order:",
      "",
      ...items.map(
        (i) => `• ${i.name} (${i.size || "standard"}) × ${i.qty} — Rs.${(i.price * i.qty).toLocaleString()}`
      ),
      "",
      `Total: Rs.${subtotal.toLocaleString()}`,
    ].join("\n")
  );

  return (
    <div className="bg-ivory">
      {/* Page header */}
      <div className="bg-ink text-ivory py-12 sm:py-14">
        <div className="container-content text-center">
          <span className="eyebrow mb-3">Your Selection</span>
          <h1 className="font-display text-3xl sm:text-4xl text-ivory">Shopping Cart</h1>
          <p className="text-cream/60 text-sm mt-3">
            {itemCount} item{itemCount !== 1 ? "s" : ""} · Subtotal Rs.{subtotal.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="container-content py-10 sm:py-14">
        <div className="grid lg:grid-cols-[1.55fr_1fr] gap-10 lg:gap-14 items-start">
          {/* ---------- Cart lines ---------- */}
          <div>
            {/* Column headings — desktop only */}
            <div className="hidden sm:grid grid-cols-[100px_1fr_140px_120px] gap-6 pb-3 border-b border-ink/15
                            text-[11px] tracking-[0.14em] uppercase text-ink/45 font-semibold">
              <span className="col-span-2">Product</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Total</span>
            </div>

            {items.map((item) => {
              const lineTotal = item.price * item.qty;
              const lowStock = typeof item.stock === "number" && item.stock > 0 && item.stock <= 5;
              const maxed = typeof item.stock === "number" && item.qty >= item.stock;

              return (
                <div
                  key={item.productId}
                  className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr_140px_120px] gap-4 sm:gap-6
                             items-start py-6 border-b border-cream-dim"
                >
                  {/* Image */}
                  <Link
                    to={`/products/${item.slug}`}
                    className="w-20 h-20 sm:w-[100px] sm:h-[100px] rounded-sm overflow-hidden bg-cream shrink-0 group"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Details */}
                  <div className="min-w-0">
                    <Link
                      to={`/products/${item.slug}`}
                      className="font-medium text-[15px] leading-snug hover:text-gold-1 transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>

                    <dl className="mt-2 space-y-1 text-[12.5px] text-ink/55">
                      {item.size && (
                        <div className="flex gap-1.5">
                          <dt className="text-ink/40">Size:</dt>
                          <dd>{item.size}</dd>
                        </div>
                      )}
                      <div className="flex gap-1.5">
                        <dt className="text-ink/40">Unit price:</dt>
                        <dd>Rs.{item.price.toLocaleString()}</dd>
                      </div>
                      <div className="flex gap-1.5">
                        <dt className="text-ink/40">Item code:</dt>
                        <dd className="font-mono text-[11.5px] uppercase">
                          WM-{item.productId.slice(-6)}
                        </dd>
                      </div>
                    </dl>

                    {/* Stock signal */}
                    {lowStock ? (
                      <p className="flex items-center gap-1.5 mt-2.5 text-[12px] text-gold-1 font-medium">
                        <HiOutlineExclamationTriangle className="w-3.5 h-3.5" />
                        Only {item.stock} left in stock
                      </p>
                    ) : (
                      <p className="flex items-center gap-1.5 mt-2.5 text-[12px] text-moss font-medium">
                        <HiOutlineSparkles className="w-3.5 h-3.5" />
                        In stock · ships in 24 hrs
                      </p>
                    )}

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="flex items-center gap-1.5 text-[12px] text-ink/40 hover:text-red-600 transition-colors mt-3 sm:hidden"
                    >
                      <HiOutlineTrash className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-center gap-4 mt-1 sm:mt-0">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="flex items-center border border-ink/20 rounded-sm bg-white">
                        <button
                          onClick={() => setQty(item.productId, item.qty - 1)}
                          disabled={item.qty <= 1}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="w-9 h-10 flex items-center justify-center text-ink/70 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <HiOutlineMinus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 text-center text-sm font-medium">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.productId, item.qty + 1)}
                          disabled={maxed}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="w-9 h-10 flex items-center justify-center text-ink/70 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <HiOutlinePlus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {maxed && (
                        <span className="text-[11px] text-ink/40">Max available</span>
                      )}
                    </div>

                    <span className="sm:hidden font-display text-[16px]">
                      Rs.{lineTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Line total — desktop */}
                  <div className="hidden sm:flex flex-col items-end gap-2">
                    <span className="font-display text-[17px]">Rs.{lineTotal.toLocaleString()}</span>
                    <span className="text-[11.5px] text-ink/40">
                      {item.qty} × Rs.{item.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="flex items-center gap-1.5 text-[12px] text-ink/40 hover:text-red-600 transition-colors mt-1"
                    >
                      <HiOutlineTrash className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Cart actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
              <Link
                to="/shop"
                className="text-[13px] tracking-[0.06em] uppercase text-gold-1 hover:text-ink transition-colors font-semibold"
              >
                &larr; Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-[12.5px] text-ink/40 hover:text-red-600 transition-colors"
              >
                Clear entire cart
              </button>
            </div>

            {/* Trust strip */}
            <div className="grid sm:grid-cols-3 gap-4 mt-10 pt-8 border-t border-cream-dim">
              {TRUST_POINTS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-gold-1 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-semibold text-ink">{title}</p>
                    <p className="text-[12px] text-ink/50">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---------- Order summary ---------- */}
          <div className="lg:sticky lg:top-28 space-y-5">
            <div className="bg-cream border border-cream-dim p-7 sm:p-8">
              <h2 className="font-display text-xl mb-6">Order Summary</h2>

              {/* Per-item recap so the totals are traceable */}
              <ul className="space-y-2.5 mb-5 pb-5 border-b border-cream-dim">
                {items.map((item) => (
                  <li key={item.productId} className="flex justify-between gap-3 text-[13px]">
                    <span className="text-ink/60 truncate">
                      {item.name} <span className="text-ink/40">× {item.qty}</span>
                    </span>
                    <span className="text-ink/75 shrink-0">
                      Rs.{(item.price * item.qty).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between text-[14.5px] text-ink/70 mb-3">
                <span>Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                <span>Rs.{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[14.5px] text-ink/70 mb-3">
                <span>Shipping</span>
                <span className="text-moss font-medium">Free</span>
              </div>
              <div className="flex justify-between text-[14.5px] text-ink/70 mb-5">
                <span>Estimated delivery</span>
                <span className="text-ink/60">{deliveryWindow()}</span>
              </div>

              <div className="flex justify-between font-display text-lg border-t border-cream-dim pt-5 mb-1">
                <span>Total</span>
                <span>Rs.{subtotal.toLocaleString()}</span>
              </div>
              <p className="text-[11.5px] text-ink/40 mb-6">
                Inclusive of all taxes. Any discount is applied at checkout.
              </p>

              <Link to="/checkout" className="btn btn-dark w-full">
                Proceed to Checkout
              </Link>

              <a
                href={whatsappOrder}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline w-full mt-3 gap-2"
              >
                <HiOutlineChatBubbleLeftRight className="w-4 h-4" />
                Order via WhatsApp
              </a>

              <p className="text-[12px] text-ink/45 text-center mt-4">
                Cash on Delivery available · No account required
              </p>
            </div>

            {/* Track order nudge */}
            <div className="border border-cream-dim bg-white p-6">
              <p className="flex items-center gap-2 text-[13px] font-semibold text-ink mb-1.5">
                <HiOutlineTruck className="w-4 h-4 text-gold-1" />
                Already ordered?
              </p>
              <p className="text-[12.5px] text-ink/55 mb-4">
                Check the live status of a previous order any time.
              </p>
              <Link
                to="/account/orders"
                className="text-[12.5px] tracking-[0.06em] uppercase font-semibold text-gold-1 hover:text-ink transition-colors"
              >
                Track My Order &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
