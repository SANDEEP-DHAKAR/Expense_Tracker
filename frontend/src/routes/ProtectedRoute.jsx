import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const { user } = useContext(AuthContext);

    // 🔥 WAIT UNTIL USER LOADS
    if (user === null || user === undefined) {
        return <div>Loading...</div>;
    }

    // ❌ Agar user nahi hai
    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}