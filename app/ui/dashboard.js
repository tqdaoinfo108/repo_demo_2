"use client";

import { useCallback, useMemo, useState } from "react";
import {
  IconBell, IconBuildingCommunity, IconCalendarEvent, IconChevronDown,
  IconClipboardData, IconFileCertificate, IconHome, IconLeaf, IconMap2,
  IconPackage, IconPlant2, IconReportMoney, IconSearch, IconSettings,
  IconShoppingBag, IconTractor, IconUsers, IconWallet, IconArrowUpRight,
  IconCircleCheck, IconAlertTriangle, IconX, IconMenu2, IconQrcode,
  IconClipboardCheck, IconFileAlert, IconShieldCheck, IconCreditCard,
} from "@tabler/icons-react";
import MapWidget from "./map-widget";
import ModuleView from "./module-view";
import SystemSettings from "./system-settings";
import ProfileSheet from "./profile-sheet";
import { ActionModal, SideSheet } from "./shared-ui";
import { activities, alerts, controlChecks, cropProgress, dashboardKpis, orderSnapshot } from "./dashboard-data";

const nav = [
  { label: "Tổng quan", icon: IconHome },
  { label: "Hợp tác xã", icon: IconBuildingCommunity },
  { label: "Hộ dân & thành viên", icon: IconUsers },
  { label: "Đất đai & GIS", icon: IconMap2 },
  { label: "Tài sản HTX", icon: IconTractor },
  { label: "Sản xuất", icon: IconPlant2 },
  { label: "Vật tư & nhật ký", icon: IconClipboardData },
  { label: "Truy xuất nguồn gốc", icon: IconQrcode },
  { label: "Kho & tiêu thụ", icon: IconPackage },
  { label: "Tài chính", icon: IconWallet },
  { label: "Vốn góp & cổ tức", icon: IconReportMoney },
  { label: "Truyền thông nội bộ", icon: IconBell },
  { label: "Hồ sơ & tài liệu", icon: IconFileCertificate },
];

const initialParcel = { id: "TD-042", name: "Ông Nguyễn Văn Thành", crop: "Sầu riêng Ri6", area: "2,4 ha", color: "#2d7a4f" };

const notifications = [
  { icon: IconClipboardCheck, tone: "amber", title: "Đơn DH-0826-41 chờ xác nhận", detail: "Công ty An Phú đặt 8.500 kg sầu riêng Ri6.", time: "42 phút trước", action: "Mở đơn hàng", module: "Kho & tiêu thụ" },
  { icon: IconShieldCheck, tone: "green", title: "Cập nhật nhật ký TD-042", detail: "Bón phân hữu cơ đã được ghi nhận, chờ tổ trưởng xác nhận.", time: "18 phút trước", action: "Xem nhật ký", module: "Sản xuất" },
  { icon: IconFileAlert, tone: "blue", title: "03 thửa sắp đến hạn kiểm tra", detail: "Chứng nhận VietGAP cần được rà soát trong 7 ngày tới.", time: "3 giờ trước", action: "Xem hồ sơ", module: "Hồ sơ & tài liệu" },
  { icon: IconCreditCard, tone: "red", title: "Công nợ GreenMart quá hạn", detail: "Cần đối soát khoản phải thu 62.800.000 đ.", time: "Hôm qua", action: "Đối soát", module: "Tài chính" },
];

export default function Dashboard() {
  const [active, setActive] = useState("Tổng quan");
  const [parcel, setParcel] = useState(initialParcel);
  const [notice, setNotice] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [utility, setUtility] = useState(null);
  const selectParcel = useCallback((value) => setParcel(value), []);
  const viewingSettings = utility === "Cấu hình hệ thống";
  const pageTitle = viewingSettings ? "Cấu hình hệ thống" : active === "Tổng quan" ? "Trung tâm điều hành" : active;
  const today = useMemo(() => new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(2026, 7, 18)), []);

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
        <div className="brand"><div className="brand-mark"><IconLeaf size={22} /></div><div><strong>HTX Số</strong><span>Đồng Tháp</span></div></div>
        <button className="org-switch" onClick={() => setUtility("Chuyển đơn vị làm việc")}><div className="org-icon">HT</div><div><b>HTX Nông nghiệp Tân Thuận</b><span>Huyện Châu Thành</span></div><IconChevronDown size={18} /></button>
        <nav>{nav.map(({ label, icon: Icon }) => <button key={label} onClick={() => { setActive(label); setUtility(null); setMobileNav(false); }} className={active === label && !viewingSettings ? "nav-item active" : "nav-item"}><Icon size={19} stroke={1.8} />{label}</button>)}</nav>
        <div className="sidebar-footer"><button className="nav-item" onClick={() => setUtility("Cấu hình hệ thống")}><IconSettings size={19} />Cấu hình hệ thống</button><button className="profile" onClick={() => setUtility("Tài khoản quản trị")}><div className="avatar">NT</div><div><b>Nguyễn Minh Tâm</b><span>Quản trị HTX</span></div><IconChevronDown size={17} /></button></div>
      </aside>
      {mobileNav && <button className="scrim" aria-label="Đóng menu" onClick={() => setMobileNav(false)} />}

      <section className="workspace">
        <header className="topbar"><button className="menu-btn" onClick={() => setMobileNav(true)} aria-label="Mở menu"><IconMenu2 /></button><div className="crumb"><span>Vận hành HTX</span><b>/</b><strong>{pageTitle}</strong></div><div className="top-actions"><button className="icon-btn search" onClick={() => setQuickSearchOpen(true)}><IconSearch size={19} /><span>Tìm kiếm nhanh</span><kbd>⌘ K</kbd></button><div className="notification-wrap"><button className="icon-btn bell" onClick={() => setNotificationOpen(!notificationOpen)} aria-label="Thông báo"><IconBell size={20} />{!notificationOpen && <i />}</button>{notificationOpen && <NotificationPopover onClose={() => setNotificationOpen(false)} onNotice={() => setNotice(true)} onOpen={(module) => { setNotificationOpen(false); setActive(module); }} onAll={() => { setNotificationOpen(false); setDetail({ type:"notifications", title:"Tất cả thông báo" }); }} />}</div></div></header>

        <div className="content">
          <div className="page-heading"><div><p>{today}</p><h1>{pageTitle}</h1></div><div className="heading-actions"><button className="outline-btn" onClick={() => setUtility("Xuất báo cáo vận hành")}><IconFileCertificate size={18} />Xuất báo cáo</button><button className="primary-btn" onClick={() => setUtility("Cập nhật dữ liệu")}><IconClipboardData size={18} />Cập nhật dữ liệu</button></div></div>

          {notice && <div className="notice"><IconCircleCheck size={19} /><span>Thông báo mẫu: Có 3 hồ sơ mùa vụ và 2 đơn hàng đang chờ xử lý.</span><button onClick={() => setNotice(false)}><IconX size={17} /></button></div>}

          {viewingSettings ? <SystemSettings onClose={() => setUtility(null)} onNotice={() => setNotice(true)} /> : active === "Tổng quan" ? <>
          <section className="kpi-grid">
            {dashboardKpis.map((metric) => <Metric key={metric.label} {...metric} onClick={() => setDetail({ type:"metric", ...metric.detail, module:metric.module })} />)}
          </section>

          <section className="overview-grid">
            <div className="panel production-panel"><div className="panel-head"><div><h2>Sản xuất theo mùa vụ</h2><p>Tiến độ Thu Đông 2026 · cập nhật 11:30</p></div><button className="text-btn" onClick={() => setActive("Sản xuất")}>Xem chi tiết <IconArrowUpRight size={16} /></button></div><div className="production-body"><button className="donut" onClick={() => setDetail({ type:"metric", title:"Tiến độ vụ Thu Đông 2026", period:"Cập nhật từ 07 mùa vụ đang theo dõi", summary:"Mức hoàn thành được tính theo khối lượng đã nghiệm thu so với kế hoạch vụ đã được phê duyệt.", module:"Sản xuất", facts:[["Kế hoạch đã duyệt","3.274 tấn"],["Đã nghiệm thu","2.684 tấn"],["Chờ nghiệm thu","332 tấn"],["Dự báo còn lại","258 tấn"]], timeline:[["Hôm nay","Cập nhật 04 nhật ký thu hoạch"],["Tuần này","08 tổ sản xuất hoàn tất đối chiếu sản lượng"]] })}><div><strong>82%</strong><span>hoàn thành</span></div></button><div className="crop-list">{cropProgress.map((crop) => <Crop key={crop.name} {...crop} onClick={() => setDetail({ type:"crop", title:crop.name, period:"Vụ Thu Đông 2026", summary:`${crop.name} đang thực hiện ${crop.pct}% kế hoạch, theo lịch thu hoạch ${crop.harvest.toLowerCase()}.`, module:crop.module, facts:[["Diện tích theo dõi",crop.area],["Kế hoạch",crop.plan],["Đã thực hiện",crop.amount],["Lịch thu hoạch",crop.harvest]], timeline:[["Hôm nay","Tổ trưởng cập nhật tiến độ vườn"],["Tuần này","Đối chiếu sản lượng và chất lượng đầu ra"]] })} />)}</div></div></div>
            <div className="panel orders-panel"><div className="panel-head"><div><h2>Đơn tiêu thụ</h2><p>Tháng 08/2026 · 27 đơn đang xử lý</p></div><button className="more" aria-label="Mở đơn tiêu thụ" onClick={() => setActive("Kho & tiêu thụ")}>•••</button></div><div className="order-stat"><strong>27</strong><span>đơn hàng đang xử lý</span><em>+5 đơn tuần này</em></div><div className="order-bars"><span style={{height:"68%"}} /><span style={{height:"47%"}} /><span style={{height:"82%"}} /><span style={{height:"61%"}} /><span className="current" style={{height:"94%"}} /><span style={{height:"56%"}} /><span style={{height:"73%"}} /></div><div className="week"><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>CN</span></div><div className="order-snapshot">{orderSnapshot.map((order) => <button key={order.code} onClick={() => setDetail({ type:"order", title:order.code, period:`Giao dự kiến ${order.delivery}`, summary:`${order.customer} đặt ${order.quantity} ${order.product}. Đơn đang ở trạng thái ${order.status.toLowerCase()}.`, module:"Kho & tiêu thụ", facts:[["Khách hàng",order.customer],["Sản phẩm",order.product],["Giá trị tạm tính",order.value],["Trạng thái",order.status]], timeline:[["Hôm nay","Đối chiếu tồn kho và điều kiện giao"],["Trước giờ giao","Xác nhận lệnh xuất kho và biên bản bàn giao"]] })}><b>{order.code}</b><span>{order.quantity} · {order.status}</span></button>)}</div></div>
          </section>

          <section className="panel gis-panel"><div className="panel-head"><div><h2>Bản đồ vùng sản xuất</h2><p>Tra cứu thửa đất, mùa vụ và trạng thái tiêu chuẩn</p></div><div className="map-legend"><span><i className="legend-green" />Đạt VietGAP</span><span><i className="legend-amber" />Đang chuyển đổi</span><span><i className="legend-blue" />Vùng liên kết</span></div></div><div className="map-layout"><div className="map-wrap"><MapWidget selectedParcel={parcel} onSelect={selectParcel} /><div className="map-filter"><IconSearch size={16} /><span>Tìm thửa đất, hộ dân...</span></div></div><aside className="parcel-card"><div className="parcel-label">THỬA ĐẤT ĐANG CHỌN</div><h3>{parcel.id}</h3><div className="parcel-status"><span style={{background:parcel.color}} />Đạt chuẩn VietGAP</div><dl><div><dt>Chủ sử dụng</dt><dd>{parcel.name}</dd></div><div><dt>Cây trồng</dt><dd>{parcel.crop}</dd></div><div><dt>Diện tích</dt><dd>{parcel.area}</dd></div><div><dt>Mùa vụ</dt><dd>Thu Đông 2026</dd></div></dl><button className="primary-btn full" onClick={() => setActive("Đất đai & GIS")}>Mở hồ sơ thửa đất <IconArrowUpRight size={17} /></button></aside></div></section>

          <section className="control-grid">{controlChecks.map((item) => <button className={`control-check ${item.tone}`} key={item.label} onClick={() => setActive(item.module)}><span>{item.label}</span><b>{item.value}</b><small>{item.note}</small><IconArrowUpRight size={16} /></button>)}</section>
          <section className="lower-grid"><div className="panel activity-panel"><div className="panel-head"><div><h2>Hoạt động mới nhất</h2><p>Cập nhật từ các phân hệ trong ngày</p></div><button className="text-btn" onClick={() => setActivityOpen(true)}>Tất cả <IconArrowUpRight size={16} /></button></div><div className="activity-list">{activities.map((item) => <button className="activity" key={item.title} onClick={() => setDetail({ type:"activity", ...item.detail, module:item.module })}><div className={`activity-icon ${item.tone}`}><item.icon size={18} /></div><div><b>{item.title}</b><p>{item.sub}</p></div><time>{item.time}</time></button>)}</div></div><div className="panel alerts-panel"><div className="panel-head"><div><h2>Cần lưu ý</h2><p>Cảnh báo vận hành cần xử lý</p></div><span className="count">03</span></div>{alerts.map((alert) => <Alert key={alert.title} title={alert.title} detail={alert.detail} onClick={() => setDetail({ type:"alert", ...alert.detailData, module:alert.module })} />)}</div></section>
          </> : <ModuleView active={active} onNotice={() => setNotice(true)} parcel={parcel} onSelectParcel={selectParcel} />}
        </div>
      </section>
      {quickSearchOpen && <QuickSearch onClose={() => setQuickSearchOpen(false)} onGo={(module) => { setActive(module); setQuickSearchOpen(false); }} />}
      {activityOpen && <ActivitySheet onClose={() => setActivityOpen(false)} onSelect={(item) => { setActivityOpen(false); setDetail({ type:"activity", ...item }); }} />}
      {detail && <DashboardDetail detail={detail} onClose={() => setDetail(null)} onGo={(module) => { setDetail(null); setActive(module); }} />}
      {utility === "Tài khoản quản trị" && <ProfileSheet onClose={() => setUtility(null)} onNotice={() => setNotice(true)} />}
      {utility && utility !== "Cấu hình hệ thống" && utility !== "Tài khoản quản trị" && <ActionModal title={utility} description={utility === "Cập nhật dữ liệu" ? "Dữ liệu mô phỏng đã sẵn sàng đồng bộ. Xác nhận để cập nhật thời điểm dữ liệu mới nhất." : "Đây là màn hình thao tác mẫu cho buổi demo. Xác nhận để lưu thay đổi ở trạng thái nháp."} onClose={() => setUtility(null)} onConfirm={() => { setUtility(null); setNotice(true); }} />}
    </main>
  );
}

const metricIcons = { users: IconUsers, map: IconMap2, tractor: IconTractor, money: IconReportMoney };
function Metric({ icon, label, value, change, tone, onClick }) { const Icon = metricIcons[icon]; return <button className="metric" onClick={onClick}><div className={`metric-icon ${tone}`}><Icon size={20} /></div><p>{label}</p><div><strong>{value}</strong><span className={tone}><IconArrowUpRight size={14} />{change}</span></div></button>; }
function Crop({ name, amount, pct, color, onClick }) { return <button className="crop" onClick={onClick}><div><span style={{background:color}} />{name}<b>{amount}</b></div><div className="track"><i style={{width:`${pct}%`, background:color}} /></div></button>; }
function Alert({ title, detail, onClick }) { return <button className="alert" onClick={onClick}><div><IconAlertTriangle size={18} /></div><p><b>{title}</b><span>{detail}</span></p><IconArrowUpRight size={17} /></button>; }
function NotificationPopover({ onClose, onNotice, onOpen, onAll }) { return <div className="notification-popover"><header><div><b>Thông báo</b><span>04 cần xử lý</span></div><button onClick={() => { onClose(); onNotice(); }}>Đánh dấu đã đọc</button></header><div className="notification-list">{notifications.map(({ icon: Icon, tone, title, detail, time, action, module }) => <article key={title}><div className={`notification-icon ${tone}`}><Icon size={18} /></div><div><b>{title}</b><p>{detail}</p><span>{time}</span></div><button onClick={() => onOpen(module)}>{action}</button></article>)}</div><footer><button onClick={onAll}>Xem tất cả thông báo</button></footer></div>; }
function QuickSearch({ onClose, onGo }) { const [query, setQuery] = useState(""); const options = nav.filter(({ label }) => label.toLowerCase().includes(query.toLowerCase())); return <SideSheet title="Tìm kiếm nhanh" onClose={onClose}><div className="quick-search"><label><IconSearch size={18} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm phân hệ hoặc dữ liệu demo" /></label>{options.map(({ label, icon: Icon }) => <button key={label} onClick={() => onGo(label)}><Icon size={18} />{label}<IconArrowUpRight size={16} /></button>)}</div></SideSheet>; }
function ActivitySheet({ onClose, onSelect }) { return <SideSheet title="Tất cả hoạt động" onClose={onClose}><div className="all-activities">{activities.map((item) => <button className="activity" key={item.title} onClick={() => onSelect({ type:"activity", ...item.detail, module:item.module })}><div className={`activity-icon ${item.tone}`}><item.icon size={18} /></div><div><b>{item.title}</b><p>{item.sub}</p></div><time>{item.time}</time></button>)}</div></SideSheet>; }
function DashboardDetail({ detail, onClose, onGo }) { if (detail.type === "notifications") return <SideSheet title={detail.title} onClose={onClose}><div className="all-activities">{notifications.map((item) => <article className="notification-detail" key={item.title}><b>{item.title}</b><p>{item.detail}</p><span>{item.time}</span></article>)}</div></SideSheet>; return <SideSheet title={detail.title} onClose={onClose}><div className="dashboard-detail">{detail.period && <span className="detail-period">{detail.period}</span>}<p>{detail.summary || detail.description}</p>{detail.facts && <dl className="detail-facts">{detail.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}{detail.timeline && <div className="detail-timeline"><b>Dấu vết xử lý</b>{detail.timeline.map(([time, event]) => <div key={`${time}-${event}`}><time>{time}</time><span>{event}</span></div>)}</div>}<button className="primary-btn full" onClick={() => onGo(detail.module || "Sản xuất")}>Mở phân hệ liên quan <IconArrowUpRight size={17} /></button></div></SideSheet>; }
