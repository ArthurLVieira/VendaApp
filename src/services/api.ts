import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { Storage } from "@/utils/storage";
import { AuthRepository } from "./repository/AuthRepository";
import { RegisterRepository } from "./repository/RegisterRepository";
import { ClienteRepository } from "./repository/ClienteRepository";

export const TOKEN_KEY = "@apivenda:token";
export const USER_KEY = "@apivenda:user";
export const REFRESH_KEY = "@apivenda:refresh";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Storage.get<string>(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

async function performRefresh() {
  const refreshToken = Storage.get<string>(REFRESH_KEY);
  if (!refreshToken) throw new Error("Sem refresh token");

  const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
    refreshToken,
  });

  Storage.set(TOKEN_KEY, data.accessToken);
  Storage.set(REFRESH_KEY, data.refreshToken);
  if (data.data) Storage.set(USER_KEY, data.data);

  return data.accessToken as string;
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
        refreshPromise ??= performRefresh().finally(() => {
          refreshPromise = null;
        });
        const newToken = await refreshPromise;
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        Storage.clearAuth();
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
