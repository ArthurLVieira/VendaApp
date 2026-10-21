import type { RawUsuario } from "@/models/Usuario";
import { Storage } from "@/utils/storage";
import axios from "axios";

export const TOKEN_KEY = "@apivenda:token";
export const REFRESH_KEY = "@apivenda:refresh";
export const EXPIRES_KEY = "@apivenda:expiresAt";
export const USER_KEY = "@apivenda:user";

export type TokenEvent = "session:refreshed" | "session:expired";

export interface SessionResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  data: RawUsuario;
}

interface TokenState {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: RawUsuario;
}

class TokenManager {
  private state: TokenState | null = null;
  private refreshPromise: Promise<string> | null = null;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners = new Set<(event: TokenEvent) => void>();
  private baseURL = import.meta.env.VITE_API_URL || "";

  constructor() {}

  hydrate(): void {
    const accessToken = Storage.get<string>(TOKEN_KEY);
    const refreshToken = Storage.get<string>(REFRESH_KEY);
    const expiresAt = Storage.get<number>(EXPIRES_KEY);
    const user = Storage.get<RawUsuario>(USER_KEY);

    if (accessToken && refreshToken && expiresAt && user) {
      this.state = { accessToken, refreshToken, expiresAt, user };
      this.scheduleRefresh();
    } else {
      this.state = null;
    }
  }

  setSession(session: SessionResponse, rememberMe: boolean): void {
    Storage.setRemembered(rememberMe);

    const expiresAt = Date.now() + session.expiresIn;

    this.state = {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      expiresAt,
      user: session.data,
    };

    Storage.set(TOKEN_KEY, session.accessToken);
    Storage.set(REFRESH_KEY, session.refreshToken);
    Storage.set(EXPIRES_KEY, expiresAt);
    Storage.set(USER_KEY, session.data);

    this.cancelRefreshTimer();
  }

  clearSession(): void {
    this.state = null;
    Storage.clearAuth();
    Storage.remove(EXPIRES_KEY);
    this.cancelRefreshTimer();
  }

  getAccessToken(): string | null {
    return this.state?.accessToken ?? null;
  }

  getRefreshToken(): string | null {
    return this.state?.refreshToken ?? null;
  }

  getUser(): RawUsuario | null {
    return this.state?.user ?? null;
  }

  isAuthenticated(): boolean {
    return this.state !== null;
  }

  isExpiringSoon(thresholdMs = 120_000): boolean {
    if (!this.state) return false;
    return this.state.expiresAt - Date.now() <= thresholdMs;
  }

  async refresh(): Promise<string> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = this.doRefresh().finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  private async doRefresh(): Promise<string> {
    const refresToken = this.getRefreshToken();

    if (!refresToken) throw new Error("Sem refres token");

    const { data } = await axios.post<SessionResponse>(
      `${this.baseURL}/auth/refresh`,
      { refresToken },
    );

    this.state = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: Date.now() + data.expiresIn,
      user: data.data,
    };

    Storage.set(TOKEN_KEY, data.accessToken);
    Storage.set(REFRESH_KEY, data.refreshToken);
    Storage.set(EXPIRES_KEY, this.state.expiresAt);
    Storage.set(USER_KEY, data.data);

    this.scheduleRefresh();
    this.emit("session:refreshed");

    return data.accessToken;
  }

  private async refreshOrExpire(): Promise<void> {
    try {
      await this.refresh();
    } catch {
      this.clearSession();
      this.emit("session:expired");
    }
  }

  private cancelRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private listenToOtherTabs(): void {
    if (typeof window === "undefined") return;

    window.addEventListener("storage", (e) => {
      if (e.key === TOKEN_KEY || e.key === null) return;

      this.hydrate();
      if (this.state) this.emit("session:refreshed");
      else this.emit("session:expired");
    });
  }

  on(listener: (event: TokenEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: TokenEvent): void {
    this.listeners.forEach((l) => l(event));
  }

  getRemainigMs(): number | null {
    if (!this.state) return null;
    return this.state.expiresAt - Date.now();
  }

  private scheduleRefresh(): void {
    this.cancelRefreshTimer();
    if (!this.state) return;

    const msUntilExpiry = this.state.expiresAt - Date.now();
    if (msUntilExpiry <= 0) {
      void this.refreshOrExpire();
      return;
    }

    const delay = Math.max(0, msUntilExpiry - 10_000);
    this.refreshTimer = setTimeout(() => {
      void this.refreshOrExpire();
    }, delay);
  }
}

export const tokenManager = new TokenManager();
