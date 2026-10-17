import type { Mission } from "./types";

export function newMission(name: string): Mission {
  return {
    id: crypto.randomUUID(),
    name,
    waypoints: [],
    updatedAt: new Date().toISOString(),
  };
}

export function addWaypoint(
  mission: Mission,
  lng: number,
  lat: number
): Mission {
  return {
    ...mission,
    waypoints: [...mission.waypoints, { id: crypto.randomUUID(), lng, lat }],
  };
}

export function moveWaypoint(
  mission: Mission,
  id: string,
  lng: number,
  lat: number
): Mission {
  return {
    ...mission,
    waypoints: mission.waypoints.map((w) =>
      w.id === id ? { ...w, lng, lat } : w
    ),
  };
}

export function removeWaypoint(mission: Mission, id: string): Mission {
  return {
    ...mission,
    waypoints: mission.waypoints.filter((w) => w.id !== id),
  };
}
