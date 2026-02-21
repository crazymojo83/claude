---
slug: 'launching-portfolio-with-claude-code-and-github-pages'
category: 'ai'
label: 'Claude AI'
date: 'Feb 2026'
readTime: '5 min read'
title: 'How I Launched a Full Portfolio Site with Claude Code and Google Antigravity'
excerpt: '2,566 lines of code, 21 files, 50 commits — a complete React + Vite portfolio deployed on GitHub Pages with Claude AI as my pair programmer. Zero hosting costs, no CS degree required.'
---

# How I Launched a Full Portfolio Site with Claude Code and Google Antigravity

---

## The Pitch

I just launched my personal portfolio — **2,566 lines of code** across **21 files**, **50 commits** deep — hosted completely free on GitHub Pages.

React + Vite frontend. Claude AI as my pair programmer. Zero hosting costs. No CS degree required. No $200/yr domain needed. Just an idea, a GitHub account, and the will to start.

---

## What is Google Antigravity?

If you've ever typed `import antigravity` into a Python shell, you've already met the joke — it opens a browser to an xkcd comic about Python being so easy it feels like flying. **Google Antigravity** is that same energy applied to modern web development: the tools have gotten so accessible that the barrier between "I have an idea" and "it's live on the internet" has practically disappeared.

That's what this project proved. You don't need a computer science degree. You don't need a paid hosting plan. You don't need to understand Webpack internals or write your own CI pipeline from scratch. You need a GitHub account, a terminal, and a willingness to start — and the gravity holding you back from shipping just... isn't there anymore.

---

## The Stack

| Component | Role |
|---|---|
| **React** | Component-based UI framework |
| **Vite** | Lightning-fast build tooling and dev server |
| **GitHub Pages** | Free static site hosting |
| **Claude Code** | AI pair programmer — architecture, debugging, and iteration |

---

## How Claude Code Changed the Workflow

Claude wasn't a novelty bolted on at the end. It was wired into the workflow from day one — a genuine pair programmer that shaped the architecture, caught bugs before they shipped, and accelerated iteration cycles dramatically.

### Architecture Decisions

Instead of spending hours researching the "right" way to structure a React portfolio, I described what I wanted and Claude Code helped scaffold the project structure — component hierarchy, routing layout, styling approach. Decisions that would normally eat an entire evening were resolved in a conversation.

### Debugging in Real Time

When the GitHub contribution graph refused to render, Claude walked through the API response structure, identified the data mapping issue, and suggested the fix. When Vite threw cryptic polyfill errors after adding `gray-matter` for blog post parsing, Claude diagnosed the Node.js dependency conflict and rewrote the markdown parsing to work entirely in the browser.

### Iterative Design

The cyberpunk glassmorphic theme didn't land on the first try. Claude helped iterate through color palettes, hover effects, and card layouts — adjusting CSS-in-JS values, testing responsive breakpoints, and refining the visual identity across multiple passes.

---

## The Numbers

| Metric | Value |
|---|---|
| **Total lines of code** | 2,566 |
| **Source files** | 21 |
| **Commits** | 50 |
| **Hosting cost** | $0 |
| **Domain cost** | $0 |
| **CS degree required** | No |

---

## What's in the Portfolio

- **Hero section** with a custom portrait and cyberpunk-themed design
- **Career timeline** pulled from real work experience
- **Technical toolkit** with a visual domain overlap schema
- **GitHub contribution graph** rendered live via the GitHub API
- **Blog engine** that parses `.md` files from the repo with dynamic category filtering
- **Social embed cards** with glassmorphic styling
- **Fully responsive** layout — works on desktop, tablet, and mobile

---

## The Commit History Tells the Story

Fifty commits isn't a number pulled from thin air. Each one represents a real iteration:

- `feat(portfolio): actualize Technical Toolkit with domain overlap visual schema`
- `feat(design): integrate user portrait hero and shift global theme to cyan/magenta cyberpunk`
- `fix(blog): Rewrite Markdown parsing to bypass Node polyfill bugs`
- `feat(blog): implement dynamic category tag filtering and styling fixes`
- `style(global): Unify color palette to dark ruby/slate, glassmorphic card hovers`

Conventional commits. Scoped changes. A clean git history that reads like a development journal.

---

## Why GitHub Pages

GitHub Pages gives you free HTTPS hosting for any static site pushed to a repository. For a React + Vite project, the deploy pipeline looks like this:

1. `npm run build` generates the production bundle in `dist/`
2. Push to the repository
3. GitHub Pages serves it at `https://yourusername.github.io`

No server to configure. No AWS bill to worry about. No DNS propagation to wait on. Push and it's live.

---

## The Takeaway

The tools are here. Claude Code turns a solo developer into a two-person team — one that doesn't need sleep, doesn't lose context, and can switch between CSS debugging and API architecture without missing a beat. GitHub Pages removes the hosting question entirely. Vite makes the build process invisible.

If you've been sitting on a portfolio idea, waiting until you "know enough" or "have time" — stop waiting. The gravity isn't real. Open a terminal and start.

---

*Built with React + Vite. Pair programmed with Claude AI. Hosted free on GitHub Pages.*
