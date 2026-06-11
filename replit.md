# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## RoadIntel Application

Full-stack civic-tech platform for road accountability and AI-powered road intelligence.

### Frontend (artifacts/roadintel)
- React + Vite + TypeScript
- Pages: Landing, Login, Register, Dashboard, Complaints, Quick Scan (AI), Road DNA, Road Detail, Risk Map, Public Spending, Sensor Intel, Contractors, Analytics, Settings
- Vite proxy: `/api → http://localhost:8080`
- Color theme: navy #0F172A, teal #0EA5A4, amber #F59E0B

### Backend (artifacts/api-server)
Express API routes (all mounted with `/api` prefix via Vite proxy):
- `GET /dashboard/summary` — KPI stats from DB
- `GET /dashboard/recent-activity` — live activity feed
- `GET /roads`, `GET /roads/:id` — road profiles with health + repair history
- `GET /ai/corruption-flags` — AI corruption flags
- `GET /ai/insights` — AI insight cards
- `POST /ai/chatbot` — conversational AI chatbot
- `POST /ai/scan` — Quick Scan AI image analysis
- `GET /roads/risk-map` — risk map data (served by ai router, mounted before roads router)
- `GET /complaints`, `POST /complaints`, `GET /complaints/stats` — complaints CRUD
- `GET /sensors/overview`, `/sensors/analytics`, `/sensors/alerts` — sensor intelligence
- `GET /spending/overview`, `/spending/contractor-breakdown` — public spending
- `GET /contractors`, `GET /contractors/:id` — contractor profiles
- `GET /notifications` — notification feed

### Router ordering (important)
In `routes/index.ts`, `aiRouter` is mounted before `roadsRouter` so `/roads/risk-map` is handled by ai router before `/roads/:id` in roads router can intercept it.

### DB Schema
Tables exported with `Table` suffix from `@workspace/db/schema`:
`roadsTable`, `complaintsTable`, `contractorsTable`, `sensorStreamsTable`, `notificationsTable`, `repairLogsTable`
Always import with alias: `import { roadsTable as roads } from "@workspace/db/schema"`
