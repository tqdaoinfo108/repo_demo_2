import "dotenv/config";
import { getDatabase, closeDatabase } from "./database.js";
import { initializeSchema } from "./schema.js";

try {
  const db = await getDatabase();
  await initializeSchema(db);
  console.log(`MongoDB schema initialized: ${db.databaseName}`);
} finally {
  await closeDatabase();
}
