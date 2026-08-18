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

const nav = [
  { label: "Tổng quan", icon: IconHome },
  { label: "Hợp tác xã", icon: IconBuildingCommunity },
  { label: "Hộ dân & thành viên", icon: IconUsers },
  { label: "Đất đai & GIS", icon: IconMap2 },
  { label: "Sản xuất", icon: IconPlant2 },
  { label: "Kho & tiêu thụ", icon: IconPackage },
  { label: "Tài chính", icon: IconWallet },
  { label: "Hồ sơ & tài liệu", icon: IconFileCertificate },
];

const initialParcel = { id: "TD-042", name: "Ông Nguyễn Văn Thành", crop: "Sầu riêng Ri6", area: "2,4 ha", color: "#2d7a4f" };

const activities = [
  { icon: IconPlant2, title: "Nhật ký canh tác được cập nhật", sub: "Thửa TD-042 · Bón phân hữu cơ", time: "18 phút trước", tone: "green" },
  { icon: IconShoppingBag, title: "Đơn hàng mới cần xác nhận", sub: "Công ty An Phú · 8.500 kg sầu riêng", time: "42 phút trước", tone: "amber" },
  { icon: IconQrcode, title: "Hoàn tất đóng gói lô SR-2408-16", sub: "1.250 kg · Kho lạnh số 1", time: "2 giờ trước", tone: "blue" },
  { icon: IconReportMoney, title: "Đã đối soát thanh toán", sub: "Hợp đồng HĐ-2026-081 · 186.500.000 đ", time: "Hôm qua", tone: "purple" },
];

const notifications = [
  { icon: IconClipboardCheck, tone: "amber", title: "Đơn DH-0826-41 chờ xác nhận", detail: "Công ty An Phú đặt 8.500 kg sầu riêng Ri6.", time: "42 phút trước", action: "Mở đơn hàng" },
  { icon: IconShieldCheck, tone: "green", title: "Cập nhật nhật ký TD-042", detail: "Bón phân hữu cơ đã được ghi nhận, chờ tổ trưởng xác nhận.", time: "18 phút trước", action: "Xem nhật ký" },
  { icon: IconFileAlert, tone: "blue", title: "03 thửa sắp đến hạn kiểm tra", detail: "Chứng nhận VietGAP cần được rà soát trong 7 ngày tới.", time: "3 giờ trước", action: "Xem hồ sơ" },
  { icon: IconCreditCard, tone: "red", title: "Công nợ GreenMart quá hạn", detail: "Cần đối soát khoản phải thu 62.800.000 đ.", time: "Hôm qua", action: "Đối soát" },
];

export default function Dashboard() {
  const [active, setActive] = useState("Tổng quan");
  const [parcel, setParcel] = useState(initialParcel);
  const [notice, setNotice] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const selectParcel = useCallback((value) => setParcel(value), []);
  const pageTitle = active === "Tổng quan" ? "Trung tâm điều hành" : active;
  const today = useMemo(() => new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(2026, 7, 18)), []);

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
        <div className="brand"><div className="brand-mark"><IconLeaf size={22} /></div><div><strong>HTX Số</strong><span>Đồng Tháp</span></div></div>
        <div className="org-switch"><div className="org-icon">HT</div><div><b>HTX Nông nghiệp Tân Thuận</b><span>Huyện Châu Thành</span></div><IconChevronDown size={18} /></div>
        <nav>{nav.map(({ label, icon: Icon }) => <button key={label} onClick={() => { setActive(label); setMobileNav(false); }} className={active === label ? "nav-item active" : "nav-item"}><Icon size={19} stroke={1.8} />{label}</button>)}</nav>
        <div className="sidebar-footer"><button className="nav-item"><IconSettings size={19} />Cấu hình hệ thống</button><div className="profile"><div className="avatar">NT</div><div><b>Nguyễn Minh Tâm</b><span>Quản trị HTX</span></div><IconChevronDown size={17} /></div></div>
      </aside>
      {mobileNav && <button className="scrim" aria-label="Đóng menu" onClick={() => setMobileNav(false)} />}

      <section className="workspace">
        <header className="topbar"><button className="menu-btn" onClick={() => setMobileNav(true)} aria-label="Mở menu"><IconMenu2 /></button><div className="crumb"><span>Vận hành HTX</span><b>/</b><strong>{pageTitle}</strong></div><div className="top-actions"><button className="icon-btn search"><IconSearch size={19} /><span>Tìm kiếm nhanh</span><kbd>⌘ K</kbd></button><div className="notification-wrap"><button className="icon-btn bell" onClick={() => setNotificationOpen(!notificationOpen)} aria-label="Thông báo"><IconBell size={20} />{!notificationOpen && <i />}</button>{notificationOpen && <NotificationPopover onClose={() => setNotificationOpen(false)} onNotice={() => setNotice(true)} />}</div></div></header>

        <div className="content">
          <div className="page-heading"><div><p>{today}</p><h1>{pageTitle}</h1></div><div className="heading-actions"><button className="outline-btn" onClick={() => setActive("Hồ sơ & tài liệu")}><IconFileCertificate size={18} />Xuất báo cáo</button><button className="primary-btn" onClick={() => setNotice(true)}><IconClipboardData size={18} />Cập nhật dữ liệu</button></div></div>

          {notice && <div className="notice"><IconCircleCheck size={19} /><span>Thông báo mẫu: Có 3 hồ sơ mùa vụ và 2 đơn hàng đang chờ xử lý.</span><button onClick={() => setNotice(false)}><IconX size={17} /></button></div>}

          {active === "Tổng quan" ? <>
          <section className="kpi-grid">
            <Metric icon={IconUsers} label="Thành viên hoạt động" value="286" change="+12 người" tone="green" />
            <Metric icon={IconMap2} label="Diện tích sản xuất" value="412,6 ha" change="+8,4 ha" tone="blue" />
            <Metric icon={IconTractor} label="Sản lượng vụ hè thu" value="2.684 tấn" change="82% kế hoạch" tone="amber" />
            <Metric icon={IconReportMoney} label="Doanh thu lũy kế" value="18,42 tỷ" change="+14,8% so với cùng kỳ" tone="purple" />
          </section>

          <section className="overview-grid">
            <div className="panel production-panel"><div className="panel-head"><div><h2>Sản xuất theo mùa vụ</h2><p>Tiến độ vụ Thu Đông 2026</p></div><button className="text-btn">Xem chi tiết <IconArrowUpRight size={16} /></button></div><div className="production-body"><div className="donut"><div><strong>82%</strong><span>hoàn thành</span></div></div><div className="crop-list"><Crop name="Sầu riêng" amount="1.120 tấn" pct="88" color="#2d7a4f" /><Crop name="Xoài" amount="684 tấn" pct="76" color="#d99c2b" /><Crop name="Bưởi" amount="428 tấn" pct="69" color="#4b82c3" /><Crop name="Khác" amount="452 tấn" pct="61" color="#9187d9" /></div></div></div>
            <div className="panel orders-panel"><div className="panel-head"><div><h2>Đơn tiêu thụ</h2><p>Tháng 08/2026</p></div><button className="more">•••</button></div><div className="order-stat"><strong>27</strong><span>đơn hàng đang xử lý</span><em>+5 đơn tuần này</em></div><div className="order-bars"><span style={{height:"68%"}} /><span style={{height:"47%"}} /><span style={{height:"82%"}} /><span style={{height:"61%"}} /><span className="current" style={{height:"94%"}} /><span style={{height:"56%"}} /><span style={{height:"73%"}} /></div><div className="week"><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span></div></div>
          </section>

          <section className="panel gis-panel"><div className="panel-head"><div><h2>Bản đồ vùng sản xuất</h2><p>Tra cứu thửa đất, mùa vụ và trạng thái tiêu chuẩn</p></div><div className="map-legend"><span><i className="legend-green" />Đạt VietGAP</span><span><i className="legend-amber" />Đang chuyển đổi</span><span><i className="legend-blue" />Vùng liên kết</span></div></div><div className="map-layout"><div className="map-wrap"><MapWidget selectedParcel={parcel} onSelect={selectParcel} /><div className="map-filter"><IconSearch size={16} /><span>Tìm thửa đất, hộ dân...</span></div></div><aside className="parcel-card"><div className="parcel-label">THỬA ĐẤT ĐANG CHỌN</div><h3>{parcel.id}</h3><div className="parcel-status"><span style={{background:parcel.color}} />Đạt chuẩn VietGAP</div><dl><div><dt>Chủ sử dụng</dt><dd>{parcel.name}</dd></div><div><dt>Cây trồng</dt><dd>{parcel.crop}</dd></div><div><dt>Diện tích</dt><dd>{parcel.area}</dd></div><div><dt>Mùa vụ</dt><dd>Thu Đông 2026</dd></div></dl><button className="primary-btn full" onClick={() => setActive("Đất đai & GIS")}>Mở hồ sơ thửa đất <IconArrowUpRight size={17} /></button></aside></div></section>

          <section className="lower-grid"><div className="panel activity-panel"><div className="panel-head"><div><h2>Hoạt động mới nhất</h2><p>Cập nhật từ các phân hệ trong ngày</p></div><button className="text-btn">Tất cả <IconArrowUpRight size={16} /></button></div><div className="activity-list">{activities.map(({ icon: Icon, title, sub, time, tone }) => <div className="activity" key={title}><div className={`activity-icon ${tone}`}><Icon size={18} /></div><div><b>{title}</b><p>{sub}</p></div><time>{time}</time></div>)}</div></div><div className="panel alerts-panel"><div className="panel-head"><div><h2>Cần lưu ý</h2><p>Cảnh báo vận hành</p></div><span className="count">04</span></div><Alert title="3 thửa sắp đến kỳ kiểm tra" detail="Hạn kiểm tra VietGAP trong 7 ngày tới" /><Alert title="Lô hàng SR-2408-16 sắp hết hạn" detail="Còn 3 ngày bảo quản tại kho lạnh số 1" /><Alert title="02 công nợ quá hạn" detail="Tổng giá trị cần đối soát: 62,8 triệu đồng" /></div></section>
          </> : <ModuleView active={active} onNotice={() => setNotice(true)} parcel={parcel} onSelectParcel={selectParcel} />}
        </div>
      </section>
    </main>
  );
}

function Metric({ icon: Icon, label, value, change, tone }) { return <article className="metric"><div className={`metric-icon ${tone}`}><Icon size={20} /></div><p>{label}</p><div><strong>{value}</strong><span className={tone}><IconArrowUpRight size={14} />{change}</span></div></article>; }
function Crop({ name, amount, pct, color }) { return <div className="crop"><div><span style={{background:color}} />{name}<b>{amount}</b></div><div className="track"><i style={{width:`${pct}%`, background:color}} /></div></div>; }
function Alert({ title, detail }) { return <div className="alert"><div><IconAlertTriangle size={18} /></div><p><b>{title}</b><span>{detail}</span></p><IconArrowUpRight size={17} /></div>; }
function NotificationPopover({ onClose, onNotice }) { return <div className="notification-popover"><header><div><b>Thông báo</b><span>04 cần xử lý</span></div><button onClick={onClose}>Đánh dấu đã đọc</button></header><div className="notification-list">{notifications.map(({ icon: Icon, tone, title, detail, time, action }) => <article key={title}><div className={`notification-icon ${tone}`}><Icon size={18} /></div><div><b>{title}</b><p>{detail}</p><span>{time}</span></div><button onClick={() => { onClose(); onNotice(); }}>{action}</button></article>)}</div><footer><button onClick={onClose}>Xem tất cả thông báo</button></footer></div>; }
