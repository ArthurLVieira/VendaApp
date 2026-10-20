import type { RawUsuario } from "@/models/Usuario";
import { Storage } from "@/utils/storage";

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
  }
}
