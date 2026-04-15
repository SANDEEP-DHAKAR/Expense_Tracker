import api from "./axios";

// 📥 Get all expenses
export const getExpenses = (params = {}) => api.get("/expenses", { params });

// 📤 Export expenses
export const exportExpenses = (params = {}) =>
  api.get("/expenses/export", {
    params,
    responseType: "blob",
  });

// ➕ Add expense
export const addExpense = (data) => api.post("/expenses", data);

// ✏️ Update expense
export const updateExpense = (id, data) =>
  api.put(`/expenses/${id}`, data);

// ❌ Delete
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);