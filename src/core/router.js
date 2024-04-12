import { health } from "../api/health/health_controller.js";
import {
  addPostLike,
  createComment,
  createPost,
  listPostComments,
  listPosts,
} from "../api/post/post_controller.js";
import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  login,
  selfUpdateUser,
  updateOtherUser,
} from "../api/user/user_controller.js";
import {
  mustBeAuthed,
  mustBeAdmin,
  optionalAuth,
} from "../middlewares/auth.js";
import { handleError } from "../middlewares/error.js";
import multer from "multer";

export function route(app) {
  const upload = multer({ dest: "./uploads" });

  app.get("/healthz", health);

  app.post("/users/login", login);

  app.get("/posts", listPosts);
  app.get("/posts/:id/comments", listPostComments);
  app.post("/posts/:id/like", addPostLike);
  app.get("/users/:id", getUser);

  app.post("/posts/:id/comments", optionalAuth, createComment);

  app.use(mustBeAuthed);
  app.patch("/users", selfUpdateUser);

  app.post("/posts", upload.single("image"), createPost);

  app.use(mustBeAdmin);
  app.get("/users", listUsers);
  app.post("/users", createUser);
  app.delete("/users/:id", deleteUser);
  app.patch("/users/:id", updateOtherUser);

  app.use(handleError);
}
