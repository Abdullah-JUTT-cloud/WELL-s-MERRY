import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../api/products.js";
import { useCart } from "../context/CartContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { ProductGridSkeleton } from "../components/Skeleton.jsx";

const CATEGORIES = [
  { value: "", label: "ALL PRODUCTS" },
  { value: "hair-care", label: "HAIR CARE" },
  { value: "skin-care", label: "SKIN CARE" },
  { value: "body-care", label: "BODY CARE" },
];

const Shop = () => {
  const { addItem } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(false);

    (async () => {
      try {
        const params = activeCategory ? { category: activeCategory } : {};
        const data = await getProducts(params);
        if (!ignore) setProducts(data);
      } catch {
        if (!ignore) setError(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [activeCategory]);

  const handleAdd = (product) => {
    addItem(product, 1);
  };

  const handleCategoryChange = (value) => {
    if (value) setSearchParams({ category: value });
    else setSearchParams({});
  };

  return (
    <div className="bg-[#fcfbf9] min-h-screen">
      {/* Page header. Sits under the transparent navbar via `under-header`,
          then `pt-header` restores the space the bar occupies so the eyebrow
          never tucks behind it. Replaces the old hardcoded
          `-mt-[90px] pt-[130px]` pairing, which had to be re-guessed at every
          breakpoint and didn't match the header's real height. */}
      <div className="bg-ink text-ivory text-center relative overflow-hidden under-header pt-header px-4 sm:px-6">
        <div className="container-content relative z-10 py-12 sm:py-20">
          <span className="eyebrow mb-2 sm:mb-3 text-gold-3">EXCLUSIVE COLLECTION</span>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase">
            {activeCategory ? activeCategory.replace("-", " ") : "OUR PRODUCTS"}
          </h1>
          <p className="mt-3 text-cream/75 max-w-md mx-auto text-xs sm:text-base font-light">
            100% organic botanicals crafted for natural radiance, strength, and lasting nourishment.
          </p>
        </div>
      </div>

      <div className="container-content py-8 sm:py-16 px-3 sm:px-6">
        {/* Category Filter Pills (Horizontal scrollable on mobile) */}
        <div className="flex overflow-x-auto sm:flex-wrap sm:justify-center gap-2 sm:gap-4 mb-8 sm:mb-14 pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                aria-pressed={isActive}
                className={`shrink-0 px-5 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-[12px] tracking-[0.14em] font-semibold uppercase rounded-full border transition-all duration-300 ${
                  isActive
                    ? "bg-ink text-ivory border-ink shadow-md"
                    : "bg-white border-cream-dim text-ink/70 hover:border-ink hover:text-ink shadow-xs"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* States: Loading / Error / Content */}
        {loading ? (
          /* Same grid classes as the loaded state below, so the placeholders
             sit exactly where the real cards will land. */
          <ProductGridSkeleton
            count={8}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-7 gap-y-8 sm:gap-y-12"
          />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-ink/60 mb-4">We couldn't load products right now.</p>
            <button onClick={() => window.location.reload()} className="btn btn-outline">
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-ink/60 font-light text-base sm:text-lg">No products found in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-7 gap-y-8 sm:gap-y-12">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onAdd={handleAdd} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
