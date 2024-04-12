import { db } from "../../integrations/db.js";
import { CreatePostSchema } from "./post_schema.js";

export async function listPosts(_req, res) {
  const PostModel = db.models.Post;
  res.send(
    await PostModel.findAll({
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