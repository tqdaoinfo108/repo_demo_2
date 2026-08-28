"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export default function MapWidget({ selectedParcel, parcels = [], onSelect }) {
  const ref = useRef(null);

  useEffect(() => {
    let map;
    let L;
    let disposed = false;

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
        const [lng, lat] = parcel.geometry?.coordinates || [105.682255, 10.452478];
        const color = parcel.color || "#2d7a4f";
        const layer = L.circle([lat, lng], { radius:Math.max(35, (parcel.areaHa || 1) * 45), color, weight:2, fillColor:color, fillOpacity:0.28 });
        layer.on("click", () => onSelect(parcel));
        layer.bindTooltip(`${parcel.id || parcel.code} · ${parcel.crop}`, { sticky: true });
        layer.addTo(parcelLayers);
      });
      L.control.layers({ "OpenStreetMap": osmLayer }, { "Quy hoạch TP Cao Lãnh": planningLayer, "Thửa đất": parcelLayers }, { collapsed: false, position: "topright" }).addTo(map);
    }
    init();
    return () => { disposed = true; map?.remove(); };
  }, [onSelect, parcels]);

  return <div ref={ref} className="map-canvas" aria-label="Bản đồ vùng sản xuất OpenStreetMap" />;
}
