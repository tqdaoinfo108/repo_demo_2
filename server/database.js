import { MongoClient } from "mongodb";

let client;
let database;

export async function getDatabase() {
  if (database) return database;
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error("MONGODB_URI is required. Add the full MongoDB Atlas connection string to .env.");
  if (!/^mongodb(\+srv)?:\/\//.test(uri)) throw new Error("MONGODB_URI must begin with mongodb:// or mongodb+srv://. In Render, paste only the URI value (without MONGODB_URI=, quotes, or placeholders).");
  client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  await client.connect();
  database = client.db(process.env.MONGODB_DATABASE || "htx_so");
  return database;
}

export async function closeDatabase() {
  if (client) await client.close();
  client = undefined;
  database = undefined;
}
