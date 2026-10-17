import React, { useState } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";
import type { MapMouseEvent } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Feature, LineString } from "geojson";

import type { Mission } from "../types";

import MissionList from "./MissionList";

import { loadMissions, saveMission } from "../storage/MissionStorage";
import { newMission } from "../missions";

interface MissionMapProps {
  mission: Mission;
  // onChange: (mission: Mission) => void;
}

const MissionMap: React.FC<MissionMapProps> = () => {
  const [missions, setMissions] = useState<Mission[]>(loadMissions);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedMission =
    missions.find((mission) => mission.id === selectedId) ?? missions[0];
  console.log("selectedId: ", selectedId);
  const selectMissionHandler = (missionId: string) => {
    setSelectedId(missionId);
  };

  const createMissionHandler = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const mission = saveMission(newMission(trimmed));
    setMissions((prev) => [mission, ...prev]);
    setSelectedId(mission.id);
  };

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
      coordinates: selectedMission?.waypoints?.map((w) => [w.lng, w.lat]) || [
        0, 0,
      ],
    },
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>
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

        {selectedMission &&
          selectedMission.waypoints.map((w, i) => (
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
      <MissionList
        missions={missions}
        onMissionSelect={selectMissionHandler}
        onMissionCreate={createMissionHandler}
      />
    </div>
  );
};

export default MissionMap;
