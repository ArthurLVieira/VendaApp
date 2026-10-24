import { z } from "zod";

const onlyDigits = (v: string) => v.replace(/\D/g, "");

export const clienteSchema = z.object({
  nomeRazao: z
    .string()
    .trim()
    .min(3, "Nome/Razão deve ter no mínimo 3 caracteres")
    .max(200, "Máximo 200 caracteres"),

  cpfCnpj: z.string().refine((v) => {
    const n = onlyDigits(v).length;
    return n === 11 || n === 14;
  }, "CPF (11 dígitos) ou CNPJ (14 dígitos)"),

  nomeFantazia: z
    .string()
    .trim()
    .max(200, "Máximo 200 caracteres")
    .optional()
    .or(z.literal("")),

  dataNascimentoCriacao: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")
    .optional()
    .or(z.literal("")),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;
