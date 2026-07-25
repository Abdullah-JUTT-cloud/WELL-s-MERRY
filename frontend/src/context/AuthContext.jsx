import { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { setAccessToken, clearAccessToken } from "../api/tokenStore.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // true until we've checked for an existing session

  // On first load, silently try to get a fresh access token using the
  // httpOnly refresh cookie (if the user was already logged in from a
  // previous visit). This is what makes sessions survive a page refresh
  // even though the access token itself only lives in memory.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await api.post("/auth/refresh");
        setAccessToken(data.accessToken);
        const { data: profile } = await api.get("/auth/me");
        setUser(profile);
      } catch {
        // No valid session — perfectly normal for a first-time or logged-out visitor
        clearAccessToken();
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    restoreSession();
  }, []);

  // If axios's interceptor detects a dead refresh token mid-session
  // (e.g. it was revoked, or expired while the tab was open), clear
  // local auth state so the UI reflects "logged out" immediately.
  useEffect(() => {
    const handleExpired = () => {
      clearAccessToken();
      setUser(null);
    };
    window.addEventListener("wm:session-expired", handleExpired);
    return () => window.removeEventListener("wm:session-expired", handleExpired);
  }, []);

  const register = useCallback(async ({ name, email, password, phone, address }) => {
    const { data } = await api.post("/auth/register", { name, email, password, phone, address });
    return data; // { message, userId }
  }, []);

  const verifyOtp = useCallback(async ({ userId, otp }) => {
    const { data } = await api.post("/auth/verify-otp", { userId, otp });
    return data;
  }, []);

  const resendOtp = useCallback(async ({ userId, purpose }) => {
    const { data } = await api.post("/auth/resend-otp", { userId, purpose });
    return data;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { data } = await api.post("/auth/login", { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Even if the network call fails, still clear local state below —
      // the user's intent is to be logged out regardless of server reachability
    }
    clearAccessToken();
    setUser(null);
    toast.success("Logged out");
  }, []);

  const forgotPassword = useCallback(async (email) => {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  }, []);

  const resetPassword = useCallback(async ({ userId, otp, newPassword }) => {
    const { data } = await api.post("/auth/reset-password", { userId, otp, newPassword });
    return data;
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    authLoading,
    register,
    verifyOtp,
    resendOtp,
    login,
    logout,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};