
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach the JWT to every request.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Handle unauthorized responses centrally.

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url ?? "";

        const isAuthEndpoint =
            requestUrl.startsWith("/auth/login") ||
            requestUrl.startsWith("/auth/register");

        const token = localStorage.getItem("token");

        const unauthorized = status === 401;
        const forbiddenWithoutToken =
            status === 403 && !token;

        if (
            !isAuthEndpoint &&
            (unauthorized || forbiddenWithoutToken)
        ) {
            localStorage.removeItem("token");

            if (window.location.pathname !== "/") {
                window.location.replace("/");
            }
        }

        return Promise.reject(error);
    }
);


export default api;
