export async function doUpdate(updateUser, id) {
  const UserModel = db.models.User;
  const salt = process.env.PASSWORD_HASH_SALT;

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
}
