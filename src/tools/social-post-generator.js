// ─── Tool Registry ────────────────────────────────────────────────────────────
// Add new tools here. Each entry powers the /tools index and /tools/:slug detail page.
// The `component` field is a lazy import path used by React.lazy() in the route.

const tools = [
  {
    slug: "social-post-generator",
    name: "Social Post Generator",
    tagline: "Twitter/X & Threads posts that sound human",
    description:
      "Generate platform-ready social media posts with character limits, hook techniques, and tone control. Powered by Claude AI.",
    category: "Content",
    icon: "edit-3",
    features: [
      "Twitter/X (280 char) and Threads (500 char) output",
      "8 topic categories with custom option",
      "5 tone presets (Professional, Casual, Bold, Educational, Storytelling)",
      "5 hook techniques for scroll-stopping openers",
      "Character counters with visual progress bars",
      "One-tap copy with cross-platform clipboard support",
      "Source URL integration",
      "Hashtag and metadata breakdown",
    ],
    usage: `## How to Use

1. **Pick a topic** — Choose from preset categories or type your own
2. **Set the tone** — Match the voice to your audience
3. **Choose a hook** — Select the opening technique (bold statement, stat, question, etc.)
4. **Enter your message** — Paste an article summary, insight, announcement, or talking point
5. **Add a URL** *(optional)* — It gets appended to the generated posts
6. **Hit Generate** — Get both Twitter/X and Threads versions instantly
7. **Copy & post** — One tap to clipboard, ready for your feed`,
    claudeInstructions: `## Add to Your Claude Account

You can use this tool directly as a **Claude Artifact**:

1. Open [claude.ai](https://claude.ai) and start a new conversation
2. Copy the prompt below and send it to Claude
3. Claude will generate an interactive artifact you can use right in the chat

### Prompt to Use

\`\`\`
Create a React artifact that is a Social Post Generator for Twitter/X and Threads.

It should have:
- Topic category selector (Technology, Leadership, IT/Infrastructure, AI & Automation, Career, Business, Education, Custom)
- Tone picker (Professional, Casual & Witty, Bold & Opinionated, Educational, Storytelling)
- Hook technique selector (Bold Statement, Surprising Stat, Punchy Question, Emoji Anchor, Visual Pause)
- A textarea for the key message/content
- An optional source URL field
- A Generate button that calls the Claude API
- Output cards showing Twitter/X (280 char limit) and Threads (500 char limit) versions
- Character counters with color-coded progress bars
- Copy buttons with clipboard fallback for mobile
- Metadata display for hashtags, source, and hook technique used

Use a dark theme (slate/navy palette). Make it mobile-friendly.
\`\`\`

### Or Use It on This Site

Visit the [live tool](/social) to use it directly in your browser.`,
  },
  {
    slug: "zendesk-dashboard",
    name: "Zendesk Ticket Dashboard",
    tagline: "Live ticket workload reporting for IT leaders",
    description:
      "Real-time dashboard for Zendesk tickets with daily/weekly/monthly views, category breakdowns, trend analysis, and operations health metrics. Built for IT directors who need a finger on the pulse.",
    category: "Productivity",
    icon: "bar-chart-2",
    features: [
      "Daily, weekly, and monthly ticket workload views",
      "Live auto-refresh with configurable intervals (5/10/15/30 min)",
      "Summary cards: open, pending, solved, backlog, avg age, one-touch rate",
      "Ticket trend charts (created vs solved over time)",
      "Status, priority, and channel distribution charts",
      "Auto-detected tag/category breakdown",
      "Group and assignee distribution with toggle",
      "Busiest hours heatmap (day x hour)",
      "Sortable ticket table with direct Zendesk links",
      "API rate limit tracking and usage indicator",
      "Glassmorphism dark theme matching your portfolio",
    ],
    usage: `## How to Use

1. **Connect** — Enter your Zendesk subdomain, email, and API token
2. **Enable CORS** — In Zendesk Admin Center, allow your site's origin
3. **Browse** — Switch between Today, This Week, and This Month views
4. **Analyze** — Charts auto-populate showing status, priority, tags, groups, channels, and trends
5. **Click tickets** — Table rows open directly in Zendesk
6. **Auto-refresh** — Dashboard refreshes every 5 minutes by default (configurable)

### Hosting Locally

\`\`\`bash
npm run build
npx serve dist
\`\`\`

The built \`dist/\` folder can also be uploaded to SharePoint or any static file host.`,
    claudeInstructions: `## Setup Requirements

### Zendesk API Token
1. Go to **Admin Center** → Apps & Integrations → APIs → Zendesk API
2. Enable **Token Access**
3. Click **Add API token** and copy it

### Enable CORS
1. Go to **Admin Center** → Account → Security
2. Add your site's origin (e.g., \`http://localhost:3000\` or your production URL)

### Launch
Visit the [live dashboard](/zendesk) to get started.`,
  },
];

export default tools;
