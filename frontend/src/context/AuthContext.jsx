import { useState } from "react";
import { logoutUser } from "../api/auth";
import { AuthContext } from "./AuthContextValue";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : false;
    });

    const login = (data) => {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
    };

    const logout = async () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const refreshToken = storedUser?.refreshToken;

        if (refreshToken) {
            try {
                await logoutUser({ refreshToken });
            } catch (error) {
                console.warn("Logout failed", error);
            }
        }

        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;