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
import { LeafIcon } from "../components/merry/icons.jsx";

/* =====================================================================
   CART — Merry theme.

   Rebuilt on the organic palette: Deep Forest (#1A2E24), Cream (#F9F6F0)
   and Terracotta (#C17754). Every trace of the legacy gold/ivory
   ("orange") theme is gone — no gold-1 accents, no ink banners, no
   rounded ivory cards. Thick 4px borders + hard offset shadows only.

   The page renders inside MerryLayout (see App.jsx), so it inherits the
   organic Navbar, Footer and cart drawer instead of the old shell.
   ===================================================================== */

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
      <div className="bg-merry-cream">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center sm:py-32">
          <div className="grid h-20 w-20 place-items-center border-4 border-merry-forest bg-merry-oat text-merry-forest shadow-hard-merry">
            <HiOutlineShoppingBag className="h-9 w-9" />
          </div>
          <h1 className="mt-8 text-4xl uppercase leading-[0.98] sm:text-5xl">
            Your cart is
            <br />
            <span className="text-merry-clay">empty.</span>
          </h1>
          <p className="mt-5 max-w-sm text-sm font-medium leading-relaxed text-merry-forest/70 sm:text-base">
            Nothing in the basket yet. The eight-oil blend is waiting where you
            left it.
          </p>
          <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <Link
              to="/shop"
              className="pressable flex items-center justify-center gap-3 border-4 border-merry-forest bg-merry-clay px-8 py-4 font-slab text-base uppercase tracking-wide text-merry-cream shadow-hard-merry"
            >
              Start shopping
              <LeafIcon className="h-5 w-5" />
            </Link>
            <Link
              to="/account/orders"
              className="pressable flex items-center justify-center gap-2 border-4 border-merry-forest bg-merry-cream px-8 py-4 font-slab text-base uppercase tracking-wide text-merry-forest shadow-hard-merry-sm hover:bg-merry-oat"
            >
              Track an order
            </Link>
          </div>
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
    <div className="bg-merry-cream">
      {/* ── Page banner — forest green, thick bottom rule ─────────── */}
      <div className="border-b-4 border-merry-forest bg-merry-forest text-merry-cream">
        <div className="mx-auto max-w-[1440px] px-6 py-12 sm:px-10 sm:py-16">
          <p className="flex items-center gap-2.5 font-slab text-[11px] uppercase tracking-widest2 text-merry-clay">
            <LeafIcon className="h-4 w-4" />
            Your selection
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-5xl uppercase leading-[0.92] text-merry-cream sm:text-6xl">
              Shopping cart
            </h1>
            <p className="font-slab text-sm uppercase tracking-wide text-merry-sage sm:text-base">
              {itemCount} item{itemCount !== 1 ? "s" : ""} · Subtotal Rs.
              {subtotal.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 py-12 sm:px-10 sm:py-16">
        <div className="grid items-start gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-14">
          {/* ---------- Cart lines ---------- */}
          <div>
            {/* Column headings — desktop only */}
            <div className="hidden grid-cols-[110px_1fr_150px_130px] gap-6 border-b-4 border-merry-forest pb-3 font-slab text-[10px] uppercase tracking-widest2 text-merry-forest/55 sm:grid">
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
                  className="grid grid-cols-[88px_1fr] items-start gap-4 border-b-4 border-merry-forest/15 py-6
                             sm:grid-cols-[110px_1fr_150px_130px] sm:gap-6"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${item.slug}`}
                    className="group block aspect-square w-full overflow-hidden border-4 border-merry-forest bg-merry-oat"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </Link>

                  {/* Details */}
                  <div className="min-w-0">
                    <Link
                      to={`/product/${item.slug}`}
                      className="font-slab text-base uppercase leading-tight transition-colors hover:text-merry-clay sm:text-lg"
                    >
                      {item.name}
                    </Link>

                    <dl className="mt-2.5 space-y-1 text-[12.5px] font-medium text-merry-forest/70">
                      {item.size && (
                        <div className="flex gap-1.5">
                          <dt className="text-merry-forest/45">Size:</dt>
                          <dd>{item.size}</dd>
                        </div>
                      )}
                      <div className="flex gap-1.5">
                        <dt className="text-merry-forest/45">Unit price:</dt>
                        <dd>Rs.{item.price.toLocaleString()}</dd>
                      </div>
                      <div className="flex gap-1.5">
                        <dt className="text-merry-forest/45">Item code:</dt>
                        <dd className="font-mono text-[11.5px] uppercase">
                          WM-{item.productId.slice(-6)}
                        </dd>
                      </div>
                    </dl>

                    {/* Stock signal */}
                    {lowStock ? (
                      <p className="mt-3 inline-flex items-center gap-1.5 border-2 border-merry-clay px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-merry-clay">
                        <HiOutlineExclamationTriangle className="h-3.5 w-3.5" />
                        Only {item.stock} left
                      </p>
                    ) : (
                      <p className="mt-3 inline-flex items-center gap-1.5 border-2 border-merry-moss px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-merry-moss">
                        <HiOutlineSparkles className="h-3.5 w-3.5" />
                        In stock · ships in 24 hrs
                      </p>
                    )}

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="mt-3 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-merry-forest/45 transition-colors hover:text-red-700 sm:hidden"
                    >
                      <HiOutlineTrash className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 mt-1 flex items-center justify-between gap-4 sm:col-span-1 sm:mt-0 sm:justify-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="flex items-center border-4 border-merry-forest bg-merry-cream">
                        <button
                          onClick={() => setQty(item.productId, item.qty - 1)}
                          disabled={item.qty <= 1}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="flex h-11 w-10 items-center justify-center text-merry-forest transition-colors hover:bg-merry-oat disabled:cursor-not-allowed disabled:opacity-25"
                        >
                          <HiOutlineMinus className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                        <span className="w-10 border-x-4 border-merry-forest py-2.5 text-center font-slab text-sm">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => setQty(item.productId, item.qty + 1)}
                          disabled={maxed}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="flex h-11 w-10 items-center justify-center text-merry-forest transition-colors hover:bg-merry-oat disabled:cursor-not-allowed disabled:opacity-25"
                        >
                          <HiOutlinePlus className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                      </div>
                      {maxed && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-merry-forest/45">
                          Max available
                        </span>
                      )}
                    </div>

                    <span className="font-slab text-lg text-merry-clay sm:hidden">
                      Rs.{lineTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Line total — desktop */}
                  <div className="hidden flex-col items-end gap-2 sm:flex">
                    <span className="font-slab text-lg text-merry-clay">
                      Rs.{lineTotal.toLocaleString()}
                    </span>
                    <span className="text-[11.5px] font-medium text-merry-forest/45">
                      {item.qty} × Rs.{item.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="mt-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-merry-forest/45 transition-colors hover:text-red-700"
                    >
                      <HiOutlineTrash className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Cart actions */}
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 border-b-4 border-merry-clay pb-1 font-slab text-sm uppercase tracking-wide text-merry-forest transition-colors hover:text-merry-clay"
              >
                <span className="transition-transform duration-200 group-hover:-translate-x-1.5">
                  &larr;
                </span>
                Continue shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-[11px] font-bold uppercase tracking-widest2 text-merry-forest/45 transition-colors hover:text-red-700"
              >
                Clear entire cart
              </button>
            </div>

            {/* Trust strip */}
            <div className="mt-10 grid gap-0 border-4 border-merry-forest bg-merry-oat sm:grid-cols-3">
              {TRUST_POINTS.map(({ icon: Icon, title, text }, i) => (
                <div
                  key={title}
                  className={`flex items-start gap-3 p-5 ${
                    i > 0 ? "border-t-4 border-merry-forest sm:border-l-4 sm:border-t-0" : ""
                  }`}
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-merry-clay" strokeWidth={2} />
                  <div>
                    <p className="font-slab text-[12px] uppercase tracking-wide">{title}</p>
                    <p className="mt-1 text-[12px] font-medium text-merry-forest/60">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---------- Order summary ---------- */}
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="border-4 border-merry-forest bg-merry-oat shadow-hard-merry">
              <h2 className="border-b-4 border-merry-forest bg-merry-forest px-6 py-4 text-xl uppercase text-merry-cream">
                Order summary
              </h2>

              <div className="p-6 sm:p-7">
                {/* Per-item recap so the totals are traceable */}
                <ul className="mb-5 space-y-2.5 border-b-4 border-merry-forest/15 pb-5">
                  {items.map((item) => (
                    <li key={item.productId} className="flex justify-between gap-3 text-[13px] font-medium">
                      <span className="truncate text-merry-forest/70">
                        {item.name} <span className="text-merry-forest/45">× {item.qty}</span>
                      </span>
                      <span className="shrink-0 text-merry-forest">
                        Rs.{(item.price * item.qty).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mb-3 flex justify-between text-[14px] font-medium text-merry-forest/75">
                  <span>
                    Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
                  </span>
                  <span>Rs.{subtotal.toLocaleString()}</span>
                </div>
                <div className="mb-3 flex justify-between text-[14px] font-medium text-merry-forest/75">
                  <span>Shipping</span>
                  <span className="font-bold uppercase text-merry-moss">Free</span>
                </div>
                <div className="mb-5 flex justify-between text-[14px] font-medium text-merry-forest/75">
                  <span>Estimated delivery</span>
                  <span>{deliveryWindow()}</span>
                </div>

                <div className="mb-1 flex items-center justify-between border-t-4 border-merry-forest pt-5">
                  <span className="font-slab text-lg uppercase">Total</span>
                  <span className="font-slab text-2xl text-merry-clay">
                    Rs.{subtotal.toLocaleString()}
                  </span>
                </div>
                <p className="mb-6 text-[11px] font-medium text-merry-forest/45">
                  Inclusive of all taxes. Any discount is applied at checkout.
                </p>

                <Link
                  to="/checkout"
                  className="pressable flex w-full items-center justify-center gap-3 border-4 border-merry-forest bg-merry-clay px-6 py-4 font-slab text-base uppercase tracking-wide text-merry-cream shadow-hard-merry"
                >
                  Proceed to checkout
                  <LeafIcon className="h-5 w-5" />
                </Link>

                <a
                  href={whatsappOrder}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable mt-4 flex w-full items-center justify-center gap-2 border-4 border-merry-forest bg-merry-cream px-6 py-3.5 font-slab text-sm uppercase tracking-wide text-merry-forest shadow-hard-merry-sm hover:bg-merry-oat"
                >
                  <HiOutlineChatBubbleLeftRight className="h-4 w-4" />
                  Order via WhatsApp
                </a>

                <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-widest2 text-merry-forest/45">
                  Cash on delivery · No account required
                </p>
              </div>
            </div>

            {/* Track order nudge */}
            <div className="border-4 border-merry-forest bg-merry-forest p-6 text-merry-cream">
              <p className="flex items-center gap-2 font-slab text-sm uppercase tracking-wide">
                <HiOutlineTruck className="h-5 w-5 text-merry-clay" />
                Already ordered?
              </p>
              <p className="mt-2 text-[12.5px] font-medium leading-relaxed text-merry-sage">
                Follow the live status of any previous order — from packed to
                knocking on your door.
              </p>
              <Link
                to="/account/orders"
                className="mt-4 inline-flex items-center gap-2 border-b-4 border-merry-clay pb-1 font-slab text-[12px] uppercase tracking-widest2 text-merry-cream transition-colors hover:text-merry-clay"
              >
                Track my order &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
