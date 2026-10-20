import { z } from "zod";

const onlyDigits = (v: string) => v.replace(/\D/g, "");

export const clienteSchema = z.object({
  nomeCompleto: z
    .string()
    .trim()
    .min(3, "Informe o nome completo")
    .max(150, "Máximo 150 caracteres"),
  cpf: z
    .string()
    .refine((v) => !v || onlyDigits(v).length === 11, "CPF deve ter 11 dígitos")
    .optional()
    .or(z.literal("")),
  dataNascimento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")
    .optional()
    .or(z.literal("")),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;
