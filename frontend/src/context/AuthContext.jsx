import { useState, useEffect } from "react";
import { logoutUser } from "../api/auth";
import { AuthContext } from "./AuthContextValue";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔥 Load user on app start
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        } catch (error) {
            console.warn("Invalid user in localStorage");
            setUser(null);
        }

        setLoading(false);
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
                try {
                    await logoutUser({ refreshToken });
                } catch (error) {
                    console.warn("Logout API failed", error);
                }
            }
        } catch (err) {
            console.warn("Logout parse error", err);
        }

        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;