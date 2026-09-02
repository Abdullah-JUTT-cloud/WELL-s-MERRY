import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiOutlineStar,
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlineShoppingBag,
  HiOutlineArrowsPointingOut,
  HiOutlineTruck,
  HiChevronDown,
} from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import { getProductBySlug } from "../../api/products.js";
import { buildWhatsAppLink } from "../../config/siteConfig.js";
import { useCart } from "../../context/CartContext.jsx";
import { MERRY_PRODUCTS } from "../../data/merry/mock.js";
import {
  MagneticProductCard,
  LeafIcon,
  DropIcon,
  SparkIcon,
  BottleIcon,
} from "../../components/merry/index.js";
import ReviewSection from "../../components/ReviewSection.jsx";
import ImageLightbox from "../../components/ImageLightbox.jsx";

/* =====================================================================
   PRODUCT DETAIL — the Merry take.

   Same data contract as the legacy PDP (works with the live API and
   with the mock catalog fallback), re-skinned into the takeover's
   design language: cream canvas, forest 4px borders, hard shadows,
   slab headings, chunky size/qty controls, clay CTAs.

   Kept from the legacy page: qty stepper, cart + WhatsApp ordering,
   ReviewSection, ImageLightbox. New for merry: size selector, merry
   accordions (description / benefits / ingredients / ritual), and a
   "Pairs well with" strip of magnetic cards from the same category.
   ===================================================================== */

const ACCORDION_SPRING = { type: "spring", stiffness: 300, damping: 30 };

/* Tiny merry accordion row — thick top border, slab trigger, animated. */
const AccordionRow = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t-4 border-merry-forest">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="flex items-center gap-3 font-slab text-base uppercase tracking-wide sm:text-lg">
          {Icon && <Icon className="h-5 w-5 text-merry-clay" />}
          {title}
        </span>
        <HiChevronDown
          className={`h-5 w-5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={ACCORDION_SPRING}
            className="overflow-hidden"
          >
            <div className="pb-6 text-sm font-medium leading-relaxed text-merry-forest/80 sm:text-base">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MerryPdpSkeleton = () => (
  <div className="mx-auto max-w-[1240px] animate-pulse px-6 py-16 sm:px-10">
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="aspect-[4/5] border-4 border-merry-forest/20 bg-merry-oat" />
      <div className="space-y-5">
        <div className="h-4 w-28 border-2 border-merry-forest/15 bg-merry-oat" />
        <div className="h-12 w-3/4 bg-merry-oat" />
        <div className="h-6 w-32 bg-merry-oat" />
        <div className="h-20 w-full border-4 border-merry-forest/15 bg-merry-oat" />
        <div className="h-14 w-full border-4 border-merry-forest/15 bg-merry-oat" />
      </div>
    </div>
  </div>
);

const ProductDetail = () => {
  const { slug } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setNotFound(false);
    setActiveImage(0);
    setQty(1);
    setSizeIdx(0);

    (async () => {
      try {
        const data = await getProductBySlug(slug);
        if (!ignore) setProduct(data);
      } catch {
        if (!ignore) setNotFound(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [slug]);

  const handleReviewAdded = useCallback(async () => {
    try {
      const data = await getProductBySlug(slug);
      setProduct(data);
    } catch {
      // silently fail — the page keeps showing the last good data
    }
  }, [slug]);

  if (loading) return <MerryPdpSkeleton />;

  if (notFound || !product) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-[1240px] flex-col items-center justify-center px-6 py-24 text-center sm:px-10">
        <LeafIcon className="h-12 w-12 -rotate-12 text-merry-clay" />
        <h1 className="mt-6 text-4xl uppercase sm:text-5xl">This bottle wandered off</h1>
        <p className="mt-4 max-w-md text-sm font-medium text-merry-forest/70 sm:text-base">
          The product you're looking for may have been harvested, renamed, or
          the link is a little wild.
        </p>
        <Link
          to="/shop"
          className="pressable mt-8 inline-flex items-center gap-3 border-4 border-merry-forest bg-merry-clay px-8 py-4 font-slab text-base uppercase tracking-wide text-merry-cream shadow-hard-merry"
        >
          Back to the shelf
        </Link>
      </section>
    );
  }

  const imagesList =
    product.images?.length ? product.images : [product.image].filter(Boolean);
  const sizeOptions =
    product.sizes?.length
      ? product.sizes
      : [{ label: product.size || "200ml", price: product.price }];
  const selectedSize = sizeOptions[Math.min(sizeIdx, sizeOptions.length - 1)];
  const outOfStock = product.stock === 0;

  const related = MERRY_PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  ).slice(0, 3);

  const whatsappOrder = () => {
    const message = `Hi Well's Merry! I'd like to order:\n\n${qty} x ${product.name} (${selectedSize.label}) - Rs.${(
      (selectedSize.price ?? product.price) * qty
    ).toLocaleString()}\n\nName:\nAddress:\nCity:`;
    window.open(buildWhatsAppLink(message), "_blank");
  };

  const addToCart = () => {
    addItem(
      { ...product, size: selectedSize.label, price: selectedSize.price ?? product.price },
      qty
    );
  };

  return (
    <article className="pb-20">
      {/* ── Breadcrumb ───────────────────────────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        className="border-b-4 border-merry-forest bg-merry-oat"
      >
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-2 px-6 py-3.5 font-slab text-[11px] uppercase tracking-widest2 text-merry-forest/60 sm:px-10 sm:text-xs">
          <Link to="/" className="transition-colors hover:text-merry-forest">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/shop" className="transition-colors hover:text-merry-forest">Shop</Link>
          <span aria-hidden="true">/</span>
          <span className="text-merry-forest">{product.name}</span>
        </div>
      </nav>

      {/* ── Main grid ────────────────────────────────────────────────── */}
      <div className="mx-auto grid max-w-[1240px] items-start gap-10 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
        {/* Gallery */}
        <div>
          <div className="relative overflow-hidden border-4 border-merry-forest bg-merry-oat shadow-hard-merry">
            {product.badge && (
              <span className="absolute left-4 top-4 z-10 -rotate-3 border-2 border-merry-forest bg-merry-clay px-3 py-1 font-slab text-[11px] uppercase tracking-wider text-merry-cream">
                {product.badge}
              </span>
            )}
            <button
              type="button"
              onClick={() => setLightboxIndex(activeImage)}
              aria-label={`Zoom ${product.name}`}
              className="group relative block aspect-[4/5] w-full cursor-zoom-in"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={activeImage}
                  src={imagesList[activeImage]}
                  alt={`${product.name} — view ${activeImage + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center border-2 border-merry-forest bg-merry-cream/90 text-merry-forest opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <HiOutlineArrowsPointingOut className="h-5 w-5" />
              </span>
            </button>
          </div>

          {/* Thumbnails */}
          {imagesList.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {imagesList.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-pressed={activeImage === i}
                  className={`w-20 shrink-0 overflow-hidden border-4 transition-all duration-150 sm:w-24 ${
                    activeImage === i
                      ? "border-merry-forest shadow-hard-merry-sm"
                      : "border-merry-forest/25 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info column */}
        <div className="lg:sticky lg:top-24">
          <p className="flex items-center gap-2.5 font-slab text-xs uppercase tracking-widest2 text-merry-clay sm:text-sm">
            <LeafIcon className="h-4 w-4" />
            {product.category === "skin-care" ? "Skin care" : "Hair care"} · 100% organic
          </p>

          <h1 className="mt-4 text-3xl uppercase leading-[0.98] sm:text-5xl">
            {product.name}
          </h1>
          {product.tagline && (
            <p className="mt-3 text-sm font-medium italic text-merry-forest/70 sm:text-base">
              {product.tagline}
            </p>
          )}

          {/* rating */}
          <div className="mt-4 flex items-center gap-2 text-sm font-bold">
            <span className="flex items-center gap-1">
              <HiOutlineStar className="h-4 w-4 fill-merry-clay text-merry-clay" />
              {product.rating ? Number(product.rating).toFixed(1) : "4.8"}
            </span>
            <span className="text-merry-forest/30">|</span>
            <a href="#reviews" className="underline decoration-merry-clay decoration-2 underline-offset-4 transition-colors hover:text-merry-clay">
              {product.numReviews || 0} reviews
            </a>
          </div>

          {/* price */}
          <div className="mt-6 flex items-baseline gap-4">
            <p className="font-slab text-3xl text-merry-clay sm:text-4xl">
              Rs. {(selectedSize.price ?? product.price).toLocaleString()}
            </p>
            {product.compareAtPrice ? (
              <p className="font-slab text-lg text-merry-forest/40 line-through">
                Rs. {product.compareAtPrice.toLocaleString()}
              </p>
            ) : null}
            <p className="text-[10px] font-bold uppercase tracking-wider text-merry-forest/50 sm:text-[11px]">
              taxes included
            </p>
          </div>

          {/* size selector */}
          {sizeOptions.length > 1 && (
            <div className="mt-8">
              <p className="font-slab text-xs uppercase tracking-widest2 text-merry-forest/60">
                Size — <span className="text-merry-forest">{selectedSize.label}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {sizeOptions.map((opt, i) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setSizeIdx(i)}
                    aria-pressed={i === sizeIdx}
                    className={`pressable min-w-[5.5rem] border-4 px-5 py-3 font-slab text-sm uppercase tracking-wide ${
                      i === sizeIdx
                        ? "bg-merry-forest text-merry-cream shadow-hard-merry-clay-sm"
                        : "bg-merry-cream text-merry-forest shadow-hard-merry-sm hover:bg-merry-oat"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* qty + add to cart */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <div className="flex w-full items-center justify-between border-4 border-merry-forest bg-merry-cream sm:w-36">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="grid h-full w-12 place-items-center border-r-4 border-merry-forest text-merry-forest transition-colors hover:bg-merry-oat"
              >
                <HiOutlineMinus className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <span className="font-slab text-lg" aria-live="polite">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                aria-label="Increase quantity"
                className="grid h-full w-12 place-items-center border-l-4 border-merry-forest text-merry-forest transition-colors hover:bg-merry-oat"
              >
                <HiOutlinePlus className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>

            <button
              type="button"
              onClick={addToCart}
              disabled={outOfStock}
              className="pressable flex flex-1 items-center justify-center gap-3 border-4 border-merry-forest bg-merry-clay px-6 py-4 font-slab text-base uppercase tracking-wide text-merry-cream shadow-hard-merry disabled:cursor-not-allowed disabled:opacity-40"
            >
              <HiOutlineShoppingBag className="h-5 w-5" />
              {outOfStock ? "Out of stock" : "Add to cart"}
            </button>
          </div>

          {/* WhatsApp order */}
          <button
            type="button"
            onClick={whatsappOrder}
            className="pressable mt-3 flex w-full items-center justify-center gap-3 border-4 border-merry-forest bg-merry-cream px-6 py-4 font-slab text-sm uppercase tracking-wide text-merry-forest shadow-hard-merry-sm hover:bg-merry-oat"
          >
            <FaWhatsapp className="h-5 w-5 text-merry-moss" />
            Order on WhatsApp
          </button>

          {/* trust chips */}
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {[
              { icon: DropIcon, label: "Cash on delivery" },
              { icon: SparkIcon, label: "Zero chemicals" },
              { icon: BottleIcon, label: "Small-batch pressed" },
              { icon: HiOutlineTruck, label: "Rs. 5,000+ ships free" },
            ].map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 border-2 border-merry-forest/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-merry-forest/80 sm:text-[11px]"
              >
                <Icon className="h-4 w-4 text-merry-clay" />
                {label}
              </li>
            ))}
          </ul>

          {/* accordions */}
          <div className="mt-10 border-b-4 border-merry-forest">
            {product.shortDescription || product.description ? (
              <AccordionRow title="Description" icon={LeafIcon} defaultOpen>
                <p>{product.description || product.shortDescription}</p>
              </AccordionRow>
            ) : null}
            {product.benefits?.length ? (
              <AccordionRow title="What it does" icon={SparkIcon}>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {product.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 font-bold uppercase tracking-wide text-merry-forest">
                      <span className="h-2 w-2 shrink-0 bg-merry-clay" style={{ borderRadius: "46% 54% 50% 50% / 58% 46% 54% 42%" }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </AccordionRow>
            ) : null}
            {product.ingredients?.length ? (
              <AccordionRow title="Ingredients" icon={DropIcon}>
                <p className="m-0">{product.ingredients.join(" · ")}</p>
              </AccordionRow>
            ) : null}
            {product.howToUse ? (
              <AccordionRow title="The ritual" icon={BottleIcon}>
                <p>{product.howToUse}</p>
              </AccordionRow>
            ) : null}
          </div>
        </div>
      </div>

      {/* ── Reviews ──────────────────────────────────────────────────── */}
      <section id="reviews" className="border-t-4 border-merry-forest bg-merry-oat px-6 py-14 sm:px-10">
        <div className="mx-auto max-w-[1240px]">
          <h2 className="flex items-center gap-3 text-3xl uppercase sm:text-4xl">
            <LeafIcon className="h-6 w-6 text-merry-clay" />
            From the grove
          </h2>
          <div className="mt-8 border-4 border-merry-forest bg-merry-cream p-6 shadow-hard-merry sm:p-10">
            <ReviewSection product={product} onReviewAdded={handleReviewAdded} />
          </div>
        </div>
      </section>

      {/* ── Related ──────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-merry-cream px-6 py-16 sm:px-10">
          <div className="mx-auto max-w-[1240px]">
            <div className="flex items-end justify-between gap-6">
              <h2 className="text-3xl uppercase sm:text-4xl">Pairs well with</h2>
              <Link
                to="/shop"
                className="group hidden items-center gap-2 border-b-4 border-merry-clay pb-1 font-slab text-sm uppercase tracking-wide transition-colors hover:text-merry-clay sm:inline-flex"
              >
                Everything
                <span className="transition-transform duration-200 group-hover:translate-x-1.5">→</span>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {related.map((p) => (
                <MagneticProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox (reused legacy component — theme-neutral dark overlay) */}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={imagesList}
          startIndex={lightboxIndex}
          alt={product.name}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </article>
  );
};

export default ProductDetail;
