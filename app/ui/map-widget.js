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
      { id: "TD-042", name: "Ông Nguyễn Văn Thành", crop: "Sầu riêng Ri6", area: "2,4 ha", color: "#2d7a4f", points: [[10.464, 105.668], [10.4646, 105.674], [10.460, 105.674], [10.460, 105.668]] },
      { id: "TD-118", name: "Bà Trần Thị Lan", crop: "Xoài cát Hòa Lộc", area: "1,8 ha", color: "#d99c2b", points: [[10.469, 105.676], [10.471, 105.681], [10.467, 105.683], [10.466, 105.678]] },
      { id: "TD-209", name: "Tổ liên kết An Phú", crop: "Bưởi da xanh", area: "3,1 ha", color: "#4b82c3", points: [[10.457, 105.677], [10.459, 105.684], [10.454, 105.684], [10.453, 105.679]] },
    ];

    async function init() {
      L = (await import("leaflet")).default;
      if (!ref.current || disposed) return;
      // Leaflet preserves an id on a DOM node. Clear a stale id during a fast
      // dashboard-to-GIS transition before creating a new map instance.
      if (ref.current._leaflet_id) ref.current._leaflet_id = null;
      map = L.map(ref.current, { zoomControl: false, attributionControl: false }).setView([10.452478, 105.682255], 13);
      const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
      const planningLayer = L.tileLayer("https://tracuuquyhoach.com/tiles/a/9eac3b7d2e554827/11/{x}/{y}", { minZoom: 11, maxNativeZoom: 11, maxZoom: 19, opacity: 0.58, attribution: "Quy hoạch: tracuuquyhoach.com" }).addTo(map);
      const parcelLayers = L.layerGroup().addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.circleMarker([10.452478, 105.682255], { radius: 7, color: "#174f35", weight: 2, fillColor: "#d5e967", fillOpacity: 1 })
        .bindTooltip("TP Cao Lãnh · Đồng Tháp", { direction: "top", offset: [0, -8] })
        .addTo(map);
      parcels.forEach((parcel) => {
        const layer = L.polygon(parcel.points, { color: parcel.color, weight: 2, fillColor: parcel.color, fillOpacity: 0.28 });
        layer.on("click", () => onSelect(parcel));
        layer.bindTooltip(`${parcel.id} · ${parcel.crop}`, { sticky: true });
        layer.addTo(parcelLayers);
      });
      L.control.layers({ "OpenStreetMap": osmLayer }, { "Quy hoạch TP Cao Lãnh": planningLayer, "Thửa đất mô phỏng": parcelLayers }, { collapsed: false, position: "topright" }).addTo(map);
    }
    init();
    return () => { disposed = true; map?.remove(); };
  }, [onSelect]);

  return <div ref={ref} className="map-canvas" aria-label="Bản đồ vùng sản xuất OpenStreetMap" />;
}
