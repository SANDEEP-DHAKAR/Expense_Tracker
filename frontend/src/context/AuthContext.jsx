import { useEffect, useState } from "react";
import { logoutUser } from "../api/auth";
import { AuthContext } from "./AuthContextValue";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    } catch (error) {
      console.warn("Invalid user in localStorage", error);
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const logout = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const refreshToken = parsedUser?.refreshToken;

      if (refreshToken) {
        await logoutUser({ refreshToken }).catch((error) => {
          console.warn("Logout API failed", error);
        });
      }
    } catch (err) {
      console.warn("Logout parse error", err);
    } finally {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
