import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest?.url?.includes(
      "/auth/refresh-token",
    );

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;
      await api.get("/auth/refresh-token");
      return api(originalRequest);
    }

    return Promise.reject(error);
  },
);

export const getApiMessage = (error, fallback = "Something went wrong") =>
  error.response?.data?.message || error.message || fallback;

export default api;
