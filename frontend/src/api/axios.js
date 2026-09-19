import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

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

api.interceptors.request.use((config) => {
    if (
        config.url.includes("/auth/login") ||
        config.url.includes("/auth/signup") ||
        config.url.includes("/auth/google")
    ) {
        return config;
    }

    let user = null;
    try {
        user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        localStorage.removeItem("user");
    }

    if (user?.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
    }

    return config;
});

// Single flight mutex & queue for concurrent token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/refresh") &&
            !originalRequest.url?.includes("/auth/login")
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            let storedUser = null;
            try {
                storedUser = JSON.parse(localStorage.getItem("user") || "null");
            } catch {
                localStorage.removeItem("user");
            }
            const refreshToken = storedUser?.refreshToken;

            if (!refreshToken) {
                isRefreshing = false;
                processQueue(error, null);
                localStorage.removeItem("user");
                window.dispatchEvent(new Event("auth-logout"));
                return Promise.reject(error);
            }

            try {
                const response = await refreshApi.post("/auth/refresh", {
                    refreshToken,
                });

                const { accessToken, refreshToken: nextRefreshToken, user } = response.data;
                const updatedAuth = {
                    ...storedUser,
                    accessToken,
                    refreshToken: nextRefreshToken,
                    user: user || storedUser.user,
                };

                localStorage.setItem("user", JSON.stringify(updatedAuth));
                window.dispatchEvent(new CustomEvent("auth-token-refreshed", { detail: updatedAuth }));

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                processQueue(null, accessToken);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem("user");
                window.dispatchEvent(new Event("auth-logout"));
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
