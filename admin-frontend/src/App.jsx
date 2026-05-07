import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Login from "./pages/Login";
import Users from "./pages/Users";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AdminProtectedRoute>
              <Users />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <AdminProtectedRoute>
              <Expenses />
            </AdminProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
