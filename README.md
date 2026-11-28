# Map Accompaniment to The Banished Immortal by Ha Jin

This is a project to create an interactive accompaniment to the book *The Banished Immortal: A Life of Li Bai*, by Ha Jin. The book details the life story of the eighth-century Tang Dynasty poet Li Bai, widely recognized as one of the greatest if not the greatest Chinese poet in history.

Li Bai led a nomadic life, moving frequently throughout China as he sought to advance his career. While the book tells a compelling story, some may find it difficult to track the movement of the protagonist without a map. This project aims to create an accompanying tracker to add to the experience of reading the book.

## The Data

The itinerary traced in the map is saved in `src/data/libai-stop.json`, a GeoJSON file. `src/data/README.md` describes each field.

## Development

The site is a Vite + React 19 + TypeScript single-page app. The map uses mapbox-gl 1.x, and the controls are built with [ui-sdk](https://ui-sdk.dev).

1. Use the current Node LTS and run `npm install`.
2. Copy `.env.example` to `.env.local` and set `VITE_MAPBOX_API_TOKEN` to a Mapbox public access token.
3. Run `npm run dev`.

| Script            | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Start the dev server                           |
| `npm run build`   | Type check and build static files into `dist/` |
| `npm run preview` | Serve the production build locally             |
| `npm test`        | Run the Vitest suite                           |
| `npm run lint`    | Lint with oxlint                               |

## Deploying on Vercel

The site builds through Vercel with each commit. The project settings need:

- Framework preset: **Vite**. The build command is `npm run build` and the output directory is `dist`.
- Environment variable `VITE_MAPBOX_API_TOKEN` holding the Mapbox token. It replaces the old `GATSBY_MAPBOX_API_TOKEN`.

## Credits

The first version of this site was based on the [Gatsby-Mapbox starter by brendan-ward](https://github.com/brendan-ward/gatsby-starter-mapbox).
