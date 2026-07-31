import { useEffect, useState } from "react";
import logoImg from "../assets/upnav.jpg";

/**
 * SplashScreen — Branded full-screen loading state that displays on initial
 * page load/refresh while React initializes and assets download. Fades out
 * smoothly once the app is ready instead of disappearing abruptly.
 */
// Duration of the 0 → 100% progress bar fill. Also acts as the splash's
// minimum display time so the bar is never cut off mid-fill.
const PROGRESS_DURATION = 1250;

const SplashScreen = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  // Kick the bar from 0 to 100 on the frame after mount. Two nested rAFs
  // guarantee the browser paints the 0% state first, otherwise it collapses
  // both widths into a single style recalc and the transition never runs.
  useEffect(() => {
    let inner;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setProgress(100));
    });
    return () => {
      cancelAnimationFrame(outer);
      if (inner) cancelAnimationFrame(inner);
    };
  }, []);

  useEffect(() => {
    // Wait for DOM content + a minimum display time so users see the branding
    const minDisplayTime = PROGRESS_DURATION;
    const startTime = Date.now();

    const handleLoad = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDisplayTime - elapsed);

      setTimeout(() => {
        setFadeOut(true);
        // After fade animation completes, notify parent to unmount
        setTimeout(onComplete, 400);
      }, remaining);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-ink flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      role="progressbar"
      aria-live="polite"
      aria-label="Loading Well's Merry"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div className="flex flex-col items-center px-6">
        {/* The logo is a wide wordmark (675×370), not a square mark. Forcing it
            into a fixed square with `object-cover` cropped the sides and cut
            the wordmark off mid-word, so it's sized by width with `h-auto` and
            `object-contain` — the same treatment Header.jsx gives this asset. */}
        <img
          src={logoImg}
          alt="Well's Merry"
          className="w-56 sm:w-72 h-auto max-w-[80vw] object-contain"
        />

        {/* Determinate progress bar filling 0 → 100% over PROGRESS_DURATION.
            Sits below the wordmark with generous spacing so it reads as a
            separate loading affordance rather than part of the logo. */}
        <div className="mt-8 w-32 h-[3px] bg-gold-2/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold-2 rounded-full transition-[width] ease-linear"
            style={{
              width: `${progress}%`,
              transitionDuration: `${PROGRESS_DURATION}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
