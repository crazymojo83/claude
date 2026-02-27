import { describe, it, expect } from 'vitest'
import {
  computeSummaryStats,
  groupByStatus,
  groupByPriority,
  groupByTags,
  groupByGroup,
  groupByAssignee,
  groupByChannel,
  ticketsByDate,
  ticketsByHour,
  topRequesters,
} from './zendeskTransform'

const now = new Date()
const todayISO = now.toISOString()
const yesterdayISO = new Date(now - 86400000).toISOString()

const mockTickets = [
  { id: 1, status: 'open', priority: 'high', tags: ['billing', 'vip'], created_at: todayISO, updated_at: todayISO, via: { channel: 'email' }, group_id: 1, assignee_id: 10, organization_id: 100, comment_count: 1 },
  { id: 2, status: 'solved', priority: 'normal', tags: ['technical'], created_at: todayISO, updated_at: todayISO, via: { channel: 'web' }, group_id: 1, assignee_id: 11, organization_id: 100, comment_count: 5 },
  { id: 3, status: 'pending', priority: 'urgent', tags: ['billing'], created_at: yesterdayISO, updated_at: yesterdayISO, via: { channel: 'email' }, group_id: 2, assignee_id: 10, organization_id: 200, comment_count: 2 },
  { id: 4, status: 'open', priority: 'low', tags: ['onboarding'], created_at: todayISO, updated_at: todayISO, via: { channel: 'chat' }, group_id: 2, assignee_id: 12, organization_id: null, comment_count: 1 },
  { id: 5, status: 'closed', priority: 'normal', tags: ['technical', 'billing'], created_at: yesterdayISO, updated_at: yesterdayISO, via: { channel: 'email' }, group_id: 1, assignee_id: 11, organization_id: 100, comment_count: 1 },
]

describe('computeSummaryStats', () => {
  it('computes correct open and pending counts', () => {
    const stats = computeSummaryStats(mockTickets, mockTickets)
    expect(stats.openCount).toBe(2)
    expect(stats.pendingCount).toBe(1)
  })

  it('computes backlog size', () => {
    const stats = computeSummaryStats(mockTickets, mockTickets)
    expect(stats.backlogSize).toBe(3) // 2 open + 1 pending
  })

  it('computes total in range', () => {
    const stats = computeSummaryStats(mockTickets, [])
    expect(stats.totalInRange).toBe(5)
  })

  it('computes one-touch rate', () => {
    // 2 solved/closed, one has comment_count<=2 (id:5), one has 5 (id:2)
    const stats = computeSummaryStats(mockTickets, [])
    expect(stats.oneTouchRate).toBe(50)
  })
})

describe('groupByStatus', () => {
  it('groups tickets by status', () => {
    const result = groupByStatus(mockTickets)
    const open = result.find(r => r.name === 'Open')
    expect(open.value).toBe(2)
    const solved = result.find(r => r.name === 'Solved')
    expect(solved.value).toBe(1)
  })

  it('returns empty array for no tickets', () => {
    expect(groupByStatus([])).toEqual([])
  })
})

describe('groupByPriority', () => {
  it('groups tickets by priority', () => {
    const result = groupByPriority(mockTickets)
    expect(result.find(r => r.name === 'Urgent').value).toBe(1)
    expect(result.find(r => r.name === 'High').value).toBe(1)
    expect(result.find(r => r.name === 'Normal').value).toBe(2)
    expect(result.find(r => r.name === 'Low').value).toBe(1)
  })
})

describe('groupByTags', () => {
  it('returns top tags sorted by count', () => {
    const result = groupByTags(mockTickets)
    expect(result[0].name).toBe('billing')
    expect(result[0].value).toBe(3)
    expect(result[1].name).toBe('technical')
    expect(result[1].value).toBe(2)
  })

  it('respects topN limit', () => {
    const result = groupByTags(mockTickets, 2)
    expect(result).toHaveLength(2)
  })
})

describe('groupByGroup', () => {
  it('groups by group with name mapping', () => {
    const groupMap = { 1: 'IT Support', 2: 'Engineering' }
    const result = groupByGroup(mockTickets, groupMap)
    expect(result.find(r => r.name === 'IT Support').value).toBe(3)
    expect(result.find(r => r.name === 'Engineering').value).toBe(2)
  })
})

describe('groupByAssignee', () => {
  it('groups by assignee with name mapping', () => {
    const userMap = { 10: 'Alice', 11: 'Bob', 12: 'Charlie' }
    const result = groupByAssignee(mockTickets, userMap)
    expect(result.find(r => r.name === 'Alice').value).toBe(2)
    expect(result.find(r => r.name === 'Bob').value).toBe(2)
    expect(result.find(r => r.name === 'Charlie').value).toBe(1)
  })
})

describe('groupByChannel', () => {
  it('groups by channel', () => {
    const result = groupByChannel(mockTickets)
    expect(result.find(r => r.name === 'Email').value).toBe(3)
    expect(result.find(r => r.name === 'Web').value).toBe(1)
    expect(result.find(r => r.name === 'Chat').value).toBe(1)
  })
})

describe('ticketsByDate', () => {
  it('returns date-bucketed data', () => {
    const result = ticketsByDate(mockTickets, 'weekly')
    expect(result.length).toBeGreaterThan(0)
    const totalCreated = result.reduce((s, r) => s + r.created, 0)
    expect(totalCreated).toBe(5)
  })
})

describe('ticketsByHour', () => {
  it('returns 168 cells (7 days x 24 hours)', () => {
    const result = ticketsByHour(mockTickets)
    expect(result).toHaveLength(168)
  })

  it('has non-zero counts for tickets', () => {
    const result = ticketsByHour(mockTickets)
    const totalCount = result.reduce((s, r) => s + r.count, 0)
    expect(totalCount).toBe(5)
  })
})

describe('topRequesters', () => {
  it('returns top requesting orgs', () => {
    const result = topRequesters(mockTickets, 3)
    expect(result[0].name).toBe('Org 100')
    expect(result[0].value).toBe(3)
  })
})
