import { Link } from "react-router-dom";
import { HiOutlineShoppingBag } from "react-icons/hi2";

const ProductCard = ({ product, onAdd }) => {
  const outOfStock = !product.isFallback && product.stock === 0;
  const href = `/products/${product.slug}`;

  // Clean title formatting
  const formattedTitle = product.name.toLowerCase().includes("well")
    ? product.name.toUpperCase()
    : `WELL'S MERRY - ${product.name.toUpperCase()}`;

  return (
    <div className="group flex flex-col transition-all duration-300">
      {/* Product Image Container (Using object-contain with light padding to prevent image cropping) */}
      <Link
        to={href}
        className="aspect-square overflow-hidden bg-[#f8f7f5] block relative mb-4 rounded-xs border border-cream-dim/60 shadow-xs flex items-center justify-center p-2 sm:p-3"
      >
        <img
          src={product.images?.[0] || product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {outOfStock && (
          <span className="absolute top-3 left-3 bg-ink text-gold-3 text-[10px] tracking-[0.12em] uppercase px-3 py-1 font-semibold rounded-xs shadow-md">
            Out of Stock
          </span>
        )}
      </Link>

      {/* Product Details matching Dastan reference layout */}
      <div className="flex flex-col flex-1 px-1">
        {/* Title */}
        <Link to={href}>
          <h3 className="font-body text-[13.5px] sm:text-[14px] font-semibold text-ink uppercase tracking-[0.06em] leading-snug hover:text-gold-1 transition-colors mb-1.5 line-clamp-1">
            {formattedTitle}
          </h3>
        </Link>

        {/* Sale Price */}
        <p className="text-[13.5px] text-ink/80 font-medium mb-4">
          <span className="text-ink/60">Sale price</span>{" "}
          <span className="font-semibold text-ink">Rs. {product.price?.toLocaleString()}</span>
        </p>

        {/* Bottom Row: Size Badge + Quick Add Shopping Bag Icon */}
        <div className="flex items-center justify-between mt-auto pt-1">
          {/* Size Box */}
          <div className="border border-cream-dim bg-white px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-ink/75 rounded-xs">
            {product.size || "200ML"}
          </div>

          {/* Quick Add Shopping Bag Icon Button */}
          <button
            onClick={() => onAdd(product)}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
            className={`w-9 h-9 border rounded-xs flex items-center justify-center transition-all duration-300 ${
              outOfStock
                ? "border-cream-dim text-ink/30 cursor-not-allowed"
                : "border-cream-dim text-ink hover:bg-ink hover:text-ivory hover:border-ink shadow-xs"
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