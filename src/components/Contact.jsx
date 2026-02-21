import { useEffect } from 'react';

function Contact() {
  useEffect(() => {
    // If the window object already has twttr, instruct it to parse the new anchors
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    } else {
      // Otherwise inject the script. Wait for it to load to parse the embedded timeline.
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charSet = "utf-8";
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

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
            &#9993; Email
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

        {/* Side-by-Side Social Media Previews */}
        <div className="social-embeds-grid">
          {/* Threads Custom Block (Pending Official Meta Widget API) */}
          <div className="embed-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', textAlign: 'center', minHeight: '400px' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Latest on Threads</h3>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Join the conversation on AI agents, homelab infrastructure, and technology leadership.
              </p>
              <a
                href="https://www.threads.com/@stevemojica?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
                style={{ margin: '0 auto' }}
              >
                &#128172; Follow on Threads
              </a>
            </div>
          </div>

          {/* Twitter (X) Official Embed */}
          <div className="embed-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', textAlign: 'center', minHeight: '400px' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Latest on X</h3>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', width: '100%', overflow: 'hidden' }}>
              <a
                className="twitter-timeline"
                data-theme="dark"
                data-height="400"
                href="https://twitter.com/stevemojica?ref_src=twsrc%5Etfw"
              >
                Tweets by stevemojica
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
