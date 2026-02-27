import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const CHANNEL_COLORS = [
  '#38bdf8', '#4ade80', '#f43f5e', '#fbbf24', '#a78bfa',
  '#6366f1', '#e11d48', '#fb923c', '#2dd4bf', '#818cf8',
]

export default function ChannelChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="zd-chart-panel">
        <h3 className="zd-chart-title">By Channel</h3>
        <div className="zd-chart-empty">No data</div>
      </div>
    )
  }

  return (
    <div className="zd-chart-panel">
      <h3 className="zd-chart-title">By Channel</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={CHANNEL_COLORS[i % CHANNEL_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#171d27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f4f8' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
