import React, { useState } from "react";

import type { Mission } from "../types";

import NewMissionForm from "./NewMissionForm";
import MissionItem from "./MissionItem";

import "./MissionList.css";

interface MissionListProps {
  missions: Mission[];
  selectedId?: string | null;
  dirtyIds?: Set<string>;
  onMissionSelect: (missionId: string) => void;
  onMissionCreate: (name: string) => void;
  onMissionDelete: (id: string) => void;
}

const MissionList: React.FC<MissionListProps> = ({
  missions,
  selectedId,
  dirtyIds = new Set(),
  onMissionSelect,
  onMissionCreate,
  onMissionDelete,
}) => {
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const displayMissionList = () => {
    return (
      <ul className="mission-list">
        {missions.map((mission) => {
          return (
            <MissionItem
              key={mission.id}
              mission={mission}
              isSelected={mission.id === selectedId}
              isDirty={dirtyIds.has(mission.id)}
              onMissionSelect={onMissionSelect}
              onMissionDelete={onMissionDelete}
            />
          );
        })}
      </ul>
    );
  };

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <h1>Missions</h1>
      </header>

      {isCreating && (
        <NewMissionForm
          onCreate={(name: string) => {
            onMissionCreate(name);
            setIsCreating(false);
          }}
          onCancel={() => setIsCreating(false)}
        />
      )}
      <button
        type="button"
        className="new-btn"
        onClick={() => setIsCreating(true)}
      >
        New mission
      </button>
      {missions.length === 0 ? (
        <p className="empty">
          No missions yet. Create one, then click the map to place waypoints.
        </p>
      ) : (
        displayMissionList()
      )}
    </aside>
  );
};

export default MissionList;
