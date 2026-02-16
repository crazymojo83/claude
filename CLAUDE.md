# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Production build
- `npm test` — Run all tests once (vitest)
- `npm run test:watch` — Run tests in watch mode
- `npx vitest run src/components/FeedbackButton.test.jsx` — Run a single test file

## Architecture

React app built with Vite. Tests use Vitest + React Testing Library with jsdom.

- `src/main.jsx` — App entry point, renders into `#root`
- `src/App.jsx` — Root component
- `src/components/` — React components (each with co-located `.test.jsx` files)
- `vite.config.js` — Vite + Vitest configuration (globals enabled, jsdom environment)
