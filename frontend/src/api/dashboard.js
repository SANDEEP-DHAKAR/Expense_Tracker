import api from "./axios";

export const getDashboardSummary = () => api.get("/dashboard");
export const getMonthlyGraph = () => api.get("/dashboard/monthly");
