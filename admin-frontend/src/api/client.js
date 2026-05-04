import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // ❌ LOGIN / SIGNUP pe token mat bhej
  if (
    config.url.includes("/auth/login") ||
    config.url.includes("/auth/signup")
  ) {
    return config;
  }

  const directToken = localStorage.getItem("token");
  const userPayload = JSON.parse(localStorage.getItem("user") || "null");
  const accessToken = userPayload?.accessToken;
  const token = directToken || accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
