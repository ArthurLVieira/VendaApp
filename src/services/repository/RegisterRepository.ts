import type { AxiosInstance } from "axios";
import { BaseRepository } from "./BaseRepository";
import type { RegisterRequest, RegisterResponse } from "@/types/api";

export class RegisterRepository extends BaseRepository {
  constructor(http: AxiosInstance) {
    super(http, "/register");
  }

  public async register(payload: RegisterRequest): Promise<RegisterResponse> {
    return await this.post<RegisterResponse, RegisterRequest>("", payload);
  }
}
