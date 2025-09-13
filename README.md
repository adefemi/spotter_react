# Spotter Frontend (React + Vite + Leaflet)

A simple UI to plan trips, view the route on a map, see scheduled stops, and inspect ELD logs by day.

## Run locally

```bash
cd spotter-react
# point to local or deployed backend
VITE_API_BASE=http://localhost:8000 yarn dev
# or
VITE_API_BASE=https://spotter-django.onrender.com yarn dev
```

Open http://localhost:5173

## Environment
- `VITE_API_BASE` (required): base URL of the Django backend (e.g., `https://spotter-django.onrender.com`).

## Features
- Form: current location, pickup, dropoff, cycle hours used
- Calls POST `/api/plan-trip/`
- Map (Leaflet): route polyline + colored markers for pickup, break, rest, fuel, dropoff
- Summary card with total miles and hours
- ELD logs: per‑day 24‑hour grid (Off, Sleeper, Driving, On duty)
- Responsive layout for mobile/tablet/desktop

## Tech
- React 19, TypeScript, Vite
- react-leaflet + OpenStreetMap tiles

## Deploy
### Vercel
1. Import `spotter-react` as a project
2. Add env: `VITE_API_BASE=https://<your-backend-url>`
3. Deploy

### Static hosting
Build and host the `dist` folder anywhere
```bash
yarn build
# serve ./dist with any static host
```

## Notes
- Backend returns GeoJSON; the UI converts to Leaflet lat/lon for display
- Timezone and ETAs are approximate and for demo purposes
