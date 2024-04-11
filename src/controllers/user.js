import { db } from "../services/db.js";
import { createHash } from "crypto";
import { handleUniqueConstraintError } from "../core/db_errors.js";
import jwt from "jsonwebtoken";
import {
  CreateUserSchema,
  SelfUpdateUserSchema,
  UpdateOtherUserSchema,
  UserLoginSchema,
} from "../schemas/user.js";

const passwordHashAlgorithm = "sha256";
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
