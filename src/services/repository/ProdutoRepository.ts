import type { AxiosInstance } from "axios";
import { BaseRepository } from "./BaseRepository";
import { Produto, type RawProduto } from "@/models/Produto";
import type {
  ApiResponse,
  PageModel,
  ProdutoPayload,
  RawPage,
} from "@/types/api";

const SORTABLE_FIELDS = [
  "id",
  "descricao",
  "codigoDeBarras",
  "preco",
  "quantidade",
] as const;
type SortField = (typeof SORTABLE_FIELDS)[number];

function normalizeSort(sort?: string): string {
  const [rawField, rawDir] = (sort ?? "").split(",");
  const field = (SORTABLE_FIELDS as readonly string[]).includes(rawField)
    ? (rawField as SortField)
    : "descricao";
  const dir = rawDir?.toLowerCase() === "desc" ? "desc" : "asc";
  return `${field},${dir}`;
}

export class ProdutoRepository extends BaseRepository {
  constructor(http: AxiosInstance) {
    super(http, "/api/produto");
  }

  public async findById(id: number): Promise<Produto> {
    const response = await this.get<ApiResponse<RawProduto>>(`/${id}`);
    return Produto.fromRaw(response.data);
  }

  public async search(
    params: ProdutoSearchParams = {},
  ): Promise<PageModel<Produto>> {
    const q = new URLSearchParams();
    if (params.search?.trim()) q.set("search", params.search.trim());
    q.set("page", String(params.page ?? 0));
    q.set("size", String(params.size ?? 10));
    q.set("sort", normalizeSort(params.sort));

    const res = await this.get<ApiResponse<RawPage<RawProduto>>>(`?${q}`);
    const p = res.data;
    return {
      content: p.content.map(Produto.fromRaw),
      totalElements: p.totalElements,
      totalPages: p.totalPages,
      page: p.number,
      size: p.size,
      first: p.first,
      last: p.last,
    };
  }

  async create(payload: ProdutoPayload): Promise<Produto> {
    const res = await this.post<ApiResponse<RawProduto>, ProdutoPayload>(
      "",
      payload,
    );
    return Produto.fromRaw(res.data);
  }

  async update(id: number, payload: ProdutoPayload): Promise<Produto> {
    const res = await this.put<ApiResponse<RawProduto>, ProdutoPayload>(
      `/${id}`,
      payload,
    );
    return Produto.fromRaw(res.data);
  }

  async deleteById(id: number): Promise<void> {
    await this.delete<ApiResponse<void>>(`/${id}`);
  }
}
