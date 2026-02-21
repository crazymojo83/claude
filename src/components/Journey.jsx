const TIMELINE = [
  {
    date: '2026 — Present',
    title: 'AI-Augmented Leadership',
    desc: 'Integrating Claude AI across team workflows. Building open-source tools for AI-assisted development and sharing the playbook with the community.',
  },
  {
    date: '2024 — 2025',
    title: 'OpenClaw Contributor',
    desc: 'Discovered OpenClaw and began contributing plugins, documentation, and community tools. Found a passionate community at the intersection of law and code.',
  },
  {
    date: '2022 — 2024',
    title: 'IT Director',
    desc: 'Stepped into a director role overseeing infrastructure, security, and application development. Led cloud migration and modernized the engineering culture.',
  },
  {
    date: '2018 — 2022',
    title: 'Senior IT Manager',
    desc: 'Managed cross-functional teams, delivered major platform initiatives, and established DevOps practices across the organization.',
  },
  {
    date: '2014 — 2018',
    title: 'Systems Engineer & Team Lead',
    desc: 'Hands-on infrastructure and development work. Built automation frameworks, managed production systems, and started leading small teams.',
  },
  {
    date: '2010 — 2014',
    title: 'The Beginning',
    desc: 'Started in IT support, quickly moved into systems administration and development. Fell in love with solving problems through code.',
  },
]

function Journey() {
  return (
    <section className="section" id="journey">
      <div className="section-header">
        <div className="section-label">Career Journey</div>
        <h2 className="section-title">The Path So Far</h2>
        <p className="section-subtitle">
          From help desk to the director&apos;s chair — with plenty of code along the way.
        </p>
      </div>

      <div className="timeline">
        {TIMELINE.map((item) => (
          <div className="timeline-item" key={item.date}>
            <div className="timeline-date">{item.date}</div>
            <div className="timeline-title">{item.title}</div>
            <div className="timeline-desc">{item.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Journey
