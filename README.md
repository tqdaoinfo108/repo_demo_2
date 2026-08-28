# HTX Số

Ứng dụng quản trị hợp tác xã nông nghiệp theo chuỗi dữ liệu: **thửa đất → hộ dân → mùa vụ → nhật ký → thu hoạch → đóng gói → kho → giao nhận → tiêu thụ**.

## Kiến trúc

```text
Next.js UI (GitHub Pages / local)
        │
        ├── Express API (server/index.js)
        │         │
        │         └── MongoDB Atlas
        │               ├── quản trị & HTX
        │               ├── thành viên, GIS, sản xuất
        │               ├── truy xuất, kho, tiêu thụ
        │               └── tài chính, hồ sơ, thông báo
        │
        └── Trợ lý vận hành AI (cấu hình biến môi trường)
```

Frontend là Next.js xuất tĩnh; API Express cần được chạy trên một máy chủ/hosting có thể kết nối MongoDB. Khi publish GitHub Pages, đặt `API_URL` trỏ tới URL API công khai có HTTPS.

## Khởi chạy cục bộ

1. Cài dependencies: `npm install`
2. Sao chép `.env.example` thành `.env`, rồi điền biến MongoDB và URL cần thiết. Không commit `.env`.
3. Khởi tạo chỉ mục/collection: `npm run db:init`
4. Nạp bộ dữ liệu demo liên kết: `npm run db:seed`
5. Chạy API: `npm run api`
6. Chạy giao diện ở terminal khác: `npm run dev`

Mặc định UI gọi `http://localhost:4000`. Có thể thay đổi qua `NEXT_PUBLIC_API_URL`.

## Dữ liệu MongoDB

Schema được khởi tạo idempotent trong `server/schema.js`; bộ dữ liệu sample có quan hệ xuyên phân hệ nằm trong `server/seed-data.js`.

| Nhóm | Collections |
| --- | --- |
| Quản trị | `organizationUnits`, `roles`, `users`, `auditEvents`, `notifications` |
| Hợp tác xã & thành viên | `cooperatives`, `members`, `capitalContributions`, `documents` |
| GIS & sản xuất | `parcels`, `seasons`, `fieldLogs`, `harvests`, `packagingBatches`, `qualityInspections` |
| Chuỗi cung ứng | `warehouses`, `inventoryLots`, `shipments`, `contracts`, `salesOrders` |
| Tài chính | `financialEntries` |

Các trường `code`/`eventId` có index duy nhất. Các bản ghi nghiệp vụ luôn lưu `cooperativeCode`; thửa đất có chỉ mục `2dsphere` cho trường `geometry`.

## API hiện có

- `GET /health`
- `GET /api/dashboard/overview?cooperativeCode=HTX-001`
- `GET /api/cooperatives`, `GET /api/cooperatives/:code/overview`
- `GET /api/members`, `GET /api/members/:code/profile`
- `GET /api/:collection?cooperativeCode=...`
- `GET /api/:collection/:code`
- `POST /api/:collection`

Endpoint chi tiết trả về dữ liệu liên kết thay vì ghép sẵn ở giao diện. Ví dụ hồ sơ thành viên trả lại thửa đất, mùa vụ, nhật ký, vốn góp, hồ sơ và lịch sử liên quan.

## Tiến độ thay thế mock data

Đã chuyển sang MongoDB: Dashboard, danh sách/chi tiết Hợp tác xã, danh sách/chi tiết Hộ dân & thành viên.

Tiếp theo theo thứ tự dữ liệu phụ thuộc: Đất đai & GIS → Sản xuất/vật tư → Thu hoạch/đóng gói → Kho/giao nhận/tiêu thụ → Tài chính/vốn góp → Hồ sơ → Quản trị. Các màn hình còn lại vẫn có dữ liệu trình diễn tạm thời và sẽ được thay bằng API trước khi bỏ hoàn toàn mock data nguồn.

## Deploy GitHub Pages

Workflow `.github/workflows/deploy-pages.yml` build giao diện tĩnh. Thiết lập các Repository Variables sau:

- `API_URL`: URL HTTPS của Express API, ví dụ `https://api.example.vn`.
- `AI_PROXY_URL` hoặc `AI_TOKEN`: cấu hình AI theo cơ chế đang dùng.
- `BASE_PATH` nếu triển khai dưới subpath.

Không đưa chuỗi kết nối MongoDB, mật khẩu hoặc API key vào repository, source frontend, log hay GitHub Variables công khai. Chỉ server API đọc biến MongoDB từ secret/environment riêng.

## Kiểm tra

```powershell
npm run db:init
npm run db:seed
npm run build
```

Để nạp lại dataset demo có chủ đích: `npm run db:reset-demo`.
