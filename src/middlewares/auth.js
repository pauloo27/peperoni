import jwt from "jsonwebtoken";
import { HttpError } from "../core/http_error.js";

export function mustBeAuthed(req, res, next) {
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

export function mustBeAdmin(req, res, next) {
  if (!req.user.isAdmin) {
    throw new HttpError(403, "Auth error", "Usuário não é administrador");
  }

  next();
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next();
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;

  const token = authHeader.replace("Bearer ", "");

  jwt.verify(token, jwtSecret, (err, decoded) => {
    req.user = decoded;
    next();
  });
}
