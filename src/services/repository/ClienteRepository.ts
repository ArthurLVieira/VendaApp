import type { AxiosInstance } from "axios";
import { BaseRepository } from "./BaseRepository";
import { Cliente, type RawCliente } from "@/models/Cliente";
import {
  type ApiResponse,
  type ClientePayload,
  type ClienteSearchParams,
  type PageModel,
  type RawPage,
} from "@/types/api";

const SORTABLE_FIELDS = [
  "id",
  "nomeRazao",
  "cpfCnpj",
  "dataNascimentoCriacao",
  "status",
  "fornecedor",
] as const;
type SortField = (typeof SORTABLE_FIELDS)[number];

function normalizeSort(sort?: string): string {
  const [rawField, rawDir] = (sort ?? "").split(",");
  const field = (SORTABLE_FIELDS as readonly string[]).includes(rawField)
    ? (rawField as SortField)
    : SORTABLE_FIELDS[0];
  const dir = rawDir?.toLowerCase() === "desc" ? "desc" : "asc";
  return `${field},${dir}`;
}

export class ClienteRepository extends BaseRepository {
  constructor(http: AxiosInstance) {
    super(http, "/api/cliente");
  }

  public async findById(id: number): Promise<Cliente> {
    const data = await this.get<ApiResponse<RawCliente>>(`/${id}`);
    return Cliente.fromRaw(data.data);
  }

  async search(params: ClienteSearchParams = {}): Promise<PageModel<Cliente>> {
    const searchParams = new URLSearchParams();
    if (params.search?.trim()) searchParams.set("search", params.search.trim());
    searchParams.set("fornecedor", String(params.fornecedor ?? false));
    searchParams.set("page", String(params.page ?? 0));
    searchParams.set("size", String(params.size ?? 10));
    searchParams.set("sort", normalizeSort(params.sort));

    const response = await this.get<ApiResponse<RawPage<RawCliente>>>(
      `?${searchParams}`,
    );
    const page = response.data;

    return {
      content: page.content.map(Cliente.fromRaw),
      totalElements: page.totalElements,
      totalPages: page.totalPages,
      page: page.number,
      size: page.size,
      first: page.first,
      last: page.last,
    };
  }

  async create(payload: ClientePayload): Promise<Cliente> {
    const response = await this.post<ApiResponse<RawCliente>, ClientePayload>(
      "",
      payload,
    );

    return Cliente.fromRaw(response.data);
  }

  async update(id: number, payload: ClientePayload): Promise<Cliente> {
    const response = await this.put<ApiResponse<RawCliente>, ClientePayload>(
      `/${id}`,
      payload,
    );

    return Cliente.fromRaw(response.data);
  }

  async deleteById(id: number): Promise<void> {
    await this.delete<ApiResponse<void>>(`/${id}`);
  }

  async switchFornecedor(id: number): Promise<Cliente> {
    const response = await this.patch<ApiResponse<RawCliente>>(
      `/switch/fornecedor/${id}`,
    );

    return Cliente.fromRaw(response.data);
  }

  async switchStatus(id: number): Promise<Cliente> {
    const response = await this.patch<ApiResponse<RawCliente>>(
      `/switch/status/${id}`,
    );

    return Cliente.fromRaw(response.data);
  }
}
