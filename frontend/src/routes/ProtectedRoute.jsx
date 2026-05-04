import { useContext } from "react";
import { AuthContext } from "../context/AuthContextValue";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useContext(AuthContext);

    // 🔥 wait until auth is loaded
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                Loading...
            </div>
        );
    }

    // ❌ not logged in
    if (!user?.accessToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
}