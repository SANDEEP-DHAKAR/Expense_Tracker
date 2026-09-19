import { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "../context/AuthContextValue";
import Categories from "../pages/Categories";
import Budgets from "../pages/Budgets";
import Dashboard from "../pages/Dashboard";
import Expenses from "../pages/Expenses";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";

function RootRedirect() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05080d] text-sm text-emerald-400">
        Loading...
      </div>
    );
  }

  return <Navigate to={user?.accessToken ? "/dashboard" : "/login"} replace />;
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05080d] text-sm text-emerald-400">
        Loading...
      </div>
    );
  }

  if (user?.accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budgets"
          element={
            <ProtectedRoute>
              <Budgets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
