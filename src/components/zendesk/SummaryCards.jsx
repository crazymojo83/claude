const CARDS = [
  { key: 'openCount', label: 'Open Tickets', icon: '\uD83D\uDCE8', color: 'var(--accent-blue)' },
  { key: 'createdToday', label: 'Created Today', icon: '\uD83D\uDCE5', color: 'var(--cyan)' },
  { key: 'solvedToday', label: 'Solved Today', icon: '\u2705', color: 'var(--green)' },
  { key: 'pendingCount', label: 'Pending', icon: '\u23F3', color: 'var(--orange)' },
  { key: 'backlogSize', label: 'Backlog', icon: '\uD83D\uDCDA', color: 'var(--purple)' },
  { key: 'avgAge', label: 'Avg Age (days)', icon: '\uD83D\uDCC5', color: 'var(--accent)' },
  { key: 'oneTouchRate', label: 'One-Touch %', icon: '\uD83C\uDFAF', color: 'var(--green)' },
  { key: 'reopenedCount', label: 'Reopened', icon: '\uD83D\uDD04', color: 'var(--red)' },
]

export default function SummaryCards({ summary }) {
  if (!summary) return null

  return (
    <div className="zd-summary-cards">
      {CARDS.map(card => (
        <div key={card.key} className="zd-stat-card" style={{ '--card-accent': card.color }}>
          <span className="zd-stat-icon">{card.icon}</span>
          <span className="zd-stat-value">{summary[card.key] ?? 0}{card.key === 'oneTouchRate' ? '%' : ''}</span>
          <span className="zd-stat-label">{card.label}</span>
        </div>
      ))}
    </div>
  )
}
