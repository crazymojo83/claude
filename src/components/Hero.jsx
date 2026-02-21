function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <div className="hero-avatar">
          <img src="/avatar.jpg" alt="Steve Mojica" className="hero-avatar-img" />
        </div>

        <div className="hero-status">
          <span className="status-dot" />
          Building in Public
        </div>

        <h1 className="hero-name">Steve Mojica</h1>
        <p className="hero-title">
          <span>IT Professional</span> &middot; Network Administrator &middot; Coder
        </p>

        <p className="hero-bio">
          Dedicated to empowering K-12 education through technology. Documenting
          my journey building open-source tools, leading IT infrastructure, and
          exploring AI-driven workflows.
        </p>

        <div className="hero-links">
          <a href="#blog" className="hero-link hero-link--primary">
            &#128221; Read the Blog
          </a>
          <a href="#projects" className="hero-link hero-link--secondary">
            &#128193; Open Source Work
          </a>
          <a
            href="https://github.com/stevemojica"
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
