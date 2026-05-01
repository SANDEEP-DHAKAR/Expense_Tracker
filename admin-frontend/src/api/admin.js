import api from "./client";

export const getAdminDashboard = () => api.get("/admin/dashboard");
export const getAdminUsers = () => api.get("/admin/users");
export const getAdminUserDetails = (userId) => api.get(`/admin/users/${userId}`);
export const getAdminExpenses = () => api.get("/admin/expenses");
