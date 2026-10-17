import type { Mission } from "./types";

export const missions: Mission[] = [
  {
    id: "mission-1",
    name: "Downtown LA Survey",
    updatedAt: "2026-10-17T09:00:00.000Z",
    waypoints: [
      {
        id: "wp-1-1",
        name: "Start: Union Station",
        lng: -118.2365,
        lat: 34.056,
      },
      { id: "wp-1-2", name: "City Hall", lng: -118.2437, lat: 34.0537 },
      { id: "wp-1-3", name: "Crypto.com Arena", lng: -118.2673, lat: 34.043 },
      {
        id: "wp-1-4",
        name: "End: Grand Central Market",
        lng: -118.249,
        lat: 34.0509,
      },
    ],
  },
  {
    id: "mission-2",
    name: "Santa Monica Coastline",
    updatedAt: "2026-10-16T15:30:00.000Z",
    waypoints: [
      { id: "wp-2-1", name: "Santa Monica Pier", lng: -118.4965, lat: 34.0092 },
      { id: "wp-2-2", name: "Venice Beach", lng: -118.4695, lat: 33.985 },
      { id: "wp-2-3", name: "Marina del Rey", lng: -118.4517, lat: 33.9803 },
    ],
  },
  {
    id: "mission-3",
    name: "Griffith Park Patrol",
    updatedAt: "2026-10-15T12:00:00.000Z",
    waypoints: [
      {
        id: "wp-3-1",
        name: "Griffith Observatory",
        lng: -118.3004,
        lat: 34.1184,
      },
      { id: "wp-3-2", name: "Greek Theatre", lng: -118.2967, lat: 34.1196 },
      { id: "wp-3-3", name: "LA Zoo", lng: -118.2865, lat: 34.1484 },
    ],
  },
];
