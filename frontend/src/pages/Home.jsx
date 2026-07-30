import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

import slide1Img from "../assets/11.png";
import slide2Img from "../assets/2.png";
import spotlightImg from "../assets/oil-box-bottle-standing.jpg";
import ingredientsImg from "../assets/oil-ingredients-label.jpg";
import flatlayImg from "../assets/oil-flatlay-diagonal.jpg";

const HERO_SLIDES = [
  {
    id: 1,
    tagline: "— 100% ORGANIC CARE",
    title: "HAIR CARE OIL",
    subtext: "Deeply moisturizing botanical oil crafted with rice bran, sweet almond, jojoba, and argan for softness, shine, and root strength.",
    primaryCta: "SHOP HAIR OIL",
    primaryLink: "/shop",
    secondaryCta: "EXPLORE OUTLETS",
    secondaryLink: "/outlets",
    image: slide1Img,
    objectPos: "object-[82%_20%] sm:object-center",
  },
  {
    id: 2,
    tagline: "— NEW BOTANICAL FORMULA",
    title: "ORGANIC SHAMPOO",
    subtext: "Pure botanical hair cleanser engineered to gently cleanse, restore scalp balance, and revive natural volume without harsh chemicals.",
    primaryCta: "SHOP SHAMPOO",
    primaryLink: "/shop",
    secondaryCta: "VIEW COLLECTION",
    secondaryLink: "/shop",
    image: slide2Img,
    objectPos: "object-[80%_30%] sm:object-center",
  },
];

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

const Home = () => {
  const { addItem } = useCart();
  const [featured, setFeatured] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slider for Hero Section
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await getProducts({ featured: true });
        if (!ignore) setFeatured(data);
      } catch {
        // silently fail
      } finally {
        if (!ignore) setLoadingProducts(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const handleQuickAdd = (product) => {
    addItem(product, 1);
  };

  const benefitsRef = useReveal();
  const spotlightRef = useReveal();
  const ingredientsRef = useReveal();
  const testimonialsRef = useReveal();

  return (
    <div>
      {/* ============ HERO SLIDER (FULL VIEWPORT COVERAGE) ============
          `under-header` pulls the hero up behind the transparent navbar and
          `pt-header` pushes the copy back below it. Both read the header's
          measured height (see index.css / Header.jsx) instead of the
          hardcoded pixel values this used to carry. */}
      <section className="relative w-full h-screen min-h-[680px] bg-ink overflow-hidden select-none under-header flex flex-col justify-between">
        {/* Slides Container */}
        <div className="absolute inset-0 w-full h-full">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                currentSlide === index ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Full-width Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className={`absolute inset-0 w-full h-full object-cover ${slide.objectPos} transform scale-105 transition-transform duration-[8000ms] ease-out`}
              />

              {/* Subtle Gradient Overlays */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-black/85 via-black/40 to-transparent sm:via-black/50 sm:to-black/20" />
              <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/80 via-transparent to-black/40 sm:from-black/70" />

              {/* Slide Content Overlay */}
              <div className="container-content h-full relative z-20 flex flex-col justify-center pt-header pb-16 px-4 sm:px-6">
                <div
                  className={`max-w-[78%] sm:max-w-xl transition-all duration-700 ${
                    currentSlide === index ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                >
                  {/* Category Tag */}
                  <span className="inline-block text-gold-3 text-[10px] sm:text-sm tracking-[0.2em] sm:tracking-[0.24em] font-semibold uppercase mb-2 sm:mb-4 drop-shadow-xs">
                    {slide.tagline}
                  </span>

                  {/* Main Product Title */}
                  <h1 className="font-display text-3xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase mb-2 sm:mb-4 leading-tight sm:leading-none filter drop-shadow-md">
                    {slide.title}
                  </h1>

                  {/* Subtext */}
                  <p className="text-cream/90 text-xs sm:text-base lg:text-lg max-w-md mb-6 sm:mb-9 leading-relaxed font-light drop-shadow-xs line-clamp-3 sm:line-clamp-none">
                    {slide.subtext}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 max-w-[240px] sm:max-w-none">
                    <Link
                      to={slide.primaryLink}
                      className="w-full sm:w-auto bg-white text-ink hover:bg-gold-2 hover:text-ink font-bold text-[11px] sm:text-xs tracking-[0.16em] uppercase px-5 sm:px-7 py-3 sm:py-3.5 rounded-xs transition-all duration-300 flex items-center justify-between sm:justify-center gap-2 shadow-lg group text-center"
                    >
                      <span>{slide.primaryCta}</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                    </Link>

                    <Link
                      to={slide.secondaryLink}
                      className="w-full sm:w-auto border border-white/40 text-white bg-black/30 hover:bg-white/10 font-bold text-[11px] sm:text-xs tracking-[0.16em] uppercase px-5 sm:px-7 py-3 sm:py-3.5 rounded-xs transition-all duration-300 flex items-center justify-between sm:justify-center gap-2 group backdrop-blur-xs text-center"
                    >
                      <span>{slide.secondaryCta}</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slide Pagination Dots (Bottom Right) */}
          <div className="absolute bottom-14 right-5 sm:bottom-16 sm:right-12 z-30 flex items-center gap-2 sm:gap-3">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === index
                    ? "w-7 sm:w-9 h-2 sm:h-2.5 bg-white shadow-glow"
                    : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Flush Bottom Trust Marquee Bar inside Hero Viewport */}
        <div className="relative z-30 w-full mt-auto bg-espresso/90 backdrop-blur-md border-t border-gold-2/15 py-3 sm:py-4 select-none whitespace-nowrap">
          <div className="flex w-max animate-marquee">
            {[...Array(4)].map((_, dupIdx) => (
              <div key={dupIdx} className="flex shrink-0">
                {["100% Organic", "Made With Care", "Chemical Free", "Cash On Delivery", "WhatsApp Ordering"].map((t) => (
                  <span key={t} className="px-5 sm:px-8 text-[11px] sm:text-[13px] tracking-[0.08em] uppercase text-cream/90 flex items-center gap-2 font-medium">
                    <span className="text-gold-2">✦</span> {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BENEFITS ============ */}
      <section className="py-14 sm:py-24 bg-[#fcfbf9]">
        <div className="container-content px-4 sm:px-6">
          <div ref={benefitsRef} className="reveal text-center max-w-xl mx-auto mb-10 sm:mb-14">
            <span className="eyebrow mb-2 sm:mb-3">Why Well's Merry</span>
            <h2 className="font-display text-2xl sm:text-4xl">Crafted for Real Results</h2>
            <p className="mt-3 text-xs sm:text-base text-ink/60">
              Every bottle blends traditional botanicals with modern care —
              no fillers, no shortcuts.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 border border-cream-dim divide-x divide-y divide-cream-dim">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-4 sm:p-9 text-center hover:bg-cream transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-5 rounded-full border border-gold-1 flex items-center justify-center text-gold-1">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h4 className="font-semibold text-xs sm:text-[15px] mb-1">{title}</h4>
                <p className="text-[11px] sm:text-[13px] text-ink/55 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SIGNATURE PRODUCT SPOTLIGHT ============ */}
      <section className="bg-ink text-ivory">
        <div className="container-content grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-14 sm:py-20 px-4 sm:px-6">
          <div ref={spotlightRef} className="reveal relative order-2 lg:order-1">
            <div className="absolute -inset-2 sm:-inset-4 border border-gold-2/20 rounded-xl pointer-events-none" />
            <img src={spotlightImg} alt="Well's Merry Hair Care Oil box and bottle" className="rounded-xl w-full object-cover shadow-lg" />
          </div>

          <div className="order-1 lg:order-2">
            <span className="eyebrow mb-3 text-gold-3">Our Signature Product</span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-[42px] text-ivory max-w-md">
              Hair Care Oil, 100% Organic
            </h2>
            <p className="mt-4 text-cream/75 max-w-md text-xs sm:text-base leading-relaxed font-light">
              Our bestseller — a deeply moisturizing blend that restores softness
              and shine while strengthening hair from root to tip. Loved
              unconditionally by everyone who tries it.
            </p>

            <div className="flex gap-8 sm:gap-10 my-6 sm:my-8">
              <div>
                <strong className="block font-display text-2xl sm:text-3xl text-gold-3">200ml</strong>
                <span className="text-[10px] sm:text-[11px] tracking-wide uppercase text-cream/50">Bottle Size</span>
              </div>
              <div>
                <strong className="block font-display text-2xl sm:text-3xl text-gold-3">Rs.600</strong>
                <span className="text-[10px] sm:text-[11px] tracking-wide uppercase text-cream/50">Price</span>
              </div>
            </div>

            <Link to="/shop" className="btn btn-gold w-full sm:w-auto text-center">Shop This Product</Link>
          </div>
        </div>
      </section>

      {/* ============ FEATURED / QUICK-ADD ============ */}
      <section className="py-14 sm:py-24">
        <div className="container-content px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
            <span className="eyebrow mb-2 sm:mb-3">Featured</span>
            <h2 className="font-display text-2xl sm:text-4xl">Shop The Collection</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-7">
            {loadingProducts
              ? [...Array(2)].map((_, i) => (
                  <div key={i} className="border border-cream-dim animate-pulse p-2">
                    <div className="aspect-[4/5] bg-cream rounded-xl" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 w-1/3 bg-cream rounded-xs" />
                      <div className="h-4 w-2/3 bg-cream rounded-xs" />
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
      <section className="bg-moss text-ivory py-14 sm:py-20">
        <div className="container-content grid lg:grid-cols-2 gap-8 lg:gap-12 items-center px-4 sm:px-6">
          <div ref={ingredientsRef} className="reveal">
            <span className="block text-[11px] sm:text-[12px] tracking-widest2 uppercase text-gold-3 font-semibold mb-3">
              Straight From Nature
            </span>
            <h2 className="font-display text-2xl sm:text-4xl text-ivory mb-4">
              Every Ingredient, Intentional
            </h2>
            <p className="text-cream/85 max-w-lg text-xs sm:text-base leading-relaxed">
              Rice bran, sesame, almond, walnut, olive, jojoba, henna, argan
              and more — a considered blend of oils and botanical extracts,
              with nothing artificial hiding inside.
            </p>
            <div className="flex flex-wrap gap-2 mt-5 sm:mt-7">
              {["Rice Bran Oil", "Sweet Almond", "Coconut Oil", "Walnut Oil", "Olive Oil", "Jojoba Oil", "Henna Extract", "Argan Oil"].map((tag) => (
                <span key={tag} className="border border-ivory/30 px-3 py-1.5 rounded-full text-[11px] sm:text-[12.5px]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img src={ingredientsImg} alt="Well's Merry ingredients label" className="w-full object-cover" />
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="bg-cream py-14 sm:py-24">
        <div className="container-content px-4 sm:px-6">
          <div ref={testimonialsRef} className="reveal text-center max-w-xl mx-auto mb-10 sm:mb-14">
            <span className="eyebrow mb-2 sm:mb-3">Customer Love</span>
            <h2 className="font-display text-2xl sm:text-4xl">What They're Saying</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-ivory border border-cream-dim p-6 sm:p-8 rounded-xl shadow-xs">
                <div className="flex gap-1 text-gold-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <HiOutlineStar key={i} className={`w-4 h-4 ${i < t.rating ? "fill-gold-1" : "opacity-30"}`} />
                  ))}
                </div>
                <p className="font-display italic text-[14px] sm:text-[16px] text-ink/85 mb-5 leading-relaxed">"{t.text}"</p>
                <p className="text-[11.5px] sm:text-[12.5px] tracking-wide uppercase text-ink/45 font-semibold">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECONDARY BANNER ============ */}
      <section className="relative bg-ink text-ivory py-16 sm:py-24 overflow-hidden">
        <img
          src={flatlayImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative container-content text-center px-4 sm:px-6">
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl text-ivory max-w-2xl mx-auto leading-tight">
            More Products, Coming Soon To The Well's Merry Family
          </h2>
          <p className="mt-4 text-cream/70 max-w-lg mx-auto text-xs sm:text-base">
            We're just getting started. Stay close for new organic skin and
            body care launches.
          </p>
          <Link to="/shop" className="btn btn-gold mt-8 inline-block w-full sm:w-auto">Explore The Shop</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
