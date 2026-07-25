import api from "./axios.js";

export const createOrder = async (orderPayload) => {
  const { data } = await api.post("/orders", orderPayload);
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