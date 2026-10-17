// STORAGE LAYER: the only file that touches localStorage.
import type { Mission } from "../types";

const KEY = "missions";

/** READ all missions from localStorage. */
export function loadMissions(): Mission[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

/** READ one mission by id from localStorage. */
export function loadMission(id: string): Mission | undefined {
  return loadMissions().find((m) => m.id === id);
}

/** WRITE the full list of missions to localStorage. */
export function saveMissions(missions: Mission[]) {
  localStorage.setItem(KEY, JSON.stringify(missions));
}

/** WRITE one mission: insert it, or update it if it already exists. */
export function saveMission(mission: Mission): Mission {
  const saved = { ...mission, updatedAt: new Date().toISOString() };
  const all = loadMissions();
  const exists = all.some((m) => m.id === saved.id);
  saveMissions(
    exists ? all.map((m) => (m.id === saved.id ? saved : m)) : [saved, ...all]
  );
  return saved;
}

/** WRITE: remove one mission by id. */
export function deleteMission(id: string) {
  saveMissions(loadMissions().filter((m) => m.id !== id));
}
