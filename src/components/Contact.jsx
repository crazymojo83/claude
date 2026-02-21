function Contact() {
  return (
    <>
      <div className="divider" />
      <section className="contact-section" id="contact">
        <div className="section-label" style={{ justifyContent: 'center' }}>
          Get In Touch
        </div>
        <h2 className="section-title" style={{ textAlign: 'center' }}>
          Let&apos;s Connect
        </h2>
        <p
          className="section-subtitle"
          style={{ textAlign: 'center', margin: '0.5rem auto 0' }}
        >
          Whether it&apos;s about technology leadership, open source, or Claude AI
          &mdash; I&apos;m always up for a conversation.
        </p>

        <div className="contact-links">
          <a
            href="https://github.com/your-username"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            &#128187; GitHub
          </a>
          <a
            href="https://linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            &#128188; LinkedIn
          </a>
          <a
            href="mailto:your.email@example.com"
            className="contact-link"
          >
            &#9993; Email
          </a>
          <a
            href="https://twitter.com/your-handle"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            &#128172; Twitter / X
          </a>
        </div>
      </section>

      <footer className="footer">
        <div>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</div>
        <div className="footer-built-with">
          Built with React + Vite &middot; Powered by Claude AI
        </div>
      </footer>
    </>
  )
}

export default Contact
