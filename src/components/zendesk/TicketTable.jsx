import { useState } from 'react'

const STATUS_CLASSES = {
  open: 'zd-badge-open',
  pending: 'zd-badge-pending',
  hold: 'zd-badge-hold',
  solved: 'zd-badge-solved',
  closed: 'zd-badge-closed',
}

const PRIORITY_CLASSES = {
  urgent: 'zd-priority-urgent',
  high: 'zd-priority-high',
  normal: 'zd-priority-normal',
  low: 'zd-priority-low',
}

const PAGE_SIZE = 25

export default function TicketTable({ tickets, subdomain }) {
  const [sortField, setSortField] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  if (!tickets || tickets.length === 0) {
    return (
      <div className="zd-chart-panel zd-chart-full">
        <h3 className="zd-chart-title">Recent Tickets</h3>
        <div className="zd-chart-empty">No tickets found</div>
      </div>
    )
  }

  function handleSort(field) {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const sorted = [...tickets].sort((a, b) => {
    let av = a[sortField]
    let bv = b[sortField]
    if (sortField === 'created_at' || sortField === 'updated_at') {
      av = new Date(av).getTime()
      bv = new Date(bv).getTime()
    }
    if (typeof av === 'string') av = av.toLowerCase()
    if (typeof bv === 'string') bv = bv.toLowerCase()
    if (av < bv) return sortDir === 'asc' ? -1 : 1
    if (av > bv) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const visible = sorted.slice(0, visibleCount)
  const sortIndicator = (field) => sortField === field ? (sortDir === 'asc' ? ' \u25B2' : ' \u25BC') : ''

  function formatDate(iso) {
    if (!iso) return '—'
    const d = new Date(iso)
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  function ticketUrl(id) {
    return subdomain ? `https://${subdomain}.zendesk.com/agent/tickets/${id}` : '#'
  }

  return (
    <div className="zd-chart-panel zd-chart-full">
      <h3 className="zd-chart-title">Recent Tickets ({tickets.length})</h3>
      <div className="zd-table-wrap">
        <table className="zd-ticket-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>ID{sortIndicator('id')}</th>
              <th onClick={() => handleSort('subject')}>Subject{sortIndicator('subject')}</th>
              <th onClick={() => handleSort('status')}>Status{sortIndicator('status')}</th>
              <th onClick={() => handleSort('priority')}>Priority{sortIndicator('priority')}</th>
              <th>Tags</th>
              <th onClick={() => handleSort('created_at')}>Created{sortIndicator('created_at')}</th>
              <th onClick={() => handleSort('updated_at')}>Updated{sortIndicator('updated_at')}</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(ticket => (
              <tr
                key={ticket.id}
                className={PRIORITY_CLASSES[ticket.priority] || ''}
                onClick={() => window.open(ticketUrl(ticket.id), '_blank')}
                style={{ cursor: 'pointer' }}
              >
                <td className="zd-td-id">#{ticket.id}</td>
                <td className="zd-td-subject">{ticket.subject || '(no subject)'}</td>
                <td>
                  <span className={`zd-badge ${STATUS_CLASSES[ticket.status] || ''}`}>
                    {ticket.status}
                  </span>
                </td>
                <td>
                  <span className={`zd-badge ${PRIORITY_CLASSES[ticket.priority] || 'zd-badge-none'}`}>
                    {ticket.priority || 'none'}
                  </span>
                </td>
                <td className="zd-td-tags">
                  {(ticket.tags || []).slice(0, 3).map(tag => (
                    <span key={tag} className="zd-tag">{tag}</span>
                  ))}
                  {(ticket.tags || []).length > 3 && <span className="zd-tag">+{ticket.tags.length - 3}</span>}
                </td>
                <td className="zd-td-date">{formatDate(ticket.created_at)}</td>
                <td className="zd-td-date">{formatDate(ticket.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleCount < tickets.length && (
        <button className="zd-btn zd-btn-secondary zd-load-more" onClick={() => setVisibleCount(c => c + PAGE_SIZE)}>
          Show More ({tickets.length - visibleCount} remaining)
        </button>
      )}
    </div>
  )
}
