import { health } from "./controllers/health.js";
import { createUser, login } from "./controllers/user.js";

export function route(app) {
  app.get("/healthz", health);

  app.post("/users", createUser);
  app.post("/users/login", login);
}
