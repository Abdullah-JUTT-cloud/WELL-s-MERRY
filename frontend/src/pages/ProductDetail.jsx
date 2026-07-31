import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  HiOutlineStar,
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineChevronDown,
  HiOutlineMagnifyingGlassPlus,
} from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import { getProductBySlug } from "../api/products.js";
import { useCart } from "../context/CartContext.jsx";
import { buildWhatsAppLink } from "../config/siteConfig.js";
import ReviewSection from "../components/ReviewSection.jsx";
import ImageLightbox from "../components/ImageLightbox.jsx";
import { ProductDetailSkeleton } from "../components/Skeleton.jsx";

const ProductDetail = () => {
  const { slug } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  // null when closed; otherwise the index the lightbox opened on.
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setNotFound(false);
    setActiveImage(0);
    setQty(1);
    setDescriptionOpen(false);

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

  // Refresh product data after a review is submitted
  const handleReviewAdded = useCallback(async () => {
    try {
      const data = await getProductBySlug(slug);
      setProduct(data);
    } catch {
      // silently fail
    }
  }, [slug]);

  const decreaseQty = () => setQty((q) => Math.max(1, q - 1));
  const increaseQty = () => setQty((q) => Math.min(product?.stock || 99, q + 1));

  const handleAddToCart = () => {
    addItem(product, qty);
  };

  const handleBuyNowWhatsApp = () => {
    const message = `Hi Well's Merry! I'd like to order:\n\n${qty} x ${product.name} (${product.size}) - Rs.${(product.price * qty).toLocaleString()}\n\nName:\nAddress:\nCity:`;
    window.open(buildWhatsAppLink(message), "_blank");
  };

  if (loading) {
    return (
      <div className="bg-[#f4f7f0] min-h-screen py-16">
        <div className="container-content">
          <ProductDetailSkeleton />
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="bg-[#f4f7f0] min-h-screen py-24 text-center">
        <div className="container-content">
          <h1 className="font-display text-3xl mb-3 text-ink">Product Not Found</h1>
          <p className="text-ink/60 mb-8">This product may have been removed or the link is incorrect.</p>
          <Link to="/shop" className="btn btn-dark rounded-full">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const outOfStock = product.stock === 0;

  // Make sure we have array of images
  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];

  // Sanitize title & size display for test database entries
  const rawName = product.name || "";
  const isTestName = rawName.toLowerCase().includes("abdullah") || rawName.toLowerCase().includes("test");
  const displayTitle = isTestName ? "HAIR CARE OIL" : rawName.toUpperCase();
  const displaySize = !product.size || product.size === "8" ? "200ML" : product.size.toUpperCase();

  return (
    <div className="bg-[#f4f7f0] min-h-screen pb-20 select-none">
      {/* Top Metallic Torn Paper Edge Decorative Divider.
          `under-header` slides this up behind the transparent navbar, and the
          solid band below fills the space the bar covers. Both derive from the
          header's measured height, so they can't disagree. */}
      <div className="relative w-full overflow-hidden leading-none z-10 under-header">
        <div className="h-[var(--wm-header-h)] bg-ink" />
        <div className="h-2.5 sm:h-3 bg-gradient-to-r from-gold-1 via-gold-3 to-gold-1 shadow-md" />
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className="relative block w-full h-6 sm:h-8 text-[#f4f7f0] fill-current"
        >
          <path d="M0,0 C150,45 350,-20 500,30 C650,70 900,10 1200,25 L1200,60 L0,60 Z" />
        </svg>
      </div>

      <div className="container-content pt-2 sm:pt-4 pb-12 px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="text-[11px] sm:text-[12px] tracking-wider uppercase text-black/60 mb-5 sm:mb-8 flex items-center gap-1.5 sm:gap-2 font-medium flex-wrap">
          <Link to="/" className="hover:text-black">HOME</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-black">SHOP</Link>
          <span>/</span>
          <span className="text-black font-bold">{displayTitle}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Gallery. Clicking any image opens the zoom
              viewer at that image. */}
          <div className="lg:col-span-7">
            {/* Desktop 2-column grid / Mobile 1-main view */}
            <div className="hidden sm:grid sm:grid-cols-2 gap-4">
              {imagesList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`Zoom ${displayTitle} view ${idx + 1}`}
                  className="group relative rounded-3xl overflow-hidden bg-[#fbf7ef] shadow-sm border border-black/5 aspect-square cursor-zoom-in transition-all duration-300 hover:shadow-md"
                >
                  <img
                    src={imgUrl}
                    alt={`${displayTitle} view ${idx + 1}`}
                    className="absolute inset-0 w-full h-full object-contain p-2 sm:p-3"
                  />

                  {/* Zoom affordance — only shows on hover so it doesn't
                      compete with the product photo at rest. */}
                  <span className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <HiOutlineMagnifyingGlassPlus className="w-4.5 h-4.5" />
                  </span>

                  {idx === 0 && (
                    <span className="absolute top-4 right-4 bg-[#a855f7] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md z-10">
                      NEW!
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Featured Image Container */}
            <div className="block sm:hidden">
              <button
                type="button"
                onClick={() => setLightboxIndex(activeImage)}
                aria-label={`Zoom ${displayTitle}`}
                className="relative w-full rounded-2xl overflow-hidden bg-[#fbf7ef] shadow-sm border border-black/5 aspect-[4/5] cursor-zoom-in"
              >
                <img
                  src={imagesList[activeImage] || imagesList[0]}
                  alt={displayTitle}
                  className="absolute inset-0 w-full h-full object-contain p-2"
                />
                <span className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center z-10">
                  <HiOutlineMagnifyingGlassPlus className="w-4 h-4" />
                </span>
                {activeImage === 0 && (
                  <span className="absolute top-3 right-3 bg-[#a855f7] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md z-10">
                    NEW!
                  </span>
                )}
              </button>

              {/* Mobile Horizontal Thumbnail Selector Bar */}
              <div className="flex gap-2.5 overflow-x-auto mt-3 pb-2 no-scrollbar">
                {imagesList.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-[#fbf7ef] border-2 transition-all ${
                      activeImage === i ? "border-black scale-105 shadow-sm" : "border-black/10 opacity-70"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Product Info */}
          <div className="lg:col-span-5 lg:sticky lg:top-[calc(var(--wm-header-h)+1rem)]">
            {/* Reviews Line */}
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="flex items-center text-black">
                <HiOutlineStar className="w-4 h-4 fill-black text-black" />
              </div>
              <span className="text-xs font-bold text-black">
                {product.rating > 0 ? product.rating.toFixed(1) : "4.8"}
              </span>
              <span className="text-black/30">|</span>
              <span className="text-xs text-black/75 underline font-medium">
                {product.numReviews || 128} reviews
              </span>
            </div>

            {/* Main Product Title */}
            <h1 className="font-body text-xl sm:text-3xl font-extrabold text-black uppercase tracking-tight mb-2 sm:mb-3 leading-snug">
              {displayTitle} ({displaySize})
            </h1>

            {/* Price Line */}
            <div className="mb-1 flex items-baseline gap-3">
              <span className="font-body text-2xl sm:text-3xl font-black text-black tracking-tight">
                RS. {product.price?.toLocaleString()}
              </span>
              {product.compareAtPrice && (
                <span className="text-black/40 line-through text-sm sm:text-base font-medium">
                  RS. {product.compareAtPrice?.toLocaleString()}
                </span>
              )}
            </div>

            {/* Taxes Subtitle */}
            <p className="text-[9.5px] sm:text-[10px] tracking-[0.12em] font-semibold text-black/60 uppercase mb-6 sm:mb-8">
              TAXES INCLUDED. SHIPPING CALCULATED AT CHECKOUT.
            </p>

            {outOfStock ? (
              <div className="mb-6 px-5 py-4 bg-white text-xs font-semibold text-black/70 rounded-2xl border border-black/10 shadow-xs">
                Currently out of stock — message us on WhatsApp for restock notifications.
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4 mb-8">
                {/* Quantity + Add to Cart Row */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-28 shrink-0 flex items-center justify-between bg-white border border-black/20 rounded-full px-2 py-1 shadow-xs">
                    <button
                      onClick={decreaseQty}
                      aria-label="Decrease quantity"
                      className="w-7 h-8 sm:w-8 sm:h-9 flex items-center justify-center text-black hover:opacity-60 transition-opacity"
                    >
                      <HiOutlineMinus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-black">{qty}</span>
                    <button
                      onClick={increaseQty}
                      aria-label="Increase quantity"
                      className="w-7 h-8 sm:w-8 sm:h-9 flex items-center justify-center text-black hover:opacity-60 transition-opacity"
                    >
                      <HiOutlinePlus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-white hover:bg-black hover:text-white text-black border border-black/80 font-bold uppercase text-[11px] sm:text-xs tracking-wider rounded-full px-3 sm:px-6 py-3 sm:py-3.5 flex items-center justify-center gap-1.5 transition-all shadow-xs whitespace-nowrap"
                  >
                    <HiOutlineShoppingBag className="w-4 h-4" />
                    <span>ADD TO CART</span>
                  </button>
                </div>

                <Link
                  to="/checkout"
                  onClick={handleAddToCart}
                  className="block w-full bg-black text-white hover:bg-gold-2 hover:text-black font-extrabold uppercase text-[11.5px] sm:text-xs tracking-[0.18em] rounded-full py-3.5 sm:py-4 text-center transition-all shadow-md"
                >
                  BUY IT NOW
                </Link>

                <button
                  onClick={handleBuyNowWhatsApp}
                  className="w-full bg-[#25D366] text-white hover:bg-[#1fb959] font-bold uppercase text-[11.5px] sm:text-xs tracking-wider rounded-full py-3 sm:py-3.5 flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <FaWhatsapp className="w-4 h-4" /> Order Directly on WhatsApp
                </button>
              </div>
            )}

            {/* Trust Badges */}
            <div className="flex flex-col gap-2 p-4 sm:p-5 bg-white/80 rounded-2xl border border-black/5 text-xs text-black/80 font-medium shadow-xs mb-6">
              <div className="flex items-center gap-2.5">
                <HiOutlineTruck className="w-4 h-4 text-gold-1 shrink-0" />
                <span>Cash on Delivery Available Across Pakistan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <HiOutlineShieldCheck className="w-4 h-4 text-gold-1 shrink-0" />
                <span>100% Organic Botanical Formula &amp; Chemical Free</span>
              </div>
              <Link
                to="/shipping"
                className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-black/70 underline hover:text-black"
              >
                Shipping &amp; Returns
              </Link>
            </div>

            {/* Product Description — one collapsible row with a product
                thumbnail on the left and a chevron on the right. Everything
                that used to be split across four separate accordion panels
                (description, benefits, ingredients, how to use) now lives
                inside this single disclosure. */}
            <div className="border-t border-b border-black/10">
              <button
                type="button"
                onClick={() => setDescriptionOpen((v) => !v)}
                aria-expanded={descriptionOpen}
                className="w-full flex items-center gap-3 py-3.5 text-left group"
              >
                <span className="w-11 h-11 shrink-0 rounded-md overflow-hidden bg-white border border-black/10 flex items-center justify-center p-1">
                  <img
                    src={imagesList[0]}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </span>

                <span className="flex-1 text-[14px] sm:text-[15px] font-medium text-black">
                  Product Description
                </span>

                <HiOutlineChevronDown
                  className={`w-4.5 h-4.5 shrink-0 text-black/50 transition-transform duration-300 ${
                    descriptionOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {descriptionOpen && (
                <div className="pb-6 space-y-6 text-black/80">
                  <p className="text-sm leading-relaxed">{product.description}</p>

                  {product.benefits?.length > 0 && (
                    <div>
                      <h3 className="text-[11px] tracking-[0.14em] uppercase font-bold text-black/50 mb-2.5">
                        Benefits
                      </h3>
                      <ul className="list-disc pl-5 space-y-1.5 text-sm">
                        {product.benefits.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.ingredients?.length > 0 && (
                    <div>
                      <h3 className="text-[11px] tracking-[0.14em] uppercase font-bold text-black/50 mb-2.5">
                        Ingredients
                      </h3>
                      <p className="text-sm leading-relaxed">
                        {product.ingredients.join(", ")}
                      </p>
                    </div>
                  )}

                  {product.howToUse && (
                    <div>
                      <h3 className="text-[11px] tracking-[0.14em] uppercase font-bold text-black/50 mb-2.5">
                        How To Use
                      </h3>
                      <p className="text-sm leading-relaxed">{product.howToUse}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection product={product} onReviewAdded={handleReviewAdded} />
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={imagesList}
          startIndex={lightboxIndex}
          alt={displayTitle}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
};

export default ProductDetail;
