const collectionDefinitions = [
  ["cooperatives", "code"], ["organizationUnits", "code"], ["roles", "code"], ["users", "email"],
  ["members", "code"], ["parcels", "code"], ["seasons", "code"], ["fieldLogs", "code"],
  ["harvests", "code"], ["packagingBatches", "code"], ["qualityInspections", "code"], ["warehouses", "code"],
  ["inventoryLots", "code"], ["shipments", "code"], ["contracts", "code"], ["salesOrders", "code"],
  ["financialEntries", "code"], ["capitalContributions", "code"], ["documents", "code"], ["notifications", "code"], ["auditEvents", "eventId"],
];

export async function initializeSchema(db) {
  const existing = new Set((await db.listCollections({}, { nameOnly: true }).toArray()).map((item) => item.name));
  for (const [name, uniqueField] of collectionDefinitions) {
    if (!existing.has(name)) await db.createCollection(name);
    await db.collection(name).createIndex({ [uniqueField]: 1 }, { unique: true, sparse: true });
    await db.collection(name).createIndex({ cooperativeCode: 1, createdAt: -1 });
  }
  await db.collection("parcels").createIndex({ geometry: "2dsphere" });
  await db.collection("fieldLogs").createIndex({ parcelCode: 1, seasonCode: 1, performedAt: -1 });
  await db.collection("inventoryLots").createIndex({ status: 1, expiryAt: 1 });
  await db.collection("salesOrders").createIndex({ status: 1, deliveryAt: 1 });
  await db.collection("auditEvents").createIndex({ createdAt: -1 });
}

export { collectionDefinitions };
