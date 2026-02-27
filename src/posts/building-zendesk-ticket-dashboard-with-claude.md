---
slug: 'building-zendesk-ticket-dashboard-with-claude'
category: 'ai'
label: 'Claude AI'
date: 'Feb 2026'
readTime: '7 min read'
title: 'I Built a Real-Time Zendesk Ticket Dashboard in React — No Backend Required'
excerpt: 'A full support operations dashboard with live metrics, trend charts, and heatmaps — built entirely in the browser with React, Vite, and Claude Code as my pair programmer.'
---

# I Built a Real-Time Zendesk Ticket Dashboard in React — No Backend Required

*Eight summary cards. Six interactive charts. A live heatmap. Zero backend servers.*

---

## The Problem: Zendesk Explore Is Not Enough

If you manage a support team on Zendesk, you already know the frustration. Zendesk Explore gives you reporting, but it is slow, clunky to customize, and locked behind higher-tier plans for the features you actually want. You end up exporting CSVs, building pivot tables, and refreshing stale data every time someone asks "how are we doing today?"

I wanted something different. A dashboard I could open in the morning, glance at once, and immediately know the state of operations — open tickets, resolution trends, workload distribution, busiest hours — without clicking through five Explore tabs or waiting for a report to generate.

So I built one. It runs entirely in the browser, talks directly to the Zendesk API, and costs nothing to host.

---

## What the Dashboard Does

### Summary Cards

The top row gives you the numbers that matter at a glance:

| Metric | What It Tells You |
|---|---|
| **Open Tickets** | Current unresolved volume |
| **Created Today** | Inbound velocity |
| **Solved Today** | Team throughput |
| **Pending** | Tickets waiting on customer response |
| **Backlog Size** | Unsolved tickets older than your selected range |
| **Average Age** | Mean age of open tickets in days |
| **One-Touch Resolution** | Percentage of tickets solved in a single interaction |
| **Reopened** | Tickets that were solved but came back |

Eight numbers. One row. The entire health of your support operation visible in a second.

### Trend Charts and Breakdowns

Below the cards, six interactive charts break down what is happening and where:

- **Ticket Trends** — Bar chart comparing tickets created vs. solved per day. If the red bars are consistently taller than the green ones, you are falling behind.
- **By Status** — Donut chart showing Open, Pending, Hold, Solved, and Closed distribution.
- **By Priority** — Bar chart of Urgent, High, Normal, and Low tickets so you can see if your queue is front-loaded with fires.
- **By Channel** — Where tickets are coming from — email, chat, phone, web form, API.
- **Top Tags** — Horizontal bar chart of your most common ticket tags. This is where recurring issues surface.
- **Distribution** — Toggle between Group and Assignee views to see who is carrying what load.

### The Busiest Hours Heatmap

This is my favorite feature. A day-of-week by hour-of-day heatmap that shows exactly when tickets arrive. Darker cells mean higher volume. You can immediately see that Monday mornings are a firestorm and Friday afternoons are quiet — and staff accordingly.

### Recent Tickets Table

A sortable table of your 50 most recent tickets with subject, status, priority, tags, and timestamps. Click any ticket ID and it opens directly in Zendesk. Sort by any column to find what you need.

---

## The Technical Stack

| Component | Role |
|---|---|
| **React** | UI framework |
| **Vite** | Build tool and dev server |
| **Recharts** | Chart rendering |
| **Zendesk Search API** | Data source |
| **Browser localStorage** | Credential storage |
| **GitHub Pages** | Free hosting |

No backend. No database. No serverless functions. The browser handles everything.

---

## How Authentication Works

The dashboard uses Zendesk API token authentication. You enter three things:

1. Your **subdomain** (the part before `.zendesk.com`)
2. Your **email address**
3. An **API token** generated from Zendesk Admin Center

Credentials are stored in your browser's localStorage only. They never leave your machine, never hit an external server, never get logged anywhere. When you connect, the dashboard validates your credentials with a test API call before saving.

---

## The CORS Problem and How I Solved It

Here is where it got interesting. Browsers enforce CORS restrictions, which means a React app running on `localhost` or GitHub Pages cannot call `yoursubdomain.zendesk.com` directly — the browser blocks the request before it even leaves.

In production, you can add your GitHub Pages URL to Zendesk's CORS allowlist in Admin Center. That solves it for the deployed site.

In development, I built a lightweight Vite proxy plugin. It intercepts requests to `/zendesk-proxy`, forwards them to the Zendesk API using Node's built-in `https` module, and pipes the response back. Six lines of config, zero external dependencies, and CORS stops being a problem.

---

## Caching, Rate Limits, and Pagination

The Zendesk API has a 700 requests-per-minute rate limit. The dashboard handles this carefully:

- **5-minute in-memory cache** for search queries and metadata (groups, users, ticket fields) so repeated views do not burn API calls
- **Rate limit monitoring** — the dashboard reads `x-rate-limit-remaining` from every response and displays it in a badge so you always know where you stand
- **Automatic pagination** — searches use 100 results per page with automatic `next_page` following, capped at 1,000 tickets for safety
- **Auto-refresh** — configurable intervals (5, 10, 15, or 30 minutes) so the dashboard stays current without manual reloading

---

## How Claude Code Made This Possible

I am going to be direct about this. Building a full-featured analytics dashboard with interactive charts, a heatmap component, API pagination, caching, rate limit handling, CORS proxy configuration, and responsive layout — that is weeks of work for a solo developer.

I built it in days with Claude Code as my pair programmer.

### What Claude Handled

- **Architecture decisions** — component structure, data flow between the API layer and chart components, state management patterns
- **The CORS proxy** — diagnosing why browser requests were blocked, writing the Vite middleware plugin, debugging Node.js compatibility issues across versions
- **Chart implementation** — wiring Recharts components to transformed API data, configuring tooltips, colors, and responsive sizing
- **The heatmap** — building a custom day-by-hour grid component that maps ticket timestamps to visual intensity
- **Data transformation** — taking raw Zendesk search results and computing derived metrics like one-touch resolution rate, average age, and trend aggregations
- **Error handling** — graceful degradation for API failures, rate limit warnings, credential validation

### What I Handled

- **Requirements** — knowing what metrics matter for support operations, what views are useful in a standup, what information leadership asks for
- **Design direction** — the layout, the visual hierarchy, what deserves a summary card vs. a chart vs. a table
- **Testing** — validating against real Zendesk data, catching edge cases, and verifying the numbers match

This is the pattern that works. Domain expertise plus AI execution. I know what a support dashboard needs to show because I run a support team. Claude knows how to build React components, wire up APIs, and handle the hundred technical details that turn a concept into working software.

---

## Time Range Filtering

The header includes a time range selector — Today, This Week, or This Month. Switching the range triggers parallel API fetches that pull both time-filtered tickets and all open tickets, then recomputes every metric and chart. The data transformation layer handles the math so the UI components just receive clean, pre-calculated props.

---

## What This Replaces

| Before | After |
|---|---|
| Open Zendesk Explore, wait for it to load, navigate to a pre-built report | Open the dashboard — data is already there |
| Export CSV, build pivot table, calculate resolution rates manually | Summary cards show it instantly |
| Guess at staffing patterns based on gut feeling | Heatmap shows exactly when volume peaks |
| Ask around about who is overloaded | Distribution chart shows workload by agent or group |
| Refresh the page and re-run the report | Auto-refresh keeps it current |

---

## It Is Open Source

The entire dashboard is part of my portfolio site, built with React and Vite, hosted free on GitHub Pages. The code is at [github.com/stevemojica/stevemojica.github.io](https://github.com/stevemojica/stevemojica.github.io).

If you run a Zendesk instance, you can clone the repo, enter your credentials, and have a working operations dashboard in minutes. Modify it, extend it, add the charts your team cares about.

---

## Key Takeaways

1. **You do not need a backend to build a real dashboard.** Browser-only architecture with API token auth and localStorage keeps it simple and free to host.
2. **CORS is solvable.** A lightweight dev proxy and a Zendesk CORS allowlist entry handle it without external services.
3. **Claude Code turns ambitious projects into realistic ones.** A full analytics dashboard with six chart types, a heatmap, caching, and auto-refresh is not a weekend project — unless you have an AI pair programmer.
4. **Domain knowledge is the differentiator.** AI can build the components. You need to know which metrics matter and how to lay them out so a glance tells a story.
5. **Build for your own workflow.** Off-the-shelf dashboards serve everyone and therefore serve no one perfectly. When you build your own, every pixel serves your team.

---

*Built with React + Vite + Recharts. Pair programmed with Claude Code. Hosted free on GitHub Pages.*
