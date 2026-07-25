import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { HiOutlineStar, HiOutlineMinus, HiOutlinePlus, HiOutlineShoppingBag, HiOutlineTruck, HiOutlineShieldCheck } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import { getProductBySlug } from "../api/products.js";
import { useCart } from "../context/CartContext.jsx";
import { buildWhatsAppLink } from "../config/siteConfig.js";
import Accordion from "../components/Accordion.jsx";

const ProductDetail = () => {
  const { slug } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setNotFound(false);
    setActiveImage(0);
    setQty(1);

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
          <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-white rounded-3xl" />
            <div className="space-y-4 pt-4">
              <div className="h-4 w-32 bg-white rounded-md" />
              <div className="h-10 w-3/4 bg-white rounded-md" />
              <div className="h-8 w-1/3 bg-white rounded-md" />
              <div className="h-12 w-full bg-white rounded-md mt-6" />
            </div>
          </div>
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

  return (
    <div className="bg-[#f4f7f0] min-h-screen pb-20 select-none">
      {/* Top Metallic Torn Paper Edge Decorative Divider (Maaz Safder Style) */}
      <div className="relative w-full overflow-hidden leading-none z-10 -mt-[105px]">
        {/* Background spacer for header */}
        <div className="h-[105px] bg-ink" />
        <div className="h-3 bg-gradient-to-r from-gold-1 via-gold-3 to-gold-1 shadow-md" />
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className="relative block w-full h-8 text-[#f4f7f0] fill-current"
        >
          <path d="M0,0 C150,45 350,-20 500,30 C650,70 900,10 1200,25 L1200,60 L0,60 Z" />
        </svg>
      </div>

      <div className="container-content pt-4 pb-12">
        {/* Breadcrumb */}
        <div className="text-[12px] tracking-wider uppercase text-black/60 mb-8 flex items-center gap-2 font-medium">
          <Link to="/" className="hover:text-black">HOME</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-black">SHOP</Link>
          <span>/</span>
          <span className="text-black font-semibold">{product.name.toUpperCase()}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Image Gallery (Maaz Safder Rounded 2-Column / Multi Grid with object-contain) */}
          <div className="lg:col-span-7">
            <div className="grid sm:grid-cols-2 gap-4">
              {imagesList.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative rounded-3xl overflow-hidden bg-white shadow-sm border border-black/5 aspect-square cursor-pointer transition-all duration-300 flex items-center justify-center p-3 ${
                    activeImage === idx ? "ring-2 ring-black" : "hover:opacity-95"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />

                  {/* Top Right "NEW!" Pill Badge */}
                  {idx === 0 && (
                    <span className="absolute top-4 right-4 bg-[#a855f7] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md z-10">
                      NEW!
                    </span>
                  )}

                  {/* Bottom "Top Seller" / "Selling Fast" Pill Badge */}
                  {idx === 0 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-md text-white text-[11px] font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap z-10">
                      <span className="text-gold-3">✨</span> Top seller! Going fast
                    </div>
                  )}

                  {idx === 1 && (
                    <div className="absolute bottom-4 left-4 bg-[#f97316] text-black text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 z-10">
                      🔥 SELLING FAST!
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Thumbnail selector if many images */}
            {imagesList.length > 2 && (
              <div className="flex gap-3 overflow-x-auto mt-4 pb-2">
                {imagesList.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-white border-2 transition-all p-1 flex items-center justify-center ${
                      activeImage === i ? "border-black scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`View ${i}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Product Info & Ordering Box (Maaz Safder Style) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            {/* Reviews Line */}
            <div className="flex items-center gap-2 mb-3">
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
            <h1 className="font-body text-2xl sm:text-3xl font-extrabold text-black uppercase tracking-tight mb-3 leading-snug">
              {product.name} ({product.size || "200ML"})
            </h1>

            {/* Price Line */}
            <div className="mb-1">
              <span className="font-body text-3xl font-black text-black tracking-tight">
                RS. {product.price?.toLocaleString()}
              </span>
              {product.compareAtPrice && (
                <span className="ml-3 text-black/40 line-through text-base font-medium">
                  RS. {product.compareAtPrice?.toLocaleString()}
                </span>
              )}
            </div>

            {/* Taxes Subtitle */}
            <p className="text-[10px] tracking-[0.12em] font-semibold text-black/60 uppercase mb-8">
              TAXES INCLUDED. SHIPPING CALCULATED AT CHECKOUT.
            </p>

            {outOfStock ? (
              <div className="mb-6 px-5 py-4 bg-white text-xs font-semibold text-black/70 rounded-2xl border border-black/10 shadow-xs">
                Currently out of stock — message us on WhatsApp for restock notifications.
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {/* Quantity + Add to Cart Row */}
                <div className="flex items-center gap-3">
                  {/* Quantity selector box */}
                  <div className="flex items-center bg-white border border-black/20 rounded-full px-2 py-1 shadow-xs">
                    <button
                      onClick={decreaseQty}
                      aria-label="Decrease quantity"
                      className="w-8 h-9 flex items-center justify-center text-black hover:opacity-60 transition-opacity"
                    >
                      <HiOutlineMinus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-black">{qty}</span>
                    <button
                      onClick={increaseQty}
                      aria-label="Increase quantity"
                      className="w-8 h-9 flex items-center justify-center text-black hover:opacity-60 transition-opacity"
                    >
                      <HiOutlinePlus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart Pill Button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-white hover:bg-black hover:text-white text-black border border-black/80 font-bold uppercase text-xs tracking-wider rounded-full px-6 py-3.5 flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <HiOutlineShoppingBag className="w-4 h-4" />
                    <span>ADD TO CART</span>
                  </button>
                </div>

                {/* BUY IT NOW Pill Button (Solid Black Maaz Safder Style) */}
                <Link
                  to="/checkout"
                  onClick={handleAddToCart}
                  className="block w-full bg-black text-white hover:bg-gold-2 hover:text-black font-extrabold uppercase text-xs tracking-[0.18em] rounded-full py-4 text-center transition-all shadow-md"
                >
                  BUY IT NOW
                </Link>

                {/* WhatsApp Order Button */}
                <button
                  onClick={handleBuyNowWhatsApp}
                  className="w-full bg-[#25D366] text-white hover:bg-[#1fb959] font-bold uppercase text-xs tracking-wider rounded-full py-3.5 flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <FaWhatsapp className="w-4 h-4" /> Order Directly on WhatsApp
                </button>
              </div>
            )}

            {/* Trust Badges */}
            <div className="flex flex-col gap-2.5 p-5 bg-white/80 rounded-2xl border border-black/5 text-xs text-black/80 font-medium shadow-xs mb-6">
              <div className="flex items-center gap-2.5">
                <HiOutlineTruck className="w-4 h-4 text-gold-1 shrink-0" />
                <span>Cash on Delivery Available Across Pakistan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <HiOutlineShieldCheck className="w-4 h-4 text-gold-1 shrink-0" />
                <span>100% Organic Botanical Formula &amp; Chemical Free</span>
              </div>
            </div>

            {/* Product Accordion */}
            <Accordion
              items={[
                { title: "Description", content: <p className="text-sm leading-relaxed text-black/80">{product.description}</p> },
                {
                  title: "Benefits",
                  content: (
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-black/80">
                      {product.benefits?.map((b) => <li key={b}>{b}</li>)}
                    </ul>
                  ),
                },
                {
                  title: "Ingredients",
                  content: (
                    <p className="text-sm leading-relaxed text-black/80">{product.ingredients?.join(", ")}</p>
                  ),
                },
                { title: "How To Use", content: <p className="text-sm leading-relaxed text-black/80">{product.howToUse}</p> },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;