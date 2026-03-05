# Contributing to LaplasChat

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/LaplasChat.git`
3. Install dependencies: `yarn install`
4. Create a feature branch: `git checkout -b feature/my-feature`
5. Make your changes
6. Run checks: `yarn lint && yarn build`
7. Commit and push
8. Open a Pull Request

## Code Conventions

### TypeScript
- Use `type` instead of `interface`
- Avoid `enum` — use const assertions and union types
- Strict mode is enabled

### Styling
- Use Tailwind CSS 4 utility classes
- Use shadcn/ui components where possible

### Internationalization
- **Never hardcode text** in components
- Always use `t('key')` from `useTranslation()` hook
- Add translation keys to `src/shared/locales/en.json`

### Architecture
Follow the 5-layer architecture:
1. **Core** (`src/core/`) — Business logic, API clients, stores
2. **Pages** (`src/pages/`) — Route-level components
3. **Widgets** (`src/widgets/`) — Complex reusable business components
4. **Features** (`src/features/`) — Self-contained business functions
5. **Components** (`src/components/`) — Simple UI elements

### Before Submitting

- Run `yarn lint` — fix all linting errors
- Run `yarn build` — ensure TypeScript compiles and Vite builds
- Test your changes locally with `yarn dev`

## Reporting Issues

- Use the [bug report template](https://github.com/goldmangarry/LaplasChat/issues/new?template=bug_report.yml) for bugs
- Use the [feature request template](https://github.com/goldmangarry/LaplasChat/issues/new?template=feature_request.yml) for ideas

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
