function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <div className="hero-avatar">&#128187;</div>

        <div className="hero-status">
          <span className="status-dot" />
          Available for collaboration
        </div>

        <h1 className="hero-name">Your Name</h1>
        <p className="hero-title">
          <span>IT Director</span> &middot; Developer &middot; Technology Leader
        </p>

        <p className="hero-bio">
          Building bridges between leadership and code. Passionate about
          empowering teams through technology, exploring AI-driven workflows
          with Claude, and contributing to the OpenClaw community.
        </p>

        <div className="hero-links">
          <a href="#projects" className="hero-link hero-link--primary">
            &#128193; View Projects
          </a>
          <a href="#blog" className="hero-link hero-link--secondary">
            &#128221; Read My Thoughts
          </a>
          <a
            href="https://github.com/your-username"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-link hero-link--secondary"
          >
            &#128279; GitHub
          </a>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">15+</div>
            <div className="hero-stat-label">Years in IT</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">50+</div>
            <div className="hero-stat-label">Projects Delivered</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">20+</div>
            <div className="hero-stat-label">Team Members Led</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">&#9734;</div>
            <div className="hero-stat-label">Open Source</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
