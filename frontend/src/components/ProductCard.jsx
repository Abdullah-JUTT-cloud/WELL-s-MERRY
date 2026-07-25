import { Link } from "react-router-dom";

const ProductCard = ({ product, onAdd }) => {
  const outOfStock = !product.isFallback && product.stock === 0;
  const href = product.isFallback ? "/shop" : `/products/${product.slug}`;

  return (
    <div className="group border border-cream-dim bg-white flex flex-col hover:shadow-soft hover:-translate-y-1 transition-all duration-300">
      <Link to={href} className="aspect-square overflow-hidden bg-cream block relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {outOfStock && (
          <span className="absolute top-3 left-3 bg-ink text-gold-3 text-[10px] tracking-[0.1em] uppercase px-2.5 py-1.5 rounded-sm">
            Out of Stock
          </span>
        )}
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <span className="text-[11px] tracking-[0.12em] uppercase text-gold-1">
          {product.category?.replace("-", " ") || "Hair Care"}
        </span>
        <Link to={href}>
          <h3 className="font-display text-lg mt-2 mb-1 hover:text-gold-1 transition-colors">{product.name}</h3>
        </Link>
        <p className="text-sm text-ink/60 mb-5">
          {product.size} &middot; Rs.{product.price.toLocaleString()}
        </p>
        <button
          onClick={() => onAdd(product)}
          disabled={outOfStock}
          className="btn btn-dark mt-auto"
        >
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;