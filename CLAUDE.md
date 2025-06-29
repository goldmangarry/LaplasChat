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
- **Build Tool:** Vite 7.0.0 with ES modules
- **Linting:** ESLint 9.29.0 with TypeScript ESLint
- **Module System:** ES Modules (type: "module" in package.json)

### Project Structure
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Main application component
- `src/App.css` - Component-specific styles
- `src/index.css` - Global styles with dark/light theme support
- `public/` - Static assets served directly
- `index.html` - Main HTML template

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
- CSS files use system font stack
- Built-in support for dark/light themes via CSS custom properties
- Component-specific CSS files co-located with components

## Architecture Documentation

📁 **Detailed architecture documentation is available in the [docs/](./docs/) folder:**

- **[Architecture Overview](./docs/architecture-overview.md)** - General architecture principles and project structure
- **[Technology Stack](./docs/tech-stack.md)** - Detailed tech stack analysis and library choices  
- **[Development Guide](./docs/development-guide.md)** - Development patterns, best practices, and coding guidelines
- **[Core Layer](./docs/core-layer.md)** - Core business logic layer without external dependencies
- **[Progress Tracker Guide](./docs/progress-tracker-guide.md)** - Rules for working with TodoWrite/TodoRead system

## IMPORTANT for AI Assistants

### ALWAYS READ THESE DOCS FIRST:
1. **[Progress Tracker Guide](./docs/progress-tracker-guide.md)** - Critical rules for todo management
2. **[Architecture Overview](./docs/architecture-overview.md)** - Architecture principles  
3. **[Development Guide](./docs/development-guide.md)** - Coding patterns and conventions

### MANDATORY TODO WORKFLOW:
- Use TodoRead() at start of EVERY session
- Use TodoWrite() to track ALL tasks (pending → in_progress → completed)
- ONLY ONE task in_progress at a time
- Mark completed ONLY when fully working (no errors, matches requirements)
- Always check Chakra UI v3 composition patterns (Avatar.Root + Avatar.Fallback, not Avatar)

### ARCHITECTURAL REQUIREMENTS:
- **TypeScript-first**: Use `type` instead of `interface`, avoid `enum`
- **Chakra UI v3**: Compositional structure (Component.Root, Component.Item pattern)
- **Feature-driven**: Organize by business features in /src/components/
- **Core Layer**: Business logic without UI dependencies

## Development Notes

### Current State
Project is in initial setup phase with default Vite + React + TypeScript template. Architecture is designed for enterprise AI assistant with:

- **Chakra UI v3** for rapid UI development and easy theming
- **TanStack Router** for type-safe routing with search params
- **Zustand** for simple, effective state management
- **TanStack Query** for server state and real-time data
- **Core Layer** for business logic without framework dependencies

### Key Architectural Principles
- **Feature-Driven Development** - organize by business features
- **Type-Safety First** - everything typed through Zod schemas
- **Core Layer** - business logic isolated from UI dependencies
- **Performance** - virtual scrolling, code splitting, memoization
- **Security** - input sanitization, XSS protection, data obfuscation

### When Adding New Features
- Follow the [Development Guide](./docs/development-guide.md) for coding standards
- Use Core Layer services for business logic
- Implement proper TypeScript typing with Zod validators
- Add appropriate tests (unit/integration)
- Follow security best practices from documentation
- Run `yarn lint` and `yarn build` before committing changes