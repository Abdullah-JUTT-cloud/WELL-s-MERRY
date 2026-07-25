import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../api/products.js";
import { useCart } from "../context/CartContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

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
      {/* Page Header */}
      <div className="bg-ink text-ivory py-16 sm:py-20 text-center relative overflow-hidden -mt-[105px] pt-[150px]">
        <div className="container-content relative z-10">
          <span className="eyebrow mb-3 text-gold-3">EXCLUSIVE COLLECTION</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase">
            {activeCategory ? activeCategory.replace("-", " ") : "OUR PRODUCTS"}
          </h1>
          <p className="mt-4 text-cream/75 max-w-md mx-auto text-sm sm:text-base font-light">
            100% organic botanicals crafted for natural radiance, strength, and lasting nourishment.
          </p>
        </div>
      </div>

      <div className="container-content py-12 sm:py-16">
        {/* Category Filter Pills (Dastan Style) */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-14">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-6 py-2.5 text-[11.5px] sm:text-[12px] tracking-[0.14em] font-semibold uppercase rounded-full border transition-all duration-300 ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-square bg-cream/70 rounded-xs" />
                <div className="h-4 w-3/4 bg-cream/70 rounded-xs" />
                <div className="h-3 w-1/2 bg-cream/70 rounded-xs" />
                <div className="h-9 w-full bg-cream/70 rounded-xs" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-ink/60 mb-4">We couldn't load products right now.</p>
            <button onClick={() => window.location.reload()} className="btn btn-outline">
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-ink/60 font-light text-lg">No products found in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
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
