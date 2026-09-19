import api from "./axios";

// 🆕 Signup API
export const signupUser = (data) => api.post("/auth/signup", data);

// 🔑 Login API
export const loginUser = (data) => api.post("/auth/login", data);

// 🌐 Google Auth API
export const googleAuth = (data) => api.post("/auth/google", data);

// 🔁 Refresh token
export const refreshToken = (data) => api.post("/auth/refresh", data);

export const forgotPassword = (data) => api.post("/auth/forgot-password", data);

export const resetPassword = (data) => api.post("/auth/reset-password", data);

// 🚪 Logout
export const logoutUser = (data) => api.post("/auth/logout", data);
