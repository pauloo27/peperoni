import { db } from "../../integrations/db.js";
import { createHash } from "crypto";
import { handleUniqueConstraintError } from "../../core/db_errors.js";
import jwt from "jsonwebtoken";
import {
  CreateUserSchema,
  SelfUpdateUserSchema,
  UpdateOtherUserSchema,
  UserLoginSchema,
} from "./user_schema.js";
import { doUpdate } from "./user_helper.js";

export const passwordHashAlgorithm = "sha256";
const expiresInSeconds = 60 * 60;

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

export async function getUser(req, res) {
  const UserModel = db.models.User;
  const id = req.params.id;

  res.send(
    await UserModel.findOne({
      where: { id },
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

export async function listUsers(_req, res) {
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

  if ((await UserModel.count({ where: { id } })) === 0) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  await doUpdate(updateUser, id);

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
    { email: user.email, isAdmin: user.isAdmin, id: user.id },
    jwtSecret,
    { expiresIn: expiresInSeconds },
  );

  res.status(200).json({ accessToken, expiresIn: expiresInSeconds });
}

export async function selfUpdateUser(req, res) {
  const data = req.body;
  const updateUser = SelfUpdateUserSchema.parse(data);
  const id = req.user.id;

  await doUpdate(updateUser, id);

  res.status(200).json({ message: "Usuário atualizado com sucesso" });
}
