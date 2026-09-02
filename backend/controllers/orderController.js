import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

/* =====================================================================
   Line-item helpers.

   A cart line only needs to answer two questions: which product, and how
   many. Everything else (price, name, image, size) is re-read from the
   database below, so nothing the client sends about the product itself is
   trusted.
   ===================================================================== */

/**
 * The product id a line item was added under.
 *
 * Checkout.jsx sends `{ product, qty }`, but the cart stores the id as
 * `productId` and older/alternative payloads have used `_id` / `id`.
 * Accepting every spelling means a rename on either side of the wire is a
 * no-op instead of a checkout outage. Deliberately *not* an allow-list: any
 * id MongoDB itself minted — i.e. every product an admin creates — passes.
 */
const lineProductId = (item) =>
  item?.product ?? item?.productId ?? item?._id ?? item?.id;

/**
 * Guard against ids that aren't ObjectIds.
 *
 * `Product.findById("merry-p1")` throws a CastError, which the error
 * handler turns into a 500 — and the shopper reads that as the whole site
 * being broken when all that happened is a stale id (a cart saved by the
 * old mock-catalog build, or a hand-edited request). Rejecting it here is
 * both cheaper and honest: it's a bad request, and the message tells the
 * shopper exactly how to recover.
 */
const isStaleId = (id) => typeof id !== "string" || !mongoose.isValidObjectId(id);

// @desc    Create a new order (works for logged-in users AND guests)
// @route   POST /api/orders
// @access  Public (optionalAuth — req.user set if logged in, undefined if guest)
export const createOrder = asyncHandler(async (req, res) => {
  // When paymentMethod is "online", the request is multipart/form-data
  // so fields come as flat strings that need parsing.
  let { orderItems, shippingAddress, paymentMethod, guestEmail, notes } = req.body;
  if (typeof guestEmail === "string") guestEmail = guestEmail.trim();

  // Parse JSON strings from FormData if needed. A malformed body must 400,
  // not 500 — JSON.parse throwing here used to crash the route.
  try {
    if (typeof orderItems === "string") orderItems = JSON.parse(orderItems);
    if (typeof shippingAddress === "string") shippingAddress = JSON.parse(shippingAddress);
  } catch {
    res.status(400);
    throw new Error("Invalid order payload");
  }

  // A JSON body can carry any shape at all: `orderItems: 5` parses fine and
  // then explodes on `for (const item of …)` with a TypeError → 500. Anything
  // that isn't a non-empty array is a malformed cart, not a server fault.
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
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

    const productId = lineProductId(item);
    if (isStaleId(productId)) {
      // Not an ObjectId — a leftover from the pre-API mock catalog, or a
      // hand-made request. 400 with a recovery instruction beats a CastError
      // 500 or a mystery "Resource not found".
      res.status(400);
      throw new Error(
        "One of the items in your cart is no longer in our catalogue. Please remove it and add it again from the shop."
      );
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      res.status(404);
      throw new Error(
        `We couldn't find one of the items in your cart (${productId}). Please remove it and add it again from the shop.`
      );
    }
    if (product.stock < qty) {
      res.status(400);
      throw new Error(`Not enough stock for ${product.name}`);
    }

    // `product._id` is the real MongoDB ObjectId — it is what Mongoose casts
    // into orderItems[].product and what every later lookup
    // (reviews, stock restore on cancellation) joins on. Never echo back the
    // client's id string; store the one the database just handed us.
    verifiedItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] ?? "",
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

  // Never read a user id from the body — guests omit it, and a leftover
  // empty string would CastError on ObjectId. Auth comes only from the token.
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