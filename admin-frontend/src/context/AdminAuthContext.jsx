import { useMemo, useState } from "react";
import { logoutUser } from "../api/auth";
import { AdminAuthContext } from "./AdminAuthContextValue";

function readStoredAdmin() {
  try {
    const raw = localStorage.getItem("adminUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("token");
    return null;
  }
}

export default function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(readStoredAdmin);

  const login = (payload) => {
    localStorage.setItem("adminUser", JSON.stringify(payload));
    if (payload?.accessToken) {
      localStorage.setItem("token", payload.accessToken);
    }
    setAdminUser(payload);
  };

  const logout = async () => {
    const refreshToken = readStoredAdmin()?.refreshToken;

    if (refreshToken) {
      await logoutUser({ refreshToken }).catch(() => null);
    }

    localStorage.removeItem("adminUser");
    localStorage.removeItem("token");
    setAdminUser(null);
  };

  const value = useMemo(() => ({ adminUser, login, logout }), [adminUser]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
