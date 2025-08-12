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
- **Data Fetching:** React Query (@tanstack/react-query) for server state management  
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
│   │   ├── query-client.ts    # React Query client configuration
│   │   ├── auth/              # Authentication domain
│   │   │   ├── types.ts       # API types and interfaces
│   │   │   ├── index.ts       # API requests and methods
│   │   │   ├── constants.ts   # API URLs and endpoints
│   │   │   └── hooks.ts       # React Query hooks
│   │   ├── chat/              # Chat domain
│   │   │   ├── types.ts
│   │   │   ├── index.ts
│   │   │   ├── constants.ts
│   │   │   └── hooks.ts       # React Query hooks
│   │   └── models/            # Models domain
│   │       ├── types.ts
│   │       ├── index.ts
│   │       ├── constants.ts
│   │       └── hooks.ts       # React Query hooks
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
├── features/                  # Feature-level components (business functions)
│   └── chat-input/            # Chat input feature example
│       ├── index.ts           # Feature entry point
│       ├── ui/                # UI layer
│       │   ├── index.tsx      # Main feature component
│       │   └── components/    # Feature-specific components
│       │       ├── secure-toggle/ # Component folder (kebab-case)
│       │       │   ├── index.tsx
│       │       │   ├── types.ts
│       │       │   └── constants.ts
│       │       └── send-button/ # Another component
│       │           ├── index.tsx
│       │           ├── types.ts
│       │           └── constants.ts
│       └── model/             # Business logic layer
│           ├── types.ts       # Feature business logic types
│           ├── store.ts       # Zustand store for feature
│           ├── helpers.ts     # Feature-specific helpers
│           └── constants.ts   # Feature constants
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

The project follows a 5-layer architecture pattern:

1. **Core Layer** (`src/core/`) - Domain business logic and API interactions
   - Independent of UI frameworks
   - Contains stores, API clients, and business rules
   - Organized by business domains (auth, chat, user, etc.)

2. **Pages Layer** (`src/pages/`) - Route-level components
   - Top-level page components that correspond to routes
   - Compose widgets, features and handle page-specific logic
   - Each page follows the same internal structure: `index.ts`, `ui/`, `model/`

3. **Widgets Layer** (`src/widgets/`) - Complex reusable components
   - Business-feature oriented components (chat sidebar, user profile, etc.)
   - Can be reused across multiple pages
   - Have their own business logic and state management
   - Follow the same structure as pages: `index.ts`, `ui/`, `model/`

4. **Features Layer** (`src/features/`) - Business functions with logic
   - Self-contained business functions (chat input, user authentication, etc.)
   - More focused than widgets, represent specific user actions or workflows
   - Have their own business logic and state management
   - Follow the same structure as widgets: `index.ts`, `ui/`, `model/`
   - Can be composed into widgets or used directly in pages

5. **Components Layer** (`src/components/`) - Simple reusable UI components
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

### API Layer & Data Fetching (React Query + Axios)

#### Core Setup

**React Query Client Configuration** (`src/core/api/query-client.ts`):
```typescript
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) {
          return false; // Don't retry unauthorized requests
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

**Axios Configuration** (`src/core/api/config.ts`):
```typescript
import axios from "axios";

export const apiClient = axios.create({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

// Request interceptor - adds auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handles 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/api/auth/login');
      if (!isLoginRequest) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
```

#### Domain Organization Structure

Each API domain follows this structure:
```
src/core/api/[domain]/
├── types.ts      # TypeScript types for API requests/responses
├── constants.ts  # API endpoints and URLs
├── index.ts      # Raw API functions using Axios
└── hooks.ts      # React Query hooks
```

#### API Implementation Pattern

**1. Types** (`types.ts`):
```typescript
// Request types
export type LoginRequest = {
  username: string;
  password: string;
};

// Response types
export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type UserProfile = {
  id: number;
  username: string;
  email: string;
};
```

**2. Constants** (`constants.ts`):
```typescript
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  ME: '/api/auth/me',
  REFRESH: '/api/auth/refresh',
} as const;
```

**3. API Functions** (`index.ts`):
```typescript
import { apiClient } from "../config";
import { AUTH_ENDPOINTS } from "./constants";
import type { LoginRequest, LoginResponse, UserProfile } from "./types";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const formData = new URLSearchParams();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);
    formData.append("grant_type", "password");

    const response = await apiClient.post<LoginResponse>(
      AUTH_ENDPOINTS.LOGIN,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return response.data;
  },

  me: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>(AUTH_ENDPOINTS.ME);
    return response.data;
  },
};
```

**4. React Query Hooks** (`hooks.ts`):
```typescript
import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "./index";
import type { LoginRequest } from "./types";

// Mutation example - for data modifications
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
    },
  });
};

// Query example - for data fetching
export const useUserProfile = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.me(),
    enabled: !!localStorage.getItem("access_token"), // Only run if authenticated
  });
};
```

#### React Query Hook Patterns

**Basic Query Hook**:
```typescript
export const useModels = () => {
  return useQuery({
    queryKey: ["models"],
    queryFn: () => modelsApi.getModels(),
    staleTime: 30 * 60 * 1000, // 30 minutes - models don't change often
  });
};
```

**Query with Custom Refetch Behavior**:
```typescript
export const useChatHistory = () => {
  return useQuery({
    queryKey: ["chat", "history"],
    queryFn: () => chatApi.getHistory(),
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });
};
```

**Conditional Query**:
```typescript
export const useUserProfile = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.me(),
    enabled: !!localStorage.getItem("access_token"), // Only run if token exists
  });
};
```

**Mutation with Side Effects**:
```typescript
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      // Save tokens to localStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
    },
    onError: (error) => {
      // Handle login errors
      console.error("Login failed:", error);
    },
  });
};
```

#### Usage in Components

**Using Query Hooks**:
```typescript
import { useUserProfile } from "@/core/api/auth/hooks";

export const ProfileComponent = () => {
  const { data: user, isLoading, error, isError } = useUserProfile();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
};
```

**Using Mutation Hooks**:
```typescript
import { useLogin } from "@/core/api/auth/hooks";
import { useNavigate } from "@tanstack/react-router";

export const LoginForm = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const handleSubmit = (credentials: LoginRequest) => {
    loginMutation.mutate(credentials, {
      onSuccess: () => {
        navigate({ to: "/dashboard" });
      },
      onError: (error) => {
        // Handle error (show toast, form errors, etc.)
        console.error("Login failed:", error);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button 
        type="submit" 
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </button>
      {loginMutation.isError && (
        <div className="error">Login failed. Please try again.</div>
      )}
    </form>
  );
};
```

#### Best Practices

**1. Query Keys**: Use consistent, hierarchical query keys
```typescript
// ✅ Good - hierarchical and consistent
["auth", "me"]
["chat", "history"]
["models"]

// ❌ Avoid - inconsistent or too generic
["user"]
["data"]
["api"]
```

**2. Error Handling**: Handle errors at both global and component level
```typescript
// Global error handling in query client
retry: (failureCount, error: any) => {
  if (error?.response?.status === 401) {
    return false; // Don't retry unauthorized requests
  }
  return failureCount < 3;
}

// Component-level error handling
if (isError) {
  return <ErrorComponent error={error} />;
}
```

**3. Loading States**: Always handle loading states
```typescript
const { data, isLoading, isFetching } = useQuery({...});

// isLoading: initial loading state
// isFetching: any time data is being fetched (including refetch)
```

**4. Cache Configuration**: Set appropriate staleTime and gcTime
```typescript
// Data that rarely changes - longer staleTime
staleTime: 30 * 60 * 1000, // 30 minutes

// Data that changes frequently - shorter staleTime
staleTime: 1 * 60 * 1000,  // 1 minute

// Real-time data - always refetch
staleTime: 0,
```

**5. TypeScript**: Always type your API functions and hooks
```typescript
// ✅ Properly typed
const response = await apiClient.get<UserProfile>(AUTH_ENDPOINTS.ME);

// ❌ Avoid any types
const response = await apiClient.get(AUTH_ENDPOINTS.ME);
```

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
- **React Query + Axios**: Server state management with Axios for HTTP requests
- **React Hook Form**: Form handling with proper validation
- **i18n**: MANDATORY use of translation constants, NO hardcoded text
- **Feature-driven**: Organize by business features in /src/components/
- **Core Layer**: Business logic without UI dependencies

## Development Notes

### Current State
Project is in initial setup phase with default Vite + React + TypeScript template. Architecture is designed for enterprise AI assistant with:

- **shadcn/ui + Tailwind CSS 4** for rapid UI development and consistent design system
- **React Query + Axios** for server state management and HTTP communication
- **Zustand** for simple, effective client state management and business logic
- **React Hook Form** for robust form handling and validation
- **Core Layer** for business logic without framework dependencies

### Key Architectural Principles
- **Feature-Driven Development** - organize by business features
- **Type-Safety First** - everything typed through Zod schemas
- **shadcn/ui Design System** - consistent UI components with Tailwind utilities
- **Zustand State Management** - simple and effective global state
- **Form Validation** - React Hook Form with schema validation
- **Server State Management** - React Query for caching, synchronization, and data fetching
- **HTTP Layer** - Axios with interceptors and error handling
- **Core Layer** - business logic isolated from UI dependencies
- **Performance** - virtual scrolling, code splitting, memoization
- **Security** - input sanitization, XSS protection, data obfuscation

### When Adding New Features
- Use shadcn/ui components with Tailwind CSS utilities
- Use Zustand for state management and business logic
- Use React Hook Form for all form implementations
- Use React Query hooks for server state management and data fetching
- Use Axios API functions within React Query hooks for HTTP requests
- Use Core Layer services for business logic
- Choose appropriate layer:
  - **Features Layer** - for self-contained business functions (chat input, authentication flow)
  - **Widgets Layer** - for complex reusable components (sidebar, dashboard panels)
  - **Components Layer** - for simple UI elements without business logic
- **MANDATORY: Use i18n translation constants** - Import `useTranslation` hook and use `t('key')` for all text
- Implement proper TypeScript typing with Zod validators
- Add appropriate tests (unit/integration)
- Follow security best practices from documentation
- **ALWAYS run `yarn lint` and `yarn build` after completing any work** - This ensures code quality and that everything compiles correctly