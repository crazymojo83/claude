import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getCredentials } from '../../services/zendeskApi'
import useZendeskData from '../../hooks/useZendeskData'
import ZendeskSettings from './ZendeskSettings'
import SummaryCards from './SummaryCards'
import TicketTrends from './TicketTrends'
import StatusChart from './StatusChart'
import PriorityChart from './PriorityChart'
import CategoryChart from './CategoryChart'
import GroupChart from './GroupChart'
import ChannelChart from './ChannelChart'
import HeatmapChart from './HeatmapChart'
import TicketTable from './TicketTable'

const TIME_RANGES = [
  { key: 'daily', label: 'Today' },
  { key: 'weekly', label: 'This Week' },
  { key: 'monthly', label: 'This Month' },
]

const REFRESH_OPTIONS = [
  { key: '5min', label: '5 min' },
  { key: '10min', label: '10 min' },
  { key: '15min', label: '15 min' },
  { key: '30min', label: '30 min' },
  { key: 'off', label: 'Off' },
]

export default function ZendeskDashboard() {
  const [showSettings, setShowSettings] = useState(!getCredentials())
  const [timeRange, setTimeRange] = useState('daily')
  const [refreshInterval, setRefreshInterval] = useState('5min')
  const { data, loading, error, refresh, lastUpdated, rateLimits } = useZendeskData(timeRange, refreshInterval)

  const creds = getCredentials()

  if (showSettings && !creds) {
    return (
      <div className="zendesk-dashboard">
        <nav className="tools-nav">
          <Link to="/tools" className="back-link">&larr; Back to tools</Link>
        </nav>
        <ZendeskSettings onConnected={() => setShowSettings(false)} />
      </div>
    )
  }

  return (
    <div className="zendesk-dashboard">
      {/* Settings modal overlay */}
      {showSettings && (
        <ZendeskSettings
          onConnected={() => setShowSettings(false)}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Header */}
      <header className="zd-header">
        <div className="zd-header-left">
          <Link to="/tools" className="back-link">&larr; Tools</Link>
          <h1 className="zd-title">Zendesk Dashboard</h1>
          {refreshInterval !== 'off' && (
            <span className="zd-live-indicator">
              <span className="zd-live-dot" />
              Live
            </span>
          )}
        </div>

        <div className="zd-header-center">
          <div className="zd-time-range">
            {TIME_RANGES.map(tr => (
              <button
                key={tr.key}
                className={`zd-range-btn ${timeRange === tr.key ? 'active' : ''}`}
                onClick={() => setTimeRange(tr.key)}
              >
                {tr.label}
              </button>
            ))}
          </div>
        </div>

        <div className="zd-header-right">
          {rateLimits.remaining != null && (
            <span className="zd-rate-badge" title="Zendesk API calls remaining">
              API: {rateLimits.remaining}/{rateLimits.limit}
            </span>
          )}
          <select
            className="zd-refresh-select"
            value={refreshInterval}
            onChange={e => setRefreshInterval(e.target.value)}
            title="Auto-refresh interval"
          >
            {REFRESH_OPTIONS.map(o => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
          <button className="zd-btn zd-btn-icon" onClick={refresh} disabled={loading} title="Refresh now">
            {loading ? '\u27F3' : '\u21BB'}
          </button>
          <button className="zd-btn zd-btn-icon" onClick={() => setShowSettings(true)} title="Settings">
            \u2699
          </button>
        </div>
      </header>

      {/* Last updated */}
      {lastUpdated && (
        <div className="zd-last-updated">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="zd-error-banner">
          {error}
          <button onClick={refresh}>Retry</button>
        </div>
      )}

      {/* Loading state */}
      {loading && !data && (
        <div className="zd-loading">
          <div className="zd-spinner" />
          <p>Loading ticket data...</p>
        </div>
      )}

      {/* Dashboard content */}
      {data && (
        <div className="zd-content">
          <SummaryCards summary={data.summary} />

          <div className="zd-charts-grid">
            <TicketTrends data={data.trends} />
            <StatusChart data={data.byStatus} />
            <PriorityChart data={data.byPriority} />
            <ChannelChart data={data.byChannel} />
          </div>

          <CategoryChart data={data.byTags} />
          <GroupChart byGroup={data.byGroup} byAssignee={data.byAssignee} />
          <HeatmapChart data={data.heatmap} />
          <TicketTable tickets={data.recentTickets} subdomain={creds?.subdomain} />
        </div>
      )}
    </div>
  )
}
