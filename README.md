# Weather App

A clean weather app featuring location-based forecasts, an interactive map,
and severe weather alerts.

## Features

- **Location-based forecasts** — geolocates you on first visit (with a
  graceful fallback), city search with autocomplete, current conditions,
  24-hour outlook with a temperature sparkline, and a 7-day forecast.
- **Interactive map** — Leaflet map with a precipitation radar overlay
  (RainViewer). Click anywhere to get the forecast for that spot.
- **Severe weather alerts** — derived from the next 48 hours of forecast
  data: thunderstorms, freezing rain, damaging winds, heavy rain/snow,
  extreme heat/cold, dense fog, and very high UV.
- °C/°F unit toggle, persisted preferences.

All data sources are free and require no API keys (Open-Meteo, BigDataCloud
reverse geocoding, RainViewer radar, OpenStreetMap tiles).

## Getting started

```bash
npm install
npm start        # dev server on http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # ESLint
```

## Stack

React 18 · Vite · Redux Toolkit + RTK Query · Material-UI v6 · Emotion + SCSS ·
Leaflet / react-leaflet · React Router

See [CLAUDE.md](CLAUDE.md) for architecture conventions.
