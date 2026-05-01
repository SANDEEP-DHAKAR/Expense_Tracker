import api from "./client";

export const loginUser = (data) => api.post("/auth/login", data);
