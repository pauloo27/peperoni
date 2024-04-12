import express from "express";
import "express-async-errors";
import { route } from "./core/router.js";
import { connectToDatabase, migrateDatabase } from "./integrations/db.js";
import { ensureAdminExists } from "./init.js";

async function main() {
  const httpPort = process.env.HTTP_PORT ?? "8080";
  const db = await connectToDatabase();
  await migrateDatabase(db);
  await ensureAdminExists(db);

  const app = express();

  app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });

  app.use(express.json());

  route(app);

  process.on("unhandledRejection", (err) => {
    console.error(err);
  });

  process.on("uncaughtException", (err) => {
    console.error(err);
  });

  app.listen(httpPort, () => {
    console.log(`Server is running on port ${httpPort}`);
  });
}

main();
