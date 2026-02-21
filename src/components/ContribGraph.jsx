import { useMemo } from 'react'

function generateContribData() {
  const cells = []
  const weeks = 52
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const rand = Math.random()
      let level
      if (rand < 0.3) level = 0
      else if (rand < 0.55) level = 1
      else if (rand < 0.75) level = 2
      else if (rand < 0.9) level = 3
      else level = 4
      cells.push(level)
    }
  }
  return cells
}

function ContribGraph() {
  const cells = useMemo(() => generateContribData(), [])

  return (
    <div className="contrib-graph">
      <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem' }}>
        365 contributions in the last year
      </div>
      <div className="contrib-grid">
        {cells.map((level, i) => (
          <div
            key={i}
            className={`contrib-cell contrib-${level}`}
            title={`Contribution level: ${level}`}
          />
        ))}
      </div>
      <div className="contrib-legend">
        Less
        <div className="contrib-legend-cell contrib-0" />
        <div className="contrib-legend-cell contrib-1" />
        <div className="contrib-legend-cell contrib-2" />
        <div className="contrib-legend-cell contrib-3" />
        <div className="contrib-legend-cell contrib-4" />
        More
      </div>
    </div>
  )
}

export default ContribGraph
