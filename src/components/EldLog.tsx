
type EldSegment = { start: string; end: string; status: 'OFF' | 'SB' | 'D' | 'ON'; note: string }

type Props = {
  date: string
  segments: EldSegment[]
}

const ROWS: { key: EldSegment['status']; label: string; color: string }[] = [
  { key: 'OFF', label: 'Off', color: '#90a4ae' },
  { key: 'SB', label: 'Sleeper', color: '#7e57c2' },
  { key: 'D', label: 'Driving', color: '#2e7d32' },
  { key: 'ON', label: 'On duty', color: '#f9a825' },
]

const HOUR_WIDTH = 32 // px per hour
const ROW_HEIGHT = 26
const PADDING_LEFT = 80
const PADDING_TOP = 24
const WIDTH = PADDING_LEFT + HOUR_WIDTH * 24 + 8
const HEIGHT = PADDING_TOP + ROWS.length * ROW_HEIGHT + 8

function hoursBetween(a: Date, b: Date) {
  return (b.getTime() - a.getTime()) / 3600000
}

export default function EldLog({ date, segments }: Props) {
  const dayStart = new Date(`${date}T00:00:00`)

  const rects = segments.map((s) => {
    const start = new Date(s.start)
    const end = new Date(s.end)
    const rowIndex = ROWS.findIndex(r => r.key === s.status)
    const x = PADDING_LEFT + Math.max(0, Math.min(24, hoursBetween(dayStart, start))) * HOUR_WIDTH
    const x2 = PADDING_LEFT + Math.max(0, Math.min(24, hoursBetween(dayStart, end))) * HOUR_WIDTH
    const y = PADDING_TOP + rowIndex * ROW_HEIGHT + 4
    const width = Math.max(2, x2 - x)
    return { x, y, width, color: ROWS[rowIndex].color, label: s.note }
  })

  return (
    <div className="eld-log">
      <div className="eld-header">{date}</div>
      <svg width={WIDTH} height={HEIGHT}>
        {/* Hour grid */}
        {[...Array(25).keys()].map(h => (
          <line
            key={h}
            x1={PADDING_LEFT + h * HOUR_WIDTH}
            y1={PADDING_TOP}
            x2={PADDING_LEFT + h * HOUR_WIDTH}
            y2={PADDING_TOP + ROWS.length * ROW_HEIGHT}
            stroke="#e0e0e0"
            strokeWidth={1}
          />
        ))}
        {/* Row labels and separators */}
        {ROWS.map((r, i) => (
          <g key={r.key}>
            <text x={8} y={PADDING_TOP + i * ROW_HEIGHT + ROW_HEIGHT - 8} fontSize={12} fill="#555">{r.label}</text>
            <line
              x1={PADDING_LEFT}
              y1={PADDING_TOP + (i + 1) * ROW_HEIGHT}
              x2={PADDING_LEFT + 24 * HOUR_WIDTH}
              y2={PADDING_TOP + (i + 1) * ROW_HEIGHT}
              stroke="#eeeeee"
              strokeWidth={1}
            />
          </g>
        ))}
        {/* Hour labels */}
        {[0, 4, 8, 12, 16, 20, 24].map(h => (
          <text key={h} x={PADDING_LEFT + h * HOUR_WIDTH - 6} y={16} fontSize={10} fill="#777">{h}</text>
        ))}
        {/* Segments as bars */}
        {rects.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.width} height={ROW_HEIGHT - 8} fill={r.color} rx={3} ry={3} />
        ))}
      </svg>
    </div>
  )
}


