import { useState, useEffect } from 'react'
import ContribGraph from './ContribGraph'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // We are pulling from the user stevemojica
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/users/stevemojica/repos?sort=updated&per_page=6'
        )
        if (!response.ok) {
          throw new Error('Failed to fetch repositories')
        }
        const data = await response.json()
        setProjects(data)
      } catch (err) {
        console.error(err)
        setError('Could not load GitHub projects at this time.')
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [])

  return (
    <section className="section" id="projects">
      <div className="section-header">
        <div className="section-label">Open Source</div>
        <h2 className="section-title">GitHub Portfolio</h2>
        <p className="section-subtitle">
          A showcase of my open-source tools, contributions, and personal projects.
        </p>
      </div>

      {loading && (
        <div className="section-subtitle" style={{ textAlign: 'center', marginTop: '2rem' }}>
          Loading repositories from GitHub...
        </div>
      )}

      {error && (
        <div className="section-subtitle error-state" style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--accent)' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="projects-grid">
          {projects.map((repo) => (
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card"
              key={repo.id}
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
            >
              <div className="project-card-header">
                <span className="project-icon">&#128206;</span>
                {/* Dynamically assign a Featured badge if it has a decent amount of stars, otherwise just note it is public */}
                <span className={`project-badge project-badge--${repo.stargazers_count > 5 ? 'featured' : 'public'}`}>
                  {repo.stargazers_count > 5 ? 'Featured' : 'Public'}
                </span>
              </div>
              <div className="project-name" style={{ overflowWrap: 'break-word' }}>{repo.name}</div>
              <div className="project-desc" style={{ flexGrow: 1 }}>
                {repo.description || 'No description provided on GitHub.'}
              </div>
              <div className="project-footer">
                <div className="project-tech">
                  {repo.language && (
                    <span className="tech-tag">
                      {repo.language}
                    </span>
                  )}
                </div>
                <div className="project-stats">
                  <span className="project-stat">&#9734; {repo.stargazers_count}</span>
                  <span className="project-stat">&#9906; {repo.forks_count}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      <ContribGraph />
    </section>
  )
}

export default Projects
