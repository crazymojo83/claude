import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import tools from '../tools/social-post-generator'

export default function ToolDetail() {
  const { slug } = useParams()
  const tool = tools.find(t => t.slug === slug)

  if (!tool) {
    return (
      <div className="tool-detail-page">
        <nav className="tools-nav">
          <Link to="/tools" className="back-link">&larr; Back to tools</Link>
        </nav>
        <div className="tool-detail-container error-state">
          <h2>Tool not found</h2>
          <p>No tool matches "{slug}".</p>
        </div>
      </div>
    )
  }

  return (
    <div className="tool-detail-page">
      <nav className="tools-nav">
        <Link to="/tools" className="back-link">&larr; Back to tools</Link>
      </nav>

      <div className="tool-detail-header">
        <h1 className="tool-detail-name">{tool.name}</h1>
        <p className="tool-detail-tagline">{tool.tagline}</p>
        <Link to={`/${tool.slug === 'social-post-generator' ? 'social' : tool.slug === 'zendesk-dashboard' ? 'zendesk' : `tools/${tool.slug}/app`}`} className="tool-detail-launch">
          Launch Tool &rarr;
        </Link>
      </div>

      <div className="tool-detail-body">
        {/* Features */}
        <section className="tool-detail-section">
          <h2 className="tool-detail-section-title">Features</h2>
          <ul className="tool-detail-features">
            {tool.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </section>

        {/* Usage / How to Use */}
        <section className="tool-detail-section">
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{tool.usage}</ReactMarkdown>
          </div>
        </section>

        {/* Add to Claude */}
        <section className="tool-detail-section">
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{tool.claudeInstructions}</ReactMarkdown>
          </div>
        </section>
      </div>
    </div>
  )
}
