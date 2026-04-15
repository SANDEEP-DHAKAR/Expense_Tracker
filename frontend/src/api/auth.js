import api from "./axios";

// 🆕 Signup API
export const signupUser = (data) => api.post("/auth/signup", data);

// 🔑 Login API
export const loginUser = (data) => api.post("/auth/login", data);

// 🔁 Refresh token
export const refreshToken = (data) => api.post("/auth/refresh", data);

// 🚪 Logout
export const logoutUser = (data) => api.post("/auth/logout", data);