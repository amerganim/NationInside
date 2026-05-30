"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { scoreColor } from "@/components/ui";
import { fmt } from "@/lib/data";

export interface MapPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  memberCount: number;
  activeCount: number;
  activityScore: number;
}

export default function MapBangladesh({
  points,
  height = 460,
}: {
  points: MapPoint[];
  height?: number | string;
}) {
  return (
    <MapContainer
      center={[23.7, 90.3]}
      zoom={6}
      minZoom={5}
      scrollWheelZoom={false}
      style={{ height, width: "100%", borderRadius: 14 }}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO'
      />
      {points.map((p) => {
        const color = scoreColor(p.activityScore);
        const radius = Math.max(8, Math.sqrt(p.memberCount) / 45 + 5);
        return (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={radius}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.55, weight: 1.5 }}
          >
            <Tooltip direction="top" offset={[0, -4]} opacity={1}>
              <div style={{ minWidth: 160 }}>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>{p.name}</div>
                <div style={{ color: "#8ea0c2" }}>
                  Members: <b style={{ color: "#e7eefb" }}>{fmt(p.memberCount)}</b>
                </div>
                <div style={{ color: "#8ea0c2" }}>
                  Active: <b style={{ color: "#e7eefb" }}>{fmt(p.activeCount)}</b>
                </div>
                <div style={{ color: "#8ea0c2" }}>
                  Health: <b style={{ color }}>{p.activityScore}/100</b>
                </div>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
