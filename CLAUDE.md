# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based chat application called "laplas-chat" built with modern web technologies. The project uses Vite for fast development and building, with TypeScript for type safety.

## Development Commands

### Essential Commands
- `yarn dev` - Start development server with hot module replacement
- `yarn build` - Build for production (runs TypeScript compilation then Vite build)
- `yarn lint` - Run ESLint to check code quality
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
- **Forms:** React Hook Form for form handling and validation
- **HTTP Client:** Axios for API requests
- **Build Tool:** Vite 7.0.0 with ES modules
- **Linting:** ESLint 9.29.0 with TypeScript ESLint
- **Module System:** ES Modules (type: "module" in package.json)

### Project Structure
```
src/
├── main.tsx                    # Application entry point
├── core/                       # Core business logic layer
│   ├── api/                    # Domain-based API organization
│   │   ├── config.ts          # Axios configuration and setup
│   │   ├── auth/              # Authentication domain
│   │   │   ├── types.ts       # API types and interfaces
│   │   │   ├── index.ts       # API requests and methods
│   │   │   └── constants.ts   # API URLs and endpoints
│   │   ├── chat/              # Chat domain
│   │   │   ├── types.ts
│   │   │   ├── index.ts
│   │   │   └── constants.ts
│   │   └── models/            # Models domain
│   │       ├── types.ts
│   │       ├── index.ts
│   │       └── constants.ts
│   └── user/                  # Core user logic (example)
│       ├── types.ts           # Business logic types
│       ├── index.ts           # User store and logic
│       ├── helpers.ts         # Utility functions
│       └── constants.ts       # User-related constants
├── pages/                     # Page-level components
│   └── login/                 # Login page example
│       ├── index.ts           # Page entry point
│       ├── ui/                # UI layer
│       │   ├── index.tsx      # Main page component
│       │   └── components/    # Page-specific components
│       │       └── login-form/ # Component folder (kebab-case)
│       │           ├── index.tsx
│       │           ├── types.ts
│       │           └── constants.ts
│       └── model/             # Business logic layer
│           ├── types.ts       # Page business logic types
│           ├── store.ts       # Zustand store for page
│           ├── helpers.ts     # Page-specific helpers
│           └── constants.ts   # Page constants
├── widgets/                   # Widget-level components (complex reusable components)
│   └── chat-sidebar/          # Chat sidebar widget example
│       ├── index.ts           # Widget entry point
│       ├── ui/                # UI layer
│       │   ├── index.tsx      # Main widget component
│       │   └── components/    # Widget-specific components
│       │       ├── user-info/ # Component folder (kebab-case)
│       │       │   ├── index.tsx
│       │       │   ├── types.ts
│       │       │   └── constants.ts
│       │       └── chat-item/ # Another component
│       │           ├── index.tsx
│       │           ├── types.ts
│       │           └── constants.ts
│       └── model/             # Business logic layer
│           ├── types.ts       # Widget business logic types
│           ├── store.ts       # Zustand store for widget
│           ├── helpers.ts     # Widget-specific helpers
│           └── constants.ts   # Widget constants
├── routes/                    # TanStack Router file-based routing
│   ├── __root.tsx            # Root route
│   ├── index.tsx             # Home route
│   ├── index.css             # Global styles with Tailwind CSS
│   └── login.tsx             # Login route
├── components/               # Shared shadcn/ui components
│   ├── ui/                   # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── shared/               # Custom shared components
│       ├── lib/              # Shared utilities
│       │   └── i18n.ts       # i18next configuration
│       ├── locales/          # Translation files
│       │   ├── en.json       # English translations
│       │   └── ru.json       # Russian translations
│       └── header/           # kebab-case naming
│           ├── index.tsx
│           ├── types.ts
│           └── constants.ts
└── public/                   # Static assets
    └── ...
```

### Layer Architecture

The project follows a 4-layer architecture pattern:

1. **Core Layer** (`src/core/`) - Domain business logic and API interactions
   - Independent of UI frameworks
   - Contains stores, API clients, and business rules
   - Organized by business domains (auth, chat, user, etc.)

2. **Pages Layer** (`src/pages/`) - Route-level components
   - Top-level page components that correspond to routes
   - Compose widgets and handle page-specific logic
   - Each page follows the same internal structure: `index.ts`, `ui/`, `model/`

3. **Widgets Layer** (`src/widgets/`) - Complex reusable components
   - Business-feature oriented components (chat sidebar, user profile, etc.)
   - Can be reused across multiple pages
   - Have their own business logic and state management
   - Follow the same structure as pages: `index.ts`, `ui/`, `model/`

4. **Components Layer** (`src/components/`) - Simple reusable UI components
   - `ui/` - shadcn/ui components (buttons, inputs, etc.)
   - `shared/` - Custom shared components without business logic

### Configuration Files
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript project references
- `tsconfig.app.json` - App-specific TypeScript config (ES2022 target)
- `tsconfig.node.json` - Node-specific TypeScript config
- `eslint.config.js` - Modern flat ESLint configuration

## Code Conventions

### TypeScript Configuration
- Strict mode enabled with comprehensive type checking
- Target: ES2022 with DOM support
- JSX: react-jsx (new JSX transform)
- Module resolution: bundler mode

### TypeScript Style Guidelines
- **Use `type` instead of `interface`** - Prefer type aliases for better composability and consistency
- **Avoid `enum`** - Use const assertions and union types instead:
  ```typescript
  // ❌ Don't use enum
  enum Status { Active, Inactive }
  
  // ✅ Use const assertion
  const Status = {
    Active: 'active',
    Inactive: 'inactive'
  } as const;
  type Status = typeof Status[keyof typeof Status];
  
  // ✅ Or use union types directly
  type Status = 'active' | 'inactive';
  ```
- **Use modern TypeScript features** - Leverage const assertions, template literal types, and satisfies operator

### ESLint Rules
- React Hooks rules enforced
- React Refresh for Vite enabled
- TypeScript-aware linting active
- Browser globals configured

### Styling
- **Tailwind CSS 4** for utility-first styling
- **shadcn/ui components** for consistent design system
- Built-in support for dark/light themes via CSS custom properties
- Component-specific styling using Tailwind utilities and CSS modules when needed

### Internationalization (i18n)
- **Location**: Translation files are located in `src/shared/locales/`
- **Configuration**: i18n setup in `src/shared/lib/i18n.ts`
- **Supported Languages**: `en.json` (English), `ru.json` (Russian)
- **Library**: Uses `i18next` with `react-i18next` and browser language detection
- **CRITICAL RULE**: **NEVER use hardcoded text in components**
  - ❌ **FORBIDDEN**: `<button>Submit</button>` or `<p>Welcome to our app</p>`
  - ✅ **REQUIRED**: Use translation constants: `<button>{t('submit')}</button>`
  - ✅ **REQUIRED**: Import `useTranslation` hook: `const { t } = useTranslation()`
- **Adding New Translations**:
  1. Add key-value pairs to both `en.json` and `ru.json`
  2. Use nested objects for organization: `"auth": { "login": "Login", "logout": "Logout" }`
  3. Access nested keys: `t('auth.login')`
- **Translation Keys**: Use kebab-case for consistency: `'forgot-password'`, `'create-account'`

### MANDATORY TODO WORKFLOW:
- Use TodoRead() at start of EVERY session
- Use TodoWrite() to track ALL tasks (pending → in_progress → completed)
- ONLY ONE task in_progress at a time
- Mark completed ONLY when fully working (no errors, matches requirements)
- Always use shadcn/ui component patterns and Tailwind CSS utilities

### ARCHITECTURAL REQUIREMENTS:
- **TypeScript-first**: Use `type` instead of `interface`, avoid `enum`
- **shadcn/ui + Tailwind**: Use shadcn/ui components with Tailwind CSS utilities
- **Zustand**: Global state management and business logic
- **React Hook Form**: Form handling with proper validation
- **Axios**: HTTP requests with proper error handling
- **i18n**: MANDATORY use of translation constants, NO hardcoded text
- **Feature-driven**: Organize by business features in /src/components/
- **Core Layer**: Business logic without UI dependencies

## Development Notes

### Current State
Project is in initial setup phase with default Vite + React + TypeScript template. Architecture is designed for enterprise AI assistant with:

- **shadcn/ui + Tailwind CSS 4** for rapid UI development and consistent design system
- **Zustand** for simple, effective state management and business logic
- **React Hook Form** for robust form handling and validation
- **Axios** for reliable HTTP requests and API communication
- **Core Layer** for business logic without framework dependencies

### Key Architectural Principles
- **Feature-Driven Development** - organize by business features
- **Type-Safety First** - everything typed through Zod schemas
- **shadcn/ui Design System** - consistent UI components with Tailwind utilities
- **Zustand State Management** - simple and effective global state
- **Form Validation** - React Hook Form with schema validation
- **HTTP Layer** - Axios with interceptors and error handling
- **Core Layer** - business logic isolated from UI dependencies
- **Performance** - virtual scrolling, code splitting, memoization
- **Security** - input sanitization, XSS protection, data obfuscation

### When Adding New Features
- Use shadcn/ui components with Tailwind CSS utilities
- Use Zustand for state management and business logic
- Use React Hook Form for all form implementations
- Use Axios with proper error handling for API requests
- Use Core Layer services for business logic
- **MANDATORY: Use i18n translation constants** - Import `useTranslation` hook and use `t('key')` for all text
- Implement proper TypeScript typing with Zod validators
- Add appropriate tests (unit/integration)
- Follow security best practices from documentation
- **ALWAYS run `yarn lint` and `yarn build` after completing any work** - This ensures code quality and that everything compiles correctly