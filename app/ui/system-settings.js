"use client";

import { useEffect, useState } from "react";
import {
  IconArrowLeft,
  IconBell,
  IconBuildingCommunity,
  IconCalendarEvent,
  IconCloudCog,
  IconDatabaseCog,
  IconFileCertificate,
  IconKey,
  IconPlus,
  IconShieldCheck,
} from "@tabler/icons-react";
import { FormModal, Status } from "./shared-ui";
import { apiGet, apiPost } from "../lib/api";

const users = [
  ["Nguyễn Minh Tâm", "Quản trị HTX", "Toàn hệ thống", "Đang hoạt động"],
  ["Lê Thị Thanh Vân", "Giám đốc HTX", "HTX Tân Thuận", "Đang hoạt động"],
  ["Trần Ngọc Ánh", "Kế toán trưởng", "Tài chính & hồ sơ", "Đang hoạt động"],
  ["Phạm Quốc Huy", "Điều phối vùng", "Sản xuất & GIS", "Đang hoạt động"],
];
const roles = [
  [
    "Quản trị nền tảng",
    "Toàn bộ phân hệ · cấu hình · nhật ký",
    "Tất cả HTX",
    "02",
  ],
  ["Giám đốc HTX", "Điều hành · phê duyệt · báo cáo", "HTX Tân Thuận", "04"],
  [
    "Điều phối vùng",
    "Hộ dân · đất đai · sản xuất",
    "Theo vùng trồng được giao",
    "07",
  ],
  ["Kế toán trưởng", "Tài chính · vốn góp · chứng từ", "HTX Tân Thuận", "03"],
];
const catalogs = [
  ["Cây trồng", "12", "Xoài cát Hòa Lộc · Bưởi da xanh", "Đã công bố"],
  ["Loại đất & mục đích sử dụng", "08", "Đất trồng cây lâu năm", "Đã công bố"],
  ["Vật tư đầu vào", "46", "Phân bón · thuốc BVTV", "Chờ rà soát"],
  ["Kênh thông báo", "05", "Ứng dụng · SMS · Email", "Đã công bố"],
];
const auditLogs = [
  [
    "20/08 · 10:15",
    "Nguyễn Minh Tâm",
    "Cập nhật ngưỡng cảnh báo công nợ",
    "Đã áp dụng",
  ],
  [
    "19/08 · 16:40",
    "Trần Ngọc Ánh",
    "Duyệt quy tắc đối soát vốn góp",
    "Đã áp dụng",
  ],
  ["18/08 · 09:30", "Hệ thống", "Sao lưu dữ liệu vận hành ngày", "Hoàn tất"],
  [
    "17/08 · 14:05",
    "Nguyễn Minh Tâm",
    "Mời tài khoản điều phối vùng",
    "Đã gửi",
  ],
];

export default function SystemSettings({ onClose, onNotice }) {
  const [tab, setTab] = useState("Đơn vị & dữ liệu");
  const [modal, setModal] = useState(null);
  const [users, setUsers] = useState([]); const [roles, setRoles] = useState([]); const [auditLogs, setAuditLogs] = useState([]); const [dataError, setDataError] = useState("");
  useEffect(() => { let active = true; Promise.all([apiGet("/api/users?cooperativeCode=HTX-001"), apiGet("/api/roles?cooperativeCode=HTX-001"), apiGet("/api/auditEvents?cooperativeCode=HTX-001")]).then(([userResult, roleResult, auditResult]) => { if (!active) return; setUsers(userResult.data.map((item) => [item.name, item.roleCode || "Chưa gán vai trò", item.cooperativeCode || "Toàn hệ thống", item.status === "active" ? "Đang hoạt động" : item.status])); setRoles(roleResult.data.map((item) => [item.name, (item.permissions || []).join(" · "), item.scope || "cooperative", String(item.permissions?.length || 0)])); setAuditLogs(auditResult.data.map((item) => [new Intl.DateTimeFormat("vi-VN", { dateStyle:"short", timeStyle:"short" }).format(new Date(item.createdAt)), item.actorCode || "Hệ thống", item.action, "Đã áp dụng"])); }).catch((reason) => active && setDataError(reason.message)); return () => { active = false; }; }, []);
  const tabs = [
    "Đơn vị & dữ liệu",
    "Người dùng & quyền",
    "Vai trò & phạm vi",
    "Danh mục & thông báo",
    "Cảnh báo",
    "Tích hợp & nhật ký",
  ];
  return (
    <section className="system-settings">
      <div className="settings-hero">
        <div>
          <span>QUẢN TRỊ NỀN TẢNG</span>
          <h2>Cấu hình hệ thống</h2>
          <p>
            Thiết lập phạm vi dữ liệu, người dùng, quy tắc cảnh báo và kết nối
            vận hành cho môi trường demo.
          </p>
        </div>
        <button className="outline-btn" onClick={onClose}>
          <IconArrowLeft size={17} />
          Quay lại vận hành
        </button>
      </div>
      {dataError && <p className="data-source-error">Không thể tải dữ liệu quản trị từ MongoDB: {dataError}</p>}<div className="settings-tabs" role="tablist">
        {tabs.map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={tab === item}
            className={tab === item ? "active" : ""}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {tab === "Đơn vị & dữ liệu" && (
        <div className="settings-content">
          <section className="settings-grid">
            <SettingCard
              icon={IconBuildingCommunity}
              title="Đơn vị quản lý"
              subtitle="HTX Nông nghiệp Tân Thuận · Đồng Tháp"
              action="Chỉnh sửa"
              onClick={() => setModal("unit")}
            >
              <Info label="Mã đơn vị" value="HTX-001" />
              <Info label="Người đại diện" value="Bà Lê Thị Thanh Vân" />
              <Info label="Phạm vi dữ liệu" value="04 HTX · 218 hộ · 46 thửa" />
            </SettingCard>
            <SettingCard
              icon={IconCalendarEvent}
              title="Chu kỳ vận hành"
              subtitle="Kỳ dữ liệu và niên độ hạch toán"
              action="Cấu hình"
              onClick={() => setModal("cycle")}
            >
              <Info label="Niên độ tài chính" value="01/01/2026 - 31/12/2026" />
              <Info label="Mùa vụ mặc định" value="Thu Đông 2026" />
              <Info label="Khóa sổ dữ liệu" value="Ngày 05 hàng tháng" />
            </SettingCard>
            <SettingCard
              icon={IconDatabaseCog}
              title="Chất lượng dữ liệu"
              subtitle="Quy tắc kiểm tra trước khi sử dụng"
              action="Xem quy tắc"
              onClick={() => setModal("quality")}
            >
              <Info label="Bản ghi hoàn chỉnh" value="94,6%" />
              <Info label="Chờ bổ sung" value="12 hồ sơ" />
              <Info label="Lần đồng bộ gần nhất" value="20/08/2026 · 10:30" />
            </SettingCard>
          </section>
        </div>
      )}
      {tab === "Người dùng & quyền" && (
        <div className="settings-content">
          <section className="settings-section">
            <header>
              <div>
                <span>PHÂN QUYỀN</span>
                <h3>Người dùng hệ thống</h3>
                <p>
                  Quyền truy cập được phân theo vai trò và phạm vi HTX, vùng sản
                  xuất hoặc nghiệp vụ.
                </p>
              </div>
              <button className="primary-btn" onClick={() => setModal("user")}>
                <IconPlus size={16} />
                Thêm người dùng
              </button>
            </header>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    {[
                      "Họ và tên",
                      "Vai trò",
                      "Phạm vi truy cập",
                      "Trạng thái",
                    ].map((item) => (
                      <th key={item}>{item}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((row) => (
                    <tr
                      key={`${row[0]}-${row[1]}`}
                      onClick={() => setModal("user")}
                    >
                      <td>{row[0]}</td>
                      <td>{row[1]}</td>
                      <td>{row[2]}</td>
                      <td>
                        <Status value={row[3]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
      {tab === "Vai trò & phạm vi" && (
        <div className="settings-content">
          <section className="settings-section">
            <header>
              <div>
                <span>MA TRẬN TRUY CẬP</span>
                <h3>Vai trò, HTX và phạm vi dữ liệu</h3>
                <p>
                  Mỗi tài khoản nhận một vai trò, giới hạn theo HTX và có thể
                  thu hẹp tới vùng trồng hoặc nghiệp vụ.
                </p>
              </div>
              <button className="primary-btn" onClick={() => setModal("role")}>
                <IconPlus size={16} />
                Thêm vai trò
              </button>
            </header>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    {["Vai trò", "Nhóm quyền", "Phạm vi HTX", "Tài khoản"].map(
                      (item) => (
                        <th key={item}>{item}</th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {roles.map((row) => (
                    <tr key={row[0]} onClick={() => setModal("role")}>
                      <td>{row[0]}</td>
                      <td>{row[1]}</td>
                      <td>{row[2]}</td>
                      <td>{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="settings-grid">
            <SettingCard
              icon={IconShieldCheck}
              title="Nguyên tắc phân quyền"
              subtitle="Kiểm soát trước khi ghi dữ liệu"
              action="Điều chỉnh"
              onClick={() => setModal("role")}
            >
              <Info label="Mặc định" value="Chỉ xem trong HTX được gán" />
              <Info
                label="Dữ liệu nhạy cảm"
                value="Tài chính cần phê duyệt 2 lớp"
              />
              <Info label="Thu hồi quyền" value="Ngay khi tài khoản bị khóa" />
            </SettingCard>
          </section>
        </div>
      )}
      {tab === "Danh mục & thông báo" && (
        <div className="settings-content">
          <section className="settings-section">
            <header>
              <div>
                <span>DỮ LIỆU DÙNG CHUNG</span>
                <h3>Danh mục và thông báo hệ thống</h3>
                <p>
                  Danh mục chuẩn dùng xuyên suốt hồ sơ, thửa đất, sản xuất, kho
                  và báo cáo.
                </p>
              </div>
              <button
                className="primary-btn"
                onClick={() => setModal("catalog")}
              >
                <IconPlus size={16} />
                Thêm danh mục
              </button>
            </header>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    {["Danh mục", "Số mục", "Áp dụng", "Trạng thái"].map(
                      (item) => (
                        <th key={item}>{item}</th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {catalogs.map((row) => (
                    <tr key={row[0]} onClick={() => setModal("catalog")}>
                      <td>{row[0]}</td>
                      <td>{row[1]}</td>
                      <td>{row[2]}</td>
                      <td>
                        <Status value={row[3]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="settings-grid">
            <SettingCard
              icon={IconBell}
              title="Thông báo hệ thống"
              subtitle="Mẫu gửi, nhóm nhận và kênh phát hành"
              action="Tạo thông báo"
              onClick={() => setModal("notification")}
            >
              <Info
                label="Lịch gửi tuần này"
                value="06 thông báo đã lên lịch"
              />
              <Info label="Kênh ưu tiên" value="Ứng dụng · SMS khi khẩn" />
              <Info label="Lưu vết xác nhận" value="Bật theo hộ và nhóm" />
            </SettingCard>
            <SettingCard
              icon={IconFileCertificate}
              title="Chính sách lưu trữ"
              subtitle="Phiên bản, hạn lưu và tệp đính kèm"
              action="Cập nhật"
              onClick={() => setModal("catalog")}
            >
              <Info label="Lưu chứng từ" value="10 năm" />
              <Info label="Lưu nhật ký sản xuất" value="Theo mùa vụ + 05 năm" />
              <Info label="Phiên bản danh mục" value="DC-2026.08" />
            </SettingCard>
          </section>
        </div>
      )}
      {tab === "Cảnh báo" && (
        <div className="settings-content">
          <section className="settings-grid">
            <SettingCard
              icon={IconBell}
              title="Cảnh báo vận hành"
              subtitle="Thông báo vào trung tâm điều hành"
              action="Chỉnh sửa"
              onClick={() => setModal("alerts")}
            >
              <Info label="Nhật ký chờ xác nhận" value="Sau 24 giờ" />
              <Info label="Mùa vụ cần theo dõi" value="Dưới 70% kế hoạch" />
              <Info label="Lô hàng sắp hết hạn" value="Trước 48 giờ" />
            </SettingCard>
            <SettingCard
              icon={IconFileCertificate}
              title="Hồ sơ & tuân thủ"
              subtitle="Nhắc hạn chứng nhận, pháp lý và ký số"
              action="Chỉnh sửa"
              onClick={() => setModal("compliance")}
            >
              <Info label="Chứng nhận hết hạn" value="Trước 30 ngày" />
              <Info label="Hồ sơ thiếu dữ liệu" value="Nhắc sau 03 ngày" />
              <Info label="Hợp đồng chờ ký" value="Nhắc mỗi 24 giờ" />
            </SettingCard>
            <SettingCard
              icon={IconShieldCheck}
              title="Tài chính & phê duyệt"
              subtitle="Kiểm soát công nợ và chứng từ"
              action="Chỉnh sửa"
              onClick={() => setModal("finance")}
            >
              <Info label="Công nợ quá hạn" value="Thông báo ngay" />
              <Info label="Phiếu chi chờ duyệt" value="Sau 08 giờ" />
              <Info label="Ngưỡng phê duyệt" value="Từ 50.000.000 đ" />
            </SettingCard>
          </section>
        </div>
      )}
      {tab === "Tích hợp & nhật ký" && (
        <div className="settings-content">
          <section className="settings-grid">
            <SettingCard
              icon={IconCloudCog}
              title="Kết nối dữ liệu"
              subtitle="Các dịch vụ dùng trong môi trường demo"
              action="Cấu hình"
              onClick={() => setModal("integration")}
            >
              <Info label="Bản đồ nền" value="OpenStreetMap · Đang kết nối" />
              <Info label="Chữ ký số" value="Mock gateway · Sẵn sàng" />
              <Info label="Đồng bộ dữ liệu" value="Mô phỏng theo yêu cầu" />
            </SettingCard>
            <SettingCard
              icon={IconKey}
              title="Bảo mật truy cập"
              subtitle="Chính sách phiên và xác thực"
              action="Cập nhật"
              onClick={() => setModal("security")}
            >
              <Info label="Thời hạn phiên" value="08 giờ" />
              <Info label="Xác thực hai lớp" value="Bật cho quản trị" />
              <Info label="Mật khẩu gần nhất" value="Đổi 18 ngày trước" />
            </SettingCard>
          </section>
          <section className="settings-section audit-section">
            <header>
              <div>
                <span>NHẬT KÝ KIỂM TOÁN</span>
                <h3>Hoạt động cấu hình gần đây</h3>
                <p>Dấu vết thay đổi cấu hình trong phạm vi dữ liệu demo.</p>
              </div>
            </header>
            {auditLogs.map(([time, user, action, status]) => (
              <div className="audit-row" key={`${time}-${action}`}>
                <time>{time}</time>
                <b>{user}</b>
                <span>{action}</span>
                <Status value={status} />
              </div>
            ))}
          </section>
        </div>
      )}
      {modal && (
        <SettingsForm
          type={modal}
          onClose={() => setModal(null)}
          onSubmit={async (values) => {
            try {
              if (modal === "notification") {
                await apiPost("/api/admin/notifications", {
                  code: values.code,
                  title: values.title,
                  message: values.message,
                  channel: values.channel,
                  target: { type: values.recipient === "Toàn hệ thống" ? "all" : "role", values:[] },
                });
              } else {
                await apiPost("/api/auditEvents", { eventId:`CFG-${Date.now()}`, cooperativeCode:"HTX-001", actorCode:"USR-001", action:`Cập nhật cấu hình: ${modal}`, detail:values, createdAt:new Date() });
              }
              setModal(null);
              onNotice();
            } catch (reason) { setDataError(reason.message); }
          }}
        />
      )}
    </section>
  );
}

function SettingCard({
  icon: Icon,
  title,
  subtitle,
  action,
  onClick,
  children,
}) {
  return (
    <section className="settings-card">
      <header>
        <div className="settings-icon">
          <Icon size={19} />
        </div>
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <button className="text-btn" onClick={onClick}>
          {action}
        </button>
      </header>
      <div>{children}</div>
    </section>
  );
}
function Info({ label, value }) {
  return (
    <div className="settings-info">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
function SettingsForm({ type, onClose, onSubmit }) {
  const forms = {
    unit: {
      title: "Cập nhật đơn vị quản lý",
      fields: [
        {
          name: "name",
          label: "Tên đơn vị",
          value: "HTX Nông nghiệp Tân Thuận",
          required: true,
          wide: true,
        },
        { name: "code", label: "Mã đơn vị", value: "HTX-001", required: true },
        {
          name: "representative",
          label: "Người đại diện",
          value: "Bà Lê Thị Thanh Vân",
          required: true,
        },
      ],
    },
    cycle: {
      title: "Thiết lập chu kỳ vận hành",
      fields: [
        {
          name: "season",
          label: "Mùa vụ mặc định",
          type: "select",
          options: ["Thu Đông 2026", "Đông Xuân 2026-2027"],
          required: true,
        },
        {
          name: "closing",
          label: "Ngày khóa sổ",
          type: "number",
          value: "5",
          required: true,
        },
      ],
    },
    user: {
      title: "Thêm hoặc cập nhật người dùng",
      fields: [
        { name: "name", label: "Họ và tên", required: true },
        {
          name: "role",
          label: "Vai trò",
          type: "select",
          options: [
            "Quản trị HTX",
            "Giám đốc HTX",
            "Kế toán trưởng",
            "Điều phối vùng",
          ],
          required: true,
        },
        {
          name: "scope",
          label: "Phạm vi truy cập",
          required: true,
          wide: true,
        },
      ],
    },
    role: {
      title: "Vai trò và phạm vi dữ liệu",
      fields: [
        { name: "role", label: "Tên vai trò", required: true },
        { name: "scope", label: "HTX/phạm vi áp dụng", value: "HTX Tân Thuận", required: true },
        { name: "permission", label: "Nhóm quyền", type: "select", options: ["Chỉ xem", "Tạo và cập nhật", "Phê duyệt", "Quản trị"], required: true },
      ],
    },
    catalog: {
      title: "Danh mục dùng chung",
      fields: [
        { name: "catalog", label: "Nhóm danh mục", type: "select", options: ["Cây trồng", "Loại đất", "Vật tư đầu vào", "Kênh thông báo"], required: true },
        { name: "name", label: "Tên mục danh mục", required: true },
        { name: "status", label: "Trạng thái công bố", type: "select", options: ["Nháp", "Đã công bố", "Ngừng áp dụng"], required: true },
      ],
    },
    notification: {
      title: "Tạo thông báo hệ thống",
      fields: [
        { name: "code", label: "Mã thông báo", value: `TB-${Date.now()}`, required: true },
        { name: "title", label: "Tiêu đề thông báo", required: true, wide: true },
        { name: "message", label: "Nội dung thông báo", required: true, wide: true },
        { name: "recipient", label: "Nhóm nhận", type: "select", options: ["Toàn hệ thống", "Theo Hợp tác xã", "Theo vùng trồng", "Theo hộ dân"], required: true },
        { name: "channel", label: "Kênh gửi", type: "select", options: ["Ứng dụng", "Email", "SMS", "Ứng dụng + SMS"], required: true },
      ],
    },
    alerts: {
      title: "Cấu hình cảnh báo vận hành",
      fields: [
        {
          name: "journal",
          label: "Nhật ký chờ xác nhận (giờ)",
          type: "number",
          value: "24",
          required: true,
        },
        {
          name: "expiry",
          label: "Cảnh báo hết hạn kho (giờ)",
          type: "number",
          value: "48",
          required: true,
        },
      ],
    },
    compliance: {
      title: "Cấu hình nhắc hồ sơ",
      fields: [
        {
          name: "certificate",
          label: "Nhắc chứng nhận trước hạn (ngày)",
          type: "number",
          value: "30",
          required: true,
        },
        {
          name: "sign",
          label: "Nhắc hợp đồng chờ ký (giờ)",
          type: "number",
          value: "24",
          required: true,
        },
      ],
    },
    finance: {
      title: "Cấu hình kiểm soát tài chính",
      fields: [
        {
          name: "amount",
          label: "Ngưỡng phê duyệt (đ)",
          type: "number",
          value: "50000000",
          required: true,
        },
        {
          name: "debt",
          label: "Nhắc nợ quá hạn sau (ngày)",
          type: "number",
          value: "1",
          required: true,
        },
      ],
    },
    integration: {
      title: "Cấu hình kết nối dữ liệu",
      fields: [
        {
          name: "map",
          label: "Bản đồ nền",
          type: "select",
          options: ["OpenStreetMap", "Bản đồ nội bộ"],
          required: true,
        },
        {
          name: "sync",
          label: "Tần suất đồng bộ",
          type: "select",
          options: ["Theo yêu cầu", "Mỗi 6 giờ", "Hàng ngày"],
          required: true,
        },
      ],
    },
    security: {
      title: "Cấu hình bảo mật",
      fields: [
        {
          name: "session",
          label: "Thời hạn phiên (giờ)",
          type: "number",
          value: "8",
          required: true,
        },
        {
          name: "mfa",
          label: "Xác thực hai lớp",
          type: "select",
          options: ["Bắt buộc quản trị", "Bật cho toàn bộ", "Tắt"],
          required: true,
        },
      ],
    },
  };
  const form = forms[type];
  return (
    <FormModal
      title={form.title}
      description="Thay đổi được ghi nhận ở trạng thái mô phỏng và tạo một mục trong nhật ký kiểm toán."
      fields={form.fields}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}
