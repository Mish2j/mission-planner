import React, { useState } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";
import type { MapMouseEvent } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Feature, LineString } from "geojson";

import type { Mission } from "../types";

import MissionList from "./MissionList";

import { loadMissions, saveMission } from "../storage/MissionStorage";
import {
  addWaypoint,
  moveWaypoint,
  newMission,
  removeWaypoint,
} from "../missions";

interface MissionMapProps {
  mission: Mission;
  // onChange: (mission: Mission) => void;
}

const MissionMap: React.FC<MissionMapProps> = () => {
  const [missions, setMissions] = useState<Mission[]>(loadMissions);
  const [selectedId, setSelectedId] = useState<string | null>(
    () => missions[0]?.id ?? null
  );
  const [selectedWaypointId, setSelectedWaypointId] = useState<string | null>(
    null
  );
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());

  const selectedMission = missions.find((m) => m.id === selectedId) ?? null;
  const isDirty = !!selectedMission && dirtyIds.has(selectedMission.id);

  // Replace a mission in state and mark it as having unsaved changes
  const updateMission = (updated: Mission) => {
    setMissions((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    setDirtyIds((prev) => new Set(prev).add(updated.id));
  };

  const selectMissionHandler = (missionId: string) => {
    setSelectedId(missionId);
    setSelectedWaypointId(null);
  };

  const createMissionHandler = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const mission = saveMission(newMission(trimmed));
    setMissions((prev) => [mission, ...prev]);
    selectMissionHandler(mission.id);
  };

  const handleMapClick = (e: MapMouseEvent) => {
    if (!selectedMission) return;
    const waypoint = addWaypoint(selectedMission, e.lngLat.lng, e.lngLat.lat);
    updateMission(waypoint);
    setSelectedWaypointId(null);
  };

  const handleMarkerDragEnd = (id: string, lng: number, lat: number) => {
    if (!selectedMission) return;
    updateMission(moveWaypoint(selectedMission, id, lng, lat));
  };

  const handleDeleteWaypoint = () => {
    if (!selectedMission || !selectedWaypointId) return;
    updateMission(removeWaypoint(selectedMission, selectedWaypointId));
    setSelectedWaypointId(null);
  };

  const handleSave = () => {
    if (!selectedMission) return;
    const saved = saveMission(selectedMission);
    setMissions((prev) => prev.map((m) => (m.id === saved.id ? saved : m)));
    setDirtyIds((prev) => {
      const next = new Set(prev);
      next.delete(saved.id);
      return next;
    });
  };

  const line: Feature<LineString> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: selectedMission?.waypoints.map((w) => [w.lng, w.lat]) ?? [],
    },
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{ longitude: -118.2437, latitude: 34.0522, zoom: 10 }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: "100%", height: "100vh" }}
        onClick={handleMapClick}
      >
        <Source id="route" type="geojson" data={line}>
          <Layer
            id="route-line"
            type="line"
            paint={{ "line-color": "#2563eb", "line-width": 3 }}
          />
        </Source>

        {selectedMission?.waypoints.map((w, i) => (
          <Marker
            key={w.id}
            longitude={w.lng}
            latitude={w.lat}
            draggable
            onDragEnd={(e) =>
              handleMarkerDragEnd(w.id, e.lngLat.lng, e.lngLat.lat)
            }
            onClick={(e) => {
              e.originalEvent.stopPropagation(); // don't add a waypoint underneath
              setSelectedWaypointId(w.id);
            }}
          >
            <div
              style={{
                background: w.id === selectedWaypointId ? "#dc2626" : "#2563eb",
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
      {selectedMission && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            gap: 8,
          }}
        >
          <button
            type="button"
            onClick={handleDeleteWaypoint}
            disabled={!selectedWaypointId}
          >
            Delete waypoint
          </button>
          <button type="button" onClick={handleSave} disabled={!isDirty}>
            {isDirty ? "Save changes" : "Saved"}
          </button>
        </div>
      )}
      <MissionList
        missions={missions}
        onMissionSelect={selectMissionHandler}
        onMissionCreate={createMissionHandler}
      />
    </div>
  );
};

export default MissionMap;
