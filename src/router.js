import { health } from "./controllers/health.js";
import { createUser, login, selfUpdateUser } from "./controllers/user.js";
import { mustBeAdmin, mustBeAuthed } from "./middlewares/auth.js";
import { handleError } from "./middlewares/error.js";

export function route(app) {
  app.get("/healthz", health);

  app.post("/users/login", login);

  app.use(mustBeAuthed);
  app.patch("/users", selfUpdateUser);

  app.use(mustBeAdmin);
  app.post("/users", createUser);

  app.use(handleError);
}
