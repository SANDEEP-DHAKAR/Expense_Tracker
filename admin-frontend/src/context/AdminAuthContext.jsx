import { useMemo, useState } from "react";
import { AdminAuthContext } from "./AdminAuthContextValue";

export default function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    const raw = localStorage.getItem("adminUser");
    return raw ? JSON.parse(raw) : null;
  });

  const login = (payload) => {
    localStorage.setItem("adminUser", JSON.stringify(payload));
    if (payload?.accessToken) {
      localStorage.setItem("token", payload.accessToken);
    }
    setAdminUser(payload);
  };

  const logout = () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("token");
    setAdminUser(null);
  };

  const value = useMemo(() => ({ adminUser, login, logout }), [adminUser]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
