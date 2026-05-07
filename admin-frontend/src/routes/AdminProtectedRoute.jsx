import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminAuthContext } from "../context/AdminAuthContextValue";

export default function AdminProtectedRoute({ children }) {
  const { adminUser } = useContext(AdminAuthContext);

  if (!adminUser?.accessToken || adminUser?.user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
