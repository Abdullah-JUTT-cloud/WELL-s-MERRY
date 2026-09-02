import api from "./axios.js";

/* =====================================================================
   Live inventory only.

   These functions used to `catch` a failed request and answer with a
   hardcoded catalog (`data/merry/mock.js`, `data/productFallback.js`).
   That fallback is exactly what broke checkout: the shop rendered
   products whose `_id`s existed nowhere in MongoDB, so
   `Product.findById(item.product)` found nothing and the order 404'd
   ("Resource not found").

   There is no fallback now. A network failure must *look* like a failure
   — the pages render an empty "New batches coming soon…" state — rather
   than like a working shop full of unorderable products.
   ===================================================================== */

/**
 * Normalise whatever the products route returned into an array.
 * The API sends a bare JSON array; tolerate a `{ products: [...] }` wrapper
 * so a pagination envelope can be added later without touching callers.
 */
const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  return [];
};

export const getProducts = async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return toArray(data);
};

export const getProductBySlug = async (slug) => {
  const { data } = await api.get(`/products/${slug}`);
  return data;
};

export const canReviewProduct = async (productId) => {
  const { data } = await api.get(`/products/${productId}/can-review`);
  return data;
};

export const addProductReview = async (productId, formData) => {
  const { data } = await api.post(`/products/${productId}/reviews`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
