import { Marker } from "react-map-gl/mapbox";

import type { Waypoint } from "../types";

import "./WaypointMarker.css";

interface WaypointMarkerProps {
  waypoint: Waypoint;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragEnd: (id: string, lng: number, lat: number) => void;
}

const WaypointMarker: React.FC<WaypointMarkerProps> = ({
  waypoint,
  index,
  isSelected,
  onSelect,
  onDragEnd,
}) => {
  return (
    <Marker
      longitude={waypoint.lng}
      latitude={waypoint.lat}
      draggable
      onDragEnd={(e) => onDragEnd(waypoint.id, e.lngLat.lng, e.lngLat.lat)}
      onClick={(e) => {
        e.originalEvent.stopPropagation(); // don't add a waypoint underneath
        onSelect(waypoint.id);
      }}
    >
      <div className={`waypoint-marker ${isSelected ? "is-selected" : ""}`}>
        {index + 1}
      </div>
    </Marker>
  );
};

export default WaypointMarker;
