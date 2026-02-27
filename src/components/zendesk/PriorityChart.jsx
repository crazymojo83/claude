import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'

const PRIORITY_COLORS = {
  Urgent: '#be123c',
  High: '#f43f5e',
  Normal: '#38bdf8',
  Low: '#4ade80',
  None: '#616e7c',
}

export default function PriorityChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="zd-chart-panel">
        <h3 className="zd-chart-title">By Priority</h3>
        <div className="zd-chart-empty">No data</div>
      </div>
    )
  }

  return (
    <div className="zd-chart-panel">
      <h3 className="zd-chart-title">By Priority</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" stroke="#9aa5b1" fontSize={12} />
          <YAxis stroke="#9aa5b1" fontSize={12} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: '#171d27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f4f8' }}
          />
          <Bar dataKey="value" name="Tickets" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name] || '#9aa5b1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
