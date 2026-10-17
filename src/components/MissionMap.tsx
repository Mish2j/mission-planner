import React, { useState } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";
import type { MapMouseEvent } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Feature, LineString } from "geojson";
// mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const mockMissions: Mission[] = [
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

export interface Waypoint {
  id: string;
  lng: number;
  lat: number;
  name?: string;
}

export interface Mission {
  id: string;
  name: string;
  waypoints: Waypoint[];
  updatedAt: string; // ISO date
}

interface MissionMapProps {
  mission: Mission;
  onChange: (mission: Mission) => void;
}

const MissionMap: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>(mockMissions);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // const selected = missions.find((m) => m.id === selectedId) ?? missions[0];

  //  const updateMission = (updated: Mission) => {
  //   setMissions((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  // };

  const addWaypoint = (e: MapMouseEvent) => {
    console.log("addWaypoint: ", e);
    // onChange({
    //   ...mission,
    //   waypoints: [
    //     ...mission.waypoints,
    //     { id: crypto.randomUUID(), lng: e.lngLat.lng, lat: e.lngLat.lat },
    //   ],
    // });
  };

  const moveWaypoint = (id: string, lng: number, lat: number) => {
    console.log("moveWaypoint: ", id);
    console.log("lng: ", lng);
    console.log("lat: ", lat);
    // onChange({
    //   ...mission,
    //   waypoints: mission.waypoints.map((w) =>
    //     w.id === id ? { ...w, lng, lat } : w
    //   ),
    // });
  };

  const deleteWaypoint = (id: string) => {
    console.log("deleteWaypoint id: ", id);
    // onChange({
    //   ...mission,
    //   waypoints: mission.waypoints.filter((w) => w.id !== id),
    // });
    // setSelectedId(null);
  };

  const line: GeoJSON.Feature<GeoJSON.LineString> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: mockMissions[0].waypoints.map((w) => [w.lng, w.lat]),
    },
  };
  console.log("token:", import.meta.env.VITE_MAPBOX_TOKEN);
  return (
    <Map
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      initialViewState={{ longitude: -118.2437, latitude: 34.0522, zoom: 10 }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      style={{ width: "100%", height: "100vh" }}
      //   onClick={addWaypoint}
    >
      <Source id="route" type="geojson" data={line}>
        <Layer
          id="route-line"
          type="line"
          paint={{ "line-color": "#2563eb", "line-width": 3 }}
        />
      </Source>

      {mockMissions[0].waypoints.map((w, i) => (
        <Marker
          key={w.id}
          longitude={w.lng}
          latitude={w.lat}
          draggable
          onDragEnd={(e) => moveWaypoint(w.id, e.lngLat.lng, e.lngLat.lat)}
          onClick={(e) => {
            e.originalEvent.stopPropagation(); // don't add a waypoint underneath
            setSelectedId(w.id);
          }}
        >
          <div
            style={{
              background: w.id === selectedId ? "#dc2626" : "#2563eb",
              color: "white",
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "grid",
              placeItems: "center",
              fontSize: 12,
            }}
          >
            {i + 1}
          </div>
        </Marker>
      ))}
    </Map>
  );
};

export default MissionMap;
