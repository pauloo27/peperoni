import { createHash } from "crypto";
import { passwordHashAlgorithm } from "./api/user/user_controller.js";

export async function ensureAdminExists(db) {
  const UserModel = db.models.User;

  const isFirstUser = (await UserModel.count()) === 0;

  if (!isFirstUser) {
    console.log("There is already a user in the database. Nothing to do.");
    return;
  }

  const salt = process.env.PASSWORD_HASH_SALT;
  const email = process.env.ADMIN_EMAIL;
  const fullName = process.env.ADMIN_FULL_NAME;
  const password = process.env.ADMIN_PASSWORD;

  const hashedPassword = createHash(passwordHashAlgorithm)
    .update(`${salt}${password}`)
    .digest("hex");

  await UserModel.create({
    email,
    fullName,
    hashedPassword,
    passwordHashAlgorithm,
    isAdmin: true,
  });

  console.log("Admin user created successfully.");
}
