import MissionMap from "./components/MissionMap";
import "./App.css";

function App() {
  return <MissionMap />;
}

export default App;

// import { useState } from "react";
// import MissionMap from "./MissionMap";
// import MissionList from "./MissionList";
// import { mockMissions } from "./mockMissions";
// import type { Mission } from "./types";

// export default function App() {
//   const [missions, setMissions] = useState<Mission[]>(mockMissions);
//   const [selectedId, setSelectedId] = useState<string | null>(mockMissions[0]?.id ?? null);

//   const selected = missions.find((m) => m.id === selectedId) ?? null;

//   const updateMission = (updated: Mission) => {
//     setMissions((prev) =>
//       prev.map((m) =>
//         m.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : m
//       )
//     );
//   };

//   const createMission = () => {
//     const mission: Mission = {
//       id: crypto.randomUUID(),
//       name: `Mission ${missions.length + 1}`,
//       waypoints: [],
//       updatedAt: new Date().toISOString(),
//     };
//     setMissions((prev) => [mission, ...prev]);
//     setSelectedId(mission.id);
//   };

//   return (
//     <div className="app-shell">
//       <MissionList
//         missions={missions}
//         selectedId={selectedId}
//         onSelect={setSelectedId}
//         onCreate={createMission}
//       />
//       <main className="map-pane">
//         {selected && (
//           <MissionMap key={selected.id} mission={selected} onChange={updateMission} />
//         )}
//       </main>
//     </div>
//   );
// }
