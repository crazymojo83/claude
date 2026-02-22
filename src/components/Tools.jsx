import { Link } from 'react-router-dom'
import tools from '../tools/registry'

const CATEGORY_COLORS = {
  Content: { bg: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: 'rgba(56, 189, 248, 0.2)' },
  Productivity: { bg: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', border: 'rgba(74, 222, 128, 0.2)' },
  Development: { bg: 'rgba(167, 139, 250, 0.1)', color: '#a78bfa', border: 'rgba(167, 139, 250, 0.2)' },
  Data: { bg: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: 'rgba(251, 191, 36, 0.2)' },
}

function getCategoryStyle(category) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.Content
}

function ToolCard({ tool }) {
  const cat = getCategoryStyle(tool.category)
  return (
    <Link to={`/tools/${tool.slug}`} className="tool-card">
      <div className="tool-card-header">
        <span className="tool-card-category" style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.border}` }}>
          {tool.category}
        </span>
      </div>
      <h3 className="tool-card-name">{tool.name}</h3>
      <p className="tool-card-tagline">{tool.tagline}</p>
      <p className="tool-card-desc">{tool.description}</p>
      <div className="tool-card-footer">
        <span className="tool-card-link">
          View details &rarr;
        </span>
      </div>
    </Link>
  )
}

export default function Tools() {
  return (
    <div className="tools-page">
      <nav className="tools-nav">
        <Link to="/" className="back-link">&larr; Back to portfolio</Link>
      </nav>

      <div className="section-header">
        <div className="section-label">Tools & Artifacts</div>
        <h1 className="section-title">Built with Claude AI</h1>
        <p className="section-subtitle">
          Interactive tools you can use on-site or add to your own Claude account as artifacts.
        </p>
      </div>

      <div className="tools-grid">
        {tools.map(tool => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {tools.length === 1 && (
        <p className="tools-coming-soon">More tools coming soon.</p>
      )}
    </div>
  )
}
