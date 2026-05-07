import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://expense-tracker-backend-v2tv.onrender.com/api";

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
        config.url.includes("/auth/signup")
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
            let storedUser = null;
            try {
                storedUser = JSON.parse(localStorage.getItem("user") || "null");
            } catch {
                localStorage.removeItem("user");
            }
            const refreshToken = storedUser?.refreshToken;

            if (!refreshToken) {
                localStorage.removeItem("user");
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
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("user");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
