/* =====================================================================
   Order-creation happy path.

   Boots the real app with the two Mongoose models swapped for in-memory
   stubs, so a full checkout (validate → price → persist) can be asserted
   without a database.

   Mocking ESM needs Node's module-mock flag, so these specs run from their
   own script and simply skip under `npm test`:

       npm run test:order      # node --experimental-test-module-mocks

   Same guarantee as tests/orderRoutes.test.js, asserted one layer deeper.
   ===================================================================== */

import test, { mock, before, after } from "node:test";
import assert from "node:assert/strict";

process.env.NODE_ENV ??= "test";

// A real 24-char ObjectId, like the one Mongo mints for every product an
// admin creates through /api/admin/products.
const PRODUCT = {
  _id: "64f1a2b3c4d5e6f7a8b9c0d1",
  name: "Rosemary Oil",
  price: 2500,
  stock: 5,
  size: "100ml",
  images: ["https://res.cloudinary.test/rosemary.jpg"],
  isActive: true,
};

// The pre-API catalog shipped hardcoded ids like this one. Carts saved by
// that build still hold them, so checkout has to reject them cleanly.
const STALE_MOCK_ID = "merry-p1";

const state = { created: [], deleted: [] };

// mock.module only exists once Node is started with the flag below. Without
// it the specs skip with a reason instead of taking `npm test` down.
const canMock = typeof mock?.module === "function";
const SKIP = canMock ? false : "run with: npm run test:order";

if (canMock) {
  mock.module("../models/Product.js", {
    defaultExport: {
      findById: async (id) => (id === PRODUCT._id ? { ...PRODUCT } : null),
      updateOne: async () => ({ modifiedCount: 1 }),
    },
  });

  mock.module("../models/Order.js", {
    defaultExport: {
      create: async (doc) => {
        const order = { _id: `order-${state.created.length + 1}`, ...doc };
        state.created.push(order);
        return order;
      },
      findByIdAndDelete: async (id) => {
        state.deleted.push(id);
        return {};
      },
    },
  });
}

const { default: app } = await import("../app.js");

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server?.close());

const postOrder = (path, payload) =>
  fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

const validPayload = () => ({
  orderItems: [{ product: PRODUCT._id, qty: 2 }],
  shippingAddress: {
    fullName: "Ada Lovelace",
    phone: "03001234567",
    street: "1 Vine Street",
    city: "Lahore",
  },
  paymentMethod: "cod",
  guestEmail: "ada@example.com",
});

test("checkout succeeds on /api/orders", { skip: SKIP }, async () => {
  const res = await postOrder("/api/orders", validPayload());
  const order = await res.json();

  assert.equal(res.status, 201, JSON.stringify(order));
  assert.equal(order.totalPrice, PRODUCT.price * 2, "priced from the DB, not the client");
  assert.equal(order.isGuestOrder, true);
  assert.equal(order.guestEmail, "ada@example.com");
  assert.equal(order.orderItems[0].name, PRODUCT.name);
});

test("checkout succeeds on the unprefixed /orders path too", { skip: SKIP }, async () => {
  // The deploy that took checkout down sent this exact request.
  const res = await postOrder("/orders", validPayload());
  const order = await res.json();

  assert.equal(res.status, 201, JSON.stringify(order));
  assert.equal(order.totalPrice, PRODUCT.price * 2);
});

test("guest checkout is rejected without an email", { skip: SKIP }, async () => {
  const payload = validPayload();
  delete payload.guestEmail;

  const res = await postOrder("/api/orders", payload);
  assert.equal(res.status, 400);
  assert.match((await res.json()).message, /Email is required/);
});

test("an incomplete address is rejected before anything is written", { skip: SKIP }, async () => {
  const payload = validPayload();
  payload.shippingAddress = { fullName: "Ada" };

  const res = await postOrder("/api/orders", payload);
  assert.equal(res.status, 400);
  assert.match((await res.json()).message, /Complete shipping address/);
});

test("an unknown payment method is rejected", { skip: SKIP }, async () => {
  const res = await postOrder("/api/orders", { ...validPayload(), paymentMethod: "crypto" });

  assert.equal(res.status, 400);
  assert.match((await res.json()).message, /Invalid payment method/);
});

test("the stored line item keeps the real MongoDB product id", { skip: SKIP }, async () => {
  const res = await postOrder("/api/orders", validPayload());
  const order = await res.json();

  assert.equal(res.status, 201, JSON.stringify(order));
  assert.equal(order.orderItems[0].product, PRODUCT._id, "ObjectId preserved, not the client's string");
  assert.equal(order.orderItems[0].image, PRODUCT.images[0], "image snapshotted from the DB");
});

test("a line item keyed `productId` is accepted too", { skip: SKIP }, async () => {
  // The cart stores the id as `productId`; the payload contract must not
  // depend on which spelling a client happens to serialise.
  const payload = validPayload();
  payload.orderItems = [{ productId: PRODUCT._id, qty: 1 }];

  const res = await postOrder("/api/orders", payload);
  const order = await res.json();

  assert.equal(res.status, 201, JSON.stringify(order));
  assert.equal(order.orderItems[0].product, PRODUCT._id);
});

test("a stale mock-catalog id is rejected as a 400, not a 500", { skip: SKIP }, async () => {
  // The bug: a cart saved by the hardcoded-catalog build posts "merry-p1",
  // findById throws a CastError and the shopper sees a server error.
  const ordersBefore = state.created.length;
  const payload = validPayload();
  payload.orderItems = [{ product: STALE_MOCK_ID, qty: 1 }];

  const res = await postOrder("/api/orders", payload);
  const body = await res.json();

  assert.equal(res.status, 400, JSON.stringify(body));
  assert.match(body.message, /no longer in our catalogue/i);
  assert.equal(state.created.length, ordersBefore, "no order is written for a rejected cart");
});

test("a product that has sold out is rejected with a stock message", { skip: SKIP }, async () => {
  const res = await postOrder("/api/orders", { ...validPayload(), orderItems: [{ product: PRODUCT._id, qty: 99 }] });
  const body = await res.json();

  assert.equal(res.status, 400);
  assert.match(body.message, /Not enough stock/);
});

test("a non-array orderItems payload is rejected, not crashed on", { skip: SKIP }, async () => {
  const res = await postOrder("/api/orders", { ...validPayload(), orderItems: 5 });
  const body = await res.json();

  assert.equal(res.status, 400, JSON.stringify(body));
  assert.match(body.message, /No order items provided/);
});
