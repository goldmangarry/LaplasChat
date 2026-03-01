# LaplasChat

Open source AI chat application with multi-model support and built-in privacy protection.

## Features

- **Multi-Model Support** — Access 20+ AI models (GPT-5, Claude, Gemini, Llama, DeepSeek, etc.) through OpenRouter or direct API keys
- **Secure Mode** — Local data anonymization via Ollama before sending to AI providers
- **Fact Checking** — Verify AI responses using Perplexity Sonar
- **Web Search** — Enhance responses with real-time web data
- **Deepthink** — Extended reasoning for complex questions
- **Dark/Light Theme** — Toggle between themes
- **Responsive UI** — Built with shadcn/ui and Tailwind CSS 4

## Tech Stack

- **Frontend**: React 19 + TypeScript 5.8 + Vite 7
- **UI**: shadcn/ui + Tailwind CSS 4
- **Routing**: TanStack Router (file-based)
- **State**: Zustand (client) + TanStack Query (server)
- **Storage**: IndexedDB (local chat history)
- **HTTP**: Axios
- **i18n**: i18next

## Quick Start

### Prerequisites

- Node.js 20+
- Yarn
- An [OpenRouter API key](https://openrouter.ai/keys)

### Development

```bash
# Clone the repository
git clone https://github.com/nicknash/laplaschat.git
cd laplaschat

# Install dependencies
yarn install

# Start development server
yarn dev
```

Open http://localhost:5173 and enter your OpenRouter API key on the onboarding screen.

### Production Build

```bash
yarn build
yarn preview
```

### Docker

```bash
# Build the image
docker build -t laplaschat .

# Run the container
docker run -p 3000:80 laplaschat
```

Open http://localhost:3000.

## Project Structure

```
src/
├── core/           # Business logic & API layer
│   ├── api/        # API config, chat, models
│   ├── api-key/    # API key store (localStorage)
│   ├── chat/       # Chat state management
│   ├── ollama/     # Ollama integration (Secure Mode)
│   ├── storage/    # IndexedDB chat storage
│   └── theme/      # Theme management
├── pages/          # Route-level components
│   ├── main/       # Main chat page
│   ├── chat/       # Chat dialog page
│   ├── landing/    # Landing page
│   └── onboarding/ # API key onboarding
├── widgets/        # Complex reusable components
│   └── chat-sidebar/
├── features/       # Business feature components
│   └── chat-input/
├── components/     # UI components (shadcn/ui + shared)
├── routes/         # TanStack Router file-based routes
└── shared/         # Shared utilities & i18n
    ├── lib/
    └── locales/    # en.json
```

## Architecture

The project follows a 5-layer architecture:

1. **Core** — Domain logic, API clients, stores (framework-independent)
2. **Pages** — Route-level components
3. **Widgets** — Complex reusable business components
4. **Features** — Self-contained business functions
5. **Components** — Simple UI elements (shadcn/ui)

### API Keys

No backend server is required. All API calls go directly from the browser:

- **OpenRouter** (primary) — Single key for access to all models
- **OpenAI** (optional) — Direct access to OpenAI models
- **Anthropic** (optional) — Direct access to Claude models
- **Google** (optional) — Direct access to Gemini models

Keys are stored in `localStorage` and never sent to any server except the respective API providers.

### Secure Mode

When enabled, messages are processed through a local Ollama model before being sent to AI providers. Personal data (names, addresses, companies) is replaced with placeholders locally and never leaves your machine.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Follow existing code conventions (TypeScript strict, `type` over `interface`, no `enum`)
4. Use i18n translation keys for all text — no hardcoded strings
5. Run `yarn lint` and `yarn build` before committing
6. Submit a pull request

## License

MIT
