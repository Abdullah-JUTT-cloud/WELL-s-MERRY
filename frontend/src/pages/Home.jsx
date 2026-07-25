import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
// Add this import near the top with the other imports:
import ProductCard from "../components/ProductCard.jsx";
import {
  HiOutlineSparkles,
  HiOutlineSun,
  HiOutlineShieldCheck,
  HiOutlineBeaker,
  HiOutlineHeart,
  HiOutlineStar,
} from "react-icons/hi2";
import { useReveal } from "../hooks/useReveal.js";
import { useCart } from "../context/CartContext.jsx";
import { getProducts } from "../api/products.js";

import heroBottle from "../assets/oil-lying-pump.jpg";
import spotlightImg from "../assets/oil-box-bottle-standing.jpg";
import ingredientsImg from "../assets/oil-ingredients-label.jpg";
import flatlayImg from "../assets/oil-flatlay-diagonal.jpg";

const BENEFITS = [
  { icon: HiOutlineSparkles, title: "Grows New Hair", desc: "Nourishes roots to encourage healthy regrowth." },
  { icon: HiOutlineSun, title: "Shiny Hair", desc: "Restores natural gloss without weighing hair down." },
  { icon: HiOutlineShieldCheck, title: "Chemical Free", desc: "100% organic formula, safe for all ages." },
  { icon: HiOutlineBeaker, title: "Removes Frizz", desc: "Deeply moisturizes for lasting softness." },
  { icon: HiOutlineHeart, title: "Strengthens Hair", desc: "Reduces breakage from root to tip." },
  { icon: HiOutlineStar, title: "Dandruff Relief", desc: "Calms the scalp and reduces flaking." },
];

const TESTIMONIALS = [
  { name: "Ayesha, Lahore", rating: 5, text: "My hair genuinely feels softer after two weeks. The scent is subtle, not overpowering — exactly what I wanted." },
  { name: "Hassan, Karachi", rating: 5, text: "Ordered via WhatsApp, arrived in 3 days. My mother has been using it for her dandruff and says it's finally working." },
  { name: "Sana, Islamabad", rating: 4, text: "Good quality oil, a little goes a long way. Would love to see a bigger bottle size in future." },
];

// Fallback shown only if the API returns nothing yet (e.g. before the
// database is seeded) — so the homepage never looks broken/empty during
// early development. Once real products exist in the DB, this is unused.
const FALLBACK_PRODUCT = {
  _id: "fallback-hair-oil",
  slug: "hair-care-oil",
  name: "Well's Merry Hair Care Oil",
  price: 1880,
  size: "200ml",
  images: [heroBottle],
  isFallback: true,
};

const Home = () => {
  const { addItem } = useCart();
  const [featured, setFeatured] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await getProducts({ featured: true });
        if (!ignore) setFeatured(data.length ? data : [FALLBACK_PRODUCT]);
      } catch {
        if (!ignore) setFeatured([FALLBACK_PRODUCT]);
      } finally {
        if (!ignore) setLoadingProducts(false);
      }
    })();
    return () => {
      ignore = true; // avoids setting state on an unmounted component if navigation happens mid-fetch
    };
  }, []);

  const handleQuickAdd = (product) => {
    if (product.isFallback) {
      toast("This product is being finalized — visit the shop soon!", { icon: "🌿" });
      return;
    }
    addItem(product, 1);
  };

  const heroRef = useReveal();
  const benefitsRef = useReveal();
  const spotlightRef = useReveal();
  const ingredientsRef = useReveal();
  const testimonialsRef = useReveal();

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="bg-ink text-ivory relative overflow-hidden">
        <div className="container-content grid lg:grid-cols-2 gap-10 items-center min-h-[560px] lg:min-h-[640px] py-16 lg:py-0">
          <div ref={heroRef} className="reveal order-2 lg:order-1">
            <span className="eyebrow mb-4">100% Organic Hair Care</span>
            <h1 className="font-display text-[38px] leading-[1.08] sm:text-5xl lg:text-[64px] text-ivory max-w-xl">
              Nature's Gold, <em className="italic text-gold-3 font-normal">Poured</em> Into Every Drop
            </h1>
            <p className="mt-5 text-cream/70 text-base sm:text-lg max-w-md leading-relaxed">
              Deeply moisturizing hair oil crafted from organic botanicals —
              for softness, shine, and stronger hair, naturally.
            </p>
            <div className="flex flex-wrap gap-4 mt-9">
              <Link to="/shop" className="btn btn-gold">Shop Now</Link>
              <Link to="/about" className="btn btn-outline-light">Our Story</Link>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,172,71,0.16),transparent_65%)]" />
            <img
              src={heroBottle}
              alt="Well's Merry Hair Care Oil"
              className="relative max-h-[320px] sm:max-h-[420px] lg:max-h-[560px] w-auto object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </section>

      {/* ============ TRUST MARQUEE ============ */}
      <div className="bg-espresso border-y border-gold-2/10 overflow-hidden py-4">
        <div className="flex w-max animate-[marquee_28s_linear_infinite] hover:[animation-play-state:paused]">
          {[...Array(2)].map((_, dupIdx) => (
            <div key={dupIdx} className="flex shrink-0">
              {["100% Organic", "Made With Care", "Chemical Free", "Cash On Delivery", "WhatsApp Ordering"].map((t) => (
                <span key={t} className="px-8 text-[13px] tracking-[0.08em] uppercase text-cream/80 whitespace-nowrap flex items-center gap-2">
                  <span className="text-gold-2">✦</span> {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============ BENEFITS ============ */}
      <section className="py-20 sm:py-24">
        <div className="container-content">
          <div ref={benefitsRef} className="reveal text-center max-w-xl mx-auto mb-14">
            <span className="eyebrow mb-3">Why Well's Merry</span>
            <h2 className="font-display text-3xl sm:text-4xl">Crafted for Real Results</h2>
            <p className="mt-4 text-ink/60">
              Every bottle blends traditional botanicals with modern care —
              no fillers, no shortcuts.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 border border-cream-dim divide-x divide-y divide-cream-dim">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 sm:p-9 text-center hover:bg-cream transition-colors">
                <div className="w-12 h-12 mx-auto mb-5 rounded-full border border-gold-1 flex items-center justify-center text-gold-1">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-medium text-[15px] mb-1.5">{title}</h4>
                <p className="text-[13px] text-ink/55 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SIGNATURE PRODUCT SPOTLIGHT ============ */}
      <section className="bg-ink text-ivory">
        <div className="container-content grid lg:grid-cols-2 gap-12 items-center py-20">
          <div ref={spotlightRef} className="reveal relative order-2 lg:order-1">
            <div className="absolute -inset-4 border border-gold-2/20 rounded-sm pointer-events-none" />
            <img src={spotlightImg} alt="Well's Merry Hair Care Oil box and bottle" className="rounded-sm w-full object-cover" />
          </div>

          <div className="order-1 lg:order-2">
            <span className="eyebrow mb-4">Our Signature Product</span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] text-ivory max-w-md">
              Hair Care Oil, 100% Organic
            </h2>
            <p className="mt-5 text-cream/70 max-w-md leading-relaxed">
              Our bestseller — a deeply moisturizing blend that restores softness
              and shine while strengthening hair from root to tip. Loved
              unconditionally by everyone who tries it.
            </p>

            <div className="flex gap-10 my-8">
              <div>
                <strong className="block font-display text-3xl text-gold-3">200ml</strong>
                <span className="text-[11px] tracking-wide uppercase text-cream/50">Bottle Size</span>
              </div>
              <div>
                <strong className="block font-display text-3xl text-gold-3">Rs.1,880</strong>
                <span className="text-[11px] tracking-wide uppercase text-cream/50">Price</span>
              </div>
            </div>

            <Link to="/shop" className="btn btn-gold">Shop This Product</Link>
          </div>
        </div>
      </section>

      {/* ============ FEATURED / QUICK-ADD ============ */}
      <section className="py-20 sm:py-24">
        <div className="container-content">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="eyebrow mb-3">Featured</span>
            <h2 className="font-display text-3xl sm:text-4xl">Shop The Collection</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {loadingProducts
              ? [...Array(3)].map((_, i) => (
                  <div key={i} className="border border-cream-dim animate-pulse">
                    <div className="aspect-square bg-cream" />
                    <div className="p-6 space-y-3">
                      <div className="h-3 w-1/3 bg-cream" />
                      <div className="h-4 w-2/3 bg-cream" />
                      <div className="h-9 w-full bg-cream mt-4" />
                    </div>
                  </div>
                ))
              : featured.map((product) => (
                  <ProductCard key={product._id} product={product} onAdd={handleQuickAdd} />
                ))}
          </div>
        </div>
      </section>

      {/* ============ INGREDIENTS BAND ============ */}
      <section className="bg-moss text-ivory py-16 sm:py-20">
        <div className="container-content grid lg:grid-cols-2 gap-12 items-center">
          <div ref={ingredientsRef} className="reveal">
            <span className="block text-[12px] tracking-widest2 uppercase text-gold-3 font-semibold mb-4">
              Straight From Nature
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-ivory mb-5">
              Every Ingredient, Intentional
            </h2>
            <p className="text-cream/85 max-w-lg leading-relaxed">
              Rice bran, sesame, almond, walnut, olive, jojoba, henna, argan
              and more — a considered blend of oils and botanical extracts,
              with nothing artificial hiding inside.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-7">
              {["Rice Bran Oil", "Sweet Almond", "Coconut Oil", "Walnut Oil", "Olive Oil", "Jojoba Oil", "Henna Extract", "Argan Oil"].map((tag) => (
                <span key={tag} className="border border-ivory/30 px-4 py-2 rounded-full text-[12.5px]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-sm overflow-hidden">
            <img src={ingredientsImg} alt="Well's Merry ingredients label" className="w-full object-cover" />
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="container-content">
          <div ref={testimonialsRef} className="reveal text-center max-w-xl mx-auto mb-14">
            <span className="eyebrow mb-3">Customer Love</span>
            <h2 className="font-display text-3xl sm:text-4xl">What They're Saying</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-ivory border border-cream-dim p-8">
                <div className="flex gap-1 text-gold-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <HiOutlineStar key={i} className={`w-4 h-4 ${i < t.rating ? "fill-gold-1" : "opacity-30"}`} />
                  ))}
                </div>
                <p className="font-display italic text-[16px] text-ink/85 mb-6 leading-relaxed">"{t.text}"</p>
                <p className="text-[12.5px] tracking-wide uppercase text-ink/45">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECONDARY BANNER ============ */}
      <section className="relative bg-ink text-ivory py-20 sm:py-24 overflow-hidden">
        <img
          src={flatlayImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative container-content text-center">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ivory max-w-2xl mx-auto leading-tight">
            More Products, Coming Soon To The Well's Merry Family
          </h2>
          <p className="mt-5 text-cream/70 max-w-lg mx-auto">
            We're just getting started. Stay close for new organic skin and
            body care launches.
          </p>
          <Link to="/shop" className="btn btn-gold mt-9">Explore The Shop</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;