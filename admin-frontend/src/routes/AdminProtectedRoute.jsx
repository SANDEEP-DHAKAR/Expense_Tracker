import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminAuthContext } from "../context/AdminAuthContextValue";

export default function AdminProtectedRoute({ children }) {
  const { adminUser } = useContext(AdminAuthContext);

  if (!adminUser?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (adminUser?.user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
