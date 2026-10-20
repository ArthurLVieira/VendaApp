import { Entity, type RawEntity } from "./base/Entity";
import { Empresa, type RawEmpresa } from "./Empresa";
import { Role } from "./Role";

export interface RawUsuario extends RawEntity {
  email: string;
  nome: string;
  cpf?: string;
  ativo: boolean;
  empresa: RawEmpresa;
  roles: Role[];
}

export class Usuario extends Entity<RawUsuario> {
  readonly email: string;
  readonly nome: string;
  readonly cpf?: string;
  readonly ativo: boolean;
  readonly empresa: RawEmpresa;
  readonly roles: Role[];

  constructor(raw: RawUsuario) {
    super(raw);
    this.email = raw.email;
    this.nome = raw.nome;
    this.cpf = raw.cpf;
    this.ativo = raw.ativo;
    this.empresa = new Empresa(raw.empresa);
    this.roles = (raw.roles ?? []).map(Role.fromRaw);
  }

  get iniciais(): string {
    if (this.nome) {
      return this.nome.charAt(0).toUpperCase();
    }
    return this.email.charAt(0).toUpperCase();
  }

  get empresaId(): number | undefined {
    return this.empresa?.id;
  }

  hasRole(role: string): boolean {
    return this.roles.some((r) => r.nome === role);
  }

  idAdmin(): boolean {
    return this.hasRole("ROLE_ADMIN");
  }

  isUser(): boolean {
    return this.hasRole("ROLE_USER");
  }

  static fromRaw(raw: RawUsuario) {
    return new Usuario(raw);
  }

  static fromRawList(list: RawUsuario[]): Usuario[] {
    return list.map(Usuario.fromRaw);
  }
}
