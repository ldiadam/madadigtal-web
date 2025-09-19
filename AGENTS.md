# Repository Guidelines

## Project Structure & Module Organization
Source lives in `src/app` (App Router entrypoints + `globals.css`), with static assets in `public`. Root configs (`next.config.ts`, `eslint.config.mjs`, `wrangler.jsonc`, `tsconfig.json`) should move in sync when changing build or deployment behavior. Regenerate Cloudflare environment typings with `env.d.ts` whenever bindings change.

## Build, Test, and Development Commands
- `npm run dev`: Starts the Next.js dev server at `http://localhost:3000` with hot reload.
- `npm run lint`: Runs ESLint with the `next/core-web-vitals` preset; resolve all warnings before proposing changes.
- `npm run build`: Produces the production bundle consumed by OpenNext.
- `npm run check`: Executes `npm run build` then `tsc` for type-only validation; use this before every PR.
- `npm run preview`: Builds via OpenNext and serves the Worker bundle locally.
- `npm run deploy`: Builds and pushes to Cloudflare Workers; only run on vetted main-branch changes.
- `npm run cf-typegen`: Refreshes `env.d.ts` from `wrangler` for typed bindings.
- `npm run db:migrate:local`: Applies D1 migrations locally (edit the DB name if needed).
- `npm run db:migrate`: Applies migrations to the remote Cloudflare D1 instance.

## Coding Style & Naming Conventions
Follow TypeScript strictness from `tsconfig.json` and prefer explicit types at APIs. Use 2-space indentation, `PascalCase` for React components, `camelCase` for utilities, and co-locate route components under their folder (`src/app/<segment>/page.tsx`). Tailwind CSS v4 is imported globally; prefer utility classes over bespoke CSS, and keep any custom tokens in `@theme inline`.

## Testing Guidelines
No dedicated test runner is preconfigured; rely on `npm run lint` and `npm run check` as the minimum acceptance gate. When adding automated tests, place them beside the code using the `.test.ts(x)` suffix and document any new scripts in `package.json`. Include manual verification notes (e.g., `npm run preview`) in PR descriptions until automated coverage is introduced.

## Commit & Pull Request Guidelines
Write imperative, present-tense commit subjects under ~65 characters (e.g., `Add hero section layout`). Every PR should link the relevant Linear/Jira issue, summarize the change, list verification commands, and attach UI screenshots for visual updates. Request review before triggering deploy scripts, and ensure the branch rebases cleanly onto `main`.

## Cloudflare Deployment Notes
`wrangler.jsonc` connects the OpenNext Worker (`.open-next/worker.js`), static assets, and the D1 binding `DB`; set `database_id` before deploys and run `npm run db:migrate` to keep tables aligned. Use `npm wrangler tail` for staging observability and log new secrets for teammates.
