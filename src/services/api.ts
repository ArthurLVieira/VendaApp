import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { AuthRepository } from "./repository/AuthRepository";
import { RegisterRepository } from "./repository/RegisterRepository";
import { ClienteRepository } from "./repository/ClienteRepository";
import { tokenManager } from "./auth/tokenManager";

export const TOKEN_KEY = "@apivenda:token";
export const USER_KEY = "@apivenda:user";
export const REFRESH_KEY = "@apivenda:refresh";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const url = config.url ?? "";

  const isPublic =
    url.includes("/auth/loin") ||
    url.includes("/auth/refresh") ||
    url.includes("/register");

  if (isPublic || !tokenManager.isAuthenticated()) {
    return config;
  }

  if (tokenManager.isExpiringSoon()) {
    try {
      const newToken = await tokenManager.refresh();
      config.headers.Authorization = `Bearer ${newToken}`;
      return config;
    } catch {}
  }

  const token = tokenManager.getAccessToken();

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;
    const status = error.response?.status;
    const url = original?.url ?? "";

    const isAuthRoute =
      url.includes("/auth/login") ||
      url.includes("/auth/refresh") ||
      url.includes("/register");

    if (status === 401 && original && !original._retry && !isAuthRoute) {
      original._retry = true;

      try {
        const newToken = await tokenManager.refresh();
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        tokenManager.clearSession();
        if (!location.pathname.startsWith("/login")) location.assign("/login");
      }
    }

    return Promise.reject(error);
  },
);

export type ApiInstance = AxiosInstance;
export const authRepository = new AuthRepository(api);
export const registerRepository = new RegisterRepository(api);
export const clienteRespository = new ClienteRepository(api);
