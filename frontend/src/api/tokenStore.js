// In-memory access-token store — deliberately NOT localStorage/sessionStorage.
// Storing JWTs in localStorage exposes them to any XSS on the page (any injected
// script can just read localStorage and steal the token). Keeping it in a JS
// variable means it only exists in memory and is wiped on page refresh —
// which is fine, because App.jsx silently re-fetches a new one via the
// httpOnly refresh-token cookie on load. See AuthContext.jsx.

let accessToken = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (token) => {
  accessToken = token;
};
export const clearAccessToken = () => {
  accessToken = null;
};