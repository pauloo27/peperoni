import jwt from "jsonwebtoken";
import { HttpError } from "../core/http_error.js";

export function checkToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HttpError(401, "Auth error", "Token não fornecido");
  }

  const jwtSecret = process.env.JWT_SECRET;

  const token = authHeader.replace("Bearer ", "");

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      throw new HttpError(401, "Auth error", "Token inválido ou expirado");
    }

    req.user = decoded;
    next();
  });
}
