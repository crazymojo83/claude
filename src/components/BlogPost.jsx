import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

// Custom lightweight YAML frontmatter parser
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
            if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
                value = value.slice(1, -1);
            }
            data[key] = value;
        }
    });

    return { data, content: markdown.slice(match[0].length).trim() };
}

function BlogPost() {
    const { id } = useParams();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPost = async () => {
            try {
                // Dynamically load all .md files as raw strings
                const markdownFiles = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default' });

                for (const path in markdownFiles) {
                    try {
                        const rawContent = await markdownFiles[path]();
                        const { data, content } = parseFrontmatter(rawContent);

                        const filenameSlug = path.split('/').pop().replace('.md', '');
                        const slug = data.slug || filenameSlug;

                        // Match against raw id or decoded id (for files with spaces)
                        if (slug === id || slug === decodeURIComponent(id)) {
                            setContent(content);
                            setLoading(false);
                            return;
                        }
                    } catch (innerErr) {
                        console.warn(`Skipping malformed post at ${path}:`, innerErr);
                    }
                }

                // If the loop finishes without returning, the ID wasn't found
                throw new Error('Post not found');
            } catch (err) {
                console.error(err);
                setError('Could not load the blog post. It may have been moved or deleted.');
                setLoading(false);
            }
        };

        loadPost();
    }, [id]);

    if (loading) {
        return (
            <div className="blog-post-page">
                <div className="blog-post-container loading-state">
                    Loading article...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="blog-post-page">
                <div className="blog-post-container error-state">
                    <h2>Oops!</h2>
                    <p>{error}</p>
                    <Link to="/" className="hero-link hero-link--secondary">
                        &larr; Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="blog-post-page">
            <nav className="blog-nav">
                <Link to="/" className="back-link">
                    &larr; Back
                </Link>
            </nav>
            <article className="blog-post-container">
                <ReactMarkdown className="markdown-body">
                    {String(content)}
                </ReactMarkdown>
            </article>
        </div>
    );
}

export default BlogPost;
