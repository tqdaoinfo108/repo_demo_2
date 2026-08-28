"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IconBell,
  IconBuildingCommunity,
  IconCalendarEvent,
  IconChevronDown,
  IconClipboardData,
  IconFileCertificate,
  IconHome,
  IconLeaf,
  IconMap2,
  IconPackage,
  IconPlant2,
  IconReportMoney,
  IconSearch,
  IconSettings,
  IconShoppingBag,
  IconTractor,
  IconUsers,
  IconWallet,
  IconArrowUpRight,
  IconCircleCheck,
  IconChevronLeft,
  IconChevronRight,
  IconAlertTriangle,
  IconX,
  IconMenu2,
  IconMessageChatbot,
  IconQrcode,
  IconClipboardCheck,
  IconFileAlert,
  IconShieldCheck,
  IconSend,
  IconSparkles,
  IconCreditCard,
} from "@tabler/icons-react";
import MapWidget from "./map-widget";
import ModuleView from "./module-view";
import SystemSettings from "./system-settings";
import ProfileSheet from "./profile-sheet";
import { ActionModal, SideSheet } from "./shared-ui";
import { API_URL, apiGet } from "../lib/api";

const navGroups = [
  {
    title: "Điều hành",
    items: [
      { label: "Tổng quan", icon: IconHome },
      { label: "Hợp tác xã", icon: IconBuildingCommunity },
      { label: "Hộ dân & thành viên", icon: IconUsers },
      { label: "Tài sản HTX", icon: IconTractor },
    ],
  },
  {
    title: "Vùng trồng & sản xuất",
    items: [
      { label: "Đất đai & GIS", icon: IconMap2 },
      { label: "Sản xuất", icon: IconPlant2 },
      { label: "Vật tư & nhật ký", icon: IconClipboardData },
      { label: "Thu hoạch", icon: IconShoppingBag },
    ],
  },
  {
    title: "Chuỗi giá trị",
    items: [
      { label: "Đóng gói", icon: IconPackage },
      { label: "Chất lượng & kiểm nghiệm", icon: IconClipboardCheck },
      { label: "Kho & tiêu thụ", icon: IconPackage },
      { label: "Vận chuyển & giao nhận", icon: IconTractor },
      { label: "Hợp đồng & đối soát", icon: IconCreditCard },
      { label: "Truy xuất nguồn gốc", icon: IconQrcode },
    ],
  },
  {
    title: "Tài chính & hồ sơ",
    items: [
      { label: "Tài chính", icon: IconWallet },
      { label: "Vốn góp & cổ tức", icon: IconReportMoney },
      { label: "Hồ sơ & tài liệu", icon: IconFileCertificate },
      { label: "Truyền thông nội bộ", icon: IconBell },
    ],
  },
];
const nav = navGroups.flatMap((group) => group.items);

const cooperatives = [
  {
    code: "HTX-001",
    name: "HTX Nông nghiệp Tân Thuận",
    area: "Châu Thành · 412,6 ha",
    initials: "TT",
    status: "Đang làm việc",
  },
  {
    code: "HTX-002",
    name: "HTX Rau an toàn Bình Hòa",
    area: "Cao Lãnh · 86,4 ha",
    initials: "BH",
    status: "Hoạt động",
  },
  {
    code: "HTX-003",
    name: "HTX Dịch vụ Mỹ An",
    area: "Tháp Mười · 124,8 ha",
    initials: "MA",
    status: "Hoạt động",
  },
  {
    code: "HTX-004",
    name: "HTX Chăn nuôi Phú Hựu",
    area: "Lấp Vò · 72 thành viên",
    initials: "PH",
    status: "Đang rà soát",
  },
];

const initialParcel = {
  id: "TD-042",
  name: "Ông Nguyễn Văn Thành",
  crop: "Sầu riêng Ri6",
  area: "2,4 ha",
  color: "#2d7a4f",
};

const notifications = [
  {
    icon: IconClipboardCheck,
    tone: "amber",
    title: "Đơn DH-0826-41 chờ xác nhận",
    detail: "Công ty An Phú đặt 8.500 kg sầu riêng Ri6.",
    time: "42 phút trước",
    action: "Mở đơn hàng",
    module: "Kho & tiêu thụ",
  },
  {
    icon: IconShieldCheck,
    tone: "green",
    title: "Cập nhật nhật ký TD-042",
    detail: "Bón phân hữu cơ đã được ghi nhận, chờ tổ trưởng xác nhận.",
    time: "18 phút trước",
    action: "Xem nhật ký",
    module: "Sản xuất",
  },
  {
    icon: IconFileAlert,
    tone: "blue",
    title: "03 thửa sắp đến hạn kiểm tra",
    detail: "Chứng nhận VietGAP cần được rà soát trong 7 ngày tới.",
    time: "3 giờ trước",
    action: "Xem hồ sơ",
    module: "Hồ sơ & tài liệu",
  },
  {
    icon: IconCreditCard,
    tone: "red",
    title: "Công nợ GreenMart quá hạn",
    detail: "Cần đối soát khoản phải thu 62.800.000 đ.",
    time: "Hôm qua",
    action: "Đối soát",
    module: "Tài chính",
  },
];

const supplyChain = [
  {
    code: "TH-2408-16",
    product: "Sầu riêng Ri6 · TD-042",
    quantity: "1.250 kg",
    stage: "Thu hoạch",
    status: "Chờ nghiệm thu",
    module: "Thu hoạch",
    progress: 42,
    note: "Tổ Tân Thuận hoàn tất cân tại vườn lúc 09:20",
  },
  {
    code: "DG-2408-09",
    product: "Bưởi da xanh · MV-TD26-03",
    quantity: "2.100 kg",
    stage: "Đóng gói",
    status: "Đang đóng gói",
    module: "Đóng gói",
    progress: 61,
    note: "Bàn đóng gói 04 đang dán tem QR và phân hạng",
  },
  {
    code: "SR-2408-16",
    product: "Sầu riêng Ri6 · Lô xuất khẩu",
    quantity: "1.250 kg",
    stage: "Kho lạnh",
    status: "Sắp xuất kho",
    module: "Kho & tiêu thụ",
    progress: 79,
    note: "Kho lạnh số 1 · ưu tiên xuất trong 48 giờ",
  },
  {
    code: "DH-0826-41",
    product: "Sầu riêng Ri6 · Công ty An Phú",
    quantity: "8.500 kg",
    stage: "Giao nhận",
    status: "Chờ xác nhận",
    module: "Kho & tiêu thụ",
    progress: 91,
    note: "Đã phân bổ 03 lô, chờ khách hàng chốt lịch nhận",
  },
];

export default function Dashboard() {
  const [active, setActive] = useState("Tổng quan");
  const [parcel, setParcel] = useState(initialParcel);
  const [notice, setNotice] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const [selectedCoop, setSelectedCoop] = useState(cooperatives[0]);
  const [dashboardSource, setDashboardSource] = useState(null);
  const [dashboardError, setDashboardError] = useState("");
  const [liveNotifications, setLiveNotifications] = useState([]);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [chainDetail, setChainDetail] = useState(null);
  const [utility, setUtility] = useState(null);
  const selectParcel = useCallback((value) => setParcel(value), []);
  const viewingSettings = utility === "Cấu hình hệ thống";
  const pageTitle = viewingSettings
    ? "Cấu hình hệ thống"
    : active === "Tổng quan"
      ? "Trung tâm điều hành"
      : active;
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(2026, 7, 18)),
    [],
  );
  useEffect(() => {
    let cancelled = false;
    const cooperativeCode = selectedCoop.code;
    Promise.all([
      apiGet(`/api/dashboard/overview?cooperativeCode=${cooperativeCode}`), apiGet(`/api/salesOrders?cooperativeCode=${cooperativeCode}`), apiGet(`/api/inventoryLots?cooperativeCode=${cooperativeCode}`), apiGet(`/api/qualityInspections?cooperativeCode=${cooperativeCode}`), apiGet(`/api/financialEntries?cooperativeCode=${cooperativeCode}`), apiGet(`/api/auditEvents?cooperativeCode=${cooperativeCode}`),
    ]).then(([overview, orders, lots, quality, finance, audit]) => {
      if (!cancelled) { setDashboardSource({ overview, orders:orders.data, lots:lots.data, quality:quality.data, finance:finance.data, audit:audit.data }); setDashboardError(""); }
    }).catch(() => { if (!cancelled) { setDashboardSource(emptyDashboardSource(cooperativeCode)); setDashboardError("Không thể kết nối API dữ liệu. Kiểm tra API_URL và trạng thái MongoDB."); } });
    return () => { cancelled = true; };
  }, [selectedCoop.code]);
  useEffect(() => { const token = window.localStorage.getItem("htx_auth_token"); if (!token) return; const stream = new EventSource(`${API_URL}/api/notifications/stream?token=${encodeURIComponent(token)}`); stream.addEventListener("initial", (event) => setLiveNotifications(JSON.parse(event.data))); stream.addEventListener("notification", (event) => setLiveNotifications((items) => [JSON.parse(event.data), ...items])); return () => stream.close(); }, []);
  const dashboard = useMemo(() => buildDashboardView(dashboardSource), [dashboardSource]);

  return (
    <main
      className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
    >
      <aside
        className={`sidebar ${mobileNav ? "open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}
      >
        <div className="brand">
          <div className="brand-mark">
            <IconLeaf size={22} />
          </div>
          <div>
            <strong>HTX Số</strong>
            <span>Đồng Tháp</span>
          </div>
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarCollapsed((value) => !value)}
          aria-label={sidebarCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
          title={sidebarCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
        >
          {sidebarCollapsed ? (
            <IconChevronRight size={18} />
          ) : (
            <IconChevronLeft size={18} />
          )}
        </button>
        <div className="org-switch-wrap">
          <button
            className="org-switch"
            onClick={() => setOrgOpen((value) => !value)}
            aria-expanded={orgOpen}
            aria-haspopup="listbox"
            title={selectedCoop.name}
          >
            <div className="org-icon">{selectedCoop.initials}</div>
            <div>
              <b>{selectedCoop.name}</b>
              <span>{selectedCoop.area}</span>
            </div>
            <IconChevronDown size={18} />
          </button>
          {orgOpen && (
            <div
              className="org-popover"
              role="listbox"
              aria-label="Chọn hợp tác xã"
            >
              <header>
                <span>ĐƠN VỊ LÀM VIỆC</span>
                <b>Chọn Hợp tác xã</b>
              </header>
              {cooperatives.map((coop) => (
                <button
                  key={coop.code}
                  className={coop.code === selectedCoop.code ? "active" : ""}
                  onClick={() => {
                    setSelectedCoop(coop);
                    setOrgOpen(false);
                    setNotice(true);
                  }}
                  role="option"
                  aria-selected={coop.code === selectedCoop.code}
                >
                  <i>{coop.initials}</i>
                  <div>
                    <b>{coop.name}</b>
                    <span>
                      {coop.code} · {coop.area}
                    </span>
                  </div>
                  {coop.code === selectedCoop.code && (
                    <IconCircleCheck size={17} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        <nav className="sidebar-nav" aria-label="Phân hệ vận hành">
          {navGroups.map((group) => (
            <section className="nav-group" key={group.title}>
              <h2>{group.title}</h2>
              {group.items.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  title={label}
                  aria-label={label}
                  onClick={() => {
                    setActive(label);
                    setUtility(null);
                    setMobileNav(false);
                  }}
                  className={
                    active === label && !viewingSettings
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Icon size={18} stroke={1.8} />
                  {label}
                </button>
              ))}
            </section>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button
            className="nav-item"
            onClick={() => setUtility("Cấu hình hệ thống")}
          >
            <IconSettings size={19} />
            Cấu hình hệ thống
          </button>
          <button
            className="profile"
            onClick={() => setUtility("Tài khoản quản trị")}
          >
            <div className="avatar">NT</div>
            <div>
              <b>Nguyễn Minh Tâm</b>
              <span>Quản trị HTX</span>
            </div>
            <IconChevronDown size={17} />
          </button>
        </div>
      </aside>
      {mobileNav && (
        <button
          className="scrim"
          aria-label="Đóng menu"
          onClick={() => setMobileNav(false)}
        />
      )}

      <section className="workspace">
        <header className="topbar">
          <button
            className="menu-btn"
            onClick={() => setMobileNav(true)}
            aria-label="Mở menu"
          >
            <IconMenu2 />
          </button>
          <div className="crumb">
            <span>Vận hành HTX</span>
            <b>/</b>
            <strong>{pageTitle}</strong>
          </div>
          <div className="top-actions">
            <button
              className="icon-btn search"
              onClick={() => setQuickSearchOpen(true)}
            >
              <IconSearch size={19} />
              <span>Tìm kiếm nhanh</span>
              <kbd>⌘ K</kbd>
            </button>
            <div className="notification-wrap">
              <button
                className="icon-btn bell"
                onClick={() => setNotificationOpen(!notificationOpen)}
                aria-label="Thông báo"
              >
                <IconBell size={20} />
                {!notificationOpen && <i />}
              </button>
              {notificationOpen && (
                <NotificationPopover
                  items={liveNotifications}
                  onClose={() => setNotificationOpen(false)}
                  onNotice={() => setNotice(true)}
                  onOpen={(module) => {
                    setNotificationOpen(false);
                    setActive(module);
                  }}
                  onAll={() => {
                    setNotificationOpen(false);
                    setDetail({
                      type: "notifications",
                      title: "Tất cả thông báo",
                    });
                  }}
                />
              )}
            </div>
          </div>
        </header>

        <div className="content">
          <div className="page-heading">
            <div>
              <p>{today}</p>
              <h1>{pageTitle}</h1>
            </div>
            <div className="heading-actions">
              <button
                className="outline-btn"
                onClick={() => setUtility("Xuất báo cáo vận hành")}
              >
                <IconFileCertificate size={18} />
                Xuất báo cáo
              </button>
              <button
                className="primary-btn"
                onClick={() => setUtility("Cập nhật dữ liệu")}
              >
                <IconClipboardData size={18} />
                Cập nhật dữ liệu
              </button>
            </div>
          </div>

          {notice && (
            <div className="notice">
              <IconCircleCheck size={19} />
              <span>
                Thông báo mẫu: Có 3 hồ sơ mùa vụ và 2 đơn hàng đang chờ xử lý.
              </span>
              <button onClick={() => setNotice(false)}>
                <IconX size={17} />
              </button>
            </div>
          )}
          {dashboardError && <div className="notice warning"><IconAlertTriangle size={19} /><span>{dashboardError}</span><button onClick={() => setDashboardError("")}><IconX size={17} /></button></div>}

          {viewingSettings ? (
            <SystemSettings
              onClose={() => setUtility(null)}
              onNotice={() => setNotice(true)}
            />
          ) : active === "Tổng quan" ? (
            <>
              <section className="kpi-grid">
                {dashboard.kpis.map((metric) => (
                  <Metric
                    key={metric.label}
                    {...metric}
                    onClick={() =>
                      setDetail({
                        type: "metric",
                        ...metric.detail,
                        module: metric.module,
                      })
                    }
                  />
                ))}
              </section>

              <section className="overview-grid">
                <div className="panel production-panel">
                  <div className="panel-head">
                    <div>
                      <h2>Sản xuất theo mùa vụ</h2>
                      <p>Tiến độ Thu Đông 2026 · cập nhật 11:30</p>
                    </div>
                    <button
                      className="text-btn"
                      onClick={() => setActive("Sản xuất")}
                    >
                      Xem chi tiết <IconArrowUpRight size={16} />
                    </button>
                  </div>
                  <div className="production-body">
                    <button
                      className="donut"
                      onClick={() =>
                        setDetail({
                          type: "metric",
                          title: "Tiến độ vụ Thu Đông 2026",
                          period: "Cập nhật từ 07 mùa vụ đang theo dõi",
                          summary:
                            "Mức hoàn thành được tính theo khối lượng đã nghiệm thu so với kế hoạch vụ đã được phê duyệt.",
                          module: "Sản xuất",
                          facts: [
                            ["Kế hoạch đã duyệt", "3.274 tấn"],
                            ["Đã nghiệm thu", "2.684 tấn"],
                            ["Chờ nghiệm thu", "332 tấn"],
                            ["Dự báo còn lại", "258 tấn"],
                          ],
                          timeline: [
                            ["Hôm nay", "Cập nhật 04 nhật ký thu hoạch"],
                            [
                              "Tuần này",
                              "08 tổ sản xuất hoàn tất đối chiếu sản lượng",
                            ],
                          ],
                        })
                      }
                    >
                      <div>
                        <strong>82%</strong>
                        <span>hoàn thành</span>
                      </div>
                    </button>
                    <div className="crop-list">
                      {dashboard.crops.map((crop) => (
                        <Crop
                          key={crop.name}
                          {...crop}
                          onClick={() =>
                            setDetail({
                              type: "crop",
                              title: crop.name,
                              period: "Vụ Thu Đông 2026",
                              summary: `${crop.name} đang thực hiện ${crop.pct}% kế hoạch, theo lịch thu hoạch ${crop.harvest.toLowerCase()}.`,
                              module: crop.module,
                              facts: [
                                ["Diện tích theo dõi", crop.area],
                                ["Kế hoạch", crop.plan],
                                ["Đã thực hiện", crop.amount],
                                ["Lịch thu hoạch", crop.harvest],
                              ],
                              timeline: [
                                ["Hôm nay", "Tổ trưởng cập nhật tiến độ vườn"],
                                [
                                  "Tuần này",
                                  "Đối chiếu sản lượng và chất lượng đầu ra",
                                ],
                              ],
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="panel orders-panel">
                  <div className="panel-head">
                    <div>
                      <h2>Đơn tiêu thụ</h2>
                      <p>Tháng 08/2026 · 27 đơn đang xử lý</p>
                    </div>
                    <button
                      className="more"
                      aria-label="Mở đơn tiêu thụ"
                      onClick={() => setActive("Kho & tiêu thụ")}
                    >
                      •••
                    </button>
                  </div>
                  <div className="order-stat">
                    <strong>27</strong>
                    <span>đơn hàng đang xử lý</span>
                    <em>+5 đơn tuần này</em>
                  </div>
                  <div className="order-bars">
                    <span style={{ height: "68%" }} />
                    <span style={{ height: "47%" }} />
                    <span style={{ height: "82%" }} />
                    <span style={{ height: "61%" }} />
                    <span className="current" style={{ height: "94%" }} />
                    <span style={{ height: "56%" }} />
                    <span style={{ height: "73%" }} />
                  </div>
                  <div className="week">
                    <span>T2</span>
                    <span>T3</span>
                    <span>T4</span>
                    <span>T5</span>
                    <span>T6</span>
                    <span>CN</span>
                  </div>
                  <div className="order-snapshot">
                    {dashboard.orders.map((order) => (
                      <button
                        key={order.code}
                        onClick={() =>
                          setDetail({
                            type: "order",
                            title: order.code,
                            period: `Giao dự kiến ${order.delivery}`,
                            summary: `${order.customer} đặt ${order.quantity} ${order.product}. Đơn đang ở trạng thái ${order.status.toLowerCase()}.`,
                            module: "Kho & tiêu thụ",
                            facts: [
                              ["Khách hàng", order.customer],
                              ["Sản phẩm", order.product],
                              ["Giá trị tạm tính", order.value],
                              ["Trạng thái", order.status],
                            ],
                            timeline: [
                              [
                                "Hôm nay",
                                "Đối chiếu tồn kho và điều kiện giao",
                              ],
                              [
                                "Trước giờ giao",
                                "Xác nhận lệnh xuất kho và biên bản bàn giao",
                              ],
                            ],
                          })
                        }
                      >
                        <b>{order.code}</b>
                        <span>
                          {order.quantity} · {order.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="panel gis-panel">
                <div className="panel-head">
                  <div>
                    <h2>Bản đồ vùng sản xuất</h2>
                    <p>Tra cứu thửa đất, mùa vụ và trạng thái tiêu chuẩn</p>
                  </div>
                  <div className="map-legend">
                    <span>
                      <i className="legend-green" />
                      Đạt VietGAP
                    </span>
                    <span>
                      <i className="legend-amber" />
                      Đang chuyển đổi
                    </span>
                    <span>
                      <i className="legend-blue" />
                      Vùng liên kết
                    </span>
                  </div>
                </div>
                <div className="map-layout">
                  <div className="map-wrap">
                    <MapWidget
                      selectedParcel={parcel}
                      onSelect={selectParcel}
                    />
                    <div className="map-filter">
                      <IconSearch size={16} />
                      <span>Tìm thửa đất, hộ dân...</span>
                    </div>
                  </div>
                  <aside className="parcel-card">
                    <div className="parcel-label">THỬA ĐẤT ĐANG CHỌN</div>
                    <h3>{parcel.id}</h3>
                    <div className="parcel-status">
                      <span style={{ background: parcel.color }} />
                      Đạt chuẩn VietGAP
                    </div>
                    <dl>
                      <div>
                        <dt>Chủ sử dụng</dt>
                        <dd>{parcel.name}</dd>
                      </div>
                      <div>
                        <dt>Cây trồng</dt>
                        <dd>{parcel.crop}</dd>
                      </div>
                      <div>
                        <dt>Diện tích</dt>
                        <dd>{parcel.area}</dd>
                      </div>
                      <div>
                        <dt>Mùa vụ</dt>
                        <dd>Thu Đông 2026</dd>
                      </div>
                    </dl>
                    <button
                      className="primary-btn full"
                      onClick={() => setActive("Đất đai & GIS")}
                    >
                      Mở hồ sơ thửa đất <IconArrowUpRight size={17} />
                    </button>
                  </aside>
                </div>
              </section>

              <section className="control-grid">
                {dashboard.controls.map((item) => (
                  <button
                    className={`control-check ${item.tone}`}
                    key={item.label}
                    onClick={() => setActive(item.module)}
                  >
                    <span>{item.label}</span>
                    <b>{item.value}</b>
                    <small>{item.note}</small>
                    <IconArrowUpRight size={16} />
                  </button>
                ))}
              </section>
              <SupplyChainBoard onOpen={setChainDetail} onGo={setActive} />
              <section className="lower-grid">
                <div className="panel activity-panel">
                  <div className="panel-head">
                    <div>
                      <h2>Hoạt động mới nhất</h2>
                      <p>Cập nhật từ các phân hệ trong ngày</p>
                    </div>
                    <button
                      className="text-btn"
                      onClick={() => setActivityOpen(true)}
                    >
                      Tất cả <IconArrowUpRight size={16} />
                    </button>
                  </div>
                  <div className="activity-list">
                    {dashboard.activities.map((item) => (
                      <button
                        className="activity"
                        key={item.title}
                        onClick={() =>
                          setDetail({
                            type: "activity",
                            ...item.detail,
                            module: item.module,
                          })
                        }
                      >
                        <div className={`activity-icon ${item.tone}`}>
                          <item.icon size={18} />
                        </div>
                        <div>
                          <b>{item.title}</b>
                          <p>{item.sub}</p>
                        </div>
                        <time>{item.time}</time>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="panel alerts-panel">
                  <div className="panel-head">
                    <div>
                      <h2>Cần lưu ý</h2>
                      <p>Cảnh báo vận hành cần xử lý</p>
                    </div>
                    <span className="count">03</span>
                  </div>
                  {dashboard.alerts.map((alert) => (
                    <Alert
                      key={alert.title}
                      title={alert.title}
                      detail={alert.detail}
                      onClick={() =>
                        setDetail({
                          type: "alert",
                          ...alert.detailData,
                          module: alert.module,
                        })
                      }
                    />
                  ))}
                </div>
              </section>
            </>
          ) : (
            <ModuleView
              active={active}
              onNotice={() => setNotice(true)}
              parcel={parcel}
              onSelectParcel={selectParcel}
            />
          )}
        </div>
      </section>
      {quickSearchOpen && (
        <QuickSearch
          onClose={() => setQuickSearchOpen(false)}
          onGo={(module) => {
            setActive(module);
            setQuickSearchOpen(false);
          }}
        />
      )}
      {activityOpen && (
        <ActivitySheet
          items={dashboard.activities}
          onClose={() => setActivityOpen(false)}
          onSelect={(item) => {
            setActivityOpen(false);
            setDetail({ type: "activity", ...item });
          }}
        />
      )}
      {detail && (
        <DashboardDetail
          detail={detail}
          notifications={liveNotifications}
          onClose={() => setDetail(null)}
          onGo={(module) => {
            setDetail(null);
            setActive(module);
          }}
        />
      )}
      {chainDetail && (
        <ChainDetailDrawer
          item={chainDetail}
          onClose={() => setChainDetail(null)}
          onGo={(module) => {
            setChainDetail(null);
            setActive(module);
          }}
        />
      )}
      {utility === "Tài khoản quản trị" && (
        <ProfileSheet
          onClose={() => setUtility(null)}
          onNotice={() => setNotice(true)}
        />
      )}
      {utility &&
        utility !== "Cấu hình hệ thống" &&
        utility !== "Tài khoản quản trị" && (
          <ActionModal
            title={utility}
            description={
              utility === "Cập nhật dữ liệu"
                ? "Dữ liệu mô phỏng đã sẵn sàng đồng bộ. Xác nhận để cập nhật thời điểm dữ liệu mới nhất."
                : "Đây là màn hình thao tác mẫu cho buổi demo. Xác nhận để lưu thay đổi ở trạng thái nháp."
            }
            onClose={() => setUtility(null)}
            onConfirm={() => {
              setUtility(null);
              setNotice(true);
            }}
          />
        )}
      <AiProductionChat />
    </main>
  );
}

const aiCapabilities = [
  { label:"Tình hình sản xuất", prompt:"Phân tích tình hình sản xuất và 3 rủi ro cần ưu tiên hôm nay." },
  { label:"Cảnh báo sâu bệnh", prompt:"Phân tích dấu hiệu sâu bệnh và các thửa cần kiểm tra hiện trường." },
  { label:"Lịch sử phun thuốc", prompt:"Tóm tắt lịch sử phun thuốc, thời gian cách ly và các nhật ký thiếu xác nhận." },
  { label:"Bất thường vật tư", prompt:"Phát hiện việc sử dụng thuốc hoặc phân bón bất thường so với dữ liệu hiện có." },
  { label:"Dự báo sản lượng", prompt:"Dự báo sản lượng đến cuối vụ, nêu giả định và mức độ tin cậy." },
  { label:"Dự báo doanh thu", prompt:"Dự báo doanh thu ngắn hạn từ lượng hàng, đơn hàng và công nợ hiện có." },
  { label:"Nhu cầu tiêu thụ", prompt:"Phân tích nhu cầu tiêu thụ và ưu tiên phân bổ hàng theo đơn đang xử lý." },
  { label:"Giá nông sản", prompt:"Phân tích biến động giá nông sản; nếu không có giá thị trường thì nêu dữ liệu cần bổ sung." },
  { label:"Sản lượng bất thường", prompt:"Phát hiện hộ hoặc thửa có sản lượng bất thường cần xác minh." },
  { label:"Hỏi đáp dữ liệu HTX", prompt:"Tóm tắt các chỉ số vận hành chính của HTX hiện tại." },
  { label:"Báo cáo định kỳ", prompt:"Tạo bản tóm tắt báo cáo tháng gồm sản xuất, chất lượng, tiêu thụ và tài chính." },
];
const AI_SYSTEM_PROMPT = `Bạn là Trợ lý điều hành HTX số cho nông nghiệp Việt Nam. Chỉ sử dụng dữ liệu trong CONTEXT; không suy đoán số liệu, giá thị trường, chẩn đoán sâu bệnh hay khuyến nghị liều lượng thuốc khi CONTEXT không có bằng chứng. Khi dữ liệu thiếu, phải ghi rõ "Chưa đủ dữ liệu" và liệt kê trường cần bổ sung. Không đưa hướng dẫn sử dụng thuốc BVTV cụ thể; yêu cầu cán bộ kỹ thuật/nhãn sản phẩm xác nhận. Trả lời tiếng Việt, ngắn gọn, theo đúng cấu trúc: 1) Kết luận; 2) Bằng chứng dữ liệu; 3) Rủi ro/mức độ tin cậy; 4) Việc cần làm tiếp theo. Với dự báo, luôn nêu giả định, phạm vi thời gian và không gọi đó là số liệu thực tế.`;
const OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "google/gemma-4-26b-a4b-it:free";

function AiProductionChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Tôi có thể phân tích tiến độ mùa vụ, rủi ro nhật ký, QC, tồn kho và đơn tiêu thụ từ dữ liệu dashboard.",
    },
  ]);
  const proxyUrl = process.env.NEXT_PUBLIC_AI_PROXY_URL;
  const directToken = process.env.NEXT_PUBLIC_AI_TOKEN;
  const ask = async (question) => {
    const prompt = question.trim();
    if (!prompt || loading) return;
    setInput("");
    setMessages((items) => [...items, { role: "user", content: prompt }]);
    setLoading(true);
    try {
      let answer = "";
      if (directToken) {
        const response = await fetch(OPENROUTER_CHAT_URL, {
          method: "POST",
          headers: { "Content-Type":"application/json", "Authorization":`Bearer ${directToken}` },
          body: JSON.stringify({ model:OPENROUTER_MODEL, stream:false, temperature:0.2, max_tokens:900, messages:[{ role:"system", content:AI_SYSTEM_PROMPT }, { role:"user", content:`CONTEXT:\n${aiContext()}\n\nYÊU CẦU:\n${prompt}` }] }),
        });
        if (!response.ok) throw new Error("OpenRouter unavailable");
        const payload = await response.json(); answer = payload?.choices?.[0]?.message?.content || "";
      } else if (proxyUrl) {
        const response = await fetch(proxyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: AI_SYSTEM_PROMPT,
              },
              {
                role: "user",
                content: `Dữ liệu vận hành: ${aiContext()}\n\nYêu cầu: ${prompt}`,
              },
            ],
          }),
        });
        if (!response.ok) throw new Error("AI proxy unavailable");
        const payload = await response.json();
        answer =
          payload?.choices?.[0]?.message?.content ||
          payload?.message ||
          payload?.content ||
          "";
      }
      setMessages((items) => [
        ...items,
        { role: "assistant", content: answer || localInsight(prompt) },
      ]);
    } catch {
      setMessages((items) => [
        ...items,
        { role: "assistant", content: localInsight(prompt) },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={`ai-chat ${open ? "open" : ""}`}>
      {open && (
        <section className="ai-chat-window">
          <header>
            <div className="ai-avatar">
              <IconSparkles size={17} />
            </div>
            <div>
              <b>Trợ lý vận hành AI</b>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Đóng trợ lý AI">
              <IconX size={17} />
            </button>
          </header>
          <section className="ai-context-grid" aria-label="Tóm tắt dữ liệu AI đang phân tích"><div><span>Sản xuất</span><b>82%</b><small>2.684 / 3.274 tấn</small></div><div><span>Điểm cần xử lý</span><b>17</b><small>12 nhật ký · 2 QC · 3 phiếu</small></div><div><span>Ưu tiên kho</span><b>48h</b><small>SR-2408-16 · 1.250 kg</small></div></section>
          <div className="ai-capability-head"><b>Chọn tác vụ phân tích</b><span>11 năng lực AI</span></div>
          <div className="ai-suggestions">
            {aiCapabilities.map((item) => (
              <button key={item.label} onClick={() => ask(item.prompt)} title={item.prompt}>
                {item.label}
              </button>
            ))}
          </div>
          <div className="ai-messages" aria-live="polite">
            {messages.map((item, index) => (
              <article className={item.role} key={`${item.role}-${index}`}>
                <p>{item.content}</p>
              </article>
            ))}
            {loading && (
              <article className="assistant">
                <p>Đang tổng hợp dữ liệu vận hành…</p>
              </article>
            )}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              ask(input);
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Hỏi tình hình sản xuất…"
            />
            <button
              disabled={!input.trim() || loading}
              aria-label="Gửi câu hỏi"
            >
              <IconSend size={16} />
            </button>
          </form>
          <small>Không gửi mã định danh hoặc dữ liệu nhạy cảm vào AI.</small>
        </section>
      )}
      <button
        className="ai-chat-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Đóng chatbot AI" : "Mở chatbot AI"}
      >
        <IconMessageChatbot size={23} />
        <span>AI phân tích</span>
      </button>
    </div>
  );
}
function aiContext() {
  return `PHẠM VI: Demo HTX Nông nghiệp Tân Thuận, dữ liệu chốt 18/08/2026.
SẢN XUẤT: Vụ Thu Đông 2026 đạt 2.684/3.274 tấn (82%); 332 tấn chờ nghiệm thu. Sầu riêng 1.120/1.280 tấn; xoài 684/900 tấn; bưởi 428/620 tấn; chanh và khác 452/740 tấn.
NHẬT KÝ & VẬT TƯ: 184/196 nhật ký đúng hạn; 12 bản ghi chờ xác nhận. TD-042 có bón 320 kg phân hữu cơ vi sinh ngày 18/08. Không có dữ liệu bệnh hại, hoạt chất, liều lượng, ảnh hiện trường hoặc giá vật tư đủ để chẩn đoán/phát hiện định mức bất thường.
THU HOẠCH & QC: 03 phiếu thu hoạch chờ nghiệm thu. QC đạt 8/10 lô; QC-2408-144 chờ kết quả, QC-2408-147 thiếu ảnh hiện trường. Không có kết quả phòng thử nghiệm chi tiết.
KHO & GIAO NHẬN: SR-2408-16 còn 1.250 kg, ưu tiên xuất trong 48 giờ; 6/8 chuyến đã điều phối, 2 chuyến chờ xác nhận.
TIÊU THỤ & TÀI CHÍNH: 27 đơn đang xử lý; 14/16 hợp đồng đã đối soát; doanh thu lũy kế 18,42 tỷ; chờ thanh toán 1,06 tỷ; công nợ quá hạn 62,8 triệu. Không có chuỗi giá thị trường theo thời gian, giá bán bình quân, lịch sử năng suất theo hộ hoặc dự báo thời tiết.`;
}
function localInsight(question) {
  const text = question.toLowerCase();
  if (/sâu bệnh|dịch hại/.test(text)) return "Kết luận: Chưa đủ dữ liệu để cảnh báo sâu bệnh theo thửa.\n\nBằng chứng: Demo hiện có nhật ký TD-042 về bón phân và 12 nhật ký chờ xác nhận, nhưng không có triệu chứng, ảnh hiện trường, kết quả khảo sát hay dữ liệu bẫy.\n\nRủi ro/mức độ tin cậy: Không thể kết luận có dịch hại; cần kiểm tra thực địa.\n\nViệc cần làm: Thu thập ảnh có tọa độ, triệu chứng, mức độ gây hại, ngày phát hiện và người kiểm tra cho từng thửa.";
  if (/phun thuốc|thuốc bảo vệ|cách ly/.test(text)) return "Kết luận: Chưa thể tổng hợp lịch sử phun thuốc hoặc xác nhận thời gian cách ly.\n\nBằng chứng: Context chỉ ghi nhận 32 lần sử dụng vật tư và không có hoạt chất, liều lượng, thời điểm phun hay nhãn thuốc.\n\nRủi ro/mức độ tin cậy: Không dùng dữ liệu hiện tại để cho phép thu hoạch.\n\nViệc cần làm: Bổ sung tên thương mại/hoạt chất, liều lượng, thời điểm, thửa đất, người thực hiện và thời gian cách ly theo nhãn sản phẩm; cán bộ kỹ thuật xác nhận.";
  if (/bất thường|phân bón|vật tư/.test(text)) return "Kết luận: Có 12 nhật ký chờ xác nhận nhưng chưa đủ chuẩn so sánh để kết luận dùng vật tư bất thường.\n\nBằng chứng: TD-042 ghi nhận 320 kg phân hữu cơ vi sinh; chưa có định mức theo cây, diện tích và giai đoạn.\n\nRủi ro/mức độ tin cậy: Chỉ là tín hiệu cần rà soát, không phải kết luận vi phạm.\n\nViệc cần làm: Thiết lập định mức vật tư/ha theo mùa vụ, liên kết hóa đơn đầu vào và so sánh lượng dùng thực tế với định mức.";
  if (/dự báo sản lượng|sản lượng(?!.*bất thường)/.test(text)) return "Kết luận: Tiến độ hiện đạt 82% (2.684/3.274 tấn); 332 tấn đang chờ nghiệm thu.\n\nBằng chứng: Sầu riêng đạt 1.120/1.280 tấn, xoài 684/900 tấn, bưởi 428/620 tấn.\n\nRủi ro/mức độ tin cậy: Chưa đủ dữ liệu thời tiết, tỷ lệ hao hụt và lịch sử năng suất để tạo dự báo định lượng đáng tin cậy.\n\nViệc cần làm: Chốt phiếu cân 3 đợt thu hoạch, cập nhật dự báo từng thửa và bổ sung dữ liệu thời tiết/hao hụt.";
  if (/doanh thu|nhu cầu|tiêu thụ|đơn hàng/.test(text)) return "Kết luận: Doanh thu lũy kế 18,42 tỷ; 27 đơn đang xử lý và 1,06 tỷ chờ thanh toán.\n\nBằng chứng: SR-2408-16 có 1.250 kg cần ưu tiên xuất trong 48 giờ; 14/16 hợp đồng đã đối soát.\n\nRủi ro/mức độ tin cậy: Không có lịch sử đơn hàng, giá bán bình quân và xác suất chốt đơn nên chưa thể dự báo doanh thu/nhu cầu chính xác.\n\nViệc cần làm: Ưu tiên phân bổ SR-2408-16, xác nhận 2 chuyến giao nhận và cập nhật forecast theo khách hàng–sản phẩm–tuần.";
  if (/giá nông sản|giá bán|thị trường/.test(text)) return "Kết luận: Chưa đủ dữ liệu để phân tích giá nông sản.\n\nBằng chứng: Context không có chuỗi giá thị trường, giá hợp đồng theo ngày, khu vực, phẩm cấp hoặc chi phí logistics.\n\nRủi ro/mức độ tin cậy: Không suy đoán giá thị trường từ doanh thu tổng.\n\nViệc cần làm: Nạp bảng giá theo sản phẩm/phẩm cấp/khu vực/ngày và giá bán thực tế từ hợp đồng, sau đó mới phân tích xu hướng.";
  if (/hộ|thửa.*bất thường|bất thường.*sản lượng/.test(text)) return "Kết luận: Chưa thể xác định hộ có sản lượng bất thường.\n\nBằng chứng: Context có tổng sản lượng theo cây nhưng không có lịch sử năng suất chuẩn hoá theo hộ/thửa/ha.\n\nRủi ro/mức độ tin cậy: Không gắn cờ hộ dân khi thiếu đường cơ sở so sánh.\n\nViệc cần làm: Lưu sản lượng thực tế theo thửa, diện tích, mùa vụ và 3 kỳ gần nhất; chỉ gắn cờ khi lệch ngưỡng đã phê duyệt.";
  if (/báo cáo|tháng|quý|năm/.test(text)) return "BÁO CÁO VẬN HÀNH DEMO – 18/08/2026\n\n1) Sản xuất: 2.684/3.274 tấn, đạt 82%; 12 nhật ký chờ xác nhận.\n2) Chất lượng: 8/10 lô QC đạt; 2 lô cần hoàn tất kết quả/hồ sơ.\n3) Tiêu thụ: 27 đơn đang xử lý; 6/8 chuyến giao nhận đã điều phối.\n4) Tài chính: doanh thu 18,42 tỷ; công nợ quá hạn 62,8 triệu.\n\nViệc cần làm: nghiệm thu phiếu thu hoạch, chốt QC cho lô xuất kho, ưu tiên SR-2408-16 và đối soát 2 hợp đồng còn lại.";
  return "Kết luận: Có 3 ưu tiên vận hành trong ngày.\n\nBằng chứng: 12 nhật ký chờ xác nhận; QC đạt 8/10 lô; SR-2408-16 còn 1.250 kg cần xuất trong 48 giờ; công nợ quá hạn 62,8 triệu.\n\nRủi ro/mức độ tin cậy: Đây là phân tích từ dữ liệu demo chốt 18/08/2026.\n\nViệc cần làm: xác nhận nhật ký/phiếu cân, hoàn tất QC–giao nhận và lập kế hoạch thu công nợ.";
}

function emptyDashboardSource(cooperativeCode = "HTX-001") { return { overview:{ cooperativeCode, kpis:{ members:0, areaHa:0, plannedKg:0, actualKg:0, productionProgress:0, pendingLogs:0, pendingQuality:0, activeOrders:0, overdueDebt:0 }, priorityLots:[], seasons:[] }, orders:[], lots:[], quality:[], finance:[], audit:[] }; }
function kgText(value) { return value >= 1000 ? `${(value / 1000).toLocaleString("vi-VN", { maximumFractionDigits:1 })} tấn` : `${value.toLocaleString("vi-VN")} kg`; }
function moneyText(value) { return `${(value / 1000000000).toLocaleString("vi-VN", { maximumFractionDigits:2 })} tỷ`; }
function buildDashboardView(source) {
  const data = source || emptyDashboardSource(); const k = data.overview.kpis; const revenue = data.finance.filter((item) => item.kind === "receipt").reduce((sum,item) => sum + Math.max(item.amount || 0, 0), 0);
  const kpis = [
    { icon:"users", label:"Thành viên hoạt động", value:String(k.members), change:"Theo MongoDB", tone:"green", module:"Hộ dân & thành viên", detail:{ title:"Thành viên hoạt động", summary:`${k.members} thành viên đang hoạt động trong HTX được chọn.`, facts:[["Nguồn","members"],["Phạm vi",data.overview.cooperativeCode]], timeline:[] } },
    { icon:"map", label:"Diện tích sản xuất", value:`${Number(k.areaHa || 0).toLocaleString("vi-VN")} ha`, change:"Theo GIS", tone:"blue", module:"Đất đai & GIS", detail:{ title:"Diện tích sản xuất", summary:"Tổng diện tích thửa đất đang hoạt động được tổng hợp từ MongoDB.", facts:[["Diện tích",`${k.areaHa || 0} ha`]], timeline:[] } },
    { icon:"tractor", label:"Sản lượng mùa vụ", value:kgText(k.actualKg || 0), change:`${k.productionProgress || 0}% kế hoạch`, tone:"amber", module:"Sản xuất", detail:{ title:"Sản lượng mùa vụ", summary:"Tổng hợp từ các mùa vụ đang có dữ liệu.", facts:[["Kế hoạch",kgText(k.plannedKg || 0)],["Thực tế",kgText(k.actualKg || 0)]], timeline:[] } },
    { icon:"money", label:"Doanh thu đã thu", value:moneyText(revenue), change:`${data.orders.length} đơn`, tone:"purple", module:"Tài chính", detail:{ title:"Doanh thu đã thu", summary:"Tổng phiếu thu đã ghi nhận trong collection financialEntries.", facts:[["Phiếu thu",String(data.finance.filter((item) => item.kind === "receipt").length)],["Công nợ quá hạn",`${Number(k.overdueDebt || 0).toLocaleString("vi-VN")} đ`]], timeline:[] } },
  ];
  const palette = ["#2d7a4f", "#d99c2b", "#4b82c3", "#9187d9"]; const crops = data.overview.seasons.map((season,index) => ({ name:season.crop, amount:kgText(season.actualKg || 0), pct:season.planKg ? Math.round((season.actualKg || 0) / season.planKg * 100) : 0, color:palette[index % palette.length], area:"Theo thửa liên kết", plan:kgText(season.planKg || 0), harvest:season.status, module:"Sản xuất" }));
  const orders = data.orders.map((order) => ({ code:order.code, customer:order.customer, product:order.product, quantity:kgText(order.quantityKg || 0), delivery:new Date(order.deliveryAt).toLocaleDateString("vi-VN"), status:order.status, value:"Chưa đối soát" }));
  const controls = [
    { label:"Nhật ký chờ xác nhận", value:String(k.pendingLogs || 0), note:"fieldLogs · trạng thái pending", tone:"green", module:"Vật tư & nhật ký" },
    { label:"QC chờ kết quả", value:String(k.pendingQuality || 0), note:"qualityInspections · trạng thái pending", tone:"blue", module:"Chất lượng & kiểm nghiệm" },
    { label:"Lô ưu tiên xuất", value:String(data.overview.priorityLots.length), note:"inventoryLots · priority-dispatch", tone:"amber", module:"Kho & tiêu thụ" },
    { label:"Đơn đang xử lý", value:String(k.activeOrders || 0), note:"salesOrders chưa hoàn tất", tone:"purple", module:"Hợp đồng & đối soát" },
  ];
  const activities = data.audit.map((event) => ({ icon:IconClipboardCheck, title:event.action, sub:`${event.entity} · ${event.actorCode || "Hệ thống"}`, time:new Date(event.createdAt).toLocaleString("vi-VN"), tone:"green", module:"Hồ sơ & tài liệu", detail:{ title:event.action, description:"Dấu vết vận hành lấy từ MongoDB auditEvents.", facts:[["Mã sự kiện",event.eventId],["Đối tượng",event.entity]], timeline:[] } }));
  const alerts = data.overview.priorityLots.map((lot) => ({ title:`Lô ${lot.code} cần ưu tiên xuất`, detail:`${kgText(lot.availableKg || 0)} · hạn ${new Date(lot.expiryAt).toLocaleDateString("vi-VN")}`, module:"Kho & tiêu thụ", detailData:{ title:`Lô ${lot.code}`, description:"Lô hàng được MongoDB đánh dấu priority-dispatch.", facts:[["Sản phẩm",lot.product],["Khối lượng",kgText(lot.availableKg || 0)],["Kho",lot.warehouseCode]], timeline:[] } }));
  return { kpis, crops, orders, controls, activities, alerts };
}

const metricIcons = {
  users: IconUsers,
  map: IconMap2,
  tractor: IconTractor,
  money: IconReportMoney,
};
function Metric({ icon, label, value, change, tone, onClick }) {
  const Icon = metricIcons[icon];
  return (
    <button className="metric" onClick={onClick}>
      <div className={`metric-icon ${tone}`}>
        <Icon size={20} />
      </div>
      <p>{label}</p>
      <div>
        <strong>{value}</strong>
        <span className={tone}>
          <IconArrowUpRight size={14} />
          {change}
        </span>
      </div>
    </button>
  );
}
function Crop({ name, amount, pct, color, onClick }) {
  return (
    <button className="crop" onClick={onClick}>
      <div>
        <span style={{ background: color }} />
        {name}
        <b>{amount}</b>
      </div>
      <div className="track">
        <i style={{ width: `${pct}%`, background: color }} />
      </div>
    </button>
  );
}
function Alert({ title, detail, onClick }) {
  return (
    <button className="alert" onClick={onClick}>
      <div>
        <IconAlertTriangle size={18} />
      </div>
      <p>
        <b>{title}</b>
        <span>{detail}</span>
      </p>
      <IconArrowUpRight size={17} />
    </button>
  );
}
function SupplyChainBoard({ onOpen, onGo }) {
  const steps = [
    ["Thửa đất", "Đất đai & GIS"],
    ["Hộ dân", "Hộ dân & thành viên"],
    ["Mùa vụ", "Sản xuất"],
    ["Nhật ký", "Vật tư & nhật ký"],
    ["Thu hoạch", "Thu hoạch"],
    ["Đóng gói", "Đóng gói"],
    ["Kho", "Kho & tiêu thụ"],
    ["Giao nhận", "Vận chuyển & giao nhận"],
    ["Tiêu thụ", "Hợp đồng & đối soát"],
  ];
  return (
    <section className="panel supply-chain-panel">
      <div className="panel-head">
        <div>
          <h2>Điều phối chuỗi nông sản</h2>
          <p>Theo dõi lô đang di chuyển từ vùng trồng đến đơn tiêu thụ</p>
        </div>
        <button
          className="text-btn"
          onClick={() => onGo("Truy xuất nguồn gốc")}
        >
          Mở truy xuất <IconArrowUpRight size={16} />
        </button>
      </div>
      <div className="chain-steps">
        {steps.map(([step, module], index) => (
          <button
            type="button"
            className={index < 6 ? "done" : index === 6 ? "current" : ""}
            key={step}
            onClick={() => onGo(module)}
            aria-label={`Mở ${module}`}
          >
            <i>{index + 1}</i>
            {step}
          </button>
        ))}
      </div>
      <div className="chain-list">
        {supplyChain.map((item) => (
          <button
            key={item.code}
            className="chain-row"
            onClick={() => onOpen(item)}
          >
            <div>
              <b>{item.code}</b>
              <span>
                {item.product} · {item.quantity}
              </span>
            </div>
            <div className="chain-stage">
              <span>{item.stage}</span>
              <i>
                <em style={{ width: `${item.progress}%` }} />
              </i>
            </div>
            <StatusBadge value={item.status} />
            <IconArrowUpRight size={17} />
          </button>
        ))}
      </div>
    </section>
  );
}
function StatusBadge({ value }) {
  return (
    <span
      className={`chain-status ${/Chờ|Sắp/.test(value) ? "amber" : "green"}`}
    >
      {value}
    </span>
  );
}
function ChainDetailDrawer({ item, onClose, onGo }) {
  const nodes = buildChainNodes(item);
  const currentIndex = nodes.findIndex((node) => node.current);
  return (
    <SideSheet title={`${item.code} · Chuỗi điều phối`} onClose={onClose}>
      <div className="chain-detail">
        <div className="chain-detail-head">
          <span>TRUY XUẤT LÔ ĐANG VẬN HÀNH</span>
          <h3>{item.product}</h3>
          <p>{item.note}</p>
          <div>
            <b>{item.quantity}</b>
            <StatusBadge value={item.status} />
          </div>
        </div>
        <div className="chain-kpis">
          <div>
            <span>Hoàn thành chuỗi</span>
            <b>{item.progress}%</b>
          </div>
          <div>
            <span>Công đoạn hiện tại</span>
            <b>{item.stage}</b>
          </div>
          <div>
            <span>Hồ sơ hợp lệ</span>
            <b>
              {nodes.filter((node) => node.status === "Hoàn tất").length}/
              {nodes.length}
            </b>
          </div>
        </div>
        <div className="chain-detail-list">
          {nodes.map((node, index) => (
            <article
              className={`${node.current ? "current" : ""} ${node.status === "Hoàn tất" ? "done" : ""}`}
              key={node.name}
            >
              <div className="chain-node">
                <i>{node.status === "Hoàn tất" ? "✓" : index + 1}</i>
                <span />
              </div>
              <div className="chain-node-body">
                <header>
                  <div>
                    <b>{node.name}</b>
                    <small>{node.code}</small>
                  </div>
                  <StatusBadge value={node.status} />
                </header>
                <p>{node.description}</p>
                <dl>
                  <div>
                    <dt>Số liệu</dt>
                    <dd>{node.metric}</dd>
                  </div>
                  <div>
                    <dt>Phụ trách</dt>
                    <dd>{node.owner}</dd>
                  </div>
                  <div>
                    <dt>Thời điểm</dt>
                    <dd>{node.time}</dd>
                  </div>
                </dl>
                {node.current && (
                  <button
                    className="outline-btn"
                    onClick={() => onGo(node.module)}
                  >
                    Mở công đoạn này <IconArrowUpRight size={15} />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
        {currentIndex >= 0 && (
          <button
            className="primary-btn full"
            onClick={() => onGo(nodes[currentIndex].module)}
          >
            Tiếp tục xử lý: {nodes[currentIndex].name}
            <IconArrowUpRight size={16} />
          </button>
        )}
      </div>
    </SideSheet>
  );
}
function buildChainNodes(item) {
  const order = [
    "Thửa đất",
    "Hộ dân",
    "Mùa vụ",
    "Nhật ký canh tác",
    "Thu hoạch",
    "Đóng gói",
    "Kho",
    "Vận chuyển",
    "Tiêu thụ",
  ];
  const normalizedStage =
    item.stage === "Giao nhận"
      ? "Vận chuyển"
      : item.stage === "Kho lạnh"
        ? "Kho"
        : item.stage;
  const stageIndex = Math.max(0, order.indexOf(normalizedStage));
  const source =
    item.code === "DG-2408-09"
      ? {
          parcel: "TD-112",
          member: "TV-143 · Lê Hoàng Phúc",
          season: "MV-TD26-03",
          logs: "09/10 bản ghi đã xác nhận",
          harvest: "TH-2408-19 · 2.100 kg",
          packing: "DG-2408-09 · 1.340/2.100 kg",
          warehouse: "Chờ nhập kho",
          transport: "Chưa tạo lệnh",
          sale: "DH-0826-39 · GreenMart",
        }
      : item.code === "SR-2408-16"
        ? {
            parcel: "TD-042, TD-057",
            member: "TV-102 · Nguyễn Văn Thành",
            season: "MV-TD26-01",
            logs: "12/12 bản ghi đã xác nhận",
            harvest: "TH-2408-16, TH-2408-17 · 2.230 kg",
            packing: "DG-2408-10, DG-2408-12 · 2.230 kg",
            warehouse: "SR-2408-16 · 1.250 kg",
            transport: "LXK-0826-18 · chờ xe",
            sale: "DH-0826-41 · đã phân bổ",
          }
        : item.code === "DH-0826-41"
          ? {
              parcel: "TD-042, TD-057",
              member: "02 hộ cung ứng",
              season: "MV-TD26-01",
              logs: "24/24 bản ghi đã xác nhận",
              harvest: "03 phiếu · 8.500 kg",
              packing: "08 lệnh · 8.500 kg",
              warehouse: "03 lô đã giữ chỗ",
              transport: "LXK-0826-21 · chờ xác nhận",
              sale: "DH-0826-41 · 8.500 kg",
            }
          : {
              parcel: "TD-042",
              member: "TV-102 · Nguyễn Văn Thành",
              season: "MV-TD26-01",
              logs: "12/12 bản ghi đã xác nhận",
              harvest: "TH-2408-16 · 1.250 kg",
              packing: "Chờ tạo lệnh",
              warehouse: "Chờ nhập kho",
              transport: "Chưa tạo lệnh",
              sale: "Chưa tạo đơn",
            };
  const values = [
    [
      "Thửa đất",
      source.parcel,
      "Diện tích, vùng trồng và tiêu chuẩn đã số hóa",
      "GIS",
    ],
    [
      "Hộ dân",
      source.member,
      "Chủ thể cung ứng đã xác thực thuộc HTX",
      "Hộ dân & thành viên",
    ],
    ["Mùa vụ", source.season, "Kế hoạch sản xuất đã phê duyệt", "Sản xuất"],
    [
      "Nhật ký canh tác",
      source.logs,
      "Vật tư, cách ly và nhật ký được đối chiếu",
      "Vật tư & nhật ký",
    ],
    [
      "Thu hoạch",
      source.harvest,
      "Phiếu cân hiện trường và nghiệm thu khối lượng",
      "Thu hoạch",
    ],
    [
      "Đóng gói",
      source.packing,
      "Phân loại, quy cách, tem QR và kiểm tra chất lượng",
      "Đóng gói",
    ],
    [
      "Kho",
      source.warehouse,
      "Phiếu nhập kho, điều kiện bảo quản và hạn xử lý",
      "Kho & tiêu thụ",
    ],
    [
      "Vận chuyển",
      source.transport,
      "Lệnh xuất kho, xe và biên bản giao nhận",
      "Kho & tiêu thụ",
    ],
    [
      "Tiêu thụ",
      source.sale,
      "Đơn hàng, hợp đồng, đối soát và thanh toán",
      "Kho & tiêu thụ",
    ],
  ];
  return values.map(([name, metric, description, module], index) => ({
    name,
    code: `${String(index + 1).padStart(2, "0")} · ${index < 4 ? "Nguồn gốc" : index < 6 ? "Sơ chế" : "Thương mại"}`,
    metric,
    description,
    module,
    owner:
      index < 2
        ? "Tổ vùng trồng"
        : index < 4
          ? "Điều phối sản xuất"
          : index < 6
            ? "Tổ sơ chế & QC"
            : "Kho & tiêu thụ",
    time:
      index < stageIndex
        ? "Đã xác nhận"
        : index === stageIndex
          ? "Đang cập nhật"
          : "Chưa phát sinh",
    status:
      index < stageIndex
        ? "Hoàn tất"
        : index === stageIndex
          ? item.status
          : "Chờ xử lý",
    current: index === stageIndex,
  }));
}
function NotificationPopover({ items, onClose, onNotice, onOpen, onAll }) {
  return (
    <div className="notification-popover">
      <header>
        <div>
          <b>Thông báo</b>
          <span>04 cần xử lý</span>
        </div>
        <button
          onClick={() => {
            onClose();
            onNotice();
          }}
        >
          Đánh dấu đã đọc
        </button>
      </header>
      <div className="notification-list">
        {items.map((item) => (
            <article key={item.code}>
              <div className="notification-icon green">
                <IconBell size={18} />
              </div>
              <div>
                <b>{item.title}</b>
                <p>{item.message}</p>
                <span>{new Intl.DateTimeFormat("vi-VN", { dateStyle:"short", timeStyle:"short" }).format(new Date(item.sentAt))}</span>
              </div>
              <button onClick={() => onOpen(item.module || "Tổng quan")}>Mở</button>
            </article>
        ))}
      </div>
      <footer>
        <button onClick={onAll}>Xem tất cả thông báo</button>
      </footer>
    </div>
  );
}
function QuickSearch({ onClose, onGo }) {
  const [query, setQuery] = useState("");
  const options = nav.filter(({ label }) =>
    label.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <SideSheet title="Tìm kiếm nhanh" onClose={onClose}>
      <div className="quick-search">
        <label>
          <IconSearch size={18} />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm phân hệ hoặc dữ liệu demo"
          />
        </label>
        {options.map(({ label, icon: Icon }) => (
          <button key={label} onClick={() => onGo(label)}>
            <Icon size={18} />
            {label}
            <IconArrowUpRight size={16} />
          </button>
        ))}
      </div>
    </SideSheet>
  );
}
function ActivitySheet({ items, onClose, onSelect }) {
  return (
    <SideSheet title="Tất cả hoạt động" onClose={onClose}>
      <div className="all-activities">
        {items.map((item) => (
          <button
            className="activity"
            key={item.title}
            onClick={() =>
              onSelect({
                type: "activity",
                ...item.detail,
                module: item.module,
              })
            }
          >
            <div className={`activity-icon ${item.tone}`}>
              <item.icon size={18} />
            </div>
            <div>
              <b>{item.title}</b>
              <p>{item.sub}</p>
            </div>
            <time>{item.time}</time>
          </button>
        ))}
      </div>
    </SideSheet>
  );
}
function DashboardDetail({ detail, notifications: detailNotifications = [], onClose, onGo }) {
  if (detail.type === "notifications")
    return (
      <SideSheet title={detail.title} onClose={onClose}>
        <div className="all-activities">
          {detailNotifications.map((item) => (
            <article className="notification-detail" key={item.title}>
              <b>{item.title}</b>
              <p>{item.message}</p>
              <span>{new Intl.DateTimeFormat("vi-VN", { dateStyle:"short", timeStyle:"short" }).format(new Date(item.sentAt))}</span>
            </article>
          ))}
        </div>
      </SideSheet>
    );
  return (
    <SideSheet title={detail.title} onClose={onClose}>
      <div className="dashboard-detail">
        {detail.period && (
          <span className="detail-period">{detail.period}</span>
        )}
        <p>{detail.summary || detail.description}</p>
        {detail.facts && (
          <dl className="detail-facts">
            {detail.facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}
        {detail.timeline && (
          <div className="detail-timeline">
            <b>Dấu vết xử lý</b>
            {detail.timeline.map(([time, event]) => (
              <div key={`${time}-${event}`}>
                <time>{time}</time>
                <span>{event}</span>
              </div>
            ))}
          </div>
        )}
        <button
          className="primary-btn full"
          onClick={() => onGo(detail.module || "Sản xuất")}
        >
          Mở phân hệ liên quan <IconArrowUpRight size={17} />
        </button>
      </div>
    </SideSheet>
  );
}
