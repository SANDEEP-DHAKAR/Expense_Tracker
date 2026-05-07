import api from "./client";

export const loginUser = (data) => api.post("/auth/login", data);
export const logoutUser = (data) => api.post("/auth/logout", data);
