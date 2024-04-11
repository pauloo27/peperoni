import { HttpError } from "./http_error.js";

export function handleUniqueConstraintError(messsage) {
  return (err) => {
    if (err.name === "SequelizeUniqueConstraintError") {
      throw new HttpError(400, "Unique constraint error", messsage);
    }
    throw err;
  };
}
