import { useState } from 'react'
import { Link } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Thoughts', href: '#blog' },
  { label: 'Journey', href: '#journey' },
  { label: 'Tools', href: '/tools', isRoute: true },
  { label: 'Contact', href: '#contact' },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#" className="nav-logo">
          <span className="nav-logo-icon">&lt;/&gt;</span>
          portfolio
        </a>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              {item.isRoute ? (
                <Link to={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              ) : (
                <a href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? '\u2715' : '\u2630'}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
