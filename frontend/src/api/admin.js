import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Separate axios instance for admin — uses its own in-memory token store
// and the adminRefreshToken cookie (distinct from the customer cookie).
const adminApi = axios.create({ baseURL: BASE, withCredentials: true });

let adminToken = null;
export const getAdminToken = () => adminToken;
export const setAdminToken = (t) => { adminToken = t; };
export const clearAdminToken = () => { adminToken = null; };

adminApi.interceptors.request.use((config) => {
  if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`;
  return config;
});

let refreshing = false;
let queue = [];
const flush = (err, token) => {
  queue.forEach(({ resolve, reject }) => err ? reject(err) : resolve(token));
  queue = [];
};

adminApi.interceptors.response.use(
  (r) => r,
  async (error) => {
    const orig = error.config;
    const skip = orig.url?.includes("/admin/login") || orig.url?.includes("/admin/refresh");
    if (error.response?.status === 401 && !orig._retry && !skip) {
      if (refreshing) {
        return new Promise((resolve, reject) => queue.push({ resolve, reject }))
          .then((t) => { orig.headers.Authorization = `Bearer ${t}`; return adminApi(orig); });
      }
      orig._retry = true;
      refreshing = true;
      try {
        const { data } = await adminApi.post("/admin/refresh");
        setAdminToken(data.accessToken);
        flush(null, data.accessToken);
        orig.headers.Authorization = `Bearer ${data.accessToken}`;
        return adminApi(orig);
      } catch (e) {
        flush(e, null);
        clearAdminToken();
        window.dispatchEvent(new Event("wm:admin-session-expired"));
        return Promise.reject(e);
      } finally {
        refreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const adminLogin = async (email, password) => {
  const { data } = await adminApi.post("/admin/login", { email, password });
  setAdminToken(data.accessToken);
  return data;
};
export const adminLogout = async () => {
  await adminApi.post("/admin/logout");
  clearAdminToken();
};

// Products
export const adminGetProducts = () => adminApi.get("/admin/products").then(r => r.data);
export const adminCreateProduct = (body) => adminApi.post("/admin/products", body).then(r => r.data);
export const adminUpdateProduct = (id, body) => adminApi.put(`/admin/products/${id}`, body).then(r => r.data);
export const adminDeleteProduct = (id) => adminApi.delete(`/admin/products/${id}`).then(r => r.data);

// Image upload
export const adminUploadImages = async (files) => {
  const formData = new FormData();
  files.forEach((f) => formData.append("images", f));
  const { data } = await adminApi.post("/admin/upload", formData);
  return data.urls;
};

// Orders
export const adminGetOrders = (status) =>
  adminApi.get("/admin/orders", { params: status ? { status } : {} }).then(r => r.data);
export const adminGetOrder = (id) => adminApi.get(`/admin/orders/${id}`).then(r => r.data);
export const adminUpdateOrderStatus = (id, orderStatus) =>
  adminApi.put(`/admin/orders/${id}/status`, { orderStatus }).then(r => r.data);
export const adminAdjustCharges = (id, body) =>
  adminApi.put(`/admin/orders/${id}/charges`, body).then(r => r.data);

export default adminApi;
