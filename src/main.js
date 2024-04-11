import express from "express";
import { route } from "./router.js";
import { connectToDatabase, migrateDatabase } from "./services/db.js";

async function main() {
  const httpPort = process.env.HTTP_PORT ?? "8080";
  const db = await connectToDatabase();
  await migrateDatabase(db);

  const app = express();
  route(app);

  app.listen(httpPort, () => {
    console.log(`Server is running on port ${httpPort}`);
  });
}

main();
