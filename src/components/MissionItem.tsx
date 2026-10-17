import React from "react";
import type { Mission } from "../types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface MissionItemProps {
  mission: Mission;
  onMissionSelect: (missionId: string) => void;
}

const MissionItem: React.FC<MissionItemProps> = ({
  mission,
  onMissionSelect,
}) => {
  const count = mission.waypoints.length;
  console.log("mission", mission);
  return (
    <li>
      <button
        type="button"
        className="mission-card"
        //   aria-current={m.id === selectedId}
        //   onClick={() => onSelect(m.id)}
        onClick={() => onMissionSelect(mission.id)}
      >
        {/* <RouteShape mission={m} />  */}
        <span className="mission-text">
          <span className="mission-name">{mission.name}</span>
          <span className="mission-meta">
            {count} {count === 1 ? "waypoint" : "waypoints"}, updated{" "}
            {formatDate(mission.updatedAt)}
          </span>
        </span>
      </button>
      <button type="button">Edit</button>
      <button type="button">Save</button>
    </li>
  );
};

export default MissionItem;
