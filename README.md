<p align="center">
  <img src="public/logo.svg" alt="LaplasChat" width="80" height="80" />
</p>

<h1 align="center">LaplasChat</h1>

<p align="center">
  <strong>Open source AI chat with privacy protection. One app for ChatGPT, Claude, Gemini, and 20+ models.</strong>
</p>

<p align="center">
  <a href="https://github.com/goldmangarry/LaplasChat/releases"><img src="https://img.shields.io/github/v/release/goldmangarry/LaplasChat?style=flat-square&color=6c56f0" alt="Release" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" /></a>
  <a href="https://github.com/goldmangarry/LaplasChat/stargazers"><img src="https://img.shields.io/github/stars/goldmangarry/LaplasChat?style=flat-square&color=6c56f0" alt="Stars" /></a>
</p>

---

## Download

| Platform | Download |
|----------|----------|
| Windows  | [Download .exe](https://github.com/goldmangarry/LaplasChat/releases/latest) |
| macOS (Apple Silicon) | [Download .dmg](https://github.com/goldmangarry/LaplasChat/releases/latest) |
| macOS (Intel) | [Download .dmg](https://github.com/goldmangarry/LaplasChat/releases/latest) |
| Web (self-hosted) | See [Quick Start](#quick-start) below |

## Features

- **20+ AI Models** — GPT-4o, Claude, Gemini, Llama, DeepSeek, and more via OpenRouter or direct API keys
- **Secure Mode** — Local data anonymization through Ollama before sending to AI providers. Your personal data never leaves your machine
- **Fact Checking** — Verify AI responses with Perplexity Sonar and real-time web search
- **Desktop App** — Native Windows and macOS app via Tauri (lightweight ~10 MB)
- **No Backend** — All API calls go directly from your device. No middleman server
- **Privacy First** — API keys stored locally, chat history in local IndexedDB. Nothing is sent anywhere except the AI provider you choose

## How Secure Mode Works

When enabled, your messages go through a local Ollama model **on your machine** before being sent to any AI provider:

1. **Anonymize** — Local LLM extracts personal data (names, emails, addresses, companies) and replaces them with placeholders
2. **Send** — Only the anonymized message reaches the AI provider
3. **De-anonymize** — The response is restored with your original data locally

Your sensitive information never leaves your device.

### Remote Ollama Server

By default, LaplasChat connects to Ollama at `http://localhost:11434`. You can point it to a remote Ollama instance (e.g. a GPU server) via **Settings > Anonymization Model > Ollama Server URL** or during onboarding.

If your Ollama server runs on a different machine, make sure it listens on `0.0.0.0` and is protected with an API key:

```bash
# On the remote server
OLLAMA_HOST=0.0.0.0:11434 OLLAMA_API_KEY=your-secret-key ollama serve
```

Then in LaplasChat, enter the server URL (e.g. `http://192.168.1.100:11434`) and the API key you chose. The key is sent as a `Bearer` token in the `Authorization` header on every request to Ollama.

> **Note:** For the Tauri desktop app, connections to remote Ollama servers (non-localhost) require updating the CSP in `src-tauri/tauri.conf.json` to allow the target host.

## Quick Start

### Desktop App

1. Download the installer for your platform from [Releases](https://github.com/goldmangarry/LaplasChat/releases/latest)
2. Install and launch
3. Enter your [OpenRouter API key](https://openrouter.ai/keys) on the onboarding screen
4. Start chatting

### Web (Development)

```bash
git clone https://github.com/goldmangarry/LaplasChat.git
cd LaplasChat
yarn install
yarn dev
```

Open http://localhost:5173 and enter your OpenRouter API key.

### Docker

```bash
docker build -t laplaschat .
docker run -p 3000:80 laplaschat
```

### Desktop Development

Requires [Rust](https://rustup.rs/) and [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (Windows) or Xcode Command Line Tools (macOS).

```bash
yarn install
npm run tauri:dev
```

## API Keys

No backend server required. All API calls go directly from your device:

| Provider | Purpose |
|----------|---------|
| [OpenRouter](https://openrouter.ai/keys) | Primary — single key for 20+ models |
| [OpenAI](https://platform.openai.com/api-keys) | Optional — direct GPT access |
| [Anthropic](https://console.anthropic.com/) | Optional — direct Claude access |
| [Google](https://aistudio.google.com/apikey) | Optional — direct Gemini access |

Keys are stored in `localStorage` and never sent to any server except the respective API provider.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 · TypeScript 5.8 · Vite 7 |
| UI | shadcn/ui · Tailwind CSS 4 |
| State | Zustand (client) · TanStack Query (server) |
| Routing | TanStack Router (file-based) |
| Storage | IndexedDB (chat history) · localStorage (config) |
| Desktop | Tauri v2 (Rust) |
| i18n | i18next |

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
├── widgets/        # Complex reusable components
├── features/       # Business feature components
├── components/     # UI components (shadcn/ui + shared)
├── routes/         # TanStack Router file-based routes
└── shared/         # Shared utilities & i18n
src-tauri/          # Tauri desktop app shell (Rust)
```

## First Contributors

| | |
|---|---|
| <img src="https://github.com/Anyastar1111.png" width="40" /> | [Anna](https://github.com/Anyastar1111) |
| <img src="https://github.com/elbek45.png" width="40" /> | [Elbek](https://github.com/elbek45) |
| <img src="https://github.com/Kleepers.png" width="40" /> | [Vlad](https://github.com/Kleepers) |
| <img src="https://github.com/shanhoza.png" width="40" /> | [Vitaliy](https://github.com/shanhoza) |
| <img src="https://github.com/goldmangarry.png" width="40" /> | [Igor](https://github.com/goldmangarry) |

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE)
