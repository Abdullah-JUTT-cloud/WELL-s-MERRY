import { Link } from "react-router-dom";
import { HiOutlineShoppingBag } from "react-icons/hi2";

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

  return (
    <div className="group flex flex-col transition-all duration-300">
      {/* Product Image Container */}
      <Link
        to={href}
        className="aspect-[4/5] overflow-hidden bg-[#fbf7ef] block relative mb-4 rounded-2xl border border-black/5 shadow-xs"
      >
        <img
          src={product.images?.[0] || product.image}
          alt={product.name}
          className="w-full h-full object-contain object-center p-2 transition-opacity duration-300 group-hover:opacity-95"
        />

        {outOfStock && (
          <span className="absolute top-3 left-3 bg-ink text-gold-3 text-[10px] tracking-[0.12em] uppercase px-3 py-1 font-semibold rounded-full shadow-md z-10">
            Out of Stock
          </span>
        )}
      </Link>

      {/* Product Details matching luxury reference layout */}
      <div className="flex flex-col flex-1 px-1">
        {/* Title */}
        <Link to={href}>
          <h3 className="font-body text-[13px] sm:text-[13.5px] font-bold text-ink uppercase tracking-[0.06em] leading-snug hover:text-gold-1 transition-colors mb-1 line-clamp-1">
            {formattedTitle}
          </h3>
        </Link>

        {/* Sale Price */}
        <p className="text-[13px] text-ink/80 font-medium mb-4">
          <span className="text-ink/50">Sale price</span>{" "}
          <span className="font-bold text-ink">Rs. {product.price?.toLocaleString()}</span>
        </p>

        {/* Bottom Row: Size Badge + Quick Add Shopping Bag Icon */}
        <div className="flex items-center justify-between mt-auto pt-1">
          {/* Size Box */}
          <div className="border border-black/15 bg-white px-3.5 py-1.5 text-[11px] font-bold tracking-[0.1em] uppercase text-ink/80 rounded-lg shadow-2xs">
            {displaySize}
          </div>

          {/* Quick Add Shopping Bag Icon Button */}
          <button
            onClick={() => onAdd(product)}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
            className={`w-9 h-9 border rounded-lg flex items-center justify-center transition-all duration-300 ${
              outOfStock
                ? "border-black/10 text-ink/30 cursor-not-allowed"
                : "border-black/20 text-ink hover:bg-black hover:text-white hover:border-black shadow-2xs"
            }`}
          >
            <HiOutlineShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
