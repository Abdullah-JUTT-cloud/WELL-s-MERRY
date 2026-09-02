/**
 * Skeleton loading primitives + per-page layouts.
 *
 * Two rules this file exists to enforce:
 *
 *   1. One shimmer, everywhere. The visual treatment lives in a single
 *      `.skeleton` class in index.css. Nothing here (and nothing in a page)
 *      should hand-roll its own `animate-pulse bg-cream` block, which is how
 *      Shop, Home, Orders and Outlets ended up with four slightly different
 *      loading looks.
 *
 *   2. The skeleton mirrors the real content. A skeleton that doesn't match
 *      the layout it's standing in for causes a visible jump when data lands.
 *      Each layout below is built from the same grid/spacing classes as the
 *      component it replaces, so the swap is close to invisible.
 *
 * Pages import the named layout they need (ProductGridSkeleton, OrderListSkeleton…)
 * rather than composing boxes inline.
 */

/**
 * The atom. Everything else is composed from this.
 *
 * `className` carries the size/shape (Tailwind), `.skeleton` carries the
 * shimmer. Marked aria-hidden because the *container* announces the loading
 * state — otherwise a screen reader would read out a dozen empty boxes.
 */
export const SkeletonBox = ({ className = "", dark = false }) => (
  <div
    aria-hidden="true"
    className={`skeleton ${dark ? "skeleton-dark" : ""} ${className}`}
  />
);

/**
 * Text line placeholder. Defaults to a realistic body-copy height so callers
 * usually only need to pass a width.
 */
export const SkeletonText = ({ className = "h-3 w-full", dark = false }) => (
  <SkeletonBox className={className} dark={dark} />
);

/**
 * Wrapper that carries the accessibility semantics for a loading region.
 *
 * `aria-busy` + a visually hidden label means assistive tech announces
 * "Loading products" once, instead of the user hearing nothing at all while
 * the screen is full of placeholder boxes.
 */
export const SkeletonRegion = ({ label = "Loading", children, className = "" }) => (
  <div role="status" aria-busy="true" className={className}>
    <span className="sr-only">{label}</span>
    {children}
  </div>
);

/* ------------------------------------------------------------------ *
 * Page-level layouts
 * ------------------------------------------------------------------ */

/**
 * Shop / Home product grid.
 *
 * Mirrors ProductCard: 4:5 image, title line, price line. `count` and the
 * grid classes are props because Home shows a 3-up featured row while Shop
 * shows a full 4-up catalogue grid.
 */
export const ProductGridSkeleton = ({
  count = 8,
  className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-7 gap-y-8 sm:gap-y-12",
}) => (
  <SkeletonRegion label="Loading products" className={className}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="space-y-3">
        <SkeletonBox className="aspect-[4/5] w-full rounded-2xl" />
        <SkeletonText className="h-3.5 w-3/4" />
        <SkeletonText className="h-3 w-1/2" />
      </div>
    ))}
  </SkeletonRegion>
);

/**
 * Merry product grid — the loading twin of MagneticProductCard.
 *
 * Same shell as the real card (4px forest border, 4:5 image stage, name +
 * price footer) so the homepage lineup and /shop don't jump when the live
 * inventory lands. Boxier than the legacy grid above on purpose: the merry
 * design system has no rounded corners.
 */
export const MerryProductGridSkeleton = ({
  count = 8,
  className = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8",
}) => (
  <SkeletonRegion label="Loading products" className={className}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="flex flex-col border-4 border-merry-forest bg-merry-cream"
      >
        <SkeletonBox className="aspect-[4/5] w-full border-b-4 border-merry-forest" />
        <div className="space-y-2 p-5">
          <SkeletonBox className="h-4 w-2/3" />
          <SkeletonBox className="h-3 w-1/3" />
        </div>
      </div>
    ))}
  </SkeletonRegion>
);

/**
 * ProductDetail — gallery on the left, buying panel on the right.
 * Matches the `lg:grid-cols-2` split of the real page.
 */
export const ProductDetailSkeleton = () => (
  <SkeletonRegion
    label="Loading product"
    className="grid lg:grid-cols-2 gap-8 lg:gap-12"
  >
    <div className="space-y-4">
      <SkeletonBox className="aspect-square w-full rounded-3xl" />
      {/* Thumbnail strip */}
      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBox key={i} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl" />
        ))}
      </div>
    </div>

    <div className="space-y-4 pt-2">
      <SkeletonText className="h-3 w-28" />       {/* eyebrow / category */}
      <SkeletonText className="h-9 w-3/4" />      {/* product title */}
      <SkeletonText className="h-4 w-40" />       {/* star rating */}
      <SkeletonText className="h-7 w-32" />       {/* price */}

      <div className="space-y-2 pt-2">
        <SkeletonText className="h-3 w-full" />
        <SkeletonText className="h-3 w-full" />
        <SkeletonText className="h-3 w-2/3" />
      </div>

      {/* Quantity stepper + add to cart */}
      <div className="flex gap-3 pt-4">
        <SkeletonBox className="h-12 w-32 rounded-sm" />
        <SkeletonBox className="h-12 flex-1 rounded-sm" />
      </div>
      <SkeletonBox className="h-12 w-full rounded-sm" />

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3 pt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBox key={i} className="h-14 rounded-sm" />
        ))}
      </div>
    </div>
  </SkeletonRegion>
);

/**
 * Orders list. Each row matches the collapsed OrderCard header — order ref
 * and date on the left, status pill and total on the right.
 */
export const OrderListSkeleton = ({ count = 3 }) => (
  <SkeletonRegion label="Loading your orders" className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="border border-cream-dim bg-white rounded-sm p-5 sm:p-6
                   flex flex-wrap items-center justify-between gap-3"
      >
        <div className="space-y-2">
          <SkeletonText className="h-3 w-32" />
          <SkeletonText className="h-3.5 w-44" />
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <SkeletonBox className="h-7 w-24 rounded-full" />
          <SkeletonText className="h-4 w-20" />
          <SkeletonBox className="h-4 w-4 rounded-full" />
        </div>
      </div>
    ))}
  </SkeletonRegion>
);

/**
 * Single order summary — used by OrderConfirmation, which previously showed a
 * bare spinner. Shaped like the confirmation panel: icon, headline, then the
 * line items and totals.
 */
export const OrderSummarySkeleton = () => (
  <SkeletonRegion label="Loading order" className="max-w-2xl mx-auto">
    <div className="flex flex-col items-center gap-4 mb-10">
      <SkeletonBox className="w-16 h-16 rounded-full" />
      <SkeletonText className="h-3 w-32" />
      <SkeletonText className="h-8 w-64" />
      <SkeletonText className="h-3 w-48" />
    </div>

    <div className="border border-cream-dim bg-white rounded-sm p-6 space-y-5">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <SkeletonBox className="w-14 h-14 rounded-sm shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonText className="h-3.5 w-2/3" />
            <SkeletonText className="h-3 w-1/3" />
          </div>
          <SkeletonText className="h-3.5 w-16" />
        </div>
      ))}

      <div className="pt-4 border-t border-cream-dim space-y-2.5">
        <div className="flex justify-between">
          <SkeletonText className="h-3 w-20" />
          <SkeletonText className="h-3 w-16" />
        </div>
        <div className="flex justify-between">
          <SkeletonText className="h-3 w-24" />
          <SkeletonText className="h-3 w-14" />
        </div>
        <div className="flex justify-between pt-2">
          <SkeletonText className="h-4 w-16" />
          <SkeletonText className="h-4 w-24" />
        </div>
      </div>
    </div>
  </SkeletonRegion>
);

/**
 * Cart lines. The cart itself reads from localStorage and renders instantly,
 * so this is for the brief window where CartDrawer/Cart is reconciling stock
 * and pricing against the API.
 */
export const CartSkeleton = ({ count = 3 }) => (
  <SkeletonRegion label="Loading your cart" className="space-y-0">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr_140px_120px]
                   gap-4 sm:gap-6 items-start py-6 border-b border-cream-dim"
      >
        <SkeletonBox className="w-20 h-20 sm:w-[100px] sm:h-[100px] rounded-sm" />
        <div className="space-y-2.5">
          <SkeletonText className="h-4 w-3/4" />
          <SkeletonText className="h-3 w-24" />
          <SkeletonText className="h-3 w-32" />
        </div>
        <div className="col-span-2 sm:col-span-1 flex sm:justify-center mt-1 sm:mt-0">
          <SkeletonBox className="h-10 w-28 rounded-sm" />
        </div>
        <div className="hidden sm:flex flex-col items-end gap-2">
          <SkeletonText className="h-4 w-20" />
          <SkeletonText className="h-3 w-16" />
        </div>
      </div>
    ))}
  </SkeletonRegion>
);

/**
 * Outlets grid — bordered cards with an icon, name and a few detail lines.
 */
export const OutletGridSkeleton = ({ count = 6 }) => (
  <SkeletonRegion
    label="Loading outlets"
    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
  >
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="border border-cream-dim bg-white p-7 space-y-3">
        <SkeletonBox className="w-10 h-10 rounded-full" />
        <SkeletonText className="h-5 w-2/3" />
        <SkeletonText className="h-3 w-full" />
        <SkeletonText className="h-3 w-1/2" />
        <SkeletonText className="h-3 w-2/5" />
      </div>
    ))}
  </SkeletonRegion>
);

/* ------------------------------------------------------------------ *
 * Admin layouts
 *
 * The admin panel uses a plain gray/white utility look rather than the
 * storefront's cream palette, so these use neutral borders — but they share
 * the same `.skeleton` shimmer so the whole product still feels like one app.
 * ------------------------------------------------------------------ */

/**
 * Generic admin table. `columns`/`rows` keep it usable for both the orders
 * table (8 columns) and the products table.
 */
export const AdminTableSkeleton = ({ columns = 8, rows = 6 }) => (
  <SkeletonRegion label="Loading data" className="w-full">
    {/* Header row */}
    <div
      className="grid gap-3 px-3 py-2 bg-gray-100 rounded-t"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonText key={i} className="h-3 w-full" />
      ))}
    </div>

    {Array.from({ length: rows }).map((_, r) => (
      <div
        key={r}
        className="grid gap-3 px-3 py-3.5 border-t border-gray-200"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns }).map((_, c) => (
          <SkeletonText key={c} className="h-3 w-full" />
        ))}
      </div>
    ))}
  </SkeletonRegion>
);

/**
 * Admin dashboard — four stat cards over two large action tiles.
 */
export const AdminStatsSkeleton = () => (
  <SkeletonRegion label="Loading dashboard">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border rounded-xl p-4 bg-white space-y-2.5">
          <SkeletonText className="h-3 w-20" />
          <SkeletonText className="h-7 w-16" />
        </div>
      ))}
    </div>
    <div className="grid sm:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border rounded-xl p-6 flex items-center gap-4"
        >
          <SkeletonBox className="w-10 h-10 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonText className="h-4 w-32" />
            <SkeletonText className="h-3 w-44" />
          </div>
        </div>
      ))}
    </div>
  </SkeletonRegion>
);

/**
 * Admin order detail — the printable order sheet.
 */
export const AdminOrderDetailSkeleton = () => (
  <SkeletonRegion
    label="Loading order"
    className="bg-white p-8 max-w-2xl mx-auto space-y-6"
  >
    <div className="flex items-start justify-between border-b pb-4">
      <div className="flex items-center gap-3">
        <SkeletonBox className="h-16 w-16 rounded-lg" />
        <div className="space-y-2">
          <SkeletonText className="h-5 w-36" />
          <SkeletonText className="h-3 w-28" />
        </div>
      </div>
      <div className="space-y-2 flex flex-col items-end">
        <SkeletonText className="h-6 w-40" />
        <SkeletonText className="h-3 w-28" />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="bg-gray-50 rounded-lg p-4 space-y-2.5">
          <SkeletonText className="h-3 w-20" />
          <SkeletonText className="h-4 w-3/4" />
          <SkeletonText className="h-3 w-2/3" />
          <SkeletonText className="h-3 w-1/2" />
        </div>
      ))}
    </div>

    <AdminTableSkeleton columns={4} rows={3} />
  </SkeletonRegion>
);

export default SkeletonBox;
