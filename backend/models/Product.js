import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true }, // snapshot of reviewer name at time of review
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true, // e.g. "hair-care-oil" — used in the product page URL
    },
    category: {
      type: String,
      enum: ["hair-care", "skin-care", "body-care", "other"],
      default: "hair-care",
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
    },
    benefits: [{ type: String }], // e.g. "Grows New Hair", "Removes Frizz"
    ingredients: [{ type: String }],
    howToUse: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    compareAtPrice: {
      type: Number, // original/MRP price, for showing a discount strike-through
      default: null,
    },
    size: {
      type: String, // e.g. "200ml"
      required: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    images: [{ type: String, required: true }], // image URLs/paths
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true, // lets admin "soft hide" a product without deleting it
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

// Recalculate average rating whenever reviews change
productSchema.methods.recalculateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    this.numReviews = this.reviews.length;
    this.rating =
      this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length;
  }
};

const Product = mongoose.model("Product", productSchema);
export default Product;