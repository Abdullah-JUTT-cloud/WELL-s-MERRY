import api from "./axios.js";
import { FALLBACK_PRODUCT } from "../data/productFallback.js";
import { MERRY_PRODUCTS } from "../data/merry/mock.js";

/* Offline / mock seam — the design-system ("merry") catalog doubles as
   the graceful fallback: when the API is unreachable (dev without the
   backend, demo environments, offline previews), every product route
   still resolves against the static catalog instead of dead-ending. */
const findMockBySlug = (slug) =>
  MERRY_PRODUCTS.find((p) => p.slug === slug) ||
  (slug === FALLBACK_PRODUCT.slug ? FALLBACK_PRODUCT : null);

export const getProducts = async (params = {}) => {
  try {
    const { data } = await api.get("/products", { params });
    return data?.products ?? data;
  } catch {
    const cat = params.category;
    const list = cat
      ? MERRY_PRODUCTS.filter((p) => p.category === cat)
      : MERRY_PRODUCTS;
    return list;
  }
};

export const getProductBySlug = async (slug) => {
  try {
    const { data } = await api.get(`/products/${slug}`);
    return data;
  } catch (err) {
    const mock = findMockBySlug(slug);
    if (mock) return mock;
    throw err;
  }
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
