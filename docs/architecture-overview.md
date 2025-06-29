# Architecture Overview
# Обзор архитектуры Apilaplas Frontend

## 1. Общие принципы

### 1.1 Слоистая архитектура с Core слоем

```
┌─────────────────────────────────────────────┐
│                 Pages Layer                 │  ← Страницы приложения
├─────────────────────────────────────────────┤
│               Widgets Layer                 │  ← Сложные UI блоки
├─────────────────────────────────────────────┤
│               Features Layer                │  ← Бизнес-фичи
├─────────────────────────────────────────────┤
│               Shared Layer                  │  ← Переиспользуемые компоненты
├─────────────────────────────────────────────┤
│                CORE LAYER                   │  ← Бизнес-логика без зависимостей
│              ↑ NO DEPENDENCIES ↑            │
└─────────────────────────────────────────────┘
```

### 1.2 Feature-Driven Development (FDD)

Организация кода по бизнес-фичам для лучшей модульности:

- **auth** - аутентификация и авторизация
- **chat** - основная функциональность чата
- **verification** - проверка достоверности ответов
- **admin** - административная панель

### 1.3 Type-First Approach

- Все API интерфейсы типизированы через Zod схемы
- Строгий TypeScript конфиг
- Type-safe роутинг через TanStack Router

## 2. Структура проекта

```
src/
├── app/                        # Корневое приложение
│   ├── App.tsx                # Главный компонент
│   ├── router.tsx             # TanStack Router конфигурация
│   ├── providers.tsx          # React провайдеры
│   └── store.ts               # Глобальные Zustand stores
├── core/                      # CORE LAYER
│   ├── types/                 # Доменные типы
│   ├── services/              # Бизнес-логика как функции
│   ├── stores/                # Глобальные stores
│   ├── validators/            # Zod схемы
│   └── constants/             # Бизнес-константы
├── shared/                    # Переиспользуемые компоненты
│   ├── ui/                    # UI Kit на Chakra UI
│   ├── hooks/                 # Общие хуки
│   ├── lib/                   # API клиенты
│   ├── utils/                 # Утилиты
│   └── config/                # Конфигурация
├── features/                  # Бизнес-фичи
│   ├── auth/                  # Аутентификация
│   ├── chat/                  # Чат функциональность
│   ├── verification/          # Проверка достоверности
│   └── admin/                 # Админ панель
├── widgets/                   # Составные UI блоки
│   ├── Header/
│   ├── Sidebar/
│   └── NotificationCenter/
└── pages/                     # Страницы приложения
    ├── AuthPage/
    ├── ChatPage/
    └── AdminPage/
```

## 3. Ключевые архитектурные решения

### 3.1 State Management

**Zustand** для простого и эффективного управления состоянием:
- Глобальные stores в `core/stores/`
- Локальные stores в каждой фиче
- Минимальный boilerplate

### 3.2 Data Fetching

**TanStack Query** для серверного состояния:
- Автоматическое кэширование
- Background refetching
- Оптимистичные обновления
- Real-time синхронизация

### 3.3 Routing

**TanStack Router** для type-safe маршрутизации:
- Полная типизация параметров и search params
- Предзагрузка данных
- Code splitting

### 3.4 Forms

**React Hook Form + Zod** для форм:
- Минимальные re-renders
- Типизированная валидация
- Переиспользуемые схемы

## 4. Основные фичи

### 4.1 Chat (Чат интерфейс)

**Компоненты:**
- `ChatInterface` - основной интерфейс
- `MessageList` - виртуализированный список сообщений
- `MessageInput` - поле ввода с поддержкой файлов
- `ChatSidebar` - боковая панель с чатами
- `ModeSwitcher` - переключатель secure/compare режимов

**Особенности:**
- Real-time через WebSocket
- Virtual scrolling для больших списков
- Типизированные действия с сообщениями

### 4.2 Verification (Проверка достоверности)

**Компоненты:**
- `FactChecker` - основной компонент проверки
- `VerificationResults` - результаты с источниками
- `TrustIndicator` - индикатор доверия

**Логика:**
- Асинхронная проверка фактов через AI
- Поиск по открытым источникам
- Система доверия источников

### 4.3 Admin (Административная панель)

**Разделы:**
- Dashboard - общая статистика
- User Management - управление пользователями  
- Organization Settings - настройки организации
- Billing Panel - биллинг и оплата
- Usage Analytics - аналитика использования

### 4.4 Auth (Аутентификация)

**Компоненты:**
- `LoginForm` - форма входа
- `ProtectedRoute` - защищенные маршруты
- SSO интеграция
- RBAC (Role-Based Access Control)

## 5. Real-time Architecture

### 5.1 WebSocket Integration

```typescript
// Архитектура real-time коммуникации
Client ←→ Socket.io ←→ LLM Proxy ←→ AI Models
   ↓
TanStack Query Cache
   ↓
Zustand Stores
   ↓
React Components
```

### 5.2 Event Types

- `message` - новые сообщения
- `typing` - индикатор печати
- `user-joined/left` - пользователи в чате
- `message-updated/deleted` - изменения сообщений

## 6. Security Architecture

### 6.1 Принципы безопасности

- **Input Sanitization** - очистка всех пользовательских данных
- **XSS Protection** - защита от межсайтового скриптинга
- **CSRF Protection** - защита от CSRF атак
- **Data Obfuscation** - обфускация конфиденциальных данных

### 6.2 Защита данных

- Шифрование конфиденциальной информации перед отправкой в LLM
- Локальная обработка персональных данных
- Контроль доступа на уровне компонентов

## 7. Performance Strategy

### 7.1 Оптимизации

- **Virtual Scrolling** - для больших списков сообщений
- **Code Splitting** - по фичам и роутам
- **Bundle Optimization** - оптимизированные chunks
- **Memoization** - React.memo для дорогих компонентов

### 7.2 Caching Strategy

- **TanStack Query** - серверное состояние
- **Local Storage** - пользовательские настройки
- **Session Storage** - временные данные сессии

## 8. Testing Strategy

### 8.1 Подходы к тестированию

- **Unit Tests** - компоненты и хуки (Vitest)
- **Integration Tests** - API интеграция
- **E2E Tests** - критические пользовательские сценарии

### 8.2 Test Structure

```
__tests__/
├── unit/
│   ├── components/
│   ├── hooks/
│   └── services/
├── integration/
│   └── api/
└── e2e/
    └── user-flows/
```

## 9. Deployment Architecture

### 9.1 Build Optimization

- **Manual Chunks** - разделение по фичам
- **Tree Shaking** - удаление неиспользуемого кода
- **Asset Optimization** - сжатие изображений и шрифтов

### 9.2 Environment Strategy

- **Development** - hot reload, dev tools
- **Staging** - production build, test data
- **Production** - optimized build, monitoring

## 10. Monitoring & Analytics

### 10.1 Performance Monitoring

- Отслеживание медленных компонентов
- Мониторинг API вызовов
- Bundle size analytics

### 10.2 User Analytics

- Отслеживание использования фич
- Пользовательские метрики
- Error tracking

---

Эта архитектура обеспечивает масштабируемость, производительность и maintainability корпоративного AI-ассистента с высокими требованиями к безопасности.