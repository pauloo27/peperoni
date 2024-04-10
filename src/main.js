import express from "express";
import { route } from "./router.js";

async function main() {
  const httpPort = process.env.HTTP_PORT ?? "8080";

  const app = express();
  route(app);

  app.listen(httpPort, () => {
    console.log(`Server is running on port ${httpPort}`);
  });
}

main();
