import api from "./axios.js";

// Thin wrapper functions around the products endpoints — pages call these
// instead of calling `api.get(...)` directly with raw URL strings scattered
// everywhere. If a backend route path ever changes, this is the one file
// that needs updating, not every page that fetches products.

export const getProducts = async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return data;
};

export const getProductBySlug = async (slug) => {
  const { data } = await api.get(`/products/${slug}`);
  return data;
};

export const addProductReview = async (productId, { rating, comment }) => {
  const { data } = await api.post(`/products/${productId}/reviews`, { rating, comment });
  return data;
};