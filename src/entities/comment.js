import { DataTypes } from "sequelize";

export function defineComment(sequelize) {
  const CommentModel = sequelize.define("Comment", {
    userId: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: true,
    },
    postId: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: false,
    },
  });

  CommentModel.belongsTo(sequelize.models.Post, { foreignKey: "postId" });
}
