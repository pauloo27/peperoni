import { DataTypes } from "sequelize";

export function definePost(sequelize) {
  const PostModel = sequelize.define("Post", {
    name: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: false,
    },
    likeCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(64),
      unique: false,
      allowNull: false,
    },
    ingredients: {
      type: DataTypes.STRING(256),
      unique: false,
      allowNull: false,
    },
    photoId: {
      type: DataTypes.STRING(36),
      unique: false,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  });

  PostModel.belongsTo(sequelize.models.User, { foreignKey: "userId" });
}
