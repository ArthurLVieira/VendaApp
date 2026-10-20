import type { RawEntity } from "./base/Entity";
import type { RawStatusVenda } from "./StatusVenda";

export interface RawVenda extends RawEntity {
  status: RawStatusVenda;
}
