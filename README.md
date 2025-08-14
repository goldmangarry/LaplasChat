# LaplasChat

Modern React-based AI chat application built with enterprise-grade architecture and cutting-edge technologies.

## Tech Stack

- **Frontend**: React 19.1.0 + TypeScript 5.8.3 + Vite 7.0.0
- **UI Components**: shadcn/ui + Tailwind CSS 4
- **Routing**: TanStack Router (file-based routing)
- **State Management**: Zustand for global state and business logic
- **Forms**: React Hook Form with validation
- **HTTP Client**: Axios for API communication
- **Internationalization**: i18next with React integration
- **Code Quality**: ESLint 9.29.0 with TypeScript support

## Architecture

The project follows a 4-layer architecture pattern for maintainability and scalability:

1. **Core Layer** (`src/core/`) - Domain business logic and API interactions
2. **Pages Layer** (`src/pages/`) - Route-level components
3. **Widgets Layer** (`src/widgets/`) - Complex reusable components
4. **Components Layer** (`src/components/`) - Simple UI components (shadcn/ui + shared)

### Key Features

- **Type-Safe Development**: Comprehensive TypeScript configuration with strict mode
- **Modern UI**: shadcn/ui components with Tailwind CSS utilities
- **Internationalization**: Multi-language support (EN/RU) with i18next
- **Form Management**: Robust form handling with React Hook Form
- **State Management**: Zustand for simple, effective global state
- **Performance**: Optimized builds with Vite and modern ES2022 target

## Development

```bash
# Install dependencies
yarn install

# Start development server with HMR
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Run linting
yarn lint
```

## Code Conventions

### TypeScript Guidelines
- Use `type` instead of `interface` for better composability
- Avoid `enum` - use const assertions and union types
- Leverage modern TypeScript features (const assertions, template literals)

### Styling
- **Tailwind CSS 4** for utility-first styling
- **shadcn/ui components** for consistent design system
- Built-in dark/light theme support

### Internationalization
- **CRITICAL**: Never use hardcoded text in components
- Always use translation constants with `useTranslation` hook
- Translation files: `src/shared/locales/en.json`, `src/shared/locales/ru.json`

### Project Structure
```
src/
├── main.tsx              # Application entry point
├── core/                 # Business logic and API
├── pages/                # Route-level components
├── widgets/              # Complex reusable components  
├── components/           # Simple UI components
├── routes/               # TanStack Router files
└── assets/              # Static assets
```

## Contributing

1. Follow the established architecture patterns
2. Use shadcn/ui components with Tailwind utilities
3. Implement proper TypeScript typing
4. Use i18n translation constants for all text
5. Run `yarn lint` and `yarn build` before committing
