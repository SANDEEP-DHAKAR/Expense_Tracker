import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function readAdminAuth() {
  try {
    return JSON.parse(localStorage.getItem("adminUser") || "null");
  } catch {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("token");
    return null;
  }
}

function clearAdminAuth() {
  localStorage.removeItem("adminUser");
  localStorage.removeItem("token");
}

api.interceptors.request.use((config) => {
  if (config.url?.includes("/auth/login")) {
    return config;
  }

  const adminUser = readAdminAuth();
  const accessToken = adminUser?.accessToken || localStorage.getItem("token");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;
      const adminUser = readAdminAuth();
      const refreshToken = adminUser?.refreshToken;

      if (!refreshToken) {
        clearAdminAuth();
        return Promise.reject(error);
      }

      try {
        const response = await refreshApi.post("/auth/refresh", { refreshToken });
        const nextAuth = {
          ...adminUser,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          user: response.data.user || adminUser.user,
        };

        localStorage.setItem("adminUser", JSON.stringify(nextAuth));
        localStorage.setItem("token", nextAuth.accessToken);
        originalRequest.headers.Authorization = `Bearer ${nextAuth.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearAdminAuth();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
