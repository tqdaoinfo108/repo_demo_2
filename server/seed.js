import "dotenv/config";
import bcrypt from "bcryptjs";
import { getDatabase, closeDatabase } from "./database.js";
import { initializeSchema, collectionDefinitions } from "./schema.js";
import { sampleData } from "./seed-data.js";

const reset = process.argv.includes("--reset");

try {
  const db = await getDatabase();
  await initializeSchema(db);
  if (reset) {
    for (const [name] of collectionDefinitions) await db.collection(name).deleteMany({});
  }
  const seededUsers = await Promise.all(sampleData.users.map(async (user) => ({ ...user, passwordHash:await bcrypt.hash(process.env.DEMO_ADMIN_PASSWORD || "ChangeMe123!", 12), passwordChangedAt:new Date() })));
  for (const [name, records] of Object.entries(sampleData)) {
    if (!records.length) continue;
    const uniqueField = collectionDefinitions.find(([collection]) => collection === name)?.[1] || "code";
    for (const record of (name === "users" ? seededUsers : records)) await db.collection(name).updateOne({ [uniqueField]: record[uniqueField] }, { $set: record }, { upsert: true });
  }
  console.log(`Sample data ${reset ? "reset and " : ""}seeded into: ${db.databaseName}`);
} finally {
  await closeDatabase();
}
