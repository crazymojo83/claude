const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

function getColor(count, max) {
  if (count === 0) return 'rgba(255,255,255,0.03)'
  const intensity = Math.min(count / Math.max(max, 1), 1)
  // Gradient from dark blue to cyan to green
  if (intensity < 0.5) {
    const t = intensity * 2
    return `rgba(56, 189, 248, ${0.15 + t * 0.4})`
  }
  const t = (intensity - 0.5) * 2
  return `rgba(74, 222, 128, ${0.4 + t * 0.6})`
}

export default function HeatmapChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="zd-chart-panel zd-chart-wide">
        <h3 className="zd-chart-title">Busiest Hours</h3>
        <div className="zd-chart-empty">No data</div>
      </div>
    )
  }

  const max = Math.max(...data.map(d => d.count), 1)

  return (
    <div className="zd-chart-panel zd-chart-wide">
      <h3 className="zd-chart-title">Busiest Hours</h3>
      <div className="zd-heatmap-container">
        <div className="zd-heatmap">
          {/* Hour labels */}
          <div className="zd-heatmap-row zd-heatmap-header">
            <div className="zd-heatmap-day-label" />
            {HOURS.filter(h => h % 3 === 0).map(h => (
              <div key={h} className="zd-heatmap-hour-label" style={{ gridColumn: h + 2 }}>
                {h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`}
              </div>
            ))}
          </div>
          {/* Day rows */}
          {DAYS.map((day, dayIdx) => (
            <div key={day} className="zd-heatmap-row">
              <div className="zd-heatmap-day-label">{day}</div>
              {HOURS.map(hour => {
                const cell = data.find(d => d.day === day && d.hour === hour)
                const count = cell?.count || 0
                return (
                  <div
                    key={hour}
                    className="zd-heatmap-cell"
                    style={{ background: getColor(count, max) }}
                    title={`${day} ${hour}:00 — ${count} ticket${count !== 1 ? 's' : ''}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
        <div className="zd-heatmap-legend">
          <span>Less</span>
          <div className="zd-heatmap-legend-cells">
            {[0, 0.25, 0.5, 0.75, 1].map(i => (
              <div key={i} className="zd-heatmap-cell" style={{ background: getColor(i * max, max) }} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
