import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://expense-tracker-backend-v2tv.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
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
