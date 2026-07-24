import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },   // snapshot at time of order
    image: { type: String, required: true },  // snapshot at time of order
    price: { type: Number, required: true },  // snapshot — protects order history if price changes later
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

const orderSchema = new mongoose.Schema(
  {
    // Guest checkout supported — user is optional
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isGuestOrder: {
      type: Boolean,
      default: false,
    },
    guestEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    orderItems: {
      type: [orderItemSchema],
      validate: [(arr) => arr.length > 0, "Order must have at least one item"],
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "whatsapp", "online"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      // "online" gateway isn't live yet — orders placed via cod/whatsapp
      // simply stay "pending" until payment is collected on delivery/manually.
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
    deliveredAt: { type: Date },
    notes: { type: String, trim: true }, // e.g. customer note or WhatsApp order reference
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;