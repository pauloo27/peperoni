import { health } from "./controllers/health.js";
import { createUser, login, updateUser } from "./controllers/user.js";
import { checkToken } from "./middlewares/check_token.js";
import { handleError } from "./middlewares/error.js";

export function route(app) {
  app.get("/healthz", health);

  app.post("/users", createUser);
  app.post("/users/login", login);

  app.use(checkToken);
  app.patch("/users", updateUser);

  app.use(handleError);
}
