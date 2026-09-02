import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import WavyVineDivider from "../components/WavyVineDivider.jsx";
import SpotlightCarousel from "../components/SpotlightCarousel.jsx";
import { HeroBotanicals, SectionBotanicals } from "../components/BotanicalElements.jsx";
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
import { ProductGridSkeleton } from "../components/Skeleton.jsx";

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
    accentLine: "Rooted in Nature",
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
    accentLine: "Crowned in Gold",
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
  { name: "Zara, Faisalabad", rating: 5, text: "Finally an organic oil that actually works. My split ends have visibly reduced after a month of regular use." },
  { name: "Bilal, Rawalpindi", rating: 5, text: "The whole family uses it — from my daughter to my mother. No more chemical-laden products for us." },
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

  // Build spotlight items from the signature product data
  const spotlightItems = [
    {
      id: "signature-hair-oil",
      image: spotlightImg,
      alt: "Well's Merry Hair Care Oil box and bottle",
      name: "Hair Care Oil",
      tagline: "100% Organic",
      size: "200ml",
      price: "Rs.600",
    },
  ];

  return (
    <div>
      {/* ============ HERO SLIDER ============ */}
      <section className="relative w-full h-screen min-h-[680px] bg-ink overflow-hidden select-none under-header flex flex-col justify-between">
        {/* Floating ambient botanicals */}
        <HeroBotanicals />

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

                  {/* Main Product Title — oversized & confident */}
                  <h1 className="font-display text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight text-white uppercase mb-1 sm:mb-2 leading-[0.9] filter drop-shadow-md">
                    {slide.title}
                  </h1>

                  {/* Bold italic accent line using Fraunces italic */}
                  <p className="font-display italic text-xl sm:text-3xl lg:text-4xl text-gold-3/80 mb-3 sm:mb-5 leading-tight">
                    {slide.accentLine}
                  </p>

                  {/* Subtext */}
                  <p className="text-cream/90 text-xs sm:text-base lg:text-lg max-w-md mb-6 sm:mb-9 leading-relaxed font-light drop-shadow-xs line-clamp-3 sm:line-clamp-none">
                    {slide.subtext}
                  </p>

                  {/* CTA Buttons — Brutalist style */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 max-w-[260px] sm:max-w-none">
                    <Link
                      to={slide.primaryLink}
                      className="btn-brutalist-gold w-full sm:w-auto text-center"
                    >
                      <span>{slide.primaryCta}</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                    </Link>

                    <Link
                      to={slide.secondaryLink}
                      className="w-full sm:w-auto border-[1.5px] border-white/50 text-white bg-black/20 hover:bg-white/10
                                 font-bold text-[12px] tracking-[0.14em] uppercase px-7 py-3.5 rounded-sm
                                 shadow-[3px_3px_0_rgba(255,255,255,0.15)] hover:shadow-[2px_2px_0_rgba(255,255,255,0.1)]
                                 hover:translate-x-[1px] hover:translate-y-[1px]
                                 transition-all duration-200 flex items-center justify-between sm:justify-center gap-2 backdrop-blur-xs text-center"
                    >
                      <span>{slide.secondaryCta}</span>
                      <span className="transition-transform duration-300">&rarr;</span>
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
                className={`transition-all duration-300 rounded-full border border-white/30 ${
                  currentSlide === index
                    ? "w-7 sm:w-9 h-2 sm:h-2.5 bg-gold-2 shadow-glow"
                    : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Flush Bottom Trust Marquee Bar — with sticker badges */}
        <div className="relative z-30 w-full mt-auto bg-espresso/90 backdrop-blur-md border-t border-gold-2/15 py-3 sm:py-4 select-none whitespace-nowrap">
          <div className="flex w-max animate-marquee">
            {[...Array(4)].map((_, dupIdx) => (
              <div key={dupIdx} className="flex shrink-0">
                {["100% Organic", "Made With Care", "Chemical Free", "Cash On Delivery", "WhatsApp Ordering"].map((t, tIdx) => (
                  <span key={t} className="px-5 sm:px-8 text-[11px] sm:text-[13px] tracking-[0.08em] uppercase text-cream/90 flex items-center gap-2 font-medium">
                    <span className="text-gold-2">✦</span> {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wavy vine divider: hero (ink) → benefits (cream) */}
      <WavyVineDivider from="ink" to="cream" />

      {/* ============ BENEFITS ============ */}
      <section className="py-14 sm:py-24 bg-cream relative overflow-hidden">
        <SectionBotanicals variant="cream" />
        <div className="container-content px-4 sm:px-6 relative z-10">
          <div ref={benefitsRef} className="reveal text-center max-w-xl mx-auto mb-10 sm:mb-14">
            <span className="eyebrow mb-2 sm:mb-3">Why Well's Merry</span>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl">Crafted for Real Results</h2>
            <p className="mt-3 text-xs sm:text-base text-ink/60">
              Every bottle blends traditional botanicals with modern care —
              no fillers, no shortcuts.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-0">
            {BENEFITS.map(({ icon: Icon, title, desc }, idx) => (
              <div
                key={title}
                className="p-4 sm:p-9 text-center hover:bg-ivory transition-colors border-[1.5px] border-ink/10 bg-ivory/50"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-5 rounded-full border-[1.5px] border-gold-1 flex items-center justify-center text-gold-1 shadow-hard-sm">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h4 className="font-semibold text-xs sm:text-[15px] mb-1">{title}</h4>
                <p className="text-[11px] sm:text-[13px] text-ink/55 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wavy vine divider: benefits (cream) → signature product (ink) */}
      <WavyVineDivider from="cream" to="ink" />

      {/* ============ SIGNATURE PRODUCT SPOTLIGHT CAROUSEL ============ */}
      <section className="bg-ink text-ivory relative overflow-hidden">
        <div className="container-content py-14 sm:py-20 px-4 sm:px-6">
          <div ref={spotlightRef} className="reveal text-center mb-8 sm:mb-10">
            <span className="eyebrow mb-3 text-gold-3">Our Signature Product</span>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-ivory">
              Hair Care Oil
            </h2>
            <p className="font-display italic text-lg sm:text-2xl text-gold-3/70 mt-1">
              100% Organic, Deeply Moisturizing
            </p>
          </div>

          {/* Spotlight Carousel */}
          <SpotlightCarousel
            items={spotlightItems}
            renderItem={(item, isActive) => (
              <div className="relative">
                {/* Sticker price tag near image */}
                <div
                  className="absolute -top-2 -left-2 sm:top-2 sm:left-2 z-10 sticker-badge bg-gold-2 text-ink"
                  style={{ "--sticker-rotate": "-6deg" }}
                >
                  Starting at {item.price}
                </div>

                <div className={`relative rounded-xl overflow-hidden transition-all duration-500 ${
                  isActive ? "shadow-hard-lg" : ""
                }`}>
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full aspect-[4/5] object-cover"
                  />
                  {/* Radial spotlight glow behind active image */}
                  {isActive && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(217,172,71,0.08) 0%, transparent 70%)",
                      }}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>
            )}
            className="mb-8"
          />

          {/* Product details below carousel */}
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-cream/75 text-xs sm:text-base leading-relaxed font-light mb-6">
              Our bestseller — a deeply moisturizing blend that restores softness
              and shine while strengthening hair from root to tip. Loved
              unconditionally by everyone who tries it.
            </p>

            <div className="flex gap-8 sm:gap-10 justify-center mb-6">
              <div>
                <strong className="block font-display text-2xl sm:text-3xl text-gold-3">200ml</strong>
                <span className="text-[10px] sm:text-[11px] tracking-wide uppercase text-cream/50">Bottle Size</span>
              </div>
              <div>
                <strong className="block font-display text-2xl sm:text-3xl text-gold-3">Rs.600</strong>
                <span className="text-[10px] sm:text-[11px] tracking-wide uppercase text-cream/50">Price</span>
              </div>
            </div>

            <Link to="/shop" className="btn-brutalist-gold inline-block">Shop This Product</Link>
          </div>
        </div>
      </section>

      {/* Wavy vine divider: signature (ink) → featured (ivory/cream) */}
      <WavyVineDivider from="ink" to="ivory" />

      {/* ============ FEATURED / QUICK-ADD ============ */}
      <section className="py-14 sm:py-24 bg-ivory">
        <div className="container-content px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
            <span className="eyebrow mb-2 sm:mb-3">Featured</span>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl">Shop The Collection</h2>
          </div>

          {loadingProducts ? (
            <ProductGridSkeleton
              count={3}
              className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-7"
            />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} onAdd={handleQuickAdd} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Wavy vine divider: featured → ingredients (moss) */}
      <WavyVineDivider from="ivory" to="moss" />

      {/* ============ INGREDIENTS BAND ============ */}
      <section className="bg-moss text-ivory py-14 sm:py-20 relative overflow-hidden">
        <SectionBotanicals variant="dark" />
        <div className="container-content grid lg:grid-cols-2 gap-8 lg:gap-12 items-center px-4 sm:px-6 relative z-10">
          <div ref={ingredientsRef} className="reveal">
            <span className="block text-[11px] sm:text-[12px] tracking-widest2 uppercase text-gold-3 font-semibold mb-3">
              Straight From Nature
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-ivory mb-4">
              Every Ingredient, Intentional
            </h2>
            <p className="text-cream/85 max-w-lg text-xs sm:text-base leading-relaxed">
              Rice bran, sesame, almond, walnut, olive, jojoba, henna, argan
              and more — a considered blend of oils and botanical extracts,
              with nothing artificial hiding inside.
            </p>
            <div className="flex flex-wrap gap-2 mt-5 sm:mt-7">
              {["Rice Bran Oil", "Sweet Almond", "Coconut Oil", "Walnut Oil", "Olive Oil", "Jojoba Oil", "Henna Extract", "Argan Oil"].map((tag) => (
                <span
                  key={tag}
                  className="border-[1.5px] border-ivory/40 px-3 py-1.5 rounded-full text-[11px] sm:text-[12.5px] font-medium
                             bg-ivory/5 hover:bg-ivory/15 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border-[1.5px] border-ivory/20 shadow-hard">
            <img src={ingredientsImg} alt="Well's Merry ingredients label" className="w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Wavy vine divider: ingredients (moss) → testimonials (ink-black band) */}
      <WavyVineDivider from="moss" to="ink" />

      {/* ============ TESTIMONIALS — Dark full-bleed band with scroll-snap row ============ */}
      <section className="bg-ink py-14 sm:py-24 relative overflow-hidden">
        <div className="container-content px-4 sm:px-6 relative z-10">
          <div ref={testimonialsRef} className="reveal text-center max-w-xl mx-auto mb-10 sm:mb-14">
            <span className="eyebrow mb-2 sm:mb-3 text-gold-3">Customer Love</span>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-ivory">What They're Saying</h2>
          </div>

          {/* Horizontal scroll-snap row */}
          <div className="scroll-snap-x flex gap-5 sm:gap-7 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="scroll-snap-item shrink-0 w-[85vw] sm:w-[350px] lg:w-[380px]
                           bg-cream border-[1.5px] border-ink rounded-xl shadow-hard p-6 sm:p-8
                           flex flex-col"
              >
                {/* Star rating at top */}
                <div className="flex gap-1 text-gold-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <HiOutlineStar key={i} className={`w-5 h-5 ${i < t.rating ? "fill-gold-1" : "opacity-30"}`} />
                  ))}
                </div>
                {/* Quote */}
                <p className="font-display italic text-[14px] sm:text-[16px] text-ink/85 mb-5 leading-relaxed flex-1">
                  "{t.text}"
                </p>
                {/* Reviewer name at bottom */}
                <p className="text-[11.5px] sm:text-[12.5px] tracking-wide uppercase text-ink/45 font-semibold border-t border-ink/10 pt-3">
                  {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FULL-BLEED GOLD COLOR-BLOCK — "Why Organic" callout ============ */}
      <section className="bg-gold-2 text-ink relative overflow-hidden">
        <div className="container-content py-16 sm:py-24 px-4 sm:px-6 text-center relative z-10">
          {/* Decorative wax-seal/apothecary emblem */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full border-[2px] border-ink/30 flex items-center justify-center shadow-hard-sm bg-ivory/20">
            <span className="font-display text-2xl sm:text-3xl text-ink/80">✦</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-7xl font-bold uppercase tracking-tight mb-2">
            Why Go Organic?
          </h2>
          <p className="font-display italic text-lg sm:text-2xl lg:text-3xl text-ink/70 mb-6">
            Your hair deserves nature's best.
          </p>
          <p className="text-ink/70 max-w-lg mx-auto text-xs sm:text-base leading-relaxed mb-8">
            No sulfates. No parabens. No synthetic fragrances. Just pure botanical
            goodness that your scalp and strands will thank you for — today and decades from now.
          </p>

          {/* Sticker badge row */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <span className="sticker-badge bg-ivory text-ink" style={{ "--sticker-rotate": "-3deg" }}>
              100% Natural
            </span>
            <span className="sticker-badge bg-moss text-ivory" style={{ "--sticker-rotate": "2deg" }}>
              Sulfate Free
            </span>
            <span className="sticker-badge bg-ink text-gold-3" style={{ "--sticker-rotate": "-4deg" }}>
              Family Safe
            </span>
            <span className="sticker-badge bg-espresso text-gold-3" style={{ "--sticker-rotate": "5deg" }}>
              No Fillers
            </span>
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
          <h2 className="font-display text-3xl sm:text-5xl lg:text-7xl text-ivory max-w-2xl mx-auto leading-tight font-bold">
            More Products, Coming Soon
          </h2>
          <p className="font-display italic text-lg sm:text-2xl text-gold-3/70 mt-2 mb-4">
            To The Well's Merry Family
          </p>
          <p className="mt-2 text-cream/70 max-w-lg mx-auto text-xs sm:text-base">
            We're just getting started. Stay close for new organic skin and
            body care launches.
          </p>
          <Link to="/shop" className="btn-brutalist-gold mt-8 inline-block">Explore The Shop</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
