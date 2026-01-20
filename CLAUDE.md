# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Install dependencies
pnpm install

# Development (all apps)
pnpm dev

# Development (specific app)
turbo dev --filter=web    # Next.js app on port 3000
turbo dev --filter=docs   # Next.js app on port 3001
turbo dev --filter=@repo/ui  # Vite app for UI component development

# Build
pnpm build                # Build all packages
turbo build --filter=web  # Build specific package

# Lint & Type Check
pnpm lint
pnpm check-types

# Format
pnpm format
```

## Architecture

This is a pnpm monorepo managed by Turborepo with the following structure:

### Apps
- **apps/web**: Next.js 16 application (App Router) on port 3000
- **apps/docs**: Next.js 16 documentation app on port 3001

### Packages
- **packages/ui** (`@repo/ui`): Vite-based React component library with:
  - Custom charting system for crypto data visualization (candlestick charts)
  - Binance API integration for real-time market data
  - Uses `@` path alias resolving to `./src`
  - Components exported via `@repo/ui/*` pattern (maps to `./src/*.tsx`)
  - TailwindCSS 4 with shadcn/ui components
  - TanStack Query for data fetching

- **packages/eslint-config** (`@repo/eslint-config`): Shared ESLint configs
  - `@repo/eslint-config/base` - Base config
  - `@repo/eslint-config/next-js` - Next.js apps
  - `@repo/eslint-config/react-internal` - Internal React packages

- **packages/typescript-config** (`@repo/typescript-config`): Shared tsconfigs
  - `base.json`, `nextjs.json`, `react-library.json`

### Charting System (packages/ui)
The custom charting system uses HTML Canvas with a layered architecture:
- `ChartStack` - Container managing stacked chart layers
- `ChartLayer` - Canvas-based rendering layers (`ChartLineLayer`, `ChartPointLayer`)
- `ChartStackContext` - React context for sharing size/config between layers
- Graphers (`DrawOps.ts`) - Pluggable renderers: `BasicLineGrapher`, `CandleStickGrapher`, `Point2DGrapherCircle`
- Data models in `chart/model/graph.ts` - `ChartPoint`, `ChartCandleStick`, `ChartScale`

### Data Integration
- Binance API accessed via proxy at `/api` (proxied to `data-api.binance.vision`)
- Uses `@alexrmturner/plexq-ts-api` for API utilities
