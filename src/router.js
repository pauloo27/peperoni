import { health } from "./controllers/health.js";
import {
  createUser,
  deleteUser,
  listUsers,
  login,
  selfUpdateUser,
  updateOtherUser,
} from "./controllers/user.js";
import { mustBeAuthed, mustBeAdmin } from "./middlewares/auth.js";
import { handleError } from "./middlewares/error.js";

export function route(app) {
  app.get("/healthz", health);

  app.post("/users/login", login);

  app.use(mustBeAuthed);
  app.patch("/users", selfUpdateUser);

  app.use(mustBeAdmin);
  app.get("/users", listUsers);
  app.post("/users", createUser);
  app.delete("/users/:id", deleteUser);
  app.patch("/users/:id", updateOtherUser);

  app.use(handleError);
}
