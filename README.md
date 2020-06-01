# Map Accompaniment to The Banished Immortal by Ha Jin

This is a project to create an interactive accompaniment to the book *The Banished Immortal: A Life of Li Bai*, by Ha Jin. The book details the life story of the eight-century Tang Dynasty Poet Li Bai, widely recognized as one of the greatest if not the greatest Chinese poet in history.

Li Bai led a nomadic life, moving frequently throughout China as he sought to advance his career. While the book tells a compelling story, some may find it difficult to track the movement of the protagonist without a map. This project aims to create an accompanying tracker to add to the experience of reading the book.

## Hosted site
This repo automatically builds through Vercel to https://learn-gatsby-mapbox.now.sh/ with each new commit

## The Data
The source data of the itinerary to be traced in this interactive map is saved in `src/data/libai-stops.yaml`

## Notes from the Gatsby-Mapbox starter
This site is based off of the [Gatsby-Mapbox starter made by brendan-ward](https://github.com/brendan-ward/gatsby-starter-mapbox).

This starter gets you going quickly with Mapbox GL in Gatsby.

It uses React hooks to wrap the Mapbox GL JS object.

Because Mapbox GL is provided as a native JS object within `components/Map/index.jsx`, instead of a React Component, you need to coordinate application state directly with the map object.

Map configuration is stored in `config/map.js`. You need to provide basic map configuration such as initial `zoom` level, and you can provide optional `sources` and `layers` according to the Mapbox GL style specification.

You must set the environment variable `GATSBY_MAPBOX_API_TOKEN` to your Mapbox API token.
