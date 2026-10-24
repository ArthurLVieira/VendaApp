import { parseLocalDate } from "@/utils/functionUtils";
import { Entity, type RawEntity } from "./base/Entity";

export interface RawCliente extends RawEntity {
  nomeRazao: string;
  cpfCnpj: string;
  nomeFantazia?: string | null;
  dataNascimentoCriacao?: string | null;
  fornecedor: boolean;
  status: boolean;
}

export class Cliente extends Entity<RawCliente> {
  readonly nomeRazao: string;
  readonly cpfCnpj: string;
  readonly nomeFantazia?: string | null;
  readonly dataNascimentoCriacao?: Date;
  readonly fornecedor: boolean;
  readonly status: boolean;

  constructor(raw: RawCliente) {
    super(raw);
    this.nomeRazao = raw.nomeRazao;
    this.cpfCnpj = raw.cpfCnpj;
    this.nomeFantazia = raw.nomeFantazia ?? undefined;
    this.dataNascimentoCriacao = parseLocalDate(raw.dataNascimentoCriacao);
    this.fornecedor = raw.fornecedor;
    this.status = raw.status;
  }

  get cpfCnpjFormatado(): string {
    if (!this.cpfCnpj) return "—";
    const d = this.cpfCnpj.replace(/\D/g, "");
    return d.length === 11
      ? d.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")
      : this.cpfCnpj;
  }

  get dataNascimentoCriacaoFormatado(): string {
    return this.dataNascimentoCriacao
      ? this.dataNascimentoCriacao.toLocaleDateString("pt-BR")
      : "—";
  }

  get idade(): number | undefined {
    if (!this.dataNascimentoCriacao) return undefined;

    const hoje = new Date();
    let idade = hoje.getFullYear() - this.dataNascimentoCriacao.getFullYear();
    const m = hoje.getMonth() - this.dataNascimentoCriacao.getMonth();
    if (
      m < 0 ||
      (m === 0 && hoje.getDate() < this.dataNascimentoCriacao.getDate())
    )
      idade--;
    return idade;
  }

  get iniciais(): string {
    return (
      this.nomeRazao
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase() || "?"
    );
  }

  static fromRaw(raw: RawCliente): Cliente {
    return new Cliente(raw);
  }
}
