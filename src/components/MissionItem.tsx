import React from "react";
import type { Mission } from "../types";

import "./MissionList.css";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface MissionItemProps {
  mission: Mission;
  isSelected?: boolean;
  isDirty?: boolean;
  onMissionSelect: (missionId: string) => void;
  onMissionDelete: (id: string) => void;
}

const MissionItem: React.FC<MissionItemProps> = ({
  mission,
  isSelected,
  isDirty,
  onMissionSelect,
  onMissionDelete,
}) => {
  const count = mission.waypoints.length;

  const itemClassName = [
    "mission-card",
    isSelected && "is-selected",
    isDirty && "is-dirty",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li>
      <button
        type="button"
        className={itemClassName}
        //   aria-current={m.id === selectedId}
        //   onClick={() => onSelect(m.id)}
        onClick={() => onMissionSelect(mission.id)}
      >
        {/* <RouteShape mission={m} />  */}
        <span className="mission-text">
          {isDirty && <span>Unsaved Changes</span>}
          <span className="mission-name">{mission.name}</span>
          <span className="mission-meta">
            {count} {count === 1 ? "waypoint" : "waypoints"}, updated{" "}
            {formatDate(mission.updatedAt)}
          </span>
        </span>
      </button>
      <button type="button" onClick={() => onMissionDelete(mission.id)}>
        Delete
      </button>
      <button type="button">Edit</button>
      <button type="button">Save</button>
    </li>
  );
};

export default MissionItem;
