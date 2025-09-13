import 'leaflet/dist/leaflet.css'
import { useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import './App.css'
import { planTrip, type PlanTripResponse } from './api'
import EldLog from './components/EldLog'
import LabeledInput from './components/LabeledInput'

function App() {
  const [form, setForm] = useState({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    current_cycle_hours_used: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PlanTripResponse | null>(null)

  const polylinePositions = useMemo(() => {
    const geom = result?.route.geometry
    if (!geom || geom.type !== 'LineString') return [] as [number, number][]
    // GeoJSON is [lon, lat]; Leaflet expects [lat, lon]
    return geom.coordinates.map(([lon, lat]) => [lat, lon]) as [number, number][]
  }, [result])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await planTrip({
        current_location: form.current_location,
        pickup_location: form.pickup_location,
        dropoff_location: form.dropoff_location,
        current_cycle_hours_used: Number(form.current_cycle_hours_used),
      })
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  const center = polylinePositions[0] || [37.773972, -122.431297]

  function FitBounds() {
    const map = useMap()
    if (polylinePositions.length > 0) {
      const latlngs = polylinePositions as any
      // @ts-ignore
      map.fitBounds(latlngs)
    }
    return null
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">Spotter</div>
        <div className="subtitle">Trip Planner</div>
      </header>

      <div className="content">
        <div className="map">
          <MapContainer center={center as any} zoom={6} style={{ height: '100%' }}>
            <FitBounds />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {polylinePositions.length > 0 && (
              <Polyline positions={polylinePositions as any} color="var(--primary)" weight={5} />
            )}
            {result?.stops.map((s, i) => (
              s.lat != null && s.lon != null ? (
                <CircleMarker key={i} center={[s.lat, s.lon] as any} radius={8} pathOptions={{
                  color: s.type === 'pickup' ? '#26a69a' : s.type === 'dropoff' ? '#ef5350' : s.type === 'fuel' ? '#ffa000' : s.type === 'break' ? '#42a5f5' : '#ab47bc',
                  weight: 2,
                  fillOpacity: 0.9,
                }}>
                  <Popup>
                    <div>
                      <div><strong>{s.type.toUpperCase()}</strong></div>
                      <div>ETA: {new Date(s.eta).toLocaleString()}</div>
                      <div>Duration: {s.duration_hours} h</div>
                    </div>
                  </Popup>
                </CircleMarker>
              ) : null
            ))}
          </MapContainer>
        </div>
        <aside className="sidebar">
          <div className="card">
            <form className="form" onSubmit={onSubmit}>
              <LabeledInput
                label="Current location"
                placeholder="San Francisco, CA"
                value={form.current_location}
                onChange={(e) => setForm({ ...form, current_location: e.target.value })}
                required
              />
              <LabeledInput
                label="Pickup location"
                placeholder="Los Angeles, CA"
                value={form.pickup_location}
                onChange={(e) => setForm({ ...form, pickup_location: e.target.value })}
                required
              />
              <LabeledInput
                label="Dropoff location"
                placeholder="Las Vegas, NV"
                value={form.dropoff_location}
                onChange={(e) => setForm({ ...form, dropoff_location: e.target.value })}
                required
              />
              <LabeledInput
                label="Cycle hours used"
                type="number"
                min={0}
                max={70}
                placeholder="12"
                value={form.current_cycle_hours_used}
                onChange={(e) => setForm({ ...form, current_cycle_hours_used: Number(e.target.value) })}
                required
              />
              <button type="submit" className="btn" disabled={loading}>{loading ? 'Planning...' : 'Plan trip'}</button>
            </form>
            {error && <div className="error">{error}</div>}
          </div>

          {result && (
            <div className="card">
              <div className="kpis">
                <div className="kpi"><div className="kpi-label">Distance</div><div className="kpi-value">{result.summary.distance_miles} mi</div></div>
                <div className="kpi"><div className="kpi-label">Duration</div><div className="kpi-value">{result.summary.duration_hours} h</div></div>
              </div>
              <div className="stops">
                {result.stops.map((s, i) => (
                  <div key={i} className="chip">
                    <span className={`dot dot-${s.type}`}></span>
                    {s.type} • {new Date(s.eta).toLocaleString()} • {s.duration_hours} h
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && (
            <div className="card scroll">
              <h3>ELD Logs</h3>
              {result.eld_days.map((d, i) => (
                <EldLog key={i} date={d.date} segments={d.segments as any} />
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default App
