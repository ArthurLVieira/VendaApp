import { z } from "zod";

const onlyDigits = (v: string) => v.replace(/\D/g, "");

export const registerSchema = z.object({
  empresa: z.object({
    nomeRazao: z
      .string()
      .trim()
      .min(2, "Informe a razão social")
      .max(150, "Máximo 150 caracteres"),
    cpfCnpj: z.string().refine((v) => {
      const d = onlyDigits(v);
      return d.length === 11 || d.length === 14;
    }, "CPF ou CNPJ inválido"),
    email: z
      .string()
      .trim()
      .email("E-mail inválido")
      .optional()
      .or(z.literal("")),
    logoUrl: z.string().trim().url("URL inválida").optional().or(z.literal("")),
  }),
  usuario: z
    .object({
      nome: z.string().trim().min(1, "Informe o nome"),
      cpf: z
        .string()
        .refine((v) => onlyDigits(v).length === 11, "CPF inválido"),
      email: z.string().trim().email("E-mail inválido"),
      senha: z
        .string()
        .min(6, "Mínimo 6 caracteres")
        .max(72, "Máximo 72 caracteres"),
      confirmarSenha: z.string(),
    })
    .refine((d) => d.senha === d.confirmarSenha, {
      message: "As senhas não coincidem",
      path: ["confirmarSenha"],
    }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
