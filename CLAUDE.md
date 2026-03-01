# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LaplasChat is an open source AI chat application built with React and TypeScript. It connects to a backend API and supports 20+ AI models via OpenRouter. Users provide their own OpenRouter API key on the onboarding screen.

## Development Commands

### Essential Commands
- `yarn dev` - Start development server with hot module replacement
- `yarn build` - Build for production (runs TypeScript compilation then Vite build)
- `yarn lint` - Run Biome to check code quality
- `yarn preview` - Preview the production build locally

### Package Management
- Use `yarn` (not npm) - project has yarn.lock
- `yarn add <package>` - Add runtime dependency
- `yarn add -D <package>` - Add development dependency

## Architecture

### Tech Stack
- **Frontend:** React 19.1.0 with TypeScript 5.8.3
- **UI Components:** shadcn/ui with Tailwind CSS 4
- **State Management:** Zustand for global state and business logic
- **Data Fetching:** TanStack React Query for server state management
- **HTTP Client:** Axios for API requests
- **Routing:** TanStack Router (file-based with auto code-splitting)
- **Build Tool:** Vite 7.0.0 with ES modules
- **Linting:** Biome 2.1.4
- **i18n:** i18next with EN + RU support

### Project Structure
```
src/
├── core/                       # Core business logic layer
│   ├── api/                    # API configuration and domain hooks
│   │   ├── config.ts           # Axios instance with OpenRouter key interceptor
│   │   ├── query-client.ts     # React Query client
│   │   ├── chat/               # Chat API domain
│   │   └── models/             # Models API domain
│   ├── api-key/                # OpenRouter API key store (Zustand + localStorage)
│   ├── chat/                   # Chat state management
│   └── theme/                  # Theme management
├── pages/                      # Route-level components
│   ├── main/                   # Main chat page
│   ├── chat/                   # Chat dialog page
│   └── onboarding/             # API key onboarding page
├── widgets/                    # Complex reusable components
│   └── chat-sidebar/           # Sidebar with navigation, chat history
├── features/                   # Business feature components
│   └── chat-input/             # Chat input with secure mode, web search, file upload
├── components/                 # UI components
│   ├── ui/                     # shadcn/ui components
│   └── shared/                 # Custom shared components
├── routes/                     # TanStack Router file-based routing
└── shared/                     # Shared utilities
    ├── lib/i18n.ts             # i18next configuration
    └── locales/                # Translation files (en.json, ru.json)
```

### Layer Architecture

1. **Core Layer** (`src/core/`) - Business logic, API clients, stores
2. **Pages Layer** (`src/pages/`) - Route-level page components
3. **Widgets Layer** (`src/widgets/`) - Complex reusable business components
4. **Features Layer** (`src/features/`) - Self-contained business functions
5. **Components Layer** (`src/components/`) - Simple UI elements

### API Architecture

The API layer uses Axios with a request interceptor that adds the OpenRouter API key from localStorage as a Bearer token. Each API domain follows this pattern:

```
src/core/api/[domain]/
├── types.ts      # TypeScript types
├── constants.ts  # API endpoints
├── index.ts      # Raw API functions
└── hooks.ts      # React Query hooks
```

### Authentication

There is no traditional authentication. Users provide an OpenRouter API key on the onboarding page (`/onboarding`). The key is stored in localStorage and sent as `Authorization: Bearer` header with every API request. A root route guard redirects to `/onboarding` if no key is present.

## Code Conventions

### TypeScript
- Use `type` instead of `interface`
- Avoid `enum` - use const assertions and union types
- Strict mode enabled

### Styling
- **Tailwind CSS 4** for utility-first styling
- **shadcn/ui components** for consistent design system

### i18n
- **CRITICAL**: Never use hardcoded text in components
- Always use `t('key')` from `useTranslation()` hook
- Translation files: `src/shared/locales/en.json`, `ru.json`

### When Adding Features
- Use shadcn/ui components with Tailwind CSS utilities
- Use Zustand for client state, React Query for server state
- Use i18n translation keys for ALL text
- Run `yarn lint` and `yarn build` after completing work

## Workflow Rules

### Auto-compact after large tasks
After completing a large multi-step task (5+ files changed, major feature implementation, refactoring, etc.), always run `/compact` to compress the conversation context. This prevents context window overflow and keeps the session responsive.
