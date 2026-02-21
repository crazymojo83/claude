const POSTS = [
  {
    category: 'leadership',
    label: 'Leadership',
    date: 'Feb 2026',
    readTime: '6 min read',
    title: 'Why IT Directors Should Still Write Code',
    excerpt:
      'The gap between technical leadership and hands-on engineering is growing. Here\'s why staying close to the code makes you a better director — and how to find the time for it.',
  },
  {
    category: 'ai',
    label: 'Claude AI',
    date: 'Jan 2026',
    readTime: '8 min read',
    title: 'My Claude Code Workflow: From Idea to Production',
    excerpt:
      'How I use Claude AI as a force multiplier for development. Real examples of prompts, workflows, and the surprising ways AI has changed how I think about code architecture.',
  },
  {
    category: 'management',
    label: 'Management',
    date: 'Jan 2026',
    readTime: '5 min read',
    title: 'Building Engineering Teams That Actually Ship',
    excerpt:
      'Forget the frameworks and methodologies for a moment. Here\'s what actually matters when building a high-performing engineering team — trust, clarity, and removing blockers.',
  },
  {
    category: 'openclaw',
    label: 'OpenClaw',
    date: 'Dec 2025',
    readTime: '7 min read',
    title: 'My OpenClaw Journey: Contributing to Open-Source Legal Tech',
    excerpt:
      'How I got involved with OpenClaw, what I\'ve learned about open-source contribution, and why legal tech is one of the most exciting frontiers in software development.',
  },
  {
    category: 'coding',
    label: 'Coding',
    date: 'Nov 2025',
    readTime: '4 min read',
    title: 'React in 2026: What I\'m Excited About',
    excerpt:
      'Server components, the new compiler, and React 19 patterns that are changing how we build apps. A practitioner\'s perspective from someone shipping React in production.',
  },
  {
    category: 'ai',
    label: 'Claude AI',
    date: 'Oct 2025',
    readTime: '10 min read',
    title: 'AI-Assisted Code Review: A Practical Guide for Teams',
    excerpt:
      'Setting up Claude AI as part of your team\'s code review process. Includes prompts, GitHub Action configs, and lessons learned from six months of AI-augmented reviews.',
  },
]

function Blog() {
  return (
    <section className="section" id="blog">
      <div className="section-header">
        <div className="section-label">Thoughts &amp; Writing</div>
        <h2 className="section-title">From the Terminal</h2>
        <p className="section-subtitle">
          Reflections on leadership, coding, AI, and the OpenClaw community.
        </p>
      </div>

      <div className="blog-grid">
        {POSTS.map((post) => (
          <article className="blog-card" key={post.title}>
            <div className="blog-card-meta">
              <span className={`blog-category blog-category--${post.category}`}>
                {post.label}
              </span>
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>
            <h3 className="blog-title">{post.title}</h3>
            <p className="blog-excerpt">{post.excerpt}</p>
            <span className="blog-read-more">
              Read more &rarr;
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Blog
