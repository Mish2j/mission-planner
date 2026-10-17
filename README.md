# Mission Planner

A small web app for planning field missions on a Mapbox map. Create a mission, place waypoints on the map, move or delete them, and save the plan so you can return to it later.

Built with React, TypeScript, Vite, Mapbox GL JS and `react-map-gl`.

## Setup

### Requirements

- Node.js 20.19+ or 22.12+ (required by Vite's bundler)
- A free Mapbox account

### 1. Install dependencies

```bash
npm install
```

### 2. Add your Mapbox access token

The map needs a Mapbox **public** access token (it starts with `pk.`).

1. Sign in at [account.mapbox.com](https://account.mapbox.com) and copy your default public token, or create a new one.
2. Create a file named `.env.local` in the project root.

   ```
   VITE_MAPBOX_TOKEN=pk.your_token_here
   ```

Notes:

- The `VITE_` prefix is required. Vite only exposes variables with that prefix to the browser.
- No quotes and no spaces around `=`.
- `.env.local` is git-ignored, so the token is not committed.
- Use a public `pk.` token only. Never put a secret `sk.` token in front-end code.
- Restart the dev server after creating or editing the file. Vite reads env files only at startup.
- Before deploying, restrict the token to your domain under Tokens in the Mapbox dashboard.

If the map is blank or the console says "An API access token is required", the token is not being picked up. Check the file name, its location and the variable name.

### 3. Run the app

```bash
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173`.

Other commands:

```bash
npm run build     # type-check and build for production
npm run preview   # serve the production build locally
npm run lint      # run the linter
```

## How to use

1. Click **New mission**, enter a name and create it.
2. Select a mission in the list to open it on the map.
3. Click the map to add waypoints. They are numbered in the order you add them and joined by a line.
4. Drag a waypoint to move it. Click one to select it, then use **Delete waypoint** to remove it.
5. Click **Save changes** to store the mission. Use **Cancel edits** to go back to the last saved version.
6. Use **Delete** on a mission card to remove a mission.

A mission with unsaved changes shows an orange border and an "Unsaved" label in the list. The selected mission has a green border. On small screens the mission list becomes a drawer, opened with the **Missions** button.

## Project structure

```
src/
  components/
    MissionMap.tsx      main screen: state, handlers and the Mapbox map
    MissionList.tsx     list of missions
    MissionItem.tsx     one mission card
    NewMissionForm.tsx  form to create a mission
    MapActions.tsx      map buttons: delete waypoint, cancel edits, save
    WaypointMarker.tsx  one numbered, draggable waypoint
  missions.ts           pure functions for missions and waypoints (no storage)
  missionStorage.ts     the only file that reads or writes
    storage/
      MissionStorage.ts
  types.ts              Mission and Waypoint types
```

Keeping `missions.ts` (pure logic) separate from `missionStorage.ts` (storage) means the storage layer can be swapped, for example for an API, without touching the rest of the app.

## Assumptions

- Single user, single browser. Missions are stored in `localStorage` under the key `missions`, so they are not shared across devices or browsers.
- Saving is explicit. Edits stay a draft in memory until the user clicks **Save changes**.
- Waypoint order is the order they were added. The route line follows that order.
- One mission is open on the map at a time. Switching missions keeps unsaved edits in memory.
- A mission counts as unsaved after any edit, even if the edit is later reverted by hand.
- Coordinates are stored as `lng` / `lat` numbers.

## What I would improve with more time

- Fit the map to the selected mission's waypoints when switching missions.
- Compare the draft with the saved copy so "unsaved" clears when edits are reverted.
- Let users name waypoints and show the name on the map.
- Add empty and error states (no missions, missing token, storage failure).
- Display each waypoint's coordinates (latitude and longitude) when it is selected.
- Waypoint reordering, undo history and JSON import/export.
- Unit tests for the functions in `missions.ts`.
- Replace `localStorage` with a backend so missions sync across devices.
- Review the color choices: check text and border contrast for accessibility, make sure orange (unsaved), green (selected) and red (delete) are not the only way a state is shown, and replace hardcoded hex values with the shared CSS variables.
- Move styling to Sass or a CSS framework such as Tailwind for more maintainable, consistent styles.
