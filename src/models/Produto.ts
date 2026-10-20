export interface RawProduto extends RawEntity {
  descricao: string;
  codigoDeBarras?: string;
  preco: string;
  quantidade: string;
}

export class Produto extends Entity<RawProduto> {
  readonly descricao: string;
  readonly codigoDeBarras: string;
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

  get quantidadeNumerica(): {};
}
