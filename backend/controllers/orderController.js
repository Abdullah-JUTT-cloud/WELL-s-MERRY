import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc    Create a new order (works for logged-in users AND guests)
// @route   POST /api/orders
// @access  Public (optionalAuth — req.user set if logged in, undefined if guest)
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, guestEmail, notes } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  if (!shippingAddress?.fullName || !shippingAddress?.phone || !shippingAddress?.street || !shippingAddress?.city) {
    res.status(400);
    throw new Error("Complete shipping address is required");
  }

  if (!["cod", "whatsapp", "online"].includes(paymentMethod)) {
    res.status(400);
    throw new Error("Invalid payment method");
  }

  if (paymentMethod === "online") {
    res.status(400);
    throw new Error("Online payment is coming soon. Please choose Cash on Delivery or WhatsApp order for now.");
  }

  // Re-fetch each product from the DB to trust real prices/stock —
  // never trust price/name sent from the client.
  let itemsPrice = 0;
  const verifiedItems = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }
    if (product.stock < item.qty) {
      res.status(400);
      throw new Error(`Not enough stock for ${product.name}`);
    }

    verifiedItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      size: product.size,
      qty: item.qty,
    });

    itemsPrice += product.price * item.qty;
  }

  const shippingPrice = 0; // flat free shipping for now
  const totalPrice = itemsPrice + shippingPrice;

  const isGuestOrder = !req.user;
  if (isGuestOrder && !guestEmail) {
    res.status(400);
    throw new Error("Email is required for guest checkout");
  }

  const order = await Order.create({
    user: req.user ? req.user._id : null,
    isGuestOrder,
    guestEmail: isGuestOrder ? guestEmail : undefined,
    orderItems: verifiedItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    notes,
  });

  // Decrement stock now that the order is confirmed placed
  for (const item of verifiedItems) {
    await Product.updateOne(
      { _id: item.product },
      { $inc: { stock: -item.qty } }
    );
  }

  res.status(201).json(order);
});

// @desc    Get logged-in user's own orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get a single order by id (owner or admin only)
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const isOwner = order.user && order.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.json(order);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.orderStatus = status;

  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order status (e.g. confirmed -> shipped -> delivered)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;
  const validStatuses = ["placed", "confirmed", "shipped", "delivered", "cancelled"];

  if (!validStatuses.includes(orderStatus)) {
    res.status(400);
    throw new Error("Invalid order status");
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.orderStatus = orderStatus;
  if (orderStatus === "delivered") {
    order.deliveredAt = new Date();
    if (order.paymentMethod === "cod") {
      order.paymentStatus = "paid"; // COD is collected on delivery
    }
  }

  await order.save();
  res.json(order);
});