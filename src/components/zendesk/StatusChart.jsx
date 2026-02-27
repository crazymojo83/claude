import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const STATUS_COLORS = {
  Open: '#38bdf8',
  Pending: '#fbbf24',
  Hold: '#a78bfa',
  Solved: '#4ade80',
  Closed: '#616e7c',
  Unknown: '#9aa5b1',
}

export default function StatusChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="zd-chart-panel">
        <h3 className="zd-chart-title">By Status</h3>
        <div className="zd-chart-empty">No data</div>
      </div>
    )
  }

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="zd-chart-panel">
      <h3 className="zd-chart-title">By Status</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#9aa5b1'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#171d27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f4f8' }}
          />
          <Legend />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#f0f4f8" fontSize={24} fontWeight="bold">
            {total}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
