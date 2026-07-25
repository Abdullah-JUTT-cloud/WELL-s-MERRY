import api from "./axios.js";

/**
 * Create a new order.
 * For online payments, orderPayload should be a FormData instance
 * (includes the receipt file). For COD/WhatsApp, it's a plain object.
 */
export const createOrder = async (orderPayload) => {
  const isFormData = orderPayload instanceof FormData;
  const { data } = await api.post("/orders", orderPayload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return data;
};

export const getMyOrders = async () => {
  const { data } = await api.get("/orders/my");
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};
