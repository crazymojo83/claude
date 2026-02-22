import { useEffect, useRef, useState } from 'react';

function Contact() {
  const embedRef = useRef(null);
  const [embedFailed, setEmbedFailed] = useState(false);

  useEffect(() => {
    const container = embedRef.current;
    if (!container) return;

    let timeoutId;

    function processEmbed() {
      if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load(container);
      }
    }

    // Show fallback if iframe never appears after 15 seconds
    timeoutId = setTimeout(() => {
      if (container && !container.querySelector('iframe')) {
        setEmbedFailed(true);
      }
    }, 15000);

    // Script already loaded (e.g. navigating back to this page)
    if (window.twttr && window.twttr.widgets) {
      processEmbed();
      return () => clearTimeout(timeoutId);
    }

    // First visit: set up twttr ready queue, then inject the script
    window.twttr = window.twttr || {};
    if (!window.twttr.ready) {
      window.twttr._e = window.twttr._e || [];
      window.twttr.ready = function (f) { this._e.push(f); };
    }
    window.twttr.ready(() => {
      processEmbed();
      clearTimeout(timeoutId);
    });

    if (!document.getElementById('twitter-wjs')) {
      const script = document.createElement('script');
      script.id = 'twitter-wjs';
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      script.onerror = () => setEmbedFailed(true);
      document.body.appendChild(script);
    }

    return () => clearTimeout(timeoutId);
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
              {embedFailed ? (
                <div style={{ padding: '2rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  <p style={{ marginBottom: '1rem' }}>Timeline could not be loaded.</p>
                  <a
                    href="https://x.com/SteveMojica"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                    style={{ display: 'inline-block' }}
                  >
                    &#128172; Follow @SteveMojica on X
                  </a>
                </div>
              ) : (
                <a
                  className="twitter-timeline"
                  data-theme="dark"
                  data-height="500"
                  href="https://twitter.com/SteveMojica?ref_src=twsrc%5Etfw"
                >
                  Tweets by SteveMojica
                </a>
              )}
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
