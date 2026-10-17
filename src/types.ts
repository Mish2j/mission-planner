export interface Mission {
  id: string;
  name: string;
  waypoints: Waypoint[];
  updatedAt: string; // ISO date
}

export interface Waypoint {
  id: string;
  lng: number;
  lat: number;
  name?: string;
}
