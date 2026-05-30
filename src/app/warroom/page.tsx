import { getAllDistricts, getConstituencies } from "@/lib/data";
import WarRoomClient from "@/components/WarRoomClient";

export default function WarRoomPage() {
  const districts = getAllDistricts();
  const mapPoints = districts.map((d) => ({
    id: d.id,
    name: d.name,
    lat: d.lat,
    lng: d.lng,
    memberCount: d.memberCount,
    activeCount: d.activeCount,
    activityScore: d.activityScore,
  }));

  const turnout = getConstituencies().map((c) => ({
    name: c.seat,
    pct: 38 + (c.electorate % 45),
  }));

  return <WarRoomClient mapPoints={mapPoints} turnout={turnout} />;
}
