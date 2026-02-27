import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function CategoryChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="zd-chart-panel zd-chart-wide">
        <h3 className="zd-chart-title">Top Tags / Categories</h3>
        <div className="zd-chart-empty">No tags found on tickets</div>
      </div>
    )
  }

  return (
    <div className="zd-chart-panel zd-chart-wide">
      <h3 className="zd-chart-title">Top Tags / Categories</h3>
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 36)}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis type="number" stroke="#9aa5b1" fontSize={12} allowDecimals={false} />
          <YAxis type="category" dataKey="name" stroke="#9aa5b1" fontSize={12} width={75} />
          <Tooltip
            contentStyle={{ background: '#171d27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f4f8' }}
          />
          <Bar dataKey="value" name="Tickets" fill="#6366f1" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
