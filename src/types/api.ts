import type { RawEmpresa } from "@/models/Empresa";
import type { RawUsuario } from "@/models/Usuario";

export interface ApiError {
  code?: string | null;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
  errors?: ApiError[] | null;
  traceId?: string | null;
  path?: string | null;
  timestamp?: string | null;
}

export interface AuthResponse<T> {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  data: T;
}

export type AuthUsuarioResponse = AuthResponse<RawUsuario>;

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UsuarioRegisterPayload {
  email: string;
  senha: string;
  nome: string;
  cpf: string;
  ativo?: boolean;
}

export interface EmpresaRegisterPayload {
  nomeRazao: string;
  cpfCnpj: string;
  logoUrl?: string;
  email?: string;
}

export interface RegisterRequest {
  usuario: UsuarioRegisterPayload;
  empresa: EmpresaRegisterPayload;
}

export interface RegisterResponse {
  usuario: RawUsuario;
  empresa: RawEmpresa;
}

export interface RawPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface PageModel<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface ClienteSearchParams {
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface ClientePayload {
  nomeCompleto: string;
  cpf?: string;
  dataNascimento?: string;
}

export interface ProdutoSearchParams {
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface ProdutoPayload {
  descricao: string;
  codigoDeBarras?: string;
  preco: string;
  quantidade: string;
}
