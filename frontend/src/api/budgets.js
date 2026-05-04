import api from "./axios";

export const setBudget = (data) => api.post("/budgets", data);
export const getBudget = (month) => api.get(`/budgets${month ? `?month=${month}` : ''}`);
export const getBudgetHistory = (params) => api.get("/budgets/history", { params });
