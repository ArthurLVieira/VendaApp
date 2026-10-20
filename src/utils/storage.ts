const REMEMBER_KEY = "@apivenda:remember";

export const Storage = {
  isRemembered(): boolean {
    return localStorage.getItem(REMEMBER_KEY) === "true";
  },
  setRemembered(value: boolean): void {
    localStorage.setItem(REMEMBER_KEY, String(value));
    if (!value) {
      localStorage.removeItem("@apivenda:token");
      localStorage.removeItem("@apivenda:refresh");
      localStorage.removeItem("@apivenda:user");
    }
  },
  active(): globalThis.Storage {
    return this.isRemembered() ? localStorage : sessionStorage;
  },
  get<T>(key: string): T | null {
    const raw =
      this.active().getItem(key) ??
      sessionStorage.getItem(key) ??
      localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  set<T>(key: string, value: T): void {
    this.active().setItem(key, JSON.stringify(value));
  },
  remove(key: string): void {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  },
  clear(): void {
    localStorage.clear();
  },
  clearAuth(): void {
    ["@apivenda:token", "@apivenda:refresh", "@apivenda:user"].forEach((k) =>
      this.remove(k),
    );
  },
};
