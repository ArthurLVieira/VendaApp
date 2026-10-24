export function maskCpfCnpj(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  }
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5");
}

export function maskCpf(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

export function parseLocalDate(iso?: string | null): Date | undefined {
  if (!iso) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

export function toLocalDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const onlyDigits = (v: string) => v.replace(/\D/g, "");

export function toNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

export function formatBRL(value: string | number | null | undefined): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(toNumber(value));
}

export function formatQuantity(
  value: string | number | null | undefined,
): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(toNumber(value));
}

export function maskCurrency(raw: string): string {
  let digits = raw.replace(/\D/g, "");

  digits = digits.replace(/^0+(?=\d{3,})/, "");

  if (!digits) return "";

  digits = digits.padStart(3, "0");

  const intPart = digits.slice(0, -2);
  const decPart = digits.slice(-2);
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${intFormatted},${decPart}`;
}

export function parseCurrencyToBigDecimal(masked: string): string {
  const clean = masked.replace(/[^\d,]/g, "").replace(",", ".");
  if (!clean) return "0.00";
  const n = parseFloat(clean);
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
}

export function parseDecimalToBigDecimal(masked: string, decimals = 3): string {
  const clean = masked
    .replace(/[^\d,.]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  if (!clean) return "0";
  const n = parseFloat(clean);
  return Number.isFinite(n) ? n.toFixed(decimals) : "0";
}

export function toBigDecimal(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

export function stripCpfCnpj(value: string): string {
  return onlyDigits(value);
}

export function isCpf(value: string): boolean {
  return onlyDigits(value).length === 11;
}

export function isCnpj(value: string): boolean {
  return onlyDigits(value).length === 14;
}

export function labelDocument(value: string): "CPF" | "CNPJ" | "CPF/CNPJ" {
  const n = onlyDigits(value).length;
  if (n <= 11) return "CPF";
  if (n === 14) return "CNPJ";
  return "CPF/CNPJ";
}
