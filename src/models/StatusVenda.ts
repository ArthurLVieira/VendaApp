import { Entity, type RawEntity } from "./base/Entity";

export type StatusVendaEnum = "ABERTA" | "PENDENTE" | "FECHADA" | "CANCELADA";

export interface RawStatusVenda extends RawEntity {
  status: StatusVendaEnum;
}

export class StatusVenda extends Entity<RawStatusVenda> {
  readonly status: StatusVendaEnum;

  constructor(raw: RawStatusVenda) {
    super(raw);
    this.status = raw.status;
  }

  get label(): string {
    return this.status.charAt(0) + this.status.slice(1).toLocaleLowerCase();
  }

  get color(): string {
    const map: Record<StatusVendaEnum, string> = {
      ABERTA:
        "text-primary-600 bg-primary-50 dark:bg-primary-950/40 dark:text-primary-400",
      PENDENTE:
        "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400",
      FECHADA:
        "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400",
      CANCELADA: "text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400",
    };

    return map[this.status];
  }

  static fromRaw(raw: RawStatusVenda): StatusVenda {
    return new StatusVenda(raw);
  }
}
