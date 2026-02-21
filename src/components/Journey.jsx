const TIMELINE = [
  {
    date: 'Mar 2022 — Present',
    title: 'Director of Information Technology @ Redlands Christian Schools',
    desc: 'Leading all aspects of IT operations for a multi-campus private school system. Driving infrastructure upgrades (2Gbps fiber links), strategic planning, strict cybersecurity protocols (MFA), and operational efficiency while mentoring a dedicated Tier 1–3 IT team within a Christ-centered culture.',
  },
  {
    date: 'Oct 2019 — Apr 2022',
    title: 'Lead IT Consultant @ California State Polytechnic University-Pomona',
    desc: 'Provided lead direction, SLA oversight, and Tier-3 technical support for professional staff and student assistants. Coordinated complex classroom technology deployments via SCCM and JAMF, and managed centralized campus control systems.',
  },
  {
    date: 'Jun 2017 — Oct 2019',
    title: 'Equipment Specialist II @ California State Polytechnic University-Pomona',
    desc: 'Delivered technical support, maintenance, and setup of advanced audio/visual presentation solutions and smart classroom environments. Configured computing environments and coordinated directly with faculty to quickly resolve presentation issues.',
  },
  {
    date: 'Mar 2015 — Jun 2017',
    title: 'Systems Support Technician @ Maranatha High School',
    desc: 'Provided one-on-one technology consultancy while deploying hardware, testing network servers, and resolving escalated support tickets. Managed AD deployments and audiovisual integrations across the campus.',
  },
  {
    date: 'Sep 2008 — Mar 2015',
    title: 'Support Desk Student Manager @ Azusa Pacific University',
    desc: 'Managed the university helpdesk operations and rigorous SLA thresholds. Architected internal knowledge bases via Confluence, administered critical systems, and managed hardware repairs across multiple regional centers.',
  },
  {
    date: 'Sep 2005 — Aug 2008',
    title: 'Support Tech I @ Azusa Pacific University',
    desc: 'Served as closing supervisor to a busy call center, managing a team of 4 employees and establishing foundational work knowledge bases for the university IT team.',
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
