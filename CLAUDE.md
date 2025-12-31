# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

POMB is a cross-platform travel/mapping application built as a monorepo with:
- **apps/web**: React 19 + Vite + TypeScript
- **apps/mobile**: Expo (React Native) for iOS/Android
- **packages/common**: Shared Relay environment and database types
- **Backend**: Supabase with GraphQL API

## Commands

```bash
# Development
npm run dev:web          # Web app + Relay compiler (watch mode)
npm run dev:mobile       # Mobile app + Relay compiler (watch mode)

# Build & Quality
npm run build            # Build all apps/packages
npm run lint             # Lint all
npm run check-types      # TypeScript check all
npm run format           # Prettier format

# GraphQL/Relay
npm run relay            # Compile GraphQL queries once
npm run relay:watch      # Watch mode
npm run schema:fetch     # Fetch schema from Supabase and transform it

# Supabase (requires CLI)
supabase start           # Start local Supabase
```

## Architecture

```
Client Apps (web/, mobile/)
         │
         ▼
  @pomb/common package
  ├─ relay-environment.ts (GraphQL client setup)
  └─ database.types.ts (Supabase-generated types)
         │
         ▼
  Supabase GraphQL API
  http://127.0.0.1:54321/graphql/v1
         │
         ▼
  PostgreSQL (trips, profiles, photos tables)
```

## Key Patterns

### GraphQL with Relay
- Queries live in `apps/*/graphql/*.ts` using `graphql` tagged template
- Run `npm run relay` to generate types in `__generated__/` folders
- Import generated query and use with `useLazyLoadQuery`

### Authentication
- Both apps use Supabase Auth via `lib/AuthContext.tsx`
- `useAuth()` hook provides `signIn`, `signUp`, `signOut`, `user`, `session`
- Main content is accessible without auth; auth required for mutations

### Navigation
- **Web**: React Router (`/`, `/login`, `/signup`)
- **Mobile**: React Navigation with modal auth flow

### Absolute Imports (Mobile)
- Mobile uses `@/` alias configured in `babel.config.js` and `tsconfig.json`
- Example: `import { useAuth } from "@/lib/AuthContext"`

### Environment Variables
- **Web**: `VITE_` prefix (e.g., `VITE_SUPABASE_URL`)
- **Mobile**: `EXPO_PUBLIC_` prefix (e.g., `EXPO_PUBLIC_SUPABASE_URL`)

## Tech Stack

- **UI**: Coinbase Design System (`@coinbase/cds-web`, `@coinbase/cds-mobile`)
- **Maps**: MapLibre GL (web), @maplibre/maplibre-react-native (mobile)
- **State/Data**: Relay 20.x for GraphQL
- **Build**: Turborepo, Vite (web), Metro (mobile)
- **React**: 19.1.0 (pinned across monorepo via overrides)

## Workspace Commands

Run commands in specific workspace:
```bash
npm run --workspace=web dev
npm run --workspace=mobile ios
```

Or with Turborepo filter:
```bash
npx turbo build --filter=web
```
