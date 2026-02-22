import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Custom lightweight YAML frontmatter parser for the browser 
function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { data: {}, content: markdown };

  const yamlString = match[1];
  const data = {};
  yamlString.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove quotes if present
      if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  });

  return { data, content: markdown.slice(match[0].length).trim() };
}

function Blog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState({});
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    // Dynamically load all .md files in the src/posts directory as raw text strings
    const markdownFiles = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default' });

    const fetchPosts = async () => {
      const postsArray = [];
      const categoryCounts = {};

      for (const path in markdownFiles) {
        try {
          // Execute the loader function to get the raw module text
          const rawContent = await markdownFiles[path]();

          // Parse the YAML frontmatter using our browser-safe custom parser
          const { data } = parseFrontmatter(rawContent);

          // We ensure a 'slug' exists. If it isn't in frontmatter, we extract it from the filename
          const filenameSlug = path.split('/').pop().replace('.md', '');
          const slug = data.slug || filenameSlug;

          // Push valid posts
          if (data.title) {
            const cat = data.category ? data.category.toLowerCase() : 'other';
            const label = data.label || cat;

            postsArray.push({
              slug,
              category: cat,
              label: label,
              date: data.date || '',
              readTime: data.readTime || '',
              title: data.title,
              excerpt: data.excerpt || '',
            });

            // Count the categories
            if (categoryCounts[label]) {
              categoryCounts[label].count += 1;
            } else {
              categoryCounts[label] = { count: 1, rawCategory: cat };
            }
          }
        } catch (err) {
          console.error(`Failed to process markdown file ${path}:`, err)
        }
      }

      // Sort by date or whatever criteria you'd like (here we just reverse so newest is likely first based on reads)
      setPosts(postsArray.reverse());
      setCategories(categoryCounts);
    };

    fetchPosts();
  }, []);

  // Filter posts based on active state
  const displayedPosts = activeFilter === 'All'
    ? posts
    : posts.filter(post => post.label === activeFilter);

  // Helper function to safely apply category classes, defaulting if unknown
  const getCategoryClass = (cat) => {
    // Array of officially supported CSS category colors
    const supportedClasses = ['leadership', 'coding', 'ai', 'management', 'openclaw', 'networking'];
    return supportedClasses.includes(cat) ? `blog-category--${cat}` : `blog-category--default`;
  };

  return (
    <section className="section" id="blog">
      <div className="section-header">
        <div className="section-label">The Blog</div>
        <h2 className="section-title">Documenting the Journey</h2>
        <p className="section-subtitle">
          Thoughts on coding, open-source work, AI, and professional IT life.
        </p>
        <a
          href="/feed.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="rss-link"
          title="Subscribe via RSS"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="6.18" cy="17.82" r="2.18"/>
            <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/>
          </svg>
          RSS Feed
        </a>
      </div>

      {/* Dynamic Tag Filter Bar */}
      {Object.keys(categories).length > 0 && (
        <div className="blog-filter-bar">
          <button
            className={`blog-filter-btn ${activeFilter === 'All' ? 'active' : ''}`}
            onClick={() => setActiveFilter('All')}
          >
            All <span className="blog-filter-count">{posts.length}</span>
          </button>

          {Object.entries(categories).map(([label, info]) => (
            <button
              key={label}
              className={`blog-filter-btn ${activeFilter === label ? 'active' : ''}`}
              onClick={() => setActiveFilter(activeFilter === label ? 'All' : label)}
            >
              {label} <span className="blog-filter-count">{info.count}</span>
            </button>
          ))}
        </div>
      )}

      <div className="blog-grid">
        {displayedPosts.map((post) => (
          <Link to={`/post/${post.slug}`} key={post.slug} style={{ textDecoration: 'none', color: 'inherit' }}>
            <article className="blog-card">
              <div className="blog-card-meta">
                <span className={`blog-category ${getCategoryClass(post.category)}`}>
                  {post.label}
                </span>
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="blog-card-title">{post.title}</h3>
              <p className="blog-excerpt">{post.excerpt}</p>
              <span className="blog-read-more">
                Read more &rarr;
              </span>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Blog
