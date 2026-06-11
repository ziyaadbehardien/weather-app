# Claude Code Guidelines for Weather App

A clean weather app with location-based forecasts, an interactive map, and
severe weather alerts. React 18 application built with Redux Toolkit,
Material-UI, and Vite.

## Tech Stack Summary

| Category | Technology                |
| -------- | ------------------------- |
| Framework | React 18.3.1             |
| Build    | Vite 5.4.1                |
| State    | Redux Toolkit + RTK Query |
| UI       | Material-UI v6            |
| Styling  | Emotion + SCSS            |
| Maps     | Leaflet + react-leaflet   |

## Data Sources (free, no API keys)

- **Forecast**: Open-Meteo `api.open-meteo.com/v1/forecast` (current, hourly, daily; `timezone=auto`)
- **Geocoding**: Open-Meteo `geocoding-api.open-meteo.com/v1/search`
- **Reverse geocoding**: BigDataCloud `reverse-geocode-client`
- **Radar tiles**: RainViewer public weather-maps API
- **Alerts**: derived client-side from the 48-hour forecast in `src/features/alerts/alertRules.js` (thunderstorms, freezing rain, damaging wind, heavy rain/snow, heat/cold extremes, fog, UV)

## Project Structure

```
src/
├── app/           # Redux store
├── assets/        # SCSS, theme
├── components/    # Reusable components (T-prefixed)
├── features/      # Feature modules (slices, API, components)
│   ├── weather/   # weatherApiSlice, weatherSlice, forecast components, hooks
│   ├── alerts/    # alert derivation rules + useAlerts
│   └── map/       # WeatherMap, RadarLayer
├── layout/        # BaseLayout
├── pages/         # Page components
├── routes/        # React Router config
└── utils/         # weatherCodes, formatters
```

## Key Patterns

### Feature Module Structure

```
features/{name}/
├── {name}ApiSlice.js    # RTK Query
├── {name}Slice.js       # Redux slice
└── {Name}.jsx           # Components
```

### Component Naming

- `{Name}.jsx` for shared components in `src/components/`
- `{Name}Page.jsx` for pages
- `{name}Slice.js` for Redux slices
- `{name}ApiSlice.js` for API slices

### State conventions

- Selected location + units live in `weatherSlice` and persist to
  `localStorage` (key `weather-app:prefs`) via a store subscription.
- All forecast reads go through the `useForecast()` hook (RTK Query dedupes).
- Units are `'metric' | 'imperial'`; pass through to Open-Meteo as
  `temperature_unit`/`wind_speed_unit`/`precipitation_unit`.

### Styling

- Use MUI `sx` prop with theme values
- Theme defined in `src/assets/theme.js`
- Night-time black/yellow palette (MUI dark mode): `#0B0B0D` (black
  background), `#141417` (paper), `#FFD60A` (yellow, primary), `#FFE566`
  (light yellow, secondary), `#F5F0DC` (cream text). Everything else should
  be shades/tints of black or yellow.

### Icons

```jsx
<i className="lni lni-icon-name" />
<i className="lni lni-spinner-1 lni-is-spinning" /> // Loading
```

Weather conditions render as emoji via `WeatherIcon` (WMO code map in
`src/utils/weatherCodes.js`); Lineicons are for UI chrome.

## Commands

```bash
npm start      # Dev server on :3000
npm run build  # Production build
npm run lint   # ESLint check
```
