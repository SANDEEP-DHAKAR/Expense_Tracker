import api from "./axios";

// 🔑 Login API
export const loginUser = (data) => api.post("/auth/login", data);

// 🆕 Register API
export const registerUser = (data) => api.post("/auth/register", data);