const DOMAINS = {
  infra: { label: 'IT & Infrastructure', colorClass: 'domain-infra' },
  ai: { label: 'AI & Machine Learning', colorClass: 'domain-ai' },
  dev: { label: 'Software Engineering', colorClass: 'domain-dev' },
  mgmt: { label: 'Leadership & Strategy', colorClass: 'domain-mgmt' }
};

const CATEGORIES = [
  {
    icon: '&#128421;', // Desktop computer
    name: 'Infrastructure & Engineering',
    skills: [
      { name: '2Gbps Fiber Backbones', domains: ['infra', 'mgmt'] },
      { name: 'Wi-Fi Optimization (Bridge Links)', domains: ['infra'] },
      { name: 'Server Maintenance', domains: ['infra'] },
      { name: 'Hardware Deployment', domains: ['infra'] },
    ],
  },
  {
    icon: '&#129302;', // Robot
    name: 'AI & Local Automation',
    skills: [
      { name: 'Local LLM Hosting (Ollama)', domains: ['infra', 'ai'] },
      { name: 'Claude AI / Claude Code', domains: ['ai', 'dev'] },
      { name: 'OpenClaw Integrations', domains: ['ai', 'dev'] },
      { name: 'Workflow Automation', domains: ['infra', 'dev', 'ai'] },
    ],
  },
  {
    icon: '&#128736;', // Tools
    name: 'Device & Systems Management',
    skills: [
      { name: 'JAMF (Apple MDM)', domains: ['infra'] },
      { name: 'Microsoft SCCM', domains: ['infra'] },
      { name: 'Extron GVE (A/V Layouts)', domains: ['infra'] },
      { name: 'Active Directory / Entra', domains: ['infra', 'mgmt'] },
      { name: 'Google Workspace', domains: ['infra', 'mgmt'] },
    ],
  },
  {
    icon: '&#128274;', // Lock
    name: 'Cybersecurity & Compliance',
    skills: [
      { name: 'Enterprise 2FA/MFA Rollouts', domains: ['infra', 'mgmt'] },
      { name: 'Systems Access Control', domains: ['infra'] },
      { name: 'Security Protocol Development', domains: ['mgmt', 'infra'] },
      { name: 'Staff Training', domains: ['mgmt'] },
    ],
  },
  {
    icon: '&#128187;', // Laptop
    name: 'Software Engineering',
    skills: [
      { name: 'React.js (Vite)', domains: ['dev'] },
      { name: 'Node.js', domains: ['dev'] },
      { name: 'JavaScript / API Integrations', domains: ['dev'] },
      { name: 'Markdown CMS Architecting', domains: ['dev', 'infra'] },
    ],
  },
  {
    icon: '&#128188;', // Briefcase
    name: 'Leadership & IT Strategy',
    skills: [
      { name: 'Staff Management & Team Building', domains: ['mgmt'] },
      { name: 'Strategic Budgeting & Planning', domains: ['mgmt'] },
      { name: 'Tier 1-3 Support Mentorship', domains: ['mgmt', 'infra'] },
      { name: 'SLA Development & Ticketing', domains: ['mgmt'] },
      { name: 'Vendor Relations & Procurement', domains: ['mgmt'] },
    ],
  },
]

function Skills() {
  return (
    <section className="section" id="skills">
      <div className="section-header">
        <div className="section-label">Skills &amp; Expertise</div>
        <h2 className="section-title">Technical Toolkit</h2>
        <p className="section-subtitle">
          An authentic mapping of the technologies I deploy, manage, and build with. Note the color-coded dots representing cross-domain overlap.
        </p>
      </div>

      {/* The Domain Legend */}
      <div className="domain-legend">
        {Object.entries(DOMAINS).map(([key, domain]) => (
          <div className="legend-item" key={key}>
            <span className={`domain-dot ${domain.colorClass}`}></span>
            {domain.label}
          </div>
        ))}
      </div>

      <div className="skills-grid">
        {CATEGORIES.map((cat) => (
          <div className="skill-category" key={cat.name}>
            <div className="skill-category-header">
              <span
                className="skill-category-icon"
                dangerouslySetInnerHTML={{ __html: cat.icon }}
              />
              <span className="skill-category-name">{cat.name}</span>
            </div>

            <div className="skill-list">
              {cat.skills.map((s) => (
                <div className="skill-tag" key={s.name}>
                  {/* Render the mapped domain dots for cross-discipline indication */}
                  <div className="domain-dots-container">
                    {s.domains && s.domains.map(domainKey => (
                      <span
                        key={domainKey}
                        className={`domain-dot ${DOMAINS[domainKey]?.colorClass}`}
                        title={DOMAINS[domainKey]?.label}
                      ></span>
                    ))}
                  </div>
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills
