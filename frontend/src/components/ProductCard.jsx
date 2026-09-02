import { Link } from "react-router-dom";
import { HiOutlinePlus } from "react-icons/hi2";

const ProductCard = ({ product, onAdd }) => {
  const outOfStock = !product.isFallback && product.stock === 0;
  const href = `/products/${product.slug}`;

  // Sanitize title display for test/seed items
  const displayName =
    product.name?.toLowerCase().includes("abdullah") || product.name?.toLowerCase().includes("test")
      ? "HAIR CARE OIL 200ML"
      : product.name.toUpperCase();

  const formattedTitle = displayName.startsWith("WELL")
    ? displayName
    : `WELL'S MERRY - ${displayName}`;

  // Sanitize size display
  const displaySize =
    !product.size || product.size === "8" ? "200ML" : product.size.toUpperCase();

  // Extract benefit tags from the product
  const benefitTags = product.benefits?.slice(0, 3) || [];

  return (
    <div className="group relative flex flex-col transition-all duration-300 bg-ivory border-[1.5px] border-ink rounded-xl shadow-hard hover:shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px]">
      {/* Price Tag — top-left sticker */}
      <div
        className="absolute top-3 left-3 z-10 sticker-badge bg-gold-2 text-ink"
        style={{ "--sticker-rotate": "-4deg" }}
      >
        Rs. {product.price?.toLocaleString()}
      </div>

      {/* Quick Add "+" Button — top-right circle */}
      <button
        onClick={() => onAdd(product)}
        disabled={outOfStock}
        aria-label={`Add ${product.name} to cart`}
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full
                    flex items-center justify-center
                    border-[1.5px] border-ink shadow-hard-sm
                    transition-all duration-200
                    ${outOfStock
                      ? "bg-cream-dim text-ink/30 cursor-not-allowed"
                      : "bg-ivory text-ink hover:bg-gold-2 hover:shadow-[2px_2px_0_#0e0c08] hover:translate-x-[1px] hover:translate-y-[1px]"
                    }`}
      >
        <HiOutlinePlus className="w-4 h-4" />
      </button>

      {/* Product Image Container */}
      <Link
        to={href}
        className="aspect-[4/5] overflow-hidden bg-[#fbf7ef] block relative rounded-t-[10px]"
      >
        <img
          src={product.images?.[0] || product.image}
          alt={product.name}
          className="w-full h-full object-contain object-center p-3 transition-opacity duration-300 group-hover:opacity-95"
        />

        {outOfStock && (
          <span
            className="absolute bottom-3 left-3 sticker-badge bg-ink text-gold-3"
            style={{ "--sticker-rotate": "-2deg" }}
          >
            Out of Stock
          </span>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-1 px-4 pb-4 pt-3">
        {/* Title */}
        <Link to={href}>
          <h3 className="font-body text-[12px] sm:text-[13px] font-bold text-ink uppercase tracking-[0.06em] leading-snug hover:text-gold-1 transition-colors mb-2 line-clamp-1">
            {formattedTitle}
          </h3>
        </Link>

        {/* Benefit Tags as small pills */}
        {benefitTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {benefitTags.map((tag) => (
              <span
                key={tag}
                className="inline-block text-[9px] sm:text-[10px] font-medium uppercase tracking-wide
                           px-2 py-0.5 rounded-full border border-ink/15 text-ink/60 bg-cream/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Size Selector as outlined toggle button */}
        <div className="mt-auto pt-1">
          <button
            className="border-[1.5px] border-ink/30 bg-transparent px-3 py-1.5 text-[10px] font-bold
                       tracking-[0.12em] uppercase text-ink/70 rounded-md
                       hover:border-ink hover:text-ink hover:bg-cream transition-all duration-200"
          >
            {displaySize}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
