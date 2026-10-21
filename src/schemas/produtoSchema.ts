import { z } from "zod";

/** "1.234,56" → número 1234.56 (para validar > 0). */
function parseMaskedNumber(s: string): number {
  const clean = s.replace(/\./g, "").replace(",", ".");
  const n = parseFloat(clean);
  return Number.isFinite(n) ? n : NaN;
}

export const produtoSchema = z.object({
  descricao: z
    .string()
    .trim()
    .min(3, "Descrição deve ter no mínimo 3 caracteres")
    .max(200, "Máximo 200 caracteres"),

  codigoDeBarras: z
    .string()
    .trim()
    .max(50, "Máximo 50 caracteres")
    .optional()
    .or(z.literal("")),

  preco: z
    .string()
    .min(1, "Preço é obrigatório")
    .refine((v) => {
      const n = parseMaskedNumber(v);
      return Number.isFinite(n) && n > 0;
    }, "Preço deve ser maior que zero"),

  quantidade: z
    .string()
    .min(1, "Quantidade é obrigatória")
    .refine((v) => {
      const n = parseMaskedNumber(v);
      return Number.isFinite(n) && n >= 0;
    }, "Quantidade não pode ser negativa"),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;
