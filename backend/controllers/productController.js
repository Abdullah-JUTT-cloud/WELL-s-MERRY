import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

// @desc    Get all active products (supports ?category= and ?featured=true)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const { category, featured } = req.query;

  const filter = { isActive: true };
  if (category) filter.category = category;
  if (featured === "true") filter.isFeatured = true;

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

// @desc    Get a single product by slug (used for the product detail page URL)
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    isActive: true,
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    category,
    shortDescription,
    description,
    benefits,
    ingredients,
    howToUse,
    price,
    compareAtPrice,
    size,
    sku,
    stock,
    images,
    isFeatured,
  } = req.body;

  if (!name || !slug || !description || !price || !size || !images?.length) {
    res.status(400);
    throw new Error("Missing required product fields");
  }

  const slugExists = await Product.findOne({ slug });
  if (slugExists) {
    res.status(400);
    throw new Error("A product with this slug already exists");
  }

  const product = await Product.create({
    name,
    slug,
    category,
    shortDescription,
    description,
    benefits,
    ingredients,
    howToUse,
    price,
    compareAtPrice,
    size,
    sku,
    stock,
    images,
    isFeatured,
  });

  res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  Object.assign(product, req.body);
  const updated = await product.save();

  res.json(updated);
});

// @desc    Soft-delete a product (isActive = false, keeps order history intact)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.isActive = false;
  await product.save();

  res.json({ message: "Product removed" });
});

// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Private (logged-in customers only — no guest reviews)
export const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating) {
    res.status(400);
    throw new Error("Rating is required");
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this product");
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });

  product.recalculateRating();
  await product.save();

  res.status(201).json({ message: "Review added" });
});