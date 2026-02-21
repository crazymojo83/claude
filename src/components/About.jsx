const HIGHLIGHTS = [
  {
    icon: '&#127919;',
    colorClass: 'highlight-icon--blue',
    title: 'IT Leadership',
    desc: 'Directing technology strategy, infrastructure, and digital transformation initiatives across the organization.',
  },
  {
    icon: '&#128187;',
    colorClass: 'highlight-icon--green',
    title: 'Hands-On Coding',
    desc: 'Still writing code daily — from automation scripts to full-stack applications. Leaders who code make better decisions.',
  },
  {
    icon: '&#129302;',
    colorClass: 'highlight-icon--purple',
    title: 'Claude AI Integration',
    desc: 'Leveraging Claude AI for development workflows, code review, documentation, and team productivity.',
  },
  {
    icon: '&#128640;',
    colorClass: 'highlight-icon--orange',
    title: 'OpenClaw Contributor',
    desc: 'Active in the OpenClaw community — building tools, sharing knowledge, and pushing open-source forward.',
  },
]

function About() {
  return (
    <section className="section" id="about">
      <div className="section-header">
        <div className="section-label">About Me</div>
        <h2 className="section-title">Director by Day, Developer by Night</h2>
        <p className="section-subtitle">
          Where strategic leadership meets hands-on engineering.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-text">
          <p>
            I&apos;m an <strong>IT Director</strong> who never stopped coding. While my
            day-to-day involves steering technology roadmaps, managing teams, and
            aligning IT strategy with business goals, I stay deeply connected to
            the craft of software development.
          </p>
          <p>
            I believe the best technology leaders are the ones who can still read
            a pull request, debug a production issue, and understand the
            challenges their teams face. That&apos;s why I keep my skills sharp — from{' '}
            <strong>React and Python</strong> to <strong>cloud infrastructure</strong> and{' '}
            <strong>AI-assisted development</strong>.
          </p>
          <p>
            My journey with <strong>Claude AI</strong> has transformed how I
            approach both coding and leadership. From using Claude Code for rapid
            prototyping to leveraging AI for strategic documentation,
            I&apos;m building the playbook for how IT leaders can amplify their
            impact with AI tools.
          </p>
        </div>

        <div className="about-highlights">
          {HIGHLIGHTS.map((h) => (
            <div className="highlight-card" key={h.title}>
              <div
                className={`highlight-icon ${h.colorClass}`}
                dangerouslySetInnerHTML={{ __html: h.icon }}
              />
              <div>
                <div className="highlight-title">{h.title}</div>
                <div className="highlight-desc">{h.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
