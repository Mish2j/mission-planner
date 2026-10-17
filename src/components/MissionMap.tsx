import React, { useState, useEffect } from "react";

import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";

import type { MapMouseEvent } from "react-map-gl/mapbox";
import type { Feature, LineString } from "geojson";
import type { Mission } from "../types";

import {
  deleteMission,
  loadMission,
  loadMissions,
  saveMission,
} from "../storage/MissionStorage";
import {
  addWaypoint,
  moveWaypoint,
  newMission,
  removeWaypoint,
} from "../missions";

import MissionList from "./MissionList";

import "./MissionMap.css";

const MissionMap: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>(loadMissions);
  const [selectedId, setSelectedId] = useState<string | null>(
    () => missions[0]?.id ?? null
  );
  const [selectedWaypointId, setSelectedWaypointId] = useState<string | null>(
    null
  );
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());

  const selectedMission =
    missions.find((mission) => mission.id === selectedId) ?? null;
  const isDirty = !!selectedMission && dirtyIds.has(selectedMission.id);

  // Warn the user if they try to close the tab with unsaved changes
  useEffect(() => {
    if (dirtyIds.size === 0) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirtyIds]);

  // Replace a mission in state and mark it as having unsaved changes
  const updateMission = (updatedMission: Mission) => {
    setMissions((prev) =>
      prev.map((mission) =>
        mission.id === updatedMission.id ? updatedMission : mission
      )
    );
    setDirtyIds((prev) => new Set(prev).add(updatedMission.id));
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

  const mapClickHandler = (e: MapMouseEvent) => {
    if (!selectedMission) return;
    const updated = addWaypoint(selectedMission, e.lngLat.lng, e.lngLat.lat);
    updateMission(updated);
    setSelectedWaypointId(null);
  };

  const markerDragEndHandler = (id: string, lng: number, lat: number) => {
    if (!selectedMission) return;
    const updated = moveWaypoint(selectedMission, id, lng, lat);
    updateMission(updated);
  };

  const deleteWaypointHandler = () => {
    if (!selectedMission || !selectedWaypointId) return;
    const updated = removeWaypoint(selectedMission, selectedWaypointId);
    updateMission(updated);
    setSelectedWaypointId(null);
  };

  const saveMissionHandler = () => {
    if (!selectedMission) return;
    const saved = saveMission(selectedMission);
    setMissions((prev) =>
      prev.map((mission) => (mission.id === saved.id ? saved : mission))
    );
    setDirtyIds((prev) => {
      const next = new Set(prev);
      next.delete(saved.id);
      return next;
    });
  };

  const cancelEditsHandler = () => {
    if (!selectedMission) return;

    // Confirm with the user before discarding unsaved changes
    if (!window.confirm("Discard unsaved changes?")) return;

    // last saved version
    const saved = loadMission(selectedMission.id);
    if (saved) {
      setMissions((prev) =>
        prev.map((mission) => (mission.id === saved.id ? saved : mission))
      );
    }
    setDirtyIds((prev) => {
      const next = new Set(prev);
      next.delete(selectedMission.id);
      return next;
    });
    setSelectedWaypointId(null);
  };

  const handleDeleteMission = (id: string) => {
    const mission = missions.find((mission) => mission.id === id);
    if (!mission) return;
    if (!window.confirm(`Delete "${mission.name}"? This can't be undone.`))
      return;

    // remove from localStorage
    deleteMission(id);

    const remaining = missions.filter((mission) => mission.id !== id);
    setMissions(remaining); // remove from state
    setDirtyIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

    // if the deleted mission was open, open another one (or none)
    if (id === selectedId) {
      setSelectedId(remaining[0]?.id ?? null);
      setSelectedWaypointId(null);
    }
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
        onClick={mapClickHandler}
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
              markerDragEndHandler(w.id, e.lngLat.lng, e.lngLat.lat)
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
        <div className="map-actions">
          <button
            type="button"
            className="map-btn map-btn--danger"
            onClick={deleteWaypointHandler}
            disabled={!selectedWaypointId}
          >
            Delete waypoint
          </button>
          <button
            type="button"
            className="map-btn map-btn--secondary"
            onClick={cancelEditsHandler}
            disabled={!isDirty}
          >
            Cancel edits
          </button>
          <button
            type="button"
            className="map-btn map-btn--primary"
            onClick={saveMissionHandler}
            disabled={!isDirty}
          >
            {isDirty ? "Save changes" : "Saved"}
          </button>
        </div>
      )}
      <MissionList
        missions={missions}
        selectedId={selectedId}
        dirtyIds={dirtyIds}
        onMissionSelect={selectMissionHandler}
        onMissionCreate={createMissionHandler}
        onMissionDelete={handleDeleteMission}
      />
    </div>
  );
};

export default MissionMap;
