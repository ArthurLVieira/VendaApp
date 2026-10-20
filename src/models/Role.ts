import { Entity, type RawEntity } from "./base/Entity";

export interface RawRole extends RawEntity {
  name: string;
}

export class Role extends Entity<RawRole> {
  readonly name: string;

  constructor(raw: RawRole) {
    super(raw);
    this.name = raw.name;
  }

  get idAdmin(): boolean {
    return this.name === "ROLE_ADMIN";
  }

  get isUser(): boolean {
    return this.name === "ROLE_USER";
  }

  get label(): string {
    return this.name.replace("ROLE_", "");
  }

  static fromRaw(raw: RawRole): Role {
    return new Role(raw);
  }

  static fromRawList(list: RawRole[]): Role[] {
    return list.map(Role.fromRaw);
  }
}
