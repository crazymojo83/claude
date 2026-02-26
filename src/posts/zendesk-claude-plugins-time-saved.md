---
slug: 'zendesk-claude-plugins-time-saved'
category: 'ai'
label: 'Claude AI'
date: 'Feb 2026'
readTime: '8 min read'
title: 'I Built Two Claude Plugins for Zendesk and Saved Hours Every Week — Here Is How'
excerpt: 'How two custom Claude plugins turned weeks of manual Zendesk ticket analysis into minutes, and why building your own plugins is easier than you think.'
---

# I Built Two Claude Plugins for Zendesk and Saved Hours Every Week

*Two plugins. Thirty minutes of setup. Hours of manual work eliminated.*

---

## The Problem: Drowning in Tickets, Starving for Insight

If you run a support team, you know the feeling. Tickets pour in every day. You close them, you move on, and at the end of the month someone asks: "What are customers actually struggling with?" or "Where is the team overloaded?"

You open Zendesk, start scrolling, start exporting, start building spreadsheets. Two hours later you have a rough picture that is already outdated. Multiply that by every month, every quarter review, every time leadership asks for a pulse check — and you are spending serious time on analysis that should be automatic.

I got tired of it. So I built two Claude plugins that do the work for me.

Both are open source and available right now at [github.com/stevemojica/Claude-Plugins](https://github.com/stevemojica/Claude-Plugins) for anyone to drop into their own workflow.

---

## Plugin 1: The Wiki Suggester — Know What Self-Help Articles to Write

The first plugin I built tackles a question every support team should be asking but rarely has time to answer: **What self-help articles should we create or update?**

Here is what it does. You run a single command — `/analyze-tickets` — and the plugin pulls your last 30 days of Zendesk tickets, fetches your existing Help Center articles, and compares the two. It clusters your tickets into thematic groups, identifies where customers are repeatedly asking questions that your documentation does not cover, and generates a prioritized list of article recommendations ranked by volume and customer impact.

### What You Get

- **Thematic clustering** of recent tickets so you can see patterns, not just individual issues
- **Gap analysis** that compares ticket themes against your published Help Center articles
- **Prioritized recommendations** — High, Medium, and Low — so you know where to focus first
- **Output in both chat and markdown report format** so you can share it with the team or drop it into a planning doc

### What This Replaced

Before this plugin existed, figuring out what documentation to write meant manually reading through tickets, guessing at patterns, and hoping you caught the right trends. It was a full afternoon of work at best and usually got skipped entirely because who has the time.

Now it takes about two minutes. Run the command, read the report, hand it to the person who writes your knowledge base. Done.

The real value is not just speed — it is **consistency**. The plugin catches patterns a human skimming tickets would miss. When you see that 47 tickets last month were variations of the same VPN connectivity issue and your Help Center has nothing on it, the priority becomes obvious.

---

## Plugin 2: The Support Analytics Dashboard — See Where You Are Stretched Thin

The second plugin attacks the operational side: **understanding your team's workload and finding where you can improve.**

Run `/support-report` and you get a comprehensive 30-day support intelligence report generated as a Word document. This is not a basic ticket count. It is a full operational breakdown.

### What You Get

- **Executive summary** with a narrative overview of how your support operation performed
- **Core metrics dashboard** covering First Contact Resolution (FCR), Time to First Response (TTFR), Time to Resolution (TTR), and backlog health — each with RAG (Red/Amber/Green) status indicators
- **Infrastructure category breakdown** across Network, Hardware, Software, and Identity/Access so you can see which areas generate the most load
- **Top 10 recurring issues** classified as either Systemic (root cause problems) or Symptomatic (surface-level repeat tickets)
- **Agent workload analysis** with overload alerts that flag when someone is carrying too much
- **Up to 8 prioritized improvement recommendations** ranked by severity

### What This Replaced

This is the report that used to take a full day to assemble. Exporting ticket data, building pivot tables, cross-referencing agent assignments, trying to calculate resolution times manually. And even after all that work, you were still making judgment calls about what the data actually meant.

The plugin analyzes up to 1,000 tickets and samples up to 200 for FCR calculations. It makes about 15 to 30 API calls and finishes in 2 to 4 minutes. The output is a polished Word document you can hand directly to leadership or bring into a team standup.

The agent workload analysis alone is worth it. When you can see that one person is handling 40% of your ticket volume while another is at 10%, you stop guessing about capacity and start making real decisions about workload distribution.

---

## The Time Math

Let me break down what these two plugins actually save:

| Task | Before (Manual) | After (Plugin) |
|---|---|---|
| Monthly self-help article analysis | 3-4 hours | ~2 minutes |
| Monthly support performance report | 4-6 hours | ~3 minutes |
| Identifying workload imbalances | Ongoing guesswork | Instant visibility |
| Spotting recurring ticket patterns | Buried in spreadsheets | Automatically surfaced |

That is roughly **7 to 10 hours per month** of manual analysis work replaced by about **5 minutes** of plugin runtime. Over a year, that is over 100 hours returned to the team. Time that now goes toward actually fixing the problems the reports identify instead of just finding them.

And that does not account for the decisions you make faster. When leadership asks "why are resolution times up this quarter," you are not scrambling to pull data — you already have the report.

---

## Why Plugins Change the Game

Here is what I want people to understand about Claude plugins: **they are not just automations. They are force multipliers for your specific workflow.**

The difference between a plugin and a one-off Claude prompt is persistence and precision. A prompt gives you one answer. A plugin gives you a repeatable, tuned process that understands your tools, connects to your APIs, and delivers structured output every time.

Think about what that means:

- **No context re-explaining.** The plugin already knows it is connecting to Zendesk, already knows your subdomain, already knows what metrics matter.
- **No output formatting headaches.** The report comes out in the same structure every time — Word documents, markdown, whatever you configured.
- **No manual data gathering.** The plugin calls the APIs, pulls the tickets, fetches the articles, and does the analysis. You just run the command.
- **No training required.** Anyone on the team can run `/support-report` or `/analyze-tickets`. They do not need to know how to write prompts or understand the Zendesk API.

This is the shift. AI stops being something you have a conversation with and starts being something that does work for you.

---

## How Easy It Is to Build Your Own

This is the part that surprises people. Building a Claude plugin is not a massive engineering effort. If you can describe what you want in plain language and you know which API you want to connect to, you are 90% of the way there.

### The Structure Is Simple

A Claude plugin is essentially:

1. **A server configuration** that tells Claude where to connect (your Zendesk instance, your Jira, your Salesforce — whatever)
2. **Tool definitions** that describe what actions the plugin can take (search tickets, fetch articles, pull metrics)
3. **A prompt layer** that tells Claude how to analyze the data and format the output

That is it. There is no complex framework to learn. There is no deployment pipeline. You define your tools, connect your API credentials, and Claude handles the rest.

### What You Need to Get Started

For the Zendesk plugins, the setup is:

- A `ZENDESK_SUBDOMAIN` environment variable (just the name before `.zendesk.com`)
- A `ZENDESK_OAUTH_TOKEN` with read access (takes 5 minutes to generate in Admin Center)
- The plugin files from the repo

You could have either plugin running in under 30 minutes, including the time it takes to generate an OAuth token.

### Build for Your Own Stack

The pattern translates to anything with an API. Some ideas:

| Plugin Idea | What It Does |
|---|---|
| **Jira Sprint Analyzer** | Pull last sprint's tickets, calculate velocity, identify blockers |
| **Salesforce Pipeline Reporter** | Summarize deal stages, flag stalled opportunities, forecast close rates |
| **GitHub PR Reviewer** | Analyze open PRs, flag ones that have been sitting too long, summarize change scope |
| **PagerDuty Incident Trends** | Review last 30 days of incidents, identify repeat offenders, suggest runbook updates |
| **Slack Channel Summarizer** | Digest key conversations from busy channels into daily briefs |

Every one of these follows the same pattern: **connect to an API, pull structured data, let Claude analyze it, output something actionable.** If the Zendesk plugins work for support, the same approach works for engineering, sales, ops — anywhere data lives in a tool with an API.

---

## They Are Open Source — Use Them

Both plugins are available at [github.com/stevemojica/Claude-Plugins](https://github.com/stevemojica/Claude-Plugins). Clone the repo, set your environment variables, and start running reports.

### Zendesk Wiki Suggester
- Command: `/analyze-tickets`
- Analyzes 30 days of tickets against your Help Center
- Outputs prioritized article recommendations
- Uses about 10 to 20 API requests per run

### Zendesk Support Analytics
- Command: `/support-report`
- Generates a full 30-day operational intelligence report
- Outputs a Word document with metrics, trends, and recommendations
- Analyzes up to 1,000 tickets in 2 to 4 minutes

Both stay well within Zendesk's 700 requests-per-minute rate limit. They are designed to be run regularly — weekly, monthly, or whenever you need a fresh picture of your support operation.

---

## Key Takeaways

1. **Manual reporting is dead weight.** If you are still spending hours pulling Zendesk data into spreadsheets, you are burning time that should go toward fixing the problems the data reveals.
2. **Plugins turn Claude from a chatbot into a tool.** The difference between asking Claude a question and running a plugin is the difference between a conversation and a workflow.
3. **Building plugins is accessible.** You do not need to be a developer. If you can describe your workflow and your tools have an API, you can build a plugin.
4. **Open source means you start today.** Both plugins are in the [Claude-Plugins repo](https://github.com/stevemojica/Claude-Plugins). Fork them, modify them, build on top of them.
5. **The real ROI is decisions, not reports.** The time saved generating reports matters, but the bigger win is making better decisions faster because the data is always current and always analyzed.

---

## What Is Next

I am already thinking about the next plugins to build. Automated incident correlation across Zendesk and monitoring tools. Predictive staffing recommendations based on ticket volume trends. Customer satisfaction trend analysis that goes beyond CSAT scores.

The plugin ecosystem is still early. That means right now is the best time to start building. The people who figure out how to connect their specific tools to Claude's analytical capability are going to operate at a completely different level than everyone still doing manual analysis.

Start with one plugin. See the time it saves. Then build the next one.

Check out the plugins: [github.com/stevemojica/Claude-Plugins](https://github.com/stevemojica/Claude-Plugins)
