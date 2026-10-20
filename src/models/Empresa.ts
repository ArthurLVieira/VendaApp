import { Entity, type RawEntity } from "./base/Entity";

export interface RawEmpresa extends RawEntity {
  nomeRazao: string;
  cpfCnpj: string;
  logoUrl?: string;
  email?: string;
}

export class Empresa extends Entity<RawEmpresa> {
  readonly nomeRazao: string;
  readonly cpfCnpj: string;
  readonly logoUrl?: string;
  readonly email?: string;

  constructor(raw: RawEmpresa) {
    super(raw);
    this.nomeRazao = raw.nomeRazao;
    this.cpfCnpj = raw.cpfCnpj;
    this.logoUrl = raw.logoUrl;
    this.email = raw.email;
  }

  get cpfCnpjFormatado(): string {
    const doc = this.cpfCnpj.replace(/\D/g, "");

    if (doc.length === 14) {
      return doc.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        "$1.$2.$3/$4-$5",
      );
    }

    if (doc.length === 11) {
      return doc.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    }

    return this.cpfCnpj;
  }

  get iniciais(): string {
    return this.nomeRazao
      .split(" ")
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  }

  get isPessoaJuridica(): boolean {
    return this.cpfCnpj.replace(/\D/g, "").length === 14;
  }

  static fromRaw(raw: RawEmpresa): Empresa {
    return new Empresa(raw);
  }
}
