import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

const DEFAULT_API_BASE_URL = "http://localhost:5000";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, "") ||
  DEFAULT_API_BASE_URL;

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const getAccessToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("accessToken");
};

const setAccessToken = (token: string) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("accessToken", token);
};

const clearAuthStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }

  Cookies.remove("refreshToken");
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh");
    const isLogoutRequest = originalRequest?.url?.includes("/auth/logout");

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isRefreshRequest ||
      isLogoutRequest
    ) {
      return Promise.reject(error);
    }

    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      clearAuthStorage();
      return Promise.reject(error);
    }

    // Mark the original request so an expired token only triggers one retry cycle.
    originalRequest._retry = true;

    try {
      // Refresh the access token lazily after the first protected request gets a 401.
      const { data } = await refreshClient.post("/auth/refresh", {
        refreshToken,
      });

      const newAccessToken = data?.accessToken as string | undefined;
      if (!newAccessToken) {
        clearAuthStorage();
        return Promise.reject(error);
      }

      setAccessToken(newAccessToken);

      const headers = AxiosHeaders.from(originalRequest.headers);
      headers.set("Authorization", `Bearer ${newAccessToken}`);
      originalRequest.headers = headers;

      return api(originalRequest);
    } catch (refreshError) {
      clearAuthStorage();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
