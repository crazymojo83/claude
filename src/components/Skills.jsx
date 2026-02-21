const CATEGORIES = [
  {
    icon: '&#128187;',
    name: 'Languages & Frameworks',
    skills: ['JavaScript', 'TypeScript', 'Python', 'React', 'Node.js', 'Bash', 'SQL', 'HTML/CSS'],
  },
  {
    icon: '&#9729;',
    name: 'Cloud & Infrastructure',
    skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'Networking'],
  },
  {
    icon: '&#129302;',
    name: 'AI & Automation',
    skills: ['Claude AI', 'Claude Code', 'Prompt Engineering', 'GitHub Copilot', 'LLM APIs', 'Workflow Automation'],
  },
  {
    icon: '&#128188;',
    name: 'Leadership & Management',
    skills: ['Strategic Planning', 'Team Building', 'Budget Management', 'Vendor Relations', 'Agile/Scrum', 'ITIL'],
  },
  {
    icon: '&#128736;',
    name: 'DevOps & Tools',
    skills: ['Git', 'GitHub Actions', 'Jenkins', 'Datadog', 'Jira', 'Confluence', 'VS Code', 'Vim'],
  },
  {
    icon: '&#128274;',
    name: 'Security & Compliance',
    skills: ['Zero Trust', 'SOC 2', 'HIPAA', 'Incident Response', 'Pen Testing', 'SSO/SAML'],
  },
]

function Skills() {
  return (
    <section className="section" id="skills">
      <div className="section-header">
        <div className="section-label">Skills &amp; Expertise</div>
        <h2 className="section-title">Technical Toolkit</h2>
        <p className="section-subtitle">
          A blend of hands-on technical skills and executive leadership capabilities.
        </p>
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
                <span className="skill-tag" key={s}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills
