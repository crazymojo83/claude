import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = { created: '#38bdf8', solved: '#4ade80' }

export default function TicketTrends({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="zd-chart-panel">
        <h3 className="zd-chart-title">Ticket Trends</h3>
        <div className="zd-chart-empty">No ticket data for this period</div>
      </div>
    )
  }

  return (
    <div className="zd-chart-panel">
      <h3 className="zd-chart-title">Ticket Trends</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="date" stroke="#9aa5b1" fontSize={12} />
          <YAxis stroke="#9aa5b1" fontSize={12} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: '#171d27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f4f8' }}
          />
          <Legend />
          <Bar dataKey="created" name="Created" fill={COLORS.created} radius={[4, 4, 0, 0]} />
          <Bar dataKey="solved" name="Solved" fill={COLORS.solved} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
