import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getCredentials,
  searchTickets,
  getGroups,
  getUsers,
  buildTicketQuery,
  buildAllOpenQuery,
  getRateLimitInfo,
  clearCache,
} from '../services/zendeskApi'
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
} from '../services/zendeskTransform'

const REFRESH_INTERVALS = {
  '5min': 5 * 60 * 1000,
  '10min': 10 * 60 * 1000,
  '15min': 15 * 60 * 1000,
  '30min': 30 * 60 * 1000,
  off: null,
}

export default function useZendeskData(timeRange = 'daily', refreshInterval = '5min') {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [rateLimits, setRateLimits] = useState({ limit: null, remaining: null })
  const intervalRef = useRef(null)

  const fetchData = useCallback(async () => {
    const creds = getCredentials()
    if (!creds) {
      setError('No credentials configured')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch in parallel: range tickets, open tickets, groups, users
      const [rangeTickets, openTickets, groupMap, userMap] = await Promise.all([
        searchTickets(creds, buildTicketQuery(timeRange)),
        searchTickets(creds, buildAllOpenQuery()),
        getGroups(creds),
        getUsers(creds),
      ])

      const transformed = {
        summary: computeSummaryStats(rangeTickets, openTickets),
        byStatus: groupByStatus([...rangeTickets, ...openTickets]),
        byPriority: groupByPriority([...rangeTickets, ...openTickets]),
        byTags: groupByTags([...rangeTickets, ...openTickets]),
        byGroup: groupByGroup([...rangeTickets, ...openTickets], groupMap),
        byAssignee: groupByAssignee([...rangeTickets, ...openTickets], userMap),
        byChannel: groupByChannel(rangeTickets),
        trends: ticketsByDate(rangeTickets, timeRange),
        heatmap: ticketsByHour(rangeTickets),
        topRequesters: topRequesters(rangeTickets),
        recentTickets: rangeTickets
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 50),
        groupMap,
        userMap,
      }

      setData(transformed)
      setLastUpdated(new Date())
      setRateLimits(getRateLimitInfo())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  // Initial fetch + re-fetch on timeRange change
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto-refresh
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    const ms = REFRESH_INTERVALS[refreshInterval]
    if (ms) {
      intervalRef.current = setInterval(fetchData, ms)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchData, refreshInterval])

  const refresh = useCallback(() => {
    clearCache()
    fetchData()
  }, [fetchData])

  return { data, loading, error, refresh, lastUpdated, rateLimits }
}
