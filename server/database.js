import { MongoClient } from "mongodb";

let client;
let database;

export async function getDatabase() {
  if (database) return database;
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required. Add the full MongoDB Atlas connection string to .env.");
  client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  await client.connect();
  database = client.db(process.env.MONGODB_DATABASE || "htx_so");
  return database;
}

export async function closeDatabase() {
  if (client) await client.close();
  client = undefined;
  database = undefined;
}
