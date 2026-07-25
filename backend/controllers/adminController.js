import asyncHandler from "express-async-handler";
import {
  generateAdminAccessToken,
  generateAdminRefreshToken,
  setAdminRefreshTokenCookie,
} from "../utils/adminTokens.js";
import jwt from "jsonwebtoken";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// @desc  Admin login with fixed .env credentials
// @route POST /api/admin/login
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    res.status(401);
    throw new Error("Invalid admin credentials");
  }
  const accessToken = generateAdminAccessToken();
  const refreshToken = generateAdminRefreshToken();
  setAdminRefreshTokenCookie(res, refreshToken);
  res.json({ accessToken });
});

// @desc  Refresh admin access token via cookie
// @route POST /api/admin/refresh
export const adminRefresh = asyncHandler(async (req, res) => {
  const token = req.cookies.adminRefreshToken;
  if (!token) {
    res.status(401);
    throw new Error("No refresh token");
  }
  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_REFRESH_SECRET);
    if (decoded.type !== "admin") throw new Error();
  } catch {
    res.status(401);
    throw new Error("Invalid refresh token");
  }
  const accessToken = generateAdminAccessToken();
  res.json({ accessToken });
});

// @desc  Admin logout
// @route POST /api/admin/logout
export const adminLogout = (req, res) => {
  res.clearCookie("adminRefreshToken", { httpOnly: true, sameSite: "strict" });
  res.json({ message: "Logged out" });
};

// ── Products ──────────────────────────────────────────────────────────────────

// @desc  Get ALL products (including inactive) for admin
// @route GET /api/admin/products
export const adminGetProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json(products);
});

// @desc  Create product
// @route POST /api/admin/products
export const adminCreateProduct = asyncHandler(async (req, res) => {
  const {
    name, slug, category, shortDescription, description,
    benefits, ingredients, howToUse, price, compareAtPrice,
    size, sku, stock, images, isFeatured,
  } = req.body;

  if (!name || !slug || !description || !price || !size || !images?.length) {
    res.status(400);
    throw new Error("Missing required product fields");
  }
  if (await Product.findOne({ slug })) {
    res.status(400);
    throw new Error("Slug already exists");
  }
  const product = await Product.create({
    name, slug, category, shortDescription, description,
    benefits, ingredients, howToUse, price, compareAtPrice,
    size, sku, stock, images, isFeatured,
  });
  res.status(201).json(product);
});

// @desc  Update product
// @route PUT /api/admin/products/:id
export const adminUpdateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }

  const allowed = [
    "name","slug","category","shortDescription","description",
    "benefits","ingredients","howToUse","price","compareAtPrice",
    "size","sku","stock","images","isFeatured","isActive",
  ];
  for (const key of allowed) {
    if (req.body[key] !== undefined) product[key] = req.body[key];
  }
  res.json(await product.save());
});

// @desc  Delete (soft) product
// @route DELETE /api/admin/products/:id
export const adminDeleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }
  product.isActive = false;
  await product.save();
  res.json({ message: "Product removed" });
});

// ── Orders ────────────────────────────────────────────────────────────────────

// @desc  Get all orders
// @route GET /api/admin/orders
export const adminGetOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { orderStatus: status } : {};
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc  Get single order
// @route GET /api/admin/orders/:id
export const adminGetOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found"); }
  res.json(order);
});

// @desc  Update order status
// @route PUT /api/admin/orders/:id/status
export const adminUpdateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;
  const valid = ["placed","confirmed","shipped","delivered","cancelled"];
  if (!valid.includes(orderStatus)) {
    res.status(400); throw new Error("Invalid status");
  }
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found"); }

  if (orderStatus === "cancelled" && order.orderStatus !== "cancelled") {
    for (const item of order.orderItems) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: item.qty } });
    }
  }
  order.orderStatus = orderStatus;
  if (orderStatus === "delivered") {
    order.deliveredAt = new Date();
    if (order.paymentMethod === "cod") order.paymentStatus = "paid";
  }
  res.json(await order.save());
});

// @desc  Adjust discount / extra charges on an order
// @route PUT /api/admin/orders/:id/charges
export const adminAdjustCharges = asyncHandler(async (req, res) => {
  const { discount, extraCharges } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found"); }
  if (discount !== undefined) order.discount = discount;
  if (extraCharges !== undefined) order.extraCharges = extraCharges;
  order.recalculateTotal();
  res.json(await order.save());
});

// ── Image Upload ──────────────────────────────────────────────────────────────

// @desc  Upload product images to Cloudinary
// @route POST /api/admin/upload
export const adminUploadImages = asyncHandler(async (req, res) => {
  if (!req.files?.length) {
    res.status(400);
    throw new Error("No files uploaded");
  }
  const urls = req.files.map((f) => f.path);
  res.json({ urls });
});
