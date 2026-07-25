import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { adminLogin as apiLogin, adminLogout as apiLogout, setAdminToken } from "../api/admin.js";
import adminApi from "../api/admin.js";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.post("/admin/refresh")
      .then(({ data }) => {
        setAdminToken(data.accessToken);
        setIsAdmin(true);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = () => setIsAdmin(false);
    window.addEventListener("wm:admin-session-expired", handler);
    return () => window.removeEventListener("wm:admin-session-expired", handler);
  }, []);

  const login = useCallback(async (email, password) => {
    await apiLogin(email, password);
    setIsAdmin(true);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setIsAdmin(false);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
