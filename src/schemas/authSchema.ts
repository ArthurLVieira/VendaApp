import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail")
    .email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
