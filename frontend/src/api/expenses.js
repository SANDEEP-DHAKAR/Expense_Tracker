import api from "./axios";

// 📥 Get all expenses
export const getExpenses = () => api.get("/expenses");

// ➕ Add expense
export const addExpense = (data) => api.post("/expenses", data);

// ✏️ Update expense (NEW 🔥)
export const updateExpense = (id, data) =>
  api.put(`/expenses/${id}`, data);

// ❌ Delete
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);