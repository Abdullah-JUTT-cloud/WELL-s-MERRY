// Access-token store. The live value lives in memory so an XSS payload can't
// just `localStorage.getItem` it on every page — but we *also* mirror it to
// localStorage as a fallback.
//
// Why the fallback: the shop is on Vercel and the API is on a different
// origin. The httpOnly refresh cookie is SameSite=strict, so it is NOT sent
// on cross-origin XHR. Without a persisted access token, a logged-in
// checkout POST would go out as a guest (or 401) after a refresh. Checkout
// reads this key when attaching `Authorization: Bearer …`.
//
// App.jsx still tries the refresh-cookie path on load; if that works, it
// overwrites the stored token. If it doesn't, we still have whatever was
// saved at login.

const STORAGE_KEYS = ["wm_access_token", "accessToken", "token"];

const readTokenFromStorage = () => {
  if (typeof localStorage === "undefined") return null;
  try {
    for (const key of STORAGE_KEYS) {
      const value = localStorage.getItem(key);
      if (value) return value;
    }
  } catch {
    // private mode / blocked storage
  }
  return null;
};

const writeTokenToStorage = (token) => {
  if (typeof localStorage === "undefined") return;
  try {
    if (token) {
      localStorage.setItem("wm_access_token", token);
    } else {
      for (const key of STORAGE_KEYS) localStorage.removeItem(key);
    }
  } catch {
    // storage full or blocked — in-memory token still works for this tab
  }
};

let accessToken = readTokenFromStorage();

export const getAccessToken = () => accessToken || readTokenFromStorage();

export const setAccessToken = (token) => {
  accessToken = token || null;
  writeTokenToStorage(accessToken);
};

export const clearAccessToken = () => {
  accessToken = null;
  writeTokenToStorage(null);
};

export { readTokenFromStorage };
