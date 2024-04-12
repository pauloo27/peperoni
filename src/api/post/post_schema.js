import { z } from "zod";

export const CreatePostSchema = z.object({
  name: z
    .string()
    .min(3, "O nome não pode ser menor que 3")
    .max(32, "O nome não pode ser maior que 32"),
  description: z
    .string()
    .min(3, "A descrição não pode ser menor que 3")
    .max(64, "A descrição não pode ser maior que 64"),
  ingredients: z
    .string()
    .min(3, "Os ingredientes não podem ser menores que 3")
    .max(256, "Os ingredientes não podem ser maiores que 256"),
  price: z.number().min(0, "O preço não pode ser negativo"),
});
