const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://stevemojica.github.io';
const SITE_TITLE = 'Steve Mojica | Blog & Portfolio';
const SITE_DESCRIPTION =
  'Thoughts on coding, open-source work, AI, and professional IT life.';

// Same lightweight YAML parser used in the browser (Blog.jsx)
function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { data: {}, content: markdown };

  const yamlString = match[1];
  const data = {};
  yamlString.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if (
        (value.startsWith("'") && value.endsWith("'")) ||
        (value.startsWith('"') && value.endsWith('"'))
      ) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  });

  return { data, content: markdown.slice(match[0].length).trim() };
}

// Convert friendly dates like "Feb 2026" to RFC-822 (required by RSS 2.0)
function toRFC822(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Collect and parse all markdown posts
const postsDir = path.join(__dirname, '..', 'src', 'posts');
const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

const posts = files
  .map((file) => {
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const { data, content } = parseFrontmatter(raw);
    if (!data.title) return null;

    const slug = data.slug || file.replace('.md', '');
    return {
      title: data.title,
      slug,
      date: data.date || '',
      excerpt: data.excerpt || '',
      category: data.category || '',
      content,
    };
  })
  .filter(Boolean)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

// Build RSS 2.0 XML
const items = posts
  .map(
    (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/post/${encodeURIComponent(p.slug)}</link>
      <guid isPermaLink="true">${SITE_URL}/post/${encodeURIComponent(p.slug)}</guid>
      <pubDate>${toRFC822(p.date)}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
      <category>${escapeXml(p.category)}</category>
    </item>`
  )
  .join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

const outPath = path.join(__dirname, '..', 'public', 'feed.xml');
fs.writeFileSync(outPath, rss, 'utf-8');
console.log(`RSS feed generated → ${outPath} (${posts.length} posts)`);
