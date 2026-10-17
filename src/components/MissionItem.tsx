import React from "react";

import type { Mission } from "../types";

// import "./MissionList.css";
import "./MissionItem.css";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
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
        onClick={() => onMissionSelect(mission.id)}
      >
        <span className="mission-text">
          <span className="mission-name">{mission.name}</span>
          <span className="mission-meta">
            <span>
              {count} {count === 1 ? "waypoint" : "waypoints"}
            </span>
            <span>Updated {formatDate(mission.updatedAt)}</span>
          </span>
          {isDirty && <span className="unsaved-label">Unsaved</span>}
        </span>
      </button>
      <button
        type="button"
        className="mission-delete-btn"
        onClick={() => onMissionDelete(mission.id)}
      >
        Delete
      </button>
    </li>
  );
};

export default MissionItem;
