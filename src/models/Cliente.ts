import { parseLocalDate } from "@/utils/functionUtils";
import { Entity, type RawEntity } from "./base/Entity";

export interface RawCliente extends RawEntity {
  nomeCompleto: string;
  cpf?: string | null;
  dataNascimento?: string | null;
}

export class Cliente extends Entity<RawCliente> {
  readonly nomeCompleto: string;
  readonly cpf?: string;
  readonly dataNascimento?: Date;

  constructor(raw: RawCliente) {
    super(raw);
    this.nomeCompleto = raw.nomeCompleto ?? "";
    this.cpf = raw.cpf ?? undefined;
    this.dataNascimento = parseLocalDate(raw.dataNascimento);
  }

  get cpfFormatado(): string {
    if (!this.cpf) return "—";
    const d = this.cpf.replace(/\D/g, "");
    return d.length === 11
      ? d.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")
      : this.cpf;
  }

  get dataNascimentoFormatado(): string {
    return this.dataNascimento
      ? this.dataNascimento.toLocaleDateString("pt-BR")
      : "—";
  }

  get idade(): number | undefined {
    if (!this.dataNascimento) return undefined;

    const hoje = new Date();
    let idade = hoje.getFullYear() - this.dataNascimento.getFullYear();
    const m = hoje.getMonth() - this.dataNascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < this.dataNascimento.getDate()))
      idade--;
    return idade;
  }

  get iniciais(): string {
    return (
      this.nomeCompleto
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
