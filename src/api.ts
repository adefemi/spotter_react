export type PlanTripRequest = {
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  current_cycle_hours_used: number;
  start_time?: string;
};

export type Stop = {
  type: 'pickup' | 'break' | 'rest' | 'fuel' | 'dropoff';
  eta: string;
  lat: number | null;
  lon: number | null;
  duration_hours: number;
};

export type EldDay = {
  date: string;
  segments: { start: string; end: string; status: 'OFF' | 'SB' | 'D' | 'ON'; note: string }[];
};

export type PlanTripResponse = {
  route: { geometry: GeoJSON.LineString | null; steps: any[] };
  stops: Stop[];
  eld_days: EldDay[];
  summary: { distance_miles: number; duration_hours: number };
};

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export async function planTrip(body: PlanTripRequest): Promise<PlanTripResponse> {
  const res = await fetch(`${API_BASE}/api/plan-trip/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Plan trip failed: ${res.status} ${msg}`);
  }
  return res.json();
}


