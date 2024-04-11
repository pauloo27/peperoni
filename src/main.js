import express from "express";
import "express-async-errors";
import { route } from "./router.js";
import { connectToDatabase, migrateDatabase } from "./services/db.js";

async function main() {
  const httpPort = process.env.HTTP_PORT ?? "8080";
  const db = await connectToDatabase();
  await migrateDatabase(db);

  const app = express();

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
