import { z } from "zod";
import { db } from "../services/db.js";
import { createHash } from "crypto";
import { handleUniqueConstraintError } from "../core/db_errors.js";
import jwt from "jsonwebtoken";

const passwordHashAlgorithm = "sha256";
const expiresInSeconds = 60 * 60;

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
  isAdmin: z.boolean().default(false),
});

const SelfUpdateUserSchema = z.object({
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

const UpdateOtherUserSchema = z.object({
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

const UserLoginSchema = z.object({
  email: z.string().email("O e-mail deve ser valido"),
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

  const hashedPassword = createHash(passwordHashAlgorithm)
    .update(`${salt}${createUser.password}`)
    .digest("hex");

  await UserModel.create({
    email: createUser.email,
    fullName: createUser.fullName,
    hashedPassword,
    passwordHashAlgorithm,
    isAdmin: createUser.isAdmin,
  }).catch(handleUniqueConstraintError("E-mail já cadastrado"));

  res.status(201).json({ message: "Usuário criado com sucesso" });
}

export async function listUsers(req, res) {
  const UserModel = db.models.User;
  res.send(
    await UserModel.findAll({
      attributes: [
        "id",
        "createdAt",
        "updatedAt",
        "email",
        "fullName",
        "isAdmin",
      ],
    }),
  );
}

export async function deleteUser(req, res) {
  const UserModel = db.models.User;
  const id = req.params.id;

  const updated = await UserModel.destroy({ where: { id } });
  if (updated === 0) {
    res.status(404).json({ message: "Usuário não encontrado" });
    return;
  }

  res.status(200).send({ message: "Usuário deletado com sucesso" });
}

export async function updateOtherUser(req, res) {
  const UserModel = db.models.User;
  const id = req.params.id;
  const data = req.body;
  const updateUser = UpdateOtherUserSchema.parse(data);
  const salt = process.env.PASSWORD_HASH_SALT;

  if ((await UserModel.count({ where: { id } })) === 0) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  if (updateUser.fullName) {
    await UserModel.update(
      { fullName: updateUser.fullName },
      { where: { id } },
    );
  }

  if (updateUser.newPassword) {
    const hashedPassword = createHash(passwordHashAlgorithm)
      .update(`${salt}${updateUser.newPassword}`)
      .digest("hex");

    await UserModel.update(
      { hashedPassword, passwordHashAlgorithm },
      { where: { id } },
    );
  }

  res.status(200).json({ message: "Usuário atualizado com sucesso" });
}

export async function login(req, res) {
  const UserModel = db.models.User;
  const data = req.body;
  const userLogin = UserLoginSchema.parse(data);
  const salt = process.env.PASSWORD_HASH_SALT;
  const jwtSecret = process.env.JWT_SECRET;

  const hashedPassword = createHash(passwordHashAlgorithm)
    .update(`${salt}${userLogin.password}`)
    .digest("hex");

  const user = await UserModel.findOne({
    where: {
      email: userLogin.email,
      hashedPassword,
    },
    limit: 1,
  });

  if (user === null) {
    res.status(401).json({ message: "E-mail ou senha inválidos" });
    return;
  }

  const accessToken = jwt.sign(
    { email: user.email, isAdmin: user.isAdmin },
    jwtSecret,
    { expiresIn: expiresInSeconds },
  );

  res.status(200).json({ accessToken, expiresIn: expiresInSeconds });
}

export async function selfUpdateUser(req, res) {
  const UserModel = db.models.User;
  const data = req.body;
  const updateUser = SelfUpdateUserSchema.parse(data);
  const salt = process.env.PASSWORD_HASH_SALT;
  const user = req.user;

  if (updateUser.fullName) {
    await UserModel.update(
      { fullName: updateUser.fullName },
      { where: { email: user.email } },
    );
  }

  if (updateUser.newPassword) {
    const hashedPassword = createHash(passwordHashAlgorithm)
      .update(`${salt}${updateUser.newPassword}`)
      .digest("hex");

    await UserModel.update(
      { hashedPassword, passwordHashAlgorithm },
      { where: { email: user.email } },
    );
  }

  res.status(200).json({ message: "Usuário atualizado com sucesso" });
}
