import { useState } from 'react'
import { getCredentials, saveCredentials, clearCredentials, testConnection } from '../../services/zendeskApi'

export default function ZendeskSettings({ onConnected, onClose }) {
  const existing = getCredentials()
  const [subdomain, setSubdomain] = useState(existing?.subdomain || '')
  const [email, setEmail] = useState(existing?.email || '')
  const [apiToken, setApiToken] = useState(existing?.apiToken || '')
  const [testing, setTesting] = useState(false)
  const [status, setStatus] = useState(null) // { type: 'success'|'error', message }

  async function handleTest(e) {
    e.preventDefault()
    if (!subdomain || !email || !apiToken) {
      setStatus({ type: 'error', message: 'All fields are required.' })
      return
    }

    setTesting(true)
    setStatus(null)

    try {
      const creds = { subdomain: subdomain.trim(), email: email.trim(), apiToken: apiToken.trim() }
      const user = await testConnection(creds)
      saveCredentials(creds)
      setStatus({ type: 'success', message: `Connected as ${user.name} (${user.email})` })
      setTimeout(() => onConnected?.(), 1200)
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setTesting(false)
    }
  }

  function handleDisconnect() {
    clearCredentials()
    setSubdomain('')
    setEmail('')
    setApiToken('')
    setStatus(null)
    onConnected?.()
  }

  return (
    <div className="zd-settings-overlay">
      <div className="zd-settings-panel">
        <div className="zd-settings-header">
          <h2>Zendesk Connection</h2>
          {onClose && (
            <button className="zd-settings-close" onClick={onClose} aria-label="Close">&times;</button>
          )}
        </div>

        <form onSubmit={handleTest} className="zd-settings-form">
          <div className="zd-field">
            <label htmlFor="zd-subdomain">Subdomain</label>
            <div className="zd-input-wrap">
              <input
                id="zd-subdomain"
                type="text"
                value={subdomain}
                onChange={e => setSubdomain(e.target.value)}
                placeholder="yourcompany"
              />
              <span className="zd-input-suffix">.zendesk.com</span>
            </div>
          </div>

          <div className="zd-field">
            <label htmlFor="zd-email">Email</label>
            <input
              id="zd-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>

          <div className="zd-field">
            <label htmlFor="zd-token">API Token</label>
            <input
              id="zd-token"
              type="password"
              value={apiToken}
              onChange={e => setApiToken(e.target.value)}
              placeholder="Your Zendesk API token"
            />
          </div>

          {status && (
            <div className={`zd-status zd-status-${status.type}`}>
              {status.type === 'success' ? '\u2713' : '\u2717'} {status.message}
            </div>
          )}

          <div className="zd-settings-actions">
            <button type="submit" className="zd-btn zd-btn-primary" disabled={testing}>
              {testing ? 'Testing...' : 'Test & Connect'}
            </button>
            {existing && (
              <button type="button" className="zd-btn zd-btn-danger" onClick={handleDisconnect}>
                Disconnect
              </button>
            )}
          </div>
        </form>

        <div className="zd-settings-help">
          <h4>Setup Instructions</h4>
          <ol>
            <li>Go to Zendesk Admin Center &rarr; Apps &amp; Integrations &rarr; APIs &rarr; Zendesk API</li>
            <li>Enable Token Access and create a new API token</li>
            <li>To enable CORS: Admin Center &rarr; Account &rarr; Security &rarr; add your site origin</li>
          </ol>
          <p className="zd-settings-note">
            Credentials are stored in your browser&apos;s localStorage. They never leave your device.
          </p>
        </div>
      </div>
    </div>
  )
}
