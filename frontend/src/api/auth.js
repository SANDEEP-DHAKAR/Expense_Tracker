import api from "./axios";

// 🆕 Signup API
export const signupUser = (data) => api.post("/auth/signup", data);

// 🔑 Login API
export const loginUser = (data) => api.post("/auth/login", data);