import { z } from "zod";
import { db } from "../services/db.js";
import { createHash } from "crypto";
import { handleUniqueConstraintError } from "../core/db_errors.js";

const CreateUserSchema = z.object({
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
});

export async function createUser(req, res) {
  const UserModel = db.models.User;
  const data = req.body;
  const createUser = CreateUserSchema.parse(data);
  const salt = process.env.PASSWORD_HASH_SALT;

  const passwordHashAlgorithm = "sha256";
  const hashedPassword = createHash("sha256")
    .update(`${salt}${createUser.password}`)
    .digest("hex");

  const isFirstUser = (await UserModel.count()) === 0;

  await UserModel.create({
    email: createUser.email,
    fullName: createUser.fullName,
    hashedPassword,
    passwordHashAlgorithm,
    isAdmin: isFirstUser,
  }).catch(handleUniqueConstraintError("E-mail já cadastrado"));

  res.status(201).json({ message: "Usuário criado com sucesso" });
}
