import { health } from "./controllers/health.js";

export function route(app) {
  app.get("/healthz", health);
}
