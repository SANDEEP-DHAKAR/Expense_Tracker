import { useState, useEffect } from "react";
import { logoutUser } from "../api/auth";
import { AuthContext } from "./AuthContextValue";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔥 Load user on app start
    useEffect(() => {
        const loadUser = () => {
            try {
                const storedUser = localStorage.getItem("user");

                if (storedUser) {
                    const parsed = JSON.parse(storedUser);
                    setUser(parsed);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.warn("Invalid user in localStorage");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = (data) => {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
    };

    const logout = async () => {
        try {
            const storedUser = localStorage.getItem("user");

            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                const refreshToken = parsedUser?.refreshToken;

                if (refreshToken) {
                    try {
                        await logoutUser({ refreshToken });
                    } catch (error) {
                        console.warn("Logout API failed", error);
                    }
                }
            }
        } catch (err) {
            console.warn("Logout error", err);
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