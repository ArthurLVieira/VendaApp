import type { AxiosInstance } from "axios";
import { BaseRepository } from "./BaseRepository";
import type {
  AuthUsuarioResponse,
  LoginRequest,
  RefreshTokenRequest,
} from "@/types/api";

export class AuthRepository extends BaseRepository {
  constructor(http: AxiosInstance) {
    super(http, "/auth");
  }

  public async login(payload: LoginRequest): Promise<AuthUsuarioResponse> {
    return await this.post<AuthUsuarioResponse, LoginRequest>(
      "/login",
      payload,
    );
  }

  public async refresh(
    payload: RefreshTokenRequest,
  ): Promise<AuthUsuarioResponse> {
    return await this.post<AuthUsuarioResponse, RefreshTokenRequest>(
      "/refresh",
      payload,
    );
  }

  public async logout(): Promise<void> {
    await this.post<void>("/logout", {});
  }

  public async validateToken(): Promise<boolean> {
    try {
      const { status } = await this.http.get("/auth/validate");
      return status === 200;
    } catch {
      return false;
    }
  }
}
