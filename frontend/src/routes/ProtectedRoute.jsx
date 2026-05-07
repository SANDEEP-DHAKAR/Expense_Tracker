import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextValue";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
        Loading...
      </div>
    );
  }

  if (!user?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
