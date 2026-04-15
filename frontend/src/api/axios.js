import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

const refreshApi = axios.create({
    baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user"));

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
            const storedUser = JSON.parse(localStorage.getItem("user"));
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
