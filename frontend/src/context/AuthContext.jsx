import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/members";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if a token exists, try to resolve who it belongs to.
  useEffect(() => {
    const token = localStorage.getItem("nbss_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => localStorage.removeItem("nbss_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { access_token } = await authApi.login(email, password);
    localStorage.setItem("nbss_token", access_token);
    const me = await authApi.me();
    setUser(me);
    return me;
  }

  function logout() {
    localStorage.removeItem("nbss_token");
    setUser(null);
  }

  const isSuperAdmin = user?.role === "super_admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
