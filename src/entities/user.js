import { DataTypes } from "sequelize";

export function defineUser(sequelize) {
  sequelize.define("User", {
    fullName: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: false,
    },
    email: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false,
    },
    passwordHashAlgorithm: {
      type: DataTypes.STRING(32),
      unique: false,
      allowNull: false,
    },
    hashedPassword: {
      type: DataTypes.STRING(128),
      unique: false,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
}
