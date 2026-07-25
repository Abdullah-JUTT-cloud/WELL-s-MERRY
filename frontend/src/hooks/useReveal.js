import { useEffect, useRef } from "react";

// Pairs with the `.reveal` / `.is-visible` classes defined in index.css.
// Returns a ref to attach to any element you want to fade/slide in once
// it enters the viewport. Pure IntersectionObserver, no animation library —
// keeps bundle size down since this is used on nearly every section.
export const useReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el); // animate in once, don't re-trigger on scroll-back
        }
      },
      { threshold: 0.15, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return ref;
};