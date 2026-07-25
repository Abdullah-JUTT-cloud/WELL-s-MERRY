import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String },
  },
  { _id: false }
);

// A line-item style charge, e.g. { label: "COD Handling Fee", amount: 50 }.
// Kept as an array rather than fixed fields so the invoice can show an
// arbitrary number of named charges (packaging, rush delivery, etc.)
// without another schema migration later.
const extraChargeSchema = new mongoose.Schema(
  { label: { type: String, required: true }, amount: { type: Number, required: true, min: 0 } },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    isGuestOrder: { type: Boolean, default: false },
    guestEmail: { type: String, trim: true, lowercase: true },
    orderItems: {
      type: [orderItemSchema],
      validate: [(arr) => arr.length > 0, "Order must have at least one item"],
    },
    shippingAddress: { type: shippingAddressSchema, required: true },
    paymentMethod: { type: String, enum: ["cod", "whatsapp", "online"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },

    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true, default: 0 },

    // New: discount and extra charges, both admin-adjustable after an
    // order is placed (e.g. applying a promo, or adding a handling fee).
    // Neither is set by the customer at checkout — that flow still only
    // sends itemsPrice/shippingPrice, exactly as before. See
    // orderController.adjustOrderCharges for how these get set.
    discount: { type: Number, default: 0, min: 0 },
    extraCharges: { type: [extraChargeSchema], default: [] },

    totalPrice: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
    deliveredAt: { type: Date },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

// Single source of truth for how a total is derived from its parts —
// used both when an admin adjusts discount/extraCharges (recompute) and
// available to the PDF generator so the invoice's math always matches
// exactly what's stored, never a separately-calculated duplicate.
orderSchema.methods.recalculateTotal = function () {
  const extraTotal = this.extraCharges.reduce((sum, c) => sum + c.amount, 0);
  this.totalPrice = Math.max(0, this.itemsPrice + this.shippingPrice + extraTotal - this.discount);
  return this.totalPrice;
};

const Order = mongoose.model("Order", orderSchema);
export default Order;