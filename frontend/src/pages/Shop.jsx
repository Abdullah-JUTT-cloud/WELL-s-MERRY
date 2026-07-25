import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getProducts } from "../api/products.js";
import { useCart } from "../context/CartContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import heroBottle from "../assets/oil-lying-pump.jpg";

const CATEGORIES = [
  { value: "", label: "All Products" },
  { value: "hair-care", label: "Hair Care" },
  { value: "skin-care", label: "Skin Care" },
  { value: "body-care", label: "Body Care" },
];

// Shown alongside real products so the shop never looks sparse with
// only one live item — communicates "more is coming" rather than
// looking like an unfinished or abandoned store.
const GHOST_SLOTS = [
  { label: "Skin Care — Coming Soon" },
  { label: "Body Care — Coming Soon" },
];

const FALLBACK_PRODUCT = {
  _id: "fallback-hair-oil",
  slug: "hair-care-oil",
  name: "Well's Merry Hair Care Oil",
  category: "hair-care",
  price: 1880,
  size: "200ml",
  stock: 25,
  images: [heroBottle],
  isFallback: true,
};

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
        if (ignore) return;

        if (data.length === 0 && (!activeCategory || activeCategory === "hair-care")) {
          setProducts([FALLBACK_PRODUCT]);
        } else {
          setProducts(data);
        }
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
    if (product.isFallback) {
      toast("This product is being finalized — check back very soon!", { icon: "🌿" });
      return;
    }
    addItem(product, 1);
  };

  const handleCategoryChange = (value) => {
    if (value) setSearchParams({ category: value });
    else setSearchParams({});
  };

  const showGhostSlots = useMemo(
    () => !activeCategory || activeCategory !== "hair-care",
    [activeCategory]
  );

  return (
    <div>
      {/* Page header */}
      <div className="bg-ink text-ivory py-14 sm:py-16 text-center">
        <span className="eyebrow mb-3">Shop</span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl">All Products</h1>
      </div>

      <div className="container-content py-12 sm:py-16">
        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-5 py-2.5 text-[12.5px] tracking-[0.08em] uppercase rounded-full border transition-colors
                ${activeCategory === cat.value
                  ? "bg-ink text-ivory border-ink"
                  : "border-cream-dim text-ink/60 hover:border-ink hover:text-ink"}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* States: loading / error / content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-cream-dim animate-pulse">
                <div className="aspect-square bg-cream" />
                <div className="p-6 space-y-3">
                  <div className="h-3 w-1/3 bg-cream" />
                  <div className="h-4 w-2/3 bg-cream" />
                  <div className="h-9 w-full bg-cream mt-4" />
                </div>
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
            <p className="text-ink/60">No products found in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onAdd={handleAdd} />
            ))}

            {showGhostSlots &&
              GHOST_SLOTS.map((slot) => (
                <div
                  key={slot.label}
                  className="border border-dashed border-cream-dim flex flex-col items-center justify-center text-center p-10 aspect-square sm:aspect-auto"
                >
                  <span className="font-display italic text-ink/40">{slot.label}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;