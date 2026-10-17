import React from "react";

import "./MissionMap.css";

interface MapActionsProps {
  hasSelectedWaypoint: boolean;
  isDirty: boolean;
  onDeleteWaypoint: () => void;
  onCancelEdits: () => void;
  onSave: () => void;
}

const MapActions: React.FC<MapActionsProps> = ({
  hasSelectedWaypoint,
  isDirty,
  onDeleteWaypoint,
  onCancelEdits,
  onSave,
}) => {
  return (
    <div className="map-actions">
      <button
        type="button"
        className="map-btn map-btn--danger"
        onClick={onDeleteWaypoint}
        disabled={!hasSelectedWaypoint}
      >
        Delete waypoint
      </button>
      <button
        type="button"
        className="map-btn map-btn--secondary"
        onClick={onCancelEdits}
        disabled={!isDirty}
      >
        Cancel edits
      </button>
      <button
        type="button"
        className="map-btn map-btn--primary"
        onClick={onSave}
        disabled={!isDirty}
      >
        {isDirty ? "Save changes" : "Saved"}
      </button>
    </div>
  );
};

export default MapActions;
