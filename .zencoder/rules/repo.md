---
description: Repository Information Overview
alwaysApply: true
---

# Lovable Project: Carbon Tracker Dashboard

## Summary
A React-based dashboard application for carbon tracking and sustainability analytics. Built with **Vite**, **TypeScript**, and **Tailwind CSS**, it features emissions analysis, digital twins, and predictive insights, integrated with **Supabase** for backend services.

## Structure
- **src/**: Core source code.
  - **components/**: UI components using **shadcn/ui** primitives.
  - **hooks/**: Custom React hooks (e.g., `use-mobile`, `use-toast`).
  - **integrations/**: External service integrations (Supabase).
  - **lib/**: Shared utility functions.
  - **pages/**: Application routes (Emissions, Digital Twin, Scope Analysis, Predictions).
  - **test/**: Unit and integration tests with **Vitest**.
- **supabase/**: Supabase-specific configuration and schema.
- **public/**: Static assets like icons and images.

## Language & Runtime
**Language**: TypeScript  
**Version**: ^5.8.3  
**Build System**: Vite ^5.4.19  
**Package Manager**: npm  

## Dependencies
**Main Dependencies**:
- `react` & `react-dom` (^18.3.1)
- `react-router-dom` (^6.30.1)
- `@supabase/supabase-js` (^2.99.0)
- `@tanstack/react-query` (^5.83.0)
- `recharts` (^2.15.4) - Data visualization
- `framer-motion` (^12.35.2) - Animations
- `lucide-react` (^0.462.0) - Icons
- `zod` (^3.25.76) & `react-hook-form` (^7.61.1) - Form handling
- `@radix-ui/*` - Accessible UI primitives

**Development Dependencies**:
- `vitest` (^3.2.4)
- `@playwright/test` (^1.57.0)
- `tailwindcss` (^3.4.17)
- `eslint` (^9.32.0)

## Build & Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint project
npm run lint
```

## Testing
**Framework**: Vitest (Unit) & Playwright (E2E)  
**Test Location**: `src/test/` (Vitest) and project root (Playwright)  
**Naming Convention**: `*.test.ts`, `*.test.tsx`  
**Configuration**: `vitest.config.ts`, `playwright.config.ts`, `src/test/setup.ts`  

**Run Command**:
```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch
```
