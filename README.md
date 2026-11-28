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
- Environment variables `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` for poem narration (see below). They have no `VITE_` prefix, so they stay on the server.

## Poem narration

The poem reader's Listen button reads the Chinese poem aloud, line by line. Each line comes from `/api/narrate` (`api/narrate.ts`), a Vercel function that asks [Azure AI Speech](https://learn.microsoft.com/azure/ai-services/speech-service/) to read it in the `poetry-reading` style.

1. Create an Azure AI Speech resource and copy one of its keys and its region (for example `eastasia`).
2. Set `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` in the Vercel project, and in `.env.local` for `npm run dev`, which serves the same function.
3. The voice, style, pace and pause live in `src/narration/voice.ts`. Responses are cached at the CDN for a year, so bump `VOICE_VERSION` there whenever you change the voice.

The function only speaks lines from `src/data/libai-stop.json` and rejects any other URL. Without the Azure variables it answers 503, and the reader falls back to a Chinese voice built into the browser, or says narration is unavailable when the browser has none.

## Credits

The first version of this site was based on the [Gatsby-Mapbox starter by brendan-ward](https://github.com/brendan-ward/gatsby-starter-mapbox).
