import { formatBRL, toNumber } from "@/utils/functionUtils";
import { Entity, type RawEntity } from "./base/Entity";

export interface RawProduto extends RawEntity {
  descricao: string;
  codigoDeBarras?: string;
  preco: string;
  quantidade: string;
}

export class Produto extends Entity<RawProduto> {
  readonly descricao: string;
  readonly codigoDeBarras: string | undefined;
  readonly preco: string;
  readonly quantidade: string;

  constructor(raw: RawProduto) {
    super(raw);
    this.descricao = raw.descricao ?? "";
    this.codigoDeBarras = raw.codigoDeBarras ?? undefined;
    this.preco = String(raw.preco ?? "0");
    this.quantidade = String(raw.quantidade ?? "0");
  }

  get precoNumerico(): number {
    return toNumber(this.preco);
  }

  get quantidadeNumerica(): number {
    return toNumber(this.quantidade);
  }

  get quantidadeFormatada(): string {
    return formatBRL(this.quantidade);
  }

  get semEstoque(): boolean {
    return this.quantidadeNumerica <= 0;
  }

  get estoqueBaixo(): boolean {
    const q = this.quantidadeNumerica;
    return q > 0 && q < 10;
  }

  get iniciais(): string {
    return this.descricao.trim().charAt(0).toUpperCase() || "?";
  }

  static fromRaw(raw: RawProduto): Produto {
    return new Produto(raw);
  }
}
