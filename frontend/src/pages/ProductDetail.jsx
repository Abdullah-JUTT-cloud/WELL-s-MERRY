import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { HiOutlineStar, HiOutlineMinus, HiOutlinePlus, HiOutlineTruck, HiOutlineShieldCheck } from "react-icons/hi2";
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
      <div className="container-content py-16">
        <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-cream rounded-sm" />
          <div className="space-y-4 pt-2">
            <div className="h-3 w-24 bg-cream" />
            <div className="h-8 w-2/3 bg-cream" />
            <div className="h-6 w-1/3 bg-cream" />
            <div className="h-12 w-full bg-cream mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="container-content py-24 text-center">
        <h1 className="font-display text-3xl mb-3">Product Not Found</h1>
        <p className="text-ink/60 mb-8">This product may have been removed or the link is incorrect.</p>
        <Link to="/shop" className="btn btn-dark">Back to Shop</Link>
      </div>
    );
  }

  const outOfStock = product.stock === 0;

  return (
    <div className="container-content py-10 sm:py-16">
      {/* Breadcrumb */}
      <div className="text-[12.5px] text-ink/50 mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-gold-1">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-gold-1">Shop</Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="aspect-square border border-cream-dim rounded-sm overflow-hidden mb-4 bg-cream">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-sm overflow-hidden border-2 transition-colors
                    ${activeImage === i ? "border-gold-2" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.rating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-gold-1">
                {[...Array(5)].map((_, i) => (
                  <HiOutlineStar key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-gold-1" : "opacity-30"}`} />
                ))}
              </div>
              <span className="text-[13px] text-ink/50">
                {product.rating.toFixed(1)} &middot; {product.numReviews} review{product.numReviews !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          <h1 className="font-display text-3xl sm:text-4xl mb-2">{product.name}</h1>
          {product.shortDescription && (
            <p className="text-ink/55 text-[15px] mb-4">{product.shortDescription}</p>
          )}

          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-display text-2xl">Rs.{product.price.toLocaleString()}</span>
            {product.compareAtPrice && (
              <span className="text-ink/40 line-through text-sm">Rs.{product.compareAtPrice.toLocaleString()}</span>
            )}
          </div>
          <p className="text-[12px] text-ink/45 mb-7">{product.size} &middot; Taxes included, shipping calculated at checkout</p>

          {outOfStock ? (
            <div className="mb-6 px-4 py-3 bg-cream text-[13.5px] text-ink/60 rounded-sm">
              Currently out of stock — check back soon or message us on WhatsApp for updates.
            </div>
          ) : (
            <>
              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-ink rounded-sm">
                  <button onClick={decreaseQty} aria-label="Decrease quantity" className="w-11 h-12 flex items-center justify-center">
                    <HiOutlineMinus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm">{qty}</span>
                  <button onClick={increaseQty} aria-label="Increase quantity" className="w-11 h-12 flex items-center justify-center">
                    <HiOutlinePlus className="w-4 h-4" />
                  </button>
                </div>
                {product.stock <= 5 && (
                  <span className="text-[12.5px] text-gold-1">Only {product.stock} left in stock</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button onClick={handleAddToCart} className="btn btn-outline w-full">
                  Add to Cart
                </button>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/checkout"
                    onClick={handleAddToCart}
                    className="btn btn-dark flex-1"
                  >
                    Buy It Now
                  </Link>
                  <button
                    onClick={handleBuyNowWhatsApp}
                    className="btn flex-1 bg-[#25D366] text-white hover:bg-[#1fb959] border-transparent"
                  >
                    <FaWhatsapp className="w-4 h-4" /> Order on WhatsApp
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Trust row */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-cream-dim text-[13px] text-ink/60">
            <div className="flex items-center gap-2">
              <HiOutlineTruck className="w-5 h-5 text-gold-1" /> Cash on Delivery Available
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineShieldCheck className="w-5 h-5 text-gold-1" /> 100% Organic, Chemical Free
            </div>
          </div>

          {/* Accordion */}
          <Accordion
            items={[
              { title: "Description", content: <p>{product.description}</p> },
              {
                title: "Benefits",
                content: (
                  <ul className="list-disc pl-5 space-y-1.5">
                    {product.benefits?.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                ),
              },
              {
                title: "Ingredients",
                content: (
                  <p className="leading-loose">{product.ingredients?.join(", ")}</p>
                ),
              },
              { title: "How To Use", content: <p>{product.howToUse}</p> },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;