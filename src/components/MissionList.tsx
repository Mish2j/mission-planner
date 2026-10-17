import React, { useState } from "react";

import MissionItem from "./MissionItem";

import "./MissionList.css";
import type { Mission } from "../types";
import NewMissionForm from "./NewMissionForm";

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
    <aside
      style={{
        position: "absolute",
        top: "0",
        bottom: "0",
        left: "10px",
        width: "250px",
        height: "95%",
        background: "#000000dd",
        marginTop: "auto",
        marginBottom: "auto",
      }}
    >
      <header className="sidebar-header">
        <h1>Missions</h1>
      </header>

      {missions.length === 0 ? (
        <p className="empty">
          No missions yet. Create one, then click the map to place waypoints.
        </p>
      ) : (
        displayMissionList()
      )}
      <button
        type="button"
        className="new-btn"
        onClick={() => setIsCreating(true)}
      >
        New mission
      </button>
      {isCreating && (
        <NewMissionForm
          onCreate={(name: string) => {
            onMissionCreate(name); // handleCreateMission from App
            setIsCreating(false); // close the form after creating
          }}
          onCancel={() => setIsCreating(false)}
        />
      )}
    </aside>
  );
};

export default MissionList;

// export default MissionList;
// import type { Mission } from "./types";
// import "./MissionList.css";

// interface Props {
//   missions: Mission[];
//   selectedId: string | null;
//   onSelect: (id: string) => void;
//   onCreate: () => void;
// }

// const W = 64;
// const H = 48;
// const PAD = 7;

// /** Draws the mission's actual route as a tiny thumbnail. */
// function RouteShape({ mission }: { mission: Mission }) {
//   const pts = mission.waypoints;

//   if (pts.length === 0) {
//     return (
//       <svg className="route-shape" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
//         <circle cx={W / 2} cy={H / 2} r="5" className="route-empty" />
//       </svg>
//     );
//   }

//   const lngs = pts.map((p) => p.lng);
//   const lats = pts.map((p) => p.lat);
//   const minLng = Math.min(...lngs);
//   const minLat = Math.min(...lats);
//   const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;

//   // Longitude degrees shrink with latitude, so correct for it to keep the shape true.
//   const cos = Math.cos((avgLat * Math.PI) / 180);
//   const dx = Math.max((Math.max(...lngs) - minLng) * cos, 1e-6);
//   const dy = Math.max(Math.max(...lats) - minLat, 1e-6);
//   const scale = Math.min((W - PAD * 2) / dx, (H - PAD * 2) / dy);
//   const offX = (W - dx * scale) / 2;
//   const offY = (H - dy * scale) / 2;

//   const coords: [number, number][] =
//     pts.length === 1
//       ? [[W / 2, H / 2]]
//       : pts.map((p) => [
//           offX + (p.lng - minLng) * cos * scale,
//           H - offY - (p.lat - minLat) * scale,
//         ]);

//   const last = coords.length - 1;

//   return (
//     <svg className="route-shape" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
//       <polyline points={coords.map(([x, y]) => `${x},${y}`).join(" ")} className="route-line" />
//       {coords.map(([x, y], i) => (
//         <circle
//           key={i}
//           cx={x}
//           cy={y}
//           r={i === 0 || i === last ? 3.2 : 2}
//           className={i === 0 ? "route-start" : i === last ? "route-end" : "route-stop"}
//         />
//       ))}
//     </svg>
//   );
// }

// function formatDate(iso: string) {
//   return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
// }

// export default function MissionList({ missions, selectedId, onSelect, onCreate }: Props) {
//   return (
//     <aside className="sidebar">
//       <header className="sidebar-header">
//         <h1>Missions</h1>
//         <button type="button" className="new-btn" onClick={onCreate}>
//           New mission
//         </button>
//       </header>

//       {missions.length === 0 ? (
//         <p className="empty">No missions yet. Create one, then click the map to place waypoints.</p>
//       ) : (
//         <ul className="mission-list">
//           {missions.map((m) => {
//             const count = m.waypoints.length;
//             return (
//               <li key={m.id}>
//                 <button
//                   type="button"
//                   className="mission-card"
//                   aria-current={m.id === selectedId}
//                   onClick={() => onSelect(m.id)}
//                 >
//                   <RouteShape mission={m} />
//                   <span className="mission-text">
//                     <span className="mission-name">{m.name}</span>
//                     <span className="mission-meta">
//                       {count} {count === 1 ? "waypoint" : "waypoints"}, updated {formatDate(m.updatedAt)}
//                     </span>
//                   </span>
//                 </button>
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </aside>
//   );
// }
