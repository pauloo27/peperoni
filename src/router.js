import { health } from "./controllers/health.js";
import { createUser } from "./controllers/user.js";

export function route(app) {
  app.get("/healthz", health);

  app.post("/users", createUser);
}
