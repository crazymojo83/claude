// ─── Zendesk Data Transformations ────────────────────────────────────────────
// Pure functions that convert raw Zendesk ticket arrays into chart-ready data.

// ─── Summary Stats ───────────────────────────────────────────────────────────

export function computeSummaryStats(tickets, openTickets = []) {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const createdToday = tickets.filter(t => new Date(t.created_at) >= todayStart).length
  const solvedToday = tickets.filter(
    t => t.status === 'solved' && t.updated_at && new Date(t.updated_at) >= todayStart
  ).length

  const openCount = openTickets.filter(t => t.status === 'open').length
  const pendingCount = openTickets.filter(t => t.status === 'pending').length
  const holdCount = openTickets.filter(t => t.status === 'hold').length

  // Average age of open tickets in days
  const openAges = openTickets
    .filter(t => t.status === 'open' || t.status === 'pending' || t.status === 'hold')
    .map(t => (now - new Date(t.created_at)) / (1000 * 60 * 60 * 24))
  const avgAge = openAges.length ? Math.round(openAges.reduce((a, b) => a + b, 0) / openAges.length * 10) / 10 : 0

  // One-touch resolution: solved tickets with 1 or fewer comments from agents
  const solvedTickets = tickets.filter(t => t.status === 'solved' || t.status === 'closed')
  const oneTouchCount = solvedTickets.filter(t => (t.comment_count || 0) <= 2).length
  const oneTouchRate = solvedTickets.length ? Math.round((oneTouchCount / solvedTickets.length) * 100) : 0

  // Reopened tickets (status is open but has been solved before — approximation via tags)
  const reopenedCount = tickets.filter(t =>
    t.tags && t.tags.some(tag => tag.toLowerCase().includes('reopen'))
  ).length

  return {
    openCount,
    pendingCount,
    holdCount,
    createdToday,
    solvedToday,
    totalInRange: tickets.length,
    avgAge,
    oneTouchRate,
    reopenedCount,
    backlogSize: openCount + pendingCount + holdCount,
  }
}

// ─── Group By helpers ────────────────────────────────────────────────────────

export function groupByStatus(tickets) {
  const counts = {}
  for (const t of tickets) {
    const s = t.status || 'unknown'
    counts[s] = (counts[s] || 0) + 1
  }
  return Object.entries(counts)
    .map(([name, value]) => ({ name: capitalize(name), value }))
    .sort((a, b) => b.value - a.value)
}

export function groupByPriority(tickets) {
  const order = ['urgent', 'high', 'normal', 'low', null]
  const counts = {}
  for (const t of tickets) {
    const p = t.priority || 'none'
    counts[p] = (counts[p] || 0) + 1
  }
  return order
    .map(p => {
      const key = p || 'none'
      return { name: capitalize(key), value: counts[key] || 0 }
    })
    .filter(d => d.value > 0)
}

export function groupByTags(tickets, topN = 10) {
  const counts = {}
  for (const t of tickets) {
    if (!t.tags) continue
    for (const tag of t.tags) {
      counts[tag] = (counts[tag] || 0) + 1
    }
  }
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, topN)
}

export function groupByGroup(tickets, groupMap = {}) {
  const counts = {}
  for (const t of tickets) {
    const name = groupMap[t.group_id] || (t.group_id ? `Group ${t.group_id}` : 'Unassigned')
    counts[name] = (counts[name] || 0) + 1
  }
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export function groupByAssignee(tickets, userMap = {}) {
  const counts = {}
  for (const t of tickets) {
    const name = userMap[t.assignee_id] || (t.assignee_id ? `Agent ${t.assignee_id}` : 'Unassigned')
    counts[name] = (counts[name] || 0) + 1
  }
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export function groupByChannel(tickets) {
  const counts = {}
  for (const t of tickets) {
    const ch = t.via?.channel || 'unknown'
    counts[ch] = (counts[ch] || 0) + 1
  }
  return Object.entries(counts)
    .map(([name, value]) => ({ name: capitalize(name), value }))
    .sort((a, b) => b.value - a.value)
}

// ─── Time Series ─────────────────────────────────────────────────────────────

export function ticketsByDate(tickets, range) {
  const buckets = {}

  for (const t of tickets) {
    const d = new Date(t.created_at)
    const key = range === 'monthly' ? `${d.getMonth() + 1}/${d.getDate()}` : formatShortDate(d)

    if (!buckets[key]) buckets[key] = { date: key, created: 0, solved: 0 }
    buckets[key].created++
    if (t.status === 'solved' || t.status === 'closed') {
      buckets[key].solved++
    }
  }

  return Object.values(buckets).sort((a, b) => {
    // Sort by date
    const [am, ad] = a.date.split('/').map(Number)
    const [bm, bd] = b.date.split('/').map(Number)
    if (am !== bm) return am - bm
    return ad - bd
  })
}

// ─── Busiest Hours Heatmap ───────────────────────────────────────────────────

export function ticketsByHour(tickets) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const grid = []

  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      grid.push({ day: days[day], hour, count: 0 })
    }
  }

  for (const t of tickets) {
    const d = new Date(t.created_at)
    const idx = d.getDay() * 24 + d.getHours()
    if (grid[idx]) grid[idx].count++
  }

  return grid
}

// ─── Top Requesting Orgs ────────────────────────────────────────────────────

export function topRequesters(tickets, topN = 5) {
  const counts = {}
  for (const t of tickets) {
    const org = t.organization_id ? `Org ${t.organization_id}` : 'No org'
    counts[org] = (counts[org] || 0) + 1
  }
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, topN)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function formatShortDate(d) {
  return `${d.getMonth() + 1}/${d.getDate()}`
}
