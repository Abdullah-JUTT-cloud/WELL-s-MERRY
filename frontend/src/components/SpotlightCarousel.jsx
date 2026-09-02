import { useState, useRef, useEffect } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

/**
 * SpotlightCarousel — Featured product carousel where the centered/active
 * item is at full brightness with a soft radial spotlight/vignette behind it,
 * and adjacent items are dimmed, scaled down, and pushed to the sides.
 * Arrow navigation on either side.
 *
 * Works with even a single product (spotlights it dramatically instead of
 * a plain static image), and will naturally support multiple products as
 * the catalog grows.
 */
const SpotlightCarousel = ({ items = [], renderItem, className = "" }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);
  const isSingle = items.length <= 1;

  const goPrev = () =>
    setActiveIndex((i) => (i - 1 + items.length) % items.length);
  const goNext = () =>
    setActiveIndex((i) => (i + 1) % items.length);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [items.length]);

  if (!items.length) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Carousel Track */}
      <div
        ref={trackRef}
        className="flex items-center justify-center gap-4 sm:gap-8 overflow-hidden px-4"
        role="region"
        aria-label="Product spotlight carousel"
        aria-roledescription="carousel"
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const offset = index - activeIndex;

          return (
            <div
              key={item.id || index}
              className={`shrink-0 transition-all duration-500 ease-out ${
                isActive
                  ? "scale-100 opacity-100 z-20"
                  : "scale-75 opacity-40 z-10"
              }`}
              style={{
                width: isActive ? "min(400px, 70vw)" : "min(200px, 30vw)",
                transform: `translateX(${offset * (isActive ? 0 : 20)}px)`,
                display: isSingle ? "flex" : undefined,
                justifyContent: isSingle ? "center" : undefined,
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${items.length}`}
            >
              {/* Spotlight glow behind active item */}
              {isActive && (
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute inset-0 spotlight-vignette rounded-xl"
                    aria-hidden="true"
                  />
                </div>
              )}
              {renderItem(item, isActive)}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {!isSingle && (
        <>
          <button
            onClick={goPrev}
            aria-label="Previous product"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30
                       w-10 h-10 sm:w-12 sm:h-12 rounded-full
                       bg-ivory/90 border-[1.5px] border-ink shadow-hard-sm
                       flex items-center justify-center
                       hover:bg-ivory hover:shadow-[2px_2px_0_#0e0c08] hover:translate-x-[1px] hover:translate-y-[1px]
                       transition-all duration-200"
          >
            <HiOutlineChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-ink" />
          </button>
          <button
            onClick={goNext}
            aria-label="Next product"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30
                       w-10 h-10 sm:w-12 sm:h-12 rounded-full
                       bg-ivory/90 border-[1.5px] border-ink shadow-hard-sm
                       flex items-center justify-center
                       hover:bg-ivory hover:shadow-[2px_2px_0_#0e0c08] hover:translate-x-[1px] hover:translate-y-[1px]
                       transition-all duration-200"
          >
            <HiOutlineChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-ink" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {!isSingle && (
        <div className="flex justify-center gap-2 mt-6">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`transition-all duration-300 rounded-full border border-ink/30 ${
                index === activeIndex
                  ? "w-6 h-2.5 bg-gold-2"
                  : "w-2.5 h-2.5 bg-cream hover:bg-gold-3"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SpotlightCarousel;
