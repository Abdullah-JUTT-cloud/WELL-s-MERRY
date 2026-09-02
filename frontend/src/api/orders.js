import api from "./axios.js";
import { getAccessToken, readTokenFromStorage } from "./tokenStore.js";

const authHeaders = (extra = {}) => {
  const token = getAccessToken() || readTokenFromStorage();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Create a new order.
 * For online payments, orderPayload should be a FormData instance
 * (includes the receipt file). For COD/WhatsApp, it's a plain object.
 *
 * Always attach the Bearer token when we have one so a logged-in checkout
 * is attributed to the user even if the axios interceptor missed it.
 */
export const createOrder = async (orderPayload, config = {}) => {
  const isFormData = typeof FormData !== "undefined" && orderPayload instanceof FormData;

  // Do NOT force Content-Type on FormData — the browser must set the
  // multipart boundary. Setting "multipart/form-data" without it used to
  // make multer reject online-payment checkouts.
  const headers = authHeaders({
    ...config.headers,
  });
  if (isFormData) {
    delete headers["Content-Type"];
    delete headers["content-type"];
  }

  const { data } = await api.post("/orders", orderPayload, {
    ...config,
    headers,
  });
  return data;
};

export const getMyOrders = async () => {
  const { data } = await api.get("/orders/my", { headers: authHeaders() });
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`, { headers: authHeaders() });
  return data;
};
