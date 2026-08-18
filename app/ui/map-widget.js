"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export default function MapWidget({ selectedParcel, onSelect }) {
  const ref = useRef(null);

  useEffect(() => {
    let map;
    let L;
    let disposed = false;
    const parcels = [
      { id: "TD-042", name: "Ông Nguyễn Văn Thành", crop: "Sầu riêng Ri6", area: "2,4 ha", color: "#2d7a4f", points: [[10.046, 105.773], [10.0466, 105.779], [10.042, 105.779], [10.042, 105.773]] },
      { id: "TD-118", name: "Bà Trần Thị Lan", crop: "Xoài cát Hòa Lộc", area: "1,8 ha", color: "#d99c2b", points: [[10.049, 105.781], [10.051, 105.786], [10.047, 105.788], [10.046, 105.783]] },
      { id: "TD-209", name: "Tổ liên kết An Phú", crop: "Bưởi da xanh", area: "3,1 ha", color: "#4b82c3", points: [[10.039, 105.782], [10.041, 105.789], [10.036, 105.789], [10.035, 105.784]] },
    ];

    async function init() {
      L = (await import("leaflet")).default;
      if (!ref.current || disposed) return;
      // Leaflet preserves an id on a DOM node. Clear a stale id during a fast
      // dashboard-to-GIS transition before creating a new map instance.
      if (ref.current._leaflet_id) ref.current._leaflet_id = null;
      map = L.map(ref.current, { zoomControl: false, attributionControl: false }).setView([10.043, 105.781], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.circleMarker([10.0423126, 105.7802718], { radius: 7, color: "#174f35", weight: 2, fillColor: "#d5e967", fillOpacity: 1 })
        .bindTooltip("Đinh Tiên Hoàng · Phường Ninh Kiều", { direction: "top", offset: [0, -8] })
        .addTo(map);
      parcels.forEach((parcel) => {
        const layer = L.polygon(parcel.points, { color: parcel.color, weight: 2, fillColor: parcel.color, fillOpacity: 0.28 });
        layer.on("click", () => onSelect(parcel));
        layer.bindTooltip(`${parcel.id} · ${parcel.crop}`, { sticky: true });
        layer.addTo(map);
      });
    }
    init();
    return () => { disposed = true; map?.remove(); };
  }, [onSelect]);

  return <div ref={ref} className="map-canvas" aria-label="Bản đồ vùng sản xuất OpenStreetMap" />;
}
