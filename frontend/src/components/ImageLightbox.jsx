import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  HiOutlineXMark,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineMagnifyingGlassPlus,
  HiOutlineMagnifyingGlassMinus,
} from "react-icons/hi2";

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const STEP = 0.5;
// Scale applied when you simply click the photo, rather than using the
// +/- controls. 2x reads as "zoomed in" without losing your place.
const TAP_ZOOM_SCALE = 2;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Full-screen image viewer with zoom, pan and a thumbnail rail.
 *
 * Rendered through a portal on document.body: the product gallery sits inside
 * a `lg:sticky` column with its own stacking context, so a normal fixed child
 * would end up clipped behind the page instead of over it.
 *
 * Accessibility note: Escape closes, arrow keys move between images, and the
 * close button takes focus on open. Focus is not fully trapped inside the
 * dialog — tabbing enough times will walk into the page behind it.
 */
const ImageLightbox = ({ images = [], startIndex = 0, alt = "", onClose }) => {
  const [index, setIndex] = useState(startIndex);
  const [scale, setScale] = useState(MIN_SCALE);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const frameRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Drag bookkeeping lives in a ref so tracking the pointer doesn't trigger a
  // re-render on every mousemove.
  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  });

  const isZoomed = scale > MIN_SCALE;

  const resetView = useCallback(() => {
    setScale(MIN_SCALE);
    setOffset({ x: 0, y: 0 });
  }, []);

  // Keeps a panned image inside its frame. Without this you can drag the photo
  // completely out of view and be left looking at an empty backdrop.
  const clampOffset = useCallback((next, atScale) => {
    const frame = frameRef.current;
    if (!frame) return next;
    const { width, height } = frame.getBoundingClientRect();
    const maxX = ((atScale - 1) * width) / 2;
    const maxY = ((atScale - 1) * height) / 2;
    return {
      x: clamp(next.x, -maxX, maxX),
      y: clamp(next.y, -maxY, maxY),
    };
  }, []);

  const zoomTo = useCallback(
    (nextScale) => {
      const target = clamp(nextScale, MIN_SCALE, MAX_SCALE);
      setScale(target);
      setOffset((current) =>
        target === MIN_SCALE ? { x: 0, y: 0 } : clampOffset(current, target)
      );
    },
    [clampOffset]
  );

  const goTo = useCallback(
    (nextIndex) => {
      if (images.length === 0) return;
      setIndex(((nextIndex % images.length) + images.length) % images.length);
      resetView();
    },
    [images.length, resetView]
  );

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") goTo(index + 1);
      else if (e.key === "ArrowLeft") goTo(index - 1);
      else if (e.key === "+" || e.key === "=") zoomTo(scale + STEP);
      else if (e.key === "-") zoomTo(scale - STEP);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, scale, goTo, zoomTo, onClose]);

  // Stop the page behind the overlay from scrolling, and restore whatever
  // overflow value was there before rather than assuming it was "".
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Wheel-to-zoom needs a non-passive listener to be allowed to call
  // preventDefault, which React's synthetic onWheel can't guarantee.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const onWheel = (e) => {
      e.preventDefault();
      zoomTo(scale + (e.deltaY < 0 ? STEP : -STEP));
    };
    frame.addEventListener("wheel", onWheel, { passive: false });
    return () => frame.removeEventListener("wheel", onWheel);
  }, [scale, zoomTo]);

  const handlePointerDown = (e) => {
    if (!isZoomed) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
      moved: false,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    // A couple of pixels of jitter shouldn't count as a drag, otherwise a
    // slightly shaky click would never toggle the zoom.
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.current.moved = true;
    setOffset(
      clampOffset({ x: drag.current.originX + dx, y: drag.current.originY + dy }, scale)
    );
  };

  const handlePointerUp = (e) => {
    const wasDragging = drag.current.moved;
    drag.current.active = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    // Click (not drag) toggles zoom in and back out again.
    if (!wasDragging) zoomTo(isZoomed ? MIN_SCALE : TAP_ZOOM_SCALE);
  };

  if (images.length === 0) return null;

  const hasMultiple = images.length > 1;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt ? `${alt} — enlarged view` : "Enlarged image view"}
      className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-sm flex flex-col select-none"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 shrink-0">
        <span className="text-ivory/70 text-[12px] tracking-[0.14em] uppercase font-semibold">
          {index + 1} / {images.length}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => zoomTo(scale - STEP)}
            disabled={scale <= MIN_SCALE}
            aria-label="Zoom out"
            className="w-9 h-9 rounded-full border border-ivory/25 text-ivory flex items-center justify-center
                       hover:bg-ivory hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent
                       disabled:hover:text-ivory transition-colors"
          >
            <HiOutlineMagnifyingGlassMinus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => zoomTo(scale + STEP)}
            disabled={scale >= MAX_SCALE}
            aria-label="Zoom in"
            className="w-9 h-9 rounded-full border border-ivory/25 text-ivory flex items-center justify-center
                       hover:bg-ivory hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent
                       disabled:hover:text-ivory transition-colors"
          >
            <HiOutlineMagnifyingGlassPlus className="w-4 h-4" />
          </button>
          <button
            type="button"
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close enlarged view"
            className="w-9 h-9 rounded-full border border-ivory/25 text-ivory flex items-center justify-center
                       hover:bg-ivory hover:text-ink transition-colors"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stage */}
      <div className="relative flex-1 min-h-0 flex items-center">
        {/* Clicking the empty area around the photo closes, matching the
            usual lightbox behaviour. The image itself stops propagation. */}
        <div
          ref={frameRef}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="relative flex-1 h-full overflow-hidden flex items-center justify-center px-4 sm:px-16"
        >
          <img
            src={images[index]}
            alt={alt}
            draggable="false"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              drag.current.active = false;
            }}
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              // Skip the animation while dragging, or the image lags the cursor.
              transition: drag.current.active ? "none" : "transform 200ms ease-out",
              cursor: isZoomed ? "grab" : "zoom-in",
              touchAction: "none",
            }}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous image"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                         bg-ink/60 border border-ivory/20 text-ivory flex items-center justify-center
                         hover:bg-ivory hover:text-ink transition-colors"
            >
              <HiOutlineChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next image"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                         bg-ink/60 border border-ivory/20 text-ivory flex items-center justify-center
                         hover:bg-ivory hover:text-ink transition-colors"
            >
              <HiOutlineChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail rail */}
      {hasMultiple && (
        <div className="shrink-0 px-4 py-4 flex justify-center gap-2.5 overflow-x-auto no-scrollbar">
          {images.map((image, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === index}
              className={`w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-white p-1 border-2 transition-all ${
                i === index
                  ? "border-gold-2 opacity-100"
                  : "border-transparent opacity-50 hover:opacity-90"
              }`}
            >
              <img src={image} alt="" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}

      <p className="shrink-0 text-center text-ivory/40 text-[11px] tracking-[0.1em] uppercase pb-3">
        {isZoomed ? "Drag to move · Click to zoom out" : "Click image to zoom"}
      </p>
    </div>,
    document.body
  );
};

export default ImageLightbox;
