import type { Mission } from "../types";

const KEY = "missions";

export function loadMissions(): Mission[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

/** READ one mission by id from localStorage. */
export function loadMission(id: string): Mission | undefined {
  return loadMissions().find((mission) => mission.id === id);
}

export function saveMissions(missions: Mission[]) {
  localStorage.setItem(KEY, JSON.stringify(missions));
}

/** WRITE one mission: insert it, or update it if it already exists. */
export function saveMission(mission: Mission): Mission {
  const saved = { ...mission, updatedAt: new Date().toISOString() };
  const all = loadMissions();
  const exists = all.some((mission) => mission.id === saved.id);
  saveMissions(
    exists
      ? all.map((mission) => (mission.id === saved.id ? saved : mission))
      : [saved, ...all]
  );
  return saved;
}

export function deleteMission(id: string) {
  saveMissions(loadMissions().filter((mission) => mission.id !== id));
}
