import axios from "axios";
import { buildLoginUrl } from "@/utils/authRedirects";
import tokenService from "./tokenService";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = tokenService.get();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const requestUrl = error.config?.url || "";
    const isPublicAuthRequest = [
      "/auth/register",
      "/auth/login",
      "/auth/google",
      "/auth/forgot-password",
      "/auth/reset-password",
    ].some((path) => requestUrl.startsWith(path));

    if (error.response?.status === 401 && !isPublicAuthRequest) {
      tokenService.remove();

      if (typeof window !== "undefined") {
        window.location.href = buildLoginUrl(
          `${window.location.pathname}${window.location.search}`,
        );
      }
    }

    return Promise.reject(error);
  },
);

export default api;
