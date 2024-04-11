import { ZodError } from "zod";
import { HttpError } from "../core/http_error.js";

export async function handleError(err, req, res, next) {
  if (err instanceof ZodError) {
    res.status(400).json({ error: "Validation failed", details: err.errors });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.error, details: err.details });
    return;
  }

  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
}
