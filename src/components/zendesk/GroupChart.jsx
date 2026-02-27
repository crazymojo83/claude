import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function GroupChart({ byGroup, byAssignee }) {
  const [view, setView] = useState('group')
  const data = view === 'group' ? byGroup : byAssignee

  if ((!byGroup || byGroup.length === 0) && (!byAssignee || byAssignee.length === 0)) {
    return (
      <div className="zd-chart-panel zd-chart-wide">
        <h3 className="zd-chart-title">Distribution</h3>
        <div className="zd-chart-empty">No distribution data</div>
      </div>
    )
  }

  return (
    <div className="zd-chart-panel zd-chart-wide">
      <div className="zd-chart-header">
        <h3 className="zd-chart-title">Distribution</h3>
        <div className="zd-toggle">
          <button
            className={`zd-toggle-btn ${view === 'group' ? 'active' : ''}`}
            onClick={() => setView('group')}
          >
            By Group
          </button>
          <button
            className={`zd-toggle-btn ${view === 'assignee' ? 'active' : ''}`}
            onClick={() => setView('assignee')}
          >
            By Assignee
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={Math.max(200, (data?.length || 1) * 36)}>
        <BarChart data={data || []} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis type="number" stroke="#9aa5b1" fontSize={12} allowDecimals={false} />
          <YAxis type="category" dataKey="name" stroke="#9aa5b1" fontSize={12} width={95} />
          <Tooltip
            contentStyle={{ background: '#171d27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f4f8' }}
          />
          <Bar dataKey="value" name="Tickets" fill="#38bdf8" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
