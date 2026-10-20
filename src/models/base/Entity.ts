export interface RawEntity {
  id?: number;
}

export abstract class Entity<T extends RawEntity> {
  readonly id: number;

  protected constructor(raw: T) {
    this.id = raw.id ?? 0;
  }

  equals(other: Entity<T>): boolean {
    return this.id === other.id;
  }
}
