import { db } from "../../integrations/db.js";
import { CreatePostSchema, CreateCommentSchema } from "./post_schema.js";
import { HttpError } from "../../core/http_error.js";

export async function listPosts(req, res) {
  const maxPrice = req.query.maxPrice;
  const ingredients = req.query.ingredients;

  let where = {};

  if (maxPrice) {
    where.price = { [db.Sequelize.Op.lte]: maxPrice };
  }

  if (ingredients) {
    ingredients.split(",").forEach((ingredient) => {
      where.ingredients = {
        [db.Sequelize.Op.like]: `%${ingredient}%`,
      };
    });
  }

  const PostModel = db.models.Post;
  res.send(
    await PostModel.findAll({
      where: where,
      attributes: [
        "id",
        "userId",
        "createdAt",
        "updatedAt",
        "name",
        "description",
        "ingredients",
        "photoId",
        "price",
      ],
    }),
  );
}

export async function createPost(req, res) {
  const PostModel = db.models.Post;
  let jsonData;

  try {
    jsonData = JSON.parse(req.body.json);
  } catch {
    throw new HttpError(400, "Invalid body", "Missing json field");
  }

  const photoId = req.file?.filename;
  if (!photoId) {
    throw new HttpError(400, "Invalid body", "Missing image");
  }

  const post = CreatePostSchema.parse(jsonData);

  await PostModel.create({
    userId: req.user.id,
    name: post.name,
    description: post.description,
    ingredients: post.ingredients,
    price: post.price,
    photoId,
  });

  res.status(201).json({ message: "Post created successfully" });
}

export async function createComment(req, res) {
  const CommentModel = db.models.Comment;
  const PostModel = db.models.Post;

  const post = await PostModel.findByPk(req.params.id);
  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  const comment = CreateCommentSchema.parse(req.body);

  await CommentModel.create({
    userId: req.user?.id,
    postId: post.id,
    text: comment.text,
  });

  res.status(201).json({ message: "Comment created successfully" });
}

export async function listPostComments(req, res) {
  const postId = req.params.id;
  const PostModel = db.models.Post;

  const post = await PostModel.findByPk(postId);
  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  const CommentModel = db.models.Comment;

  const comments = await CommentModel.findAll({
    where: { postId },
    attributes: ["id", "userId", "createdAt", "text"],
  });

  return res.send(comments);
}
