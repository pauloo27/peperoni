import { z } from "zod";

export const CreateUserSchema = z.object({
  fullName: z
    .string()
    .min(3, "O nome não pode ser menor que 3")
    .max(32, "O nome não pode ser maior que 32"),
  email: z
    .string()
    .email("O e-mail deve ser valido")
    .max(64, "O e-mail não pode ser maior que 64"),
  password: z
    .string()
    .min(8, "A senha deve conter ao menos 8 caracteres")
    .max(32, "A senha não pode ser maior que 32")
    .regex(/\d+/, "A senha deve conter ao menos um número")
    .regex(/[A-Za-z]+/, "A senha deve conter ao menos uma letra"),
  isAdmin: z.boolean().default(false),
});

export const SelfUpdateUserSchema = z.object({
  fullName: z
    .string()
    .min(3, "O nome não pode ser menor que 3")
    .max(32, "O nome não pode ser maior que 32")
    .optional(),
  newPassword: z
    .string()
    .min(8, "A senha deve conter ao menos 8 caracteres")
    .max(32, "A senha não pode ser maior que 32")
    .regex(/\d+/, "A senha deve conter ao menos um número")
    .regex(/[A-Za-z]+/, "A senha deve conter ao menos uma letra")
    .optional(),
});

export const UpdateOtherUserSchema = z.object({
  fullName: z
    .string()
    .min(3, "O nome não pode ser menor que 3")
    .max(32, "O nome não pode ser maior que 32")
    .optional(),
  newPassword: z
    .string()
    .min(8, "A senha deve conter ao menos 8 caracteres")
    .max(32, "A senha não pode ser maior que 32")
    .regex(/\d+/, "A senha deve conter ao menos um número")
    .regex(/[A-Za-z]+/, "A senha deve conter ao menos uma letra")
    .optional(),
});

export const UserLoginSchema = z.object({
  email: z.string().email("O e-mail deve ser valido"),
  password: z
    .string()
    .min(8, "A senha deve conter ao menos 8 caracteres")
    .max(32, "A senha não pode ser maior que 32")
    .regex(/\d+/, "A senha deve conter ao menos um número")
    .regex(/[A-Za-z]+/, "A senha deve conter ao menos uma letra"),
});
