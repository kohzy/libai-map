# AGENTS.md

An interactive map companion to Ha Jin's *The Banished Immortal: A Life of Li Bai*. It is a Vite + React 19 + TypeScript single-page app. The map is drawn with mapbox-gl 1.x, and the UI components come from ui-sdk.

- Itinerary data: `src/data/libai-stop.json` (GeoJSON, hand-collected; field notes in `src/data/README.md`).
- Scripts: `npm run dev`, `npm run build`, `npm test`, `npm run lint`, `npm run preview`.
- Mapbox token: set `VITE_MAPBOX_API_TOKEN` in `.env.local` (see `.env.example`).

## ui-sdk

Before using ui-sdk, follow the ui-sdk skill if it's installed, and read `node_modules/@ui-sdk/react/docs/llms.txt`. To build a new component, also search `node_modules/@ui-sdk/react/docs/core.md` by heading, and read `rendering.md` next to it.
