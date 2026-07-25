import api from "./axios.js";

export const getProducts = async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return data;
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
