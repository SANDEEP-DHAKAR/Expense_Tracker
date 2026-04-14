import api from "./axios";

// 📥 Get all expenses
export const getExpenses = () => api.get("/expenses");

// ➕ Add expense
export const addExpense = (data) => api.post("/expenses", data);

// ❌ Delete
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);