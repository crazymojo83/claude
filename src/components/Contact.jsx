import { useEffect, useRef } from 'react';

function Contact() {
  const embedRef = useRef(null);

  useEffect(() => {
    // Twitter's widgets.js (loaded in index.html) may fire before React
    // renders this component. Poll briefly then trigger a re-scan.
    let attempts = 0;
    const maxAttempts = 20; // 10 seconds max
    const interval = setInterval(() => {
      attempts++;
      if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load(embedRef.current);
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
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
            href="https://github.com/stevemojica"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            &#128187; GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/stevenmojica/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            &#128188; LinkedIn
          </a>
          <a
            href="mailto:stevemojica@users.noreply.github.com"
            className="contact-link"
          >
            &#128231; Email
          </a>
          <a
            href="https://twitter.com/stevemojica"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            &#128172; Twitter / X
          </a>
          <a
            href="https://www.threads.com/@stevemojica?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            &#128172; Threads
          </a>
        </div>

        {/* Centered Social Media Embed (X / Twitter) */}
        <div className="social-embed-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
          <div className="embed-card hoverable-embed" style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Latest on X</h3>
            <div
              ref={embedRef}
              className="embed-inner"
              style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', transition: 'all var(--transition)', overflow: 'auto' }}
            >
              <a
                className="twitter-timeline"
                data-theme="dark"
                data-height="500"
                data-width="100%"
                href="https://twitter.com/SteveMojica?ref_src=twsrc%5Etfw"
              >
                Tweets by SteveMojica
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div>&copy; {new Date().getFullYear()} Steve Mojica. All rights reserved.</div>
        <div className="footer-built-with">
          Built with React + Vite &middot; Powered by Claude AI
        </div>
      </footer>
    </>
  )
}

export default Contact
