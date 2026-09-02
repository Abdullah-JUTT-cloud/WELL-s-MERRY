import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "./tokenStore.js";
import { API_BASE_URL } from "./baseUrl.js";

const api = axios.create({
  // Resolved by ./baseUrl.js — always ends in /api, and falls back to the
  // live Render backend in a production build rather than to localhost.
  // Requests here are written without the prefix ("/orders"), so a base URL
  // of https://well-s-merry.onrender.com/api yields POST /api/orders.
  baseURL: API_BASE_URL,
  withCredentials: true, // sends the httpOnly refreshToken cookie automatically
});

// Attach the current access token to every outgoing request.
// Memory first, then localStorage — checkout also sets this header
// explicitly, but every other call (refresh, my-orders) needs it too.
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Prevents multiple simultaneous refresh calls if several requests
// 401 at the same time (e.g. a page firing 3 API calls on load)
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // A 404 from our own error handler means the path never matched a route —
    // almost always a base-URL/prefix mismatch rather than a missing record.
    // Say so plainly instead of surfacing the raw server string.
    if (error.response?.status === 404) {
      const serverMessage = error.response.data?.message || "";
      if (/route not found/i.test(serverMessage)) {
        console.error(
          `[api] No route for ${originalRequest?.method?.toUpperCase()} ${
            originalRequest?.baseURL
          }${originalRequest?.url} — check VITE_API_URL points at the API root (…/api).`
        );
      }
    }

    // Never try to refresh in response to the login/refresh endpoints
    // themselves — that would create an infinite loop
    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // A refresh is already in flight — queue this request instead of
        // firing a second, redundant refresh call
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post("/auth/refresh");
        setAccessToken(data.accessToken);
        processQueue(null, data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();
        // Tell the rest of the app the session died so AuthContext can
        // clear user state and redirect to login if needed
        window.dispatchEvent(new Event("wm:session-expired"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;