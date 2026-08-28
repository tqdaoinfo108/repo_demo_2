const now = new Date("2026-08-18T11:30:00+07:00");
const meta = { createdAt: now, updatedAt: now, source: "sample-seed" };

export const sampleData = {
  cooperatives: [
    { code:"HTX-001", name:"HTX Nông nghiệp Tân Thuận", field:"Trái cây xuất khẩu", taxCode:"1402156789", representative:"Lê Thị Thanh Vân", phone:"0277 385 6688", address:"TP Cao Lãnh, Đồng Tháp", status:"active", areaHa:412.6, memberCount:286, ...meta },
    { code:"HTX-002", name:"HTX Rau an toàn Bình Hòa", field:"Rau củ VietGAP", taxCode:"1402162490", representative:"Võ Hoàng Nam", phone:"0277 391 3246", address:"Cao Lãnh, Đồng Tháp", status:"active", areaHa:86.4, memberCount:124, ...meta },
    { code:"HTX-003", name:"HTX Dịch vụ Mỹ An", field:"Lúa gạo", representative:"Nguyễn Văn Lợi", address:"Tháp Mười, Đồng Tháp", status:"active", areaHa:124.8, memberCount:96, ...meta },
  ],
  organizationUnits: [
    { code:"DV-HTX001", cooperativeCode:"HTX-001", name:"Ban quản trị", type:"governance", parentCode:null, ...meta },
    { code:"DV-SX-TT", cooperativeCode:"HTX-001", name:"Tổ vùng trồng Tân Thuận", type:"production", parentCode:"DV-HTX001", ...meta },
    { code:"DV-KHO", cooperativeCode:"HTX-001", name:"Kho & tiêu thụ", type:"operations", parentCode:"DV-HTX001", ...meta },
  ],
  roles: [
    { code:"ADMIN", cooperativeCode:"HTX-001", name:"Quản trị HTX", permissions:["*"], scope:"all", ...meta },
    { code:"PRODUCTION_COORDINATOR", cooperativeCode:"HTX-001", name:"Điều phối sản xuất", permissions:["parcels.read","seasons.write","logs.approve","harvests.write"], scope:"cooperative", ...meta },
    { code:"ACCOUNTANT", cooperativeCode:"HTX-001", name:"Kế toán", permissions:["finance.*","contracts.read"], scope:"cooperative", ...meta },
  ],
  users: [
    { code:"USR-001", cooperativeCode:"HTX-001", name:"Nguyễn Minh Tâm", email:"minhtam@tanthuanhtx.vn", roleCode:"ADMIN", status:"active", ...meta },
    { code:"USR-002", cooperativeCode:"HTX-001", name:"Lê Thị Thanh Vân", email:"thanhvan@tanthuanhtx.vn", roleCode:"PRODUCTION_COORDINATOR", status:"active", ...meta },
    { code:"USR-003", cooperativeCode:"HTX-001", name:"Trần Ngọc Ánh", email:"ngocanh@tanthuanhtx.vn", roleCode:"ACCOUNTANT", status:"active", ...meta },
  ],
  members: [
    { code:"TV-102", cooperativeCode:"HTX-001", householdCode:"HD-102", name:"Nguyễn Văn Thành", phone:"0909000102", address:"Tân Thuận, TP Cao Lãnh", capitalAmount:85000000, areaHa:2.4, status:"active", ...meta },
    { code:"TV-118", cooperativeCode:"HTX-001", householdCode:"HD-118", name:"Trần Thị Lan", phone:"0909000118", address:"Tân Thuận, TP Cao Lãnh", capitalAmount:60000000, areaHa:1.8, status:"active", ...meta },
    { code:"TV-143", cooperativeCode:"HTX-001", householdCode:"HD-143", name:"Lê Hoàng Phúc", phone:"0909000143", address:"An Phú, TP Cao Lãnh", capitalAmount:120000000, areaHa:3.1, status:"active", ...meta },
  ],
  parcels: [
    { code:"TD-042", cooperativeCode:"HTX-001", memberCode:"TV-102", crop:"Sầu riêng Ri6", areaHa:2.4, landType:"Đất trồng cây lâu năm", zoneCode:"DT-VT-0362", standard:"VietGAP", status:"active", geometry:{ type:"Point", coordinates:[105.682255,10.452478] }, ...meta },
    { code:"TD-057", cooperativeCode:"HTX-001", memberCode:"TV-102", crop:"Sầu riêng Ri6", areaHa:1.7, landType:"Đất trồng cây lâu năm", zoneCode:"DT-VT-0362", standard:"VietGAP", status:"active", geometry:{ type:"Point", coordinates:[105.6841,10.4541] }, ...meta },
    { code:"TD-112", cooperativeCode:"HTX-001", memberCode:"TV-143", crop:"Bưởi da xanh", areaHa:3.1, landType:"Đất trồng cây lâu năm", zoneCode:"DT-VT-0521", standard:"conversion", status:"active", geometry:{ type:"Point", coordinates:[105.686,10.4485] }, ...meta },
  ],
  seasons: [
    { code:"MV-TD26-01", cooperativeCode:"HTX-001", crop:"Sầu riêng Ri6", zone:"Tân Thuận", parcelCodes:["TD-042","TD-057"], planKg:1280000, actualKg:1120000, forecastKg:1210000, startAt:new Date("2026-05-01"), endAt:new Date("2026-09-18"), status:"harvesting", ...meta },
    { code:"MV-TD26-03", cooperativeCode:"HTX-001", crop:"Bưởi da xanh", zone:"An Phú", parcelCodes:["TD-112"], planKg:620000, actualKg:428000, forecastKg:540000, startAt:new Date("2026-05-10"), endAt:new Date("2026-09-28"), status:"growing", ...meta },
  ],
  fieldLogs: [
    { code:"NK-TD042-0818", cooperativeCode:"HTX-001", parcelCode:"TD-042", seasonCode:"MV-TD26-01", type:"fertilizer", material:"Phân hữu cơ vi sinh", quantity:320, unit:"kg", performedBy:"TV-102", performedAt:new Date("2026-08-18T03:00:00Z"), status:"approved", ...meta },
    { code:"NK-TD057-0816", cooperativeCode:"HTX-001", parcelCode:"TD-057", seasonCode:"MV-TD26-01", type:"inspection", material:"Kiểm tra sâu bệnh", quantity:null, unit:null, performedBy:"USR-002", performedAt:new Date("2026-08-16T03:00:00Z"), status:"approved", ...meta },
    { code:"NK-TD112-0815", cooperativeCode:"HTX-001", parcelCode:"TD-112", seasonCode:"MV-TD26-03", type:"pest-observation", material:"Kiểm tra vườn", quantity:null, unit:null, performedBy:"TV-143", performedAt:new Date("2026-08-15T03:00:00Z"), status:"pending", ...meta },
  ],
  harvests: [
    { code:"TH-2408-16", cooperativeCode:"HTX-001", parcelCode:"TD-042", seasonCode:"MV-TD26-01", memberCode:"TV-102", product:"Sầu riêng Ri6", grossKg:1250, acceptedKg:null, harvestedAt:new Date("2026-08-18T02:20:00Z"), status:"pending-inspection", ...meta },
    { code:"TH-2408-17", cooperativeCode:"HTX-001", parcelCode:"TD-057", seasonCode:"MV-TD26-01", memberCode:"TV-102", product:"Sầu riêng Ri6", grossKg:980, acceptedKg:980, harvestedAt:new Date("2026-08-17T02:00:00Z"), status:"accepted", ...meta },
    { code:"TH-2408-19", cooperativeCode:"HTX-001", parcelCode:"TD-112", seasonCode:"MV-TD26-03", memberCode:"TV-143", product:"Bưởi da xanh", grossKg:2100, acceptedKg:2100, harvestedAt:new Date("2026-08-19T01:00:00Z"), status:"sorting", ...meta },
  ],
  packagingBatches: [
    { code:"DG-2408-09", cooperativeCode:"HTX-001", harvestCode:"TH-2408-19", product:"Bưởi da xanh", standard:"4 quả/thùng", inputKg:2100, outputKg:1340, qrCode:"QR-BG-2408-04", status:"packing", ...meta },
    { code:"DG-2408-10", cooperativeCode:"HTX-001", harvestCode:"TH-2408-17", product:"Sầu riêng Ri6", standard:"10 kg/thùng", inputKg:980, outputKg:980, qrCode:"QR-SR-2408-16", status:"completed", ...meta },
  ],
  qualityInspections: [
    { code:"QC-2408-128", cooperativeCode:"HTX-001", lotCode:"SR-2408-16", sourceCode:"TD-042", checks:["Ngoại quan","Độ chín","Dư lượng"], result:"pass", inspectedAt:new Date("2026-08-18T04:30:00Z"), status:"valid", ...meta },
    { code:"QC-2408-144", cooperativeCode:"HTX-001", lotCode:"DG-2408-09", sourceCode:"TH-2408-19", checks:["Quy cách 4 quả/thùng"], result:"pending", inspectedAt:new Date("2026-08-20T02:00:00Z"), status:"pending", ...meta },
  ],
  warehouses: [
    { code:"KHO-01", cooperativeCode:"HTX-001", name:"Kho lạnh số 1", type:"cold-storage", address:"TP Cao Lãnh", capacityKg:50000, ...meta },
    { code:"KHO-02", cooperativeCode:"HTX-001", name:"Kho lạnh số 2", type:"cold-storage", address:"TP Cao Lãnh", capacityKg:30000, ...meta },
  ],
  inventoryLots: [
    { code:"SR-2408-16", cooperativeCode:"HTX-001", warehouseCode:"KHO-01", product:"Sầu riêng Ri6", sourceCodes:["TH-2408-16","TH-2408-17"], availableKg:1250, expiryAt:new Date("2026-08-21T10:00:00Z"), qrCode:"QR-SR-2408-16", status:"priority-dispatch", ...meta },
    { code:"BG-2408-04", cooperativeCode:"HTX-001", warehouseCode:"KHO-02", product:"Bưởi da xanh", sourceCodes:["DG-2408-09"], availableKg:2100, expiryAt:new Date("2026-08-24T10:00:00Z"), qrCode:"QR-BG-2408-04", status:"packing", ...meta },
  ],
  shipments: [
    { code:"LXK-0826-18", cooperativeCode:"HTX-001", lotCodes:["SR-2408-16"], orderCode:"DH-0826-41", vehicle:"Xe lạnh 1,5 tấn", driver:"Nguyễn Quốc Dũng", deliveryAt:new Date("2026-08-19T07:00:00Z"), status:"awaiting-vehicle", ...meta },
    { code:"LXK-0826-20", cooperativeCode:"HTX-001", lotCodes:["BG-2408-04"], orderCode:"DH-0826-39", vehicle:"Xe thùng kín", driver:"Trần Văn Phát", deliveryAt:new Date("2026-08-20T08:00:00Z"), status:"in-transit", ...meta },
  ],
  contracts: [
    { code:"HD-2026-104", cooperativeCode:"HTX-001", customer:"Công ty An Phú", product:"Sầu riêng Ri6", committedKg:8500, value:765000000, deliveryAt:new Date("2026-08-19"), status:"awaiting-confirmation", ...meta },
    { code:"HD-2026-093", cooperativeCode:"HTX-001", customer:"GreenMart", product:"Bưởi da xanh", committedKg:2100, value:119700000, deliveryAt:new Date("2026-08-20"), status:"in-progress", ...meta },
  ],
  salesOrders: [
    { code:"DH-0826-41", cooperativeCode:"HTX-001", contractCode:"HD-2026-104", customer:"Công ty An Phú", product:"Sầu riêng Ri6", quantityKg:8500, allocatedKg:1250, deliveryAt:new Date("2026-08-19T09:00:00Z"), status:"awaiting-confirmation", ...meta },
    { code:"DH-0826-39", cooperativeCode:"HTX-001", contractCode:"HD-2026-093", customer:"GreenMart", product:"Bưởi da xanh", quantityKg:2100, allocatedKg:2100, deliveryAt:new Date("2026-08-20T08:00:00Z"), status:"packing", ...meta },
  ],
  financialEntries: [
    { code:"PT-0826-107", cooperativeCode:"HTX-001", kind:"receipt", category:"receivable", amount:186500000, counterparty:"Công ty Minh Phát", referenceCode:"HD-2026-081", postedAt:new Date("2026-08-18"), status:"reconciled", ...meta },
    { code:"PC-0826-058", cooperativeCode:"HTX-001", kind:"payment", category:"inputs", amount:-62800000, counterparty:"Công ty Vật tư Nông nghiệp Miền Tây", referenceCode:"PO-0826-058", postedAt:new Date("2026-08-17"), status:"approved", ...meta },
    { code:"CN-0826-019", cooperativeCode:"HTX-001", kind:"receivable", category:"debt", amount:62800000, counterparty:"GreenMart", referenceCode:"HD-2026-093", postedAt:new Date("2026-08-15"), status:"overdue", ...meta },
  ],
  capitalContributions: [
    { code:"VG-2026-102", cooperativeCode:"HTX-001", memberCode:"TV-102", amount:85000000, shares:850, reconciledAt:new Date("2026-06-30"), status:"reconciled", ...meta },
    { code:"VG-2026-118", cooperativeCode:"HTX-001", memberCode:"TV-118", amount:60000000, shares:600, reconciledAt:new Date("2026-06-30"), status:"reconciled", ...meta },
  ],
  documents: [
    { code:"HS-PL-022", cooperativeCode:"HTX-001", name:"Giấy đăng ký HTX Tân Thuận", group:"legal", linkedCode:"HTX-001", issuedAt:new Date("2019-03-18"), expiresAt:new Date("2029-03-18"), status:"valid", ...meta },
    { code:"HS-CL-041", cooperativeCode:"HTX-001", name:"Chứng nhận VietGAP vùng Tân Thuận", group:"certificate", linkedCode:"DT-VT-0362", issuedAt:new Date("2025-08-25"), expiresAt:new Date("2026-08-25"), status:"valid", ...meta },
  ],
  notifications: [
    { code:"TB-0826-018", cooperativeCode:"HTX-001", title:"Lịch thu hoạch vùng Tân Thuận", audience:"members-zone-tan-thuan", channel:"in-app", status:"sent", sentAt:now, ...meta },
  ],
  auditEvents: [
    { eventId:"AUD-20260818-001", cooperativeCode:"HTX-001", actorCode:"USR-001", action:"seed.database", entity:"system", createdAt:now, ...meta },
  ],
};
