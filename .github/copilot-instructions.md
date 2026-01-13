# JurisFix Copilot Instructions

## Project Overview
**JurisFix** is a Next.js 16+ SaaS platform for legal case study and memorization. It helps Brazilian law students and professionals learn administrative law through interactive case narratives, explanations, and spaced repetition.

### Tech Stack
- **Framework**: Next.js 16.1.1 (App Router, Static Generation)
- **Language**: TypeScript 5 with strict mode
- **Styling**: Tailwind CSS 4, PostCSS, Tailwind Merge
- **UI Components**: lucide-react icons, sonner toasts
- **Content**: Markdown support via react-markdown + remark-gfm
- **Data**: JSON-based case storage (no database)

## Architecture & Data Flow

### Core Data Model: Case
Located in [types/case.ts](types/case.ts). Each **Case** is a comprehensive legal study unit containing:
- **Narrative** (`narrativeMd`): Story-driven problem presented in Portuguese with humor/relatability
- **Explanation** (`explanationMd`): Technical legal concepts and rules
- **Application** (`applicationMd`): Practical scenarios showing rule application
- **Mnemonics** (`mnemonics`): Memory aids for retention

All cases are loaded statically from [data/cases.json](data/cases.json) at build time. The module structure is single: Discipline → Module → Cases (flat list).

### Key Patterns

**Static Generation**: Case pages use `generateStaticParams()` ([case/[slug]/page.tsx](app/case/[slug]/page.tsx#L19)) to pre-render all cases at build time. Never use Server Components with dynamic case data fetching—leverage the static JSON.

**Client-Side State**: Progress tracking and UI state live in browser localStorage:
- `jurisfix-ratings`: JSON object with slug keys and scores 0-5 (primary storage)
- `case-progress-{caseCode}`: Legacy format maintained for backwards compatibility
- `sidebarHidden`: Sidebar visibility toggle

Use `useEffect(..., [])` for localStorage access (hydration safety) as seen in [LayoutWrapper.tsx](components/LayoutWrapper.tsx#L19) and [useProgress.ts](hooks/useProgress.ts). The `useProgress` hook automatically migrates old format data to new format on first access.

**URL as Filter State**: Dashboard filters persist to URL query params (`?discipline=...&topics=...&search=...&status=...&sort=...`). See [dashboard/page.tsx](app/dashboard/page.tsx#L34) for pattern—load from `searchParams` on mount, push new URL when filters change. The `useFilteredCases` hook handles filtering logic with status-based filtering (`nao-iniciado`, `em-estudo`, `dominado`, `revisao`).

### Component Organization

- **Pages**: `app/` contains route structure. Dashboard is the main hub ([dashboard/page.tsx](app/dashboard/page.tsx)).
- **Components**: Reusable UI in `components/`. Key ones:
  - `LayoutWrapper`: Global layout with sidebar toggle and header
  - `CaseCard`: Case preview with progress indicator
  - `FilterBar`, `SearchBar`: Filter controls
  - `MemorizationButtons`: 0-5 score buttons for retention

- **Utilities**: [lib/utils.ts](lib/utils.ts) contains `cn()` (clsx + tailwind-merge), `getPriorityColor()`, and `getLevelText()` for consistent styling.

- **Navigation Logic**: [lib/caseNavigation.ts](lib/caseNavigation.ts) provides `getPreviousCase()`, `getNextCase()` for case-to-case navigation.

## Developer Workflows

### Build & Run
```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Static generation of all cases
npm run start     # Serve production build
npm run lint      # Run ESLint (config: eslint.config.mjs)
```

### Adding a Case
1. Append to `cases[]` array in [data/cases.json](data/cases.json)
2. Ensure all `Case` interface fields are populated (especially `slug`, `code`, Markdown fields)
3. No database changes needed—rebuild triggers `generateStaticParams()`

### Modifying Styles
- **Global CSS**: [globals.css](app/globals.css) loaded in [layout.tsx](app/layout.tsx)
- **Tailwind**: Config in [tailwind.config.ts](tailwind.config.ts). Use utility classes; avoid raw CSS when possible.
- **Component Classes**: Use `cn()` helper to merge Tailwind classes with conditional logic (e.g., priority colors)

## Code Conventions

**Naming**: Portuguese for domain terms (e.g., `simpleEmenda`, `narrativeMd`, `priorityColor`), English for code structure (functions, variables, file names follow English conventions except domain-specific exports).

**Type Safety**: All components are typed (Case interface, props interfaces). No implicit `any`. Cast `caseData.cases as Case[]` when importing from JSON to satisfy TypeScript strict mode.

**'use client' Boundary**: Add `'use client'` to components using hooks (useState, useEffect, useSearchParams). Keep async Server Components in pages. Example: [DashboardContent.tsx](components/DashboardContent.tsx#L1) is a Client Component for state management, while [dashboard/page.tsx](app/dashboard/page.tsx) is Server Component wrapping it with Suspense.

**Markdown Rendering**: Use `ReactMarkdown` with `remarkGfm` plugin for case explanations (supports tables, strikethrough, etc.). See [CustomMarkdown.tsx](components/CustomMarkdown.tsx).

**Color Functions**: Never hardcode color classes—use `getPriorityColor(priority)` and `getLevelText(level)` from [lib/utils.ts](lib/utils.ts). These map Portuguese priority levels (`altissima`, `alta`, `media`, `baixa`) and numeric levels (1-3) to Tailwind classes.

## Important Integration Points

**Case Lookup**: Always use [lib/caseNavigation.ts](lib/caseNavigation.ts) helpers rather than direct array manipulation. They handle edge cases (boundaries, missing cases).

**Toast Notifications**: Use `sonner` package. Toast is auto-initialized in [layout.tsx](app/layout.tsx#L6).

**Icons**: Import from `lucide-react` (e.g., `ChevronRight`, `Menu`, `Clock`).

**Responsive Design**: Mobile-first approach. Use `md:` breakpoint for desktop adjustments (e.g., [LayoutWrapper.tsx](components/LayoutWrapper.tsx#L60)).

## Common Gotchas

- **Hydration Mismatch**: Always check `mounted` state before rendering localStorage data in Client Components. Use `useEffect(..., [])` to set mounted after hydration (see [useProgress.ts](hooks/useProgress.ts#L8)).
- **Params as Promises**: Next.js 16 requires `await params` in dynamic routes—async layout/page functions. Always destructure after awaiting: `const { slug } = await params;` ([case/[slug]/page.tsx](app/case/[slug]/page.tsx#L23-L24)).
- **Static Paths**: If adding dynamic routes, regenerate statics with `generateStaticParams()` or enable ISR. Case pages are pre-rendered at build time via `generateStaticParams()` iterating `caseData.cases`.
- **JSON Type Casting**: `caseData` imported as `unknown`; always cast to `Case[]`: `(caseData.cases as Case[])`. TypeScript strict mode requires explicit casting.
- **Progress Migration**: `useProgress` hook auto-migrates old `case-progress-{codeId}` format to new `jurisfix-ratings` format. Always use `useProgress(caseCode)` hook rather than manual localStorage access for consistency.
- **Filter State Sync**: Dashboard maintains two state sources: URL params and React state. Initialize from `searchParams` on mount, then sync to URL when filters change via `router.push()` with new query string.
