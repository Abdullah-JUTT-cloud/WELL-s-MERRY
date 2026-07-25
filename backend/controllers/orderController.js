import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc    Create a new order (works for logged-in users AND guests)
// @route   POST /api/orders
// @access  Public (optionalAuth — req.user set if logged in, undefined if guest)
export const createOrder = asyncHandler(async (req, res) => {
  // When paymentMethod is "online", the request is multipart/form-data
  // so fields come as flat strings that need parsing.
  let { orderItems, shippingAddress, paymentMethod, guestEmail, notes } = req.body;

  // Parse JSON strings from FormData if needed
  if (typeof orderItems === "string") orderItems = JSON.parse(orderItems);
  if (typeof shippingAddress === "string") shippingAddress = JSON.parse(shippingAddress);

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

  // Validate online payment fields
  let onlinePaymentData = undefined;
  if (paymentMethod === "online") {
    const provider = req.body.onlineProvider;
    const senderAccount = req.body.onlineSenderAccount;
    const transactionAmount = Number(req.body.onlineTransactionAmount);

    if (!["easypaisa", "jazzcash", "nayapay", "raqami"].includes(provider)) {
      res.status(400);
      throw new Error("Please select a valid payment provider");
    }
    if (!senderAccount || senderAccount.trim().length < 7) {
      res.status(400);
      throw new Error("Please enter the account number you sent payment from");
    }
    if (!transactionAmount || transactionAmount <= 0) {
      res.status(400);
      throw new Error("Please enter the transaction amount");
    }
    if (!req.file) {
      res.status(400);
      throw new Error("Please upload a receipt screenshot");
    }

    onlinePaymentData = {
      provider,
      senderAccount: senderAccount.trim(),
      transactionAmount,
      receiptImage: req.file.path,
    };
  }

  // Re-fetch each product from the DB to trust real prices/stock —
  // never trust price/name sent from the client.
  let itemsPrice = 0;
  const verifiedItems = [];

  for (const item of orderItems) {
    // Validate qty is a positive integer
    const qty = Number(item.qty);
    if (!Number.isInteger(qty) || qty < 1) {
      res.status(400);
      throw new Error("Each item quantity must be a positive integer");
    }

    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }
    if (product.stock < qty) {
      res.status(400);
      throw new Error(`Not enough stock for ${product.name}`);
    }

    verifiedItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      size: product.size,
      qty,
    });

    itemsPrice += product.price * qty;
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
    onlinePayment: onlinePaymentData,
    itemsPrice,
    shippingPrice,
    totalPrice,
    notes,
  });

  // Atomically decrement stock — the filter ensures stock can't go negative.
  // If any product fails (concurrent order grabbed the last units), roll back
  // all previous decrements and reject the order.
  const decremented = [];
  for (const item of verifiedItems) {
    const result = await Product.updateOne(
      { _id: item.product, stock: { $gte: item.qty } },
      { $inc: { stock: -item.qty } }
    );
    if (result.modifiedCount === 0) {
      // Roll back items already decremented
      for (const prev of decremented) {
        await Product.updateOne(
          { _id: prev.product },
          { $inc: { stock: prev.qty } }
        );
      }
      // Remove the order we just created — it can't be fulfilled
      await Order.findByIdAndDelete(order._id);
      res.status(409);
      throw new Error(`Stock no longer available for ${item.name}. Please try again.`);
    }
    decremented.push(item);
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

  // Restore stock when an order is cancelled
  if (orderStatus === "cancelled" && order.orderStatus !== "cancelled") {
    for (const item of order.orderItems) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.qty } }
      );
    }
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