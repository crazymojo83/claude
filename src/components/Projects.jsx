import ContribGraph from './ContribGraph'

const PROJECTS = [
  {
    name: 'claude-workflow-toolkit',
    desc: 'A collection of Claude AI prompts, templates, and automation scripts for IT teams. Streamlines code reviews, documentation generation, and incident response.',
    tech: ['Claude AI', 'Python', 'Bash'],
    badge: 'featured',
    stars: 42,
    forks: 12,
  },
  {
    name: 'infra-dashboard',
    desc: 'Real-time infrastructure monitoring dashboard built with React. Tracks server health, deployment status, and team velocity metrics.',
    tech: ['React', 'Node.js', 'Docker'],
    badge: 'featured',
    stars: 28,
    forks: 8,
  },
  {
    name: 'openclaw-contrib',
    desc: 'My contributions to the OpenClaw ecosystem — plugins, documentation improvements, and community tools that make legal tech more accessible.',
    tech: ['JavaScript', 'OpenClaw', 'API'],
    badge: 'wip',
    stars: 15,
    forks: 4,
  },
  {
    name: 'team-automator',
    desc: 'Automation framework for IT operations. Handles onboarding, access provisioning, and compliance reporting with minimal manual intervention.',
    tech: ['Python', 'Terraform', 'AWS'],
    badge: 'featured',
    stars: 35,
    forks: 10,
  },
  {
    name: 'ai-code-review-bot',
    desc: 'GitHub Action that uses Claude AI to perform intelligent code reviews on pull requests. Catches bugs, suggests improvements, and enforces team standards.',
    tech: ['GitHub Actions', 'Claude API', 'TypeScript'],
    badge: 'wip',
    stars: 19,
    forks: 6,
  },
  {
    name: 'leadership-metrics',
    desc: 'Dashboard for tracking engineering team health — DORA metrics, sprint velocity, and developer experience scores. Data-driven management.',
    tech: ['React', 'D3.js', 'PostgreSQL'],
    badge: null,
    stars: 11,
    forks: 3,
  },
]

function Projects() {
  return (
    <section className="section" id="projects">
      <div className="section-header">
        <div className="section-label">Projects</div>
        <h2 className="section-title">What I&apos;m Building</h2>
        <p className="section-subtitle">
          Open-source tools and projects at the intersection of leadership, AI,
          and engineering.
        </p>
      </div>

      <div className="projects-grid">
        {PROJECTS.map((p) => (
          <div className="project-card" key={p.name}>
            <div className="project-card-header">
              <span className="project-icon">&#128206;</span>
              {p.badge && (
                <span className={`project-badge project-badge--${p.badge}`}>
                  {p.badge === 'featured' ? 'Featured' : 'In Progress'}
                </span>
              )}
            </div>
            <div className="project-name">{p.name}</div>
            <div className="project-desc">{p.desc}</div>
            <div className="project-footer">
              <div className="project-tech">
                {p.tech.map((t) => (
                  <span className="tech-tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="project-stats">
                <span className="project-stat">&#9734; {p.stars}</span>
                <span className="project-stat">&#9906; {p.forks}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ContribGraph />
    </section>
  )
}

export default Projects
