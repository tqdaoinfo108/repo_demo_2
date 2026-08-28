import "dotenv/config";
import cors from "cors";
import express from "express";
import { getDatabase } from "./database.js";
import { collectionDefinitions } from "./schema.js";

const app = express();
const port = Number(process.env.API_PORT || 4000);
const collections = new Set(collectionDefinitions.map(([name]) => name));

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || true }));
app.use(express.json({ limit: "1mb" }));

function collectionName(value) {
  if (!collections.has(value)) return null;
  return value;
}

app.get("/health", async (_request, response) => {
  try { const db = await getDatabase(); await db.command({ ping: 1 }); response.json({ ok:true, database:db.databaseName }); }
  catch (error) { response.status(503).json({ ok:false, error:error.message }); }
});

app.get("/api/dashboard/overview", async (request, response, next) => {
  try {
    const db = await getDatabase(); const cooperativeCode = request.query.cooperativeCode || "HTX-001";
    const [members, parcels, seasons, logsPending, qualityPending, inventoryPriority, orders, overdueDebt] = await Promise.all([
      db.collection("members").countDocuments({ cooperativeCode, status:"active" }), db.collection("parcels").aggregate([{ $match:{ cooperativeCode } }, { $group:{ _id:null, areaHa:{ $sum:"$areaHa" } } }]).toArray(),
      db.collection("seasons").find({ cooperativeCode }).toArray(), db.collection("fieldLogs").countDocuments({ cooperativeCode, status:"pending" }),
      db.collection("qualityInspections").countDocuments({ cooperativeCode, status:"pending" }), db.collection("inventoryLots").find({ cooperativeCode, status:"priority-dispatch" }).toArray(),
      db.collection("salesOrders").countDocuments({ cooperativeCode, status:{ $nin:["completed","cancelled"] } }),
      db.collection("financialEntries").aggregate([{ $match:{ cooperativeCode, status:"overdue" } }, { $group:{ _id:null, amount:{ $sum:"$amount" } } }]).toArray(),
    ]);
    const plannedKg = seasons.reduce((sum,item) => sum + (item.planKg || 0), 0); const actualKg = seasons.reduce((sum,item) => sum + (item.actualKg || 0), 0);
    response.json({ cooperativeCode, generatedAt:new Date(), kpis:{ members, areaHa:parcels[0]?.areaHa || 0, plannedKg, actualKg, productionProgress:plannedKg ? Math.round(actualKg / plannedKg * 100) : 0, pendingLogs:logsPending, pendingQuality:qualityPending, activeOrders:orders, overdueDebt:overdueDebt[0]?.amount || 0 }, priorityLots:inventoryPriority, seasons });
  } catch (error) { next(error); }
});

app.get("/api/:collection", async (request, response, next) => {
  try {
    const name = collectionName(request.params.collection); if (!name) return response.status(404).json({ error:"Unknown collection" });
    const db = await getDatabase(); const filter = request.query.cooperativeCode ? { cooperativeCode:request.query.cooperativeCode } : {};
    const limit = Math.min(Number(request.query.limit || 100), 500); const rows = await db.collection(name).find(filter).sort({ updatedAt:-1, createdAt:-1 }).limit(limit).toArray();
    response.json({ data:rows });
  } catch (error) { next(error); }
});

app.get("/api/:collection/:code", async (request, response, next) => {
  try {
    const name = collectionName(request.params.collection); if (!name) return response.status(404).json({ error:"Unknown collection" });
    const field = collectionDefinitions.find(([collection]) => collection === name)?.[1] || "code"; const row = await (await getDatabase()).collection(name).findOne({ [field]:request.params.code });
    if (!row) return response.status(404).json({ error:"Record not found" }); response.json({ data:row });
  } catch (error) { next(error); }
});

app.post("/api/:collection", async (request, response, next) => {
  try {
    const name = collectionName(request.params.collection); if (!name) return response.status(404).json({ error:"Unknown collection" });
    const record = { ...request.body, createdAt:new Date(), updatedAt:new Date() }; const field = collectionDefinitions.find(([collection]) => collection === name)?.[1] || "code";
    if (!record[field]) return response.status(400).json({ error:`${field} is required` }); await (await getDatabase()).collection(name).insertOne(record); response.status(201).json({ data:record });
  } catch (error) { next(error); }
});

app.use((error, _request, response, _next) => response.status(error.code === 11000 ? 409 : 500).json({ error:error.code === 11000 ? "Duplicate record" : "Server error", detail:error.message }));
app.listen(port, () => console.log(`HTX MongoDB API listening on http://localhost:${port}`));
