// ─── Zendesk API Client ──────────────────────────────────────────────────────
// Handles authentication, search queries, pagination, caching, and rate limits.

const STORAGE_KEY = 'zendesk_credentials'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// In-memory response cache
const cache = new Map()

// Rate limit state
let rateLimitInfo = { limit: null, remaining: null, updatedAt: null }

// ─── Credential helpers ──────────────────────────────────────────────────────

export function getCredentials() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveCredentials(creds) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(creds))
}

export function clearCredentials() {
  localStorage.removeItem(STORAGE_KEY)
}

// ─── Rate limit helpers ──────────────────────────────────────────────────────

export function getRateLimitInfo() {
  return { ...rateLimitInfo }
}

function updateRateLimits(headers) {
  const limit = headers.get('x-rate-limit')
  const remaining = headers.get('x-rate-limit-remaining')
  if (limit != null) rateLimitInfo.limit = parseInt(limit, 10)
  if (remaining != null) rateLimitInfo.remaining = parseInt(remaining, 10)
  rateLimitInfo.updatedAt = Date.now()
}

// ─── Core fetch wrapper ──────────────────────────────────────────────────────

function buildBaseUrl(creds) {
  return `https://${creds.subdomain}.zendesk.com`
}

function buildAuthHeader(creds) {
  const token = btoa(`${creds.email}/token:${creds.apiToken}`)
  return `Basic ${token}`
}

async function zdFetch(creds, path, options = {}) {
  const url = path.startsWith('http') ? path : `${buildBaseUrl(creds)}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: buildAuthHeader(creds),
      ...options.headers,
    },
  })

  updateRateLimits(res.headers)

  if (res.status === 401) throw new Error('Invalid credentials. Check your subdomain, email, and API token.')
  if (res.status === 429) {
    const retryAfter = res.headers.get('retry-after') || 60
    throw new Error(`Rate limited. Retry after ${retryAfter} seconds.`)
  }
  if (!res.ok) throw new Error(`Zendesk API error: ${res.status} ${res.statusText}`)

  return res.json()
}

// ─── Cache helpers ───────────────────────────────────────────────────────────

function getCached(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.time > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  return entry.data
}

function setCache(key, data) {
  cache.set(key, { data, time: Date.now() })
}

export function clearCache() {
  cache.clear()
}

// ─── API methods ─────────────────────────────────────────────────────────────

export async function testConnection(creds) {
  const data = await zdFetch(creds, '/api/v2/users/me.json')
  return data.user
}

export async function searchTickets(creds, query) {
  const cacheKey = `search:${query}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const allResults = []
  let url = `/api/v2/search.json?query=${encodeURIComponent(query)}&per_page=100`

  while (url) {
    const data = await zdFetch(creds, url)
    allResults.push(...(data.results || []))
    url = data.next_page || null
    // Safety: cap at 1000 results to avoid excessive API calls
    if (allResults.length >= 1000) break
  }

  setCache(cacheKey, allResults)
  return allResults
}

export async function getTicketMetrics(creds, ticketId) {
  return zdFetch(creds, `/api/v2/tickets/${ticketId}/metrics.json`)
}

export async function getTicketFields(creds) {
  const cacheKey = 'ticket_fields'
  const cached = getCached(cacheKey)
  if (cached) return cached

  const data = await zdFetch(creds, '/api/v2/ticket_fields.json')
  setCache(cacheKey, data.ticket_fields)
  return data.ticket_fields
}

export async function getGroups(creds) {
  const cacheKey = 'groups'
  const cached = getCached(cacheKey)
  if (cached) return cached

  const data = await zdFetch(creds, '/api/v2/groups.json')
  const map = {}
  for (const g of data.groups) map[g.id] = g.name
  setCache(cacheKey, map)
  return map
}

export async function getUsers(creds, role = 'agent') {
  const cacheKey = `users:${role}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const data = await zdFetch(creds, `/api/v2/users.json?role=${role}&per_page=100`)
  const map = {}
  for (const u of data.users) map[u.id] = u.name
  setCache(cacheKey, map)
  return map
}

// ─── Date query builders ─────────────────────────────────────────────────────

function formatDate(d) {
  return d.toISOString().split('T')[0]
}

export function getDateRange(range) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (range) {
    case 'daily': {
      return { start: formatDate(today), end: formatDate(now), label: 'Today' }
    }
    case 'weekly': {
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      return { start: formatDate(weekStart), end: formatDate(now), label: 'This Week' }
    }
    case 'monthly': {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      return { start: formatDate(monthStart), end: formatDate(now), label: 'This Month' }
    }
    default:
      return { start: formatDate(today), end: formatDate(now), label: 'Today' }
  }
}

export function buildTicketQuery(range) {
  const { start, end } = getDateRange(range)
  return `type:ticket created>${start} created<${end}`
}

export function buildAllOpenQuery() {
  return 'type:ticket status<solved'
}
