import { Link } from "react-router-dom";
import { HiOutlineMinus, HiOutlinePlus, HiOutlineTrash, HiOutlineShoppingBag } from "react-icons/hi2";
import { useCart } from "../context/CartContext.jsx";

const Cart = () => {
  const { items, setQty, removeItem, subtotal, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-content py-24 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-cream-dim flex items-center justify-center text-ink/30">
          <HiOutlineShoppingBag className="w-7 h-7" />
        </div>
        <h1 className="font-display text-3xl mb-3">Your Cart is Empty</h1>
        <p className="text-ink/55 mb-8 max-w-sm mx-auto">
          Looks like you haven't added anything yet. Explore our organic hair
          care collection to get started.
        </p>
        <Link to="/shop" className="btn btn-dark">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-content py-10 sm:py-16">
      <h1 className="font-display text-3xl sm:text-4xl mb-2">Your Cart</h1>
      <p className="text-ink/50 text-sm mb-10">{itemCount} item{itemCount !== 1 ? "s" : ""} in your cart</p>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-16 items-start">
        {/* Cart lines */}
        <div className="border-t border-cream-dim">
          {items.map((item) => (
            <div
              key={item.productId}
              className="grid grid-cols-[72px_1fr] sm:grid-cols-[90px_1fr_auto_auto] gap-4 sm:gap-6 items-center py-6 border-b border-cream-dim"
            >
              <Link to={`/products/${item.slug}`} className="w-[72px] h-[72px] sm:w-[90px] sm:h-[90px] rounded-sm overflow-hidden bg-cream shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </Link>

              <div className="min-w-0">
                <Link to={`/products/${item.slug}`} className="font-medium text-[15px] hover:text-gold-1 transition-colors line-clamp-2">
                  {item.name}
                </Link>
                <p className="text-[13px] text-ink/50 mt-1">{item.size} &middot; Rs.{item.price.toLocaleString()}</p>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="flex items-center gap-1.5 text-[12px] text-ink/40 hover:text-red-600 transition-colors mt-2 sm:hidden"
                >
                  <HiOutlineTrash className="w-3.5 h-3.5" /> Remove
                </button>
              </div>

              {/* Qty (wraps to its own row on mobile) */}
              <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-start gap-4 mt-3 sm:mt-0">
                <div className="flex items-center border border-ink/20 rounded-sm">
                  <button
                    onClick={() => setQty(item.productId, item.qty - 1)}
                    aria-label="Decrease quantity"
                    className="w-9 h-10 flex items-center justify-center"
                  >
                    <HiOutlineMinus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.qty}</span>
                  <button
                    onClick={() => setQty(item.productId, item.qty + 1)}
                    aria-label="Increase quantity"
                    className="w-9 h-10 flex items-center justify-center"
                  >
                    <HiOutlinePlus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="sm:hidden font-display text-[15px]">
                  Rs.{(item.price * item.qty).toLocaleString()}
                </span>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-3">
                <span className="font-display text-[16px]">Rs.{(item.price * item.qty).toLocaleString()}</span>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="flex items-center gap-1.5 text-[12px] text-ink/40 hover:text-red-600 transition-colors"
                >
                  <HiOutlineTrash className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}

          <Link to="/shop" className="inline-block mt-6 text-[13px] tracking-[0.06em] uppercase text-gold-1 hover:text-ink transition-colors">
            &larr; Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="bg-cream border border-cream-dim p-7 sm:p-8 sticky top-24">
          <h3 className="font-display text-xl mb-6">Order Summary</h3>

          <div className="flex justify-between text-[14.5px] text-ink/70 mb-3">
            <span>Subtotal</span>
            <span>Rs.{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[14.5px] text-ink/70 mb-5">
            <span>Shipping</span>
            <span className="text-moss">Free</span>
          </div>
          <div className="flex justify-between font-display text-lg border-t border-cream-dim pt-5 mb-7">
            <span>Total</span>
            <span>Rs.{subtotal.toLocaleString()}</span>
          </div>

          <Link to="/checkout" className="btn btn-dark w-full">
            Proceed to Checkout
          </Link>
          <p className="text-[12px] text-ink/45 text-center mt-4">
            Cash on Delivery &amp; WhatsApp orders available
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;