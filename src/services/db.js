import { Sequelize } from "sequelize";
import { defineUser } from "../entities/user.js";

export async function connectToDatabase() {
  const database = process.env.DB_DATABASE ?? "database";
  const username = process.env.DB_USERNAME ?? "username";
  const password = process.env.DB_PASSWORD ?? "password";
  const host = process.env.DB_HOST ?? "localhost";
  const dialect = process.env.DB_DIALECT ?? "mysql";
  console.log("Connecting to database...");

  const db = new Sequelize(database, username, password, {
    host,
    dialect,
  });

  await db.authenticate();

  return db;
}

export async function migrateDatabase(db) {
  defineUser(db);

  await db.sync({ force: true });
}