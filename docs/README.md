# Apilaplas Frontend Documentation

Документация для фронтенд части корпоративного AI-ассистента Apilaplas.

## 📁 Структура документации

### [Architecture Overview](./architecture-overview.md)
Общий обзор архитектуры приложения:
- Слоистая архитектура с Core слоем
- Feature-Driven Development подход
- Структура проекта и основные принципы
- Ключевые архитектурные решения

### [Technology Stack](./tech-stack.md) 
Детальный разбор технологического стека:
- Обоснование выбора каждой библиотеки
- Сравнение с альтернативами
- Примеры использования
- Bundle optimization стратегия

### [Development Guide](./development-guide.md)
Практическое руководство по разработке:
- Правила написания компонентов
- Паттерны для API интеграции
- State management с Zustand
- Performance best practices
- Testing guidelines
- Security practices

### [Core Layer](./core-layer.md)
Детальное описание Core слоя:
- Принципы и ограничения Core слоя
- Доменные типы и интерфейсы
- Бизнес-сервисы и логика
- Глобальные stores
- Валидаторы и константы

## 🚀 Быстрый старт

1. **Изучите архитектуру** - начните с [Architecture Overview](./architecture-overview.md)
2. **Познакомьтесь со стеком** - прочитайте [Technology Stack](./tech-stack.md)
3. **Изучите правила разработки** - ознакомьтесь с [Development Guide](./development-guide.md)
4. **Поймите Core слой** - изучите [Core Layer](./core-layer.md)

## 🎯 Ключевые принципы

### ✅ Type Safety First
- Все API типизированы через Zod схемы
- Type-safe роутинг с TanStack Router
- Строгий TypeScript конфиг

### ✅ Feature-Driven Development
- Организация по бизнес-фичам
- Изолированные компоненты
- Четкие границы ответственности

### ✅ Core Layer без зависимостей
- Чистая бизнес-логика
- Переиспользуемые сервисы
- Независимость от UI фреймворков

### ✅ Performance-First
- Virtual scrolling для больших списков
- Оптимизированные bundle chunks
- Мемоизация критических компонентов

### ✅ Security by Design
- Input sanitization
- XSS protection
- Обфускация персональных данных

## 🛠 Технологический стек

| Категория | Библиотека | Версия |
|-----------|------------|---------|
| **UI Framework** | Chakra UI | v3.0.0 |
| **Routing** | TanStack Router | v1.78.0 |
| **State Management** | Zustand | v5.0.0 |
| **Data Fetching** | TanStack Query | v5.0.0 |
| **Forms** | React Hook Form + Zod | v7.48.0 + v3.22.0 |
| **Real-time** | Socket.io Client | v4.7.0 |
| **Virtual Scrolling** | TanStack Virtual | v3.0.0 |
| **Testing** | Vitest | v2.0.0 |

## 📋 Основные фичи

### 🔹 Chat Interface
- Real-time сообщения через WebSocket
- Virtual scrolling для производительности
- Поддержка файлов и attachments
- Режимы: Normal, Secure, Compare

### 🔹 Verification System
- Проверка достоверности ответов AI
- Поиск по открытым источникам
- Система доверия источников
- Асинхронная проверка фактов

### 🔹 Admin Panel
- Управление пользователями и организациями
- Биллинг и аналитика использования
- Настройки безопасности
- Аудит логи

### 🔹 Authentication & Authorization
- JWT токены с refresh
- RBAC система разрешений
- SSO интеграция
- Multi-factor authentication

## 🔒 Безопасность

- **Data Obfuscation** - автоматическая обфускация персональных данных
- **Input Sanitization** - очистка всех пользовательских данных
- **XSS Protection** - защита от межсайтового скриптинга
- **CSRF Protection** - защита от CSRF атак
- **File Upload Security** - валидация загружаемых файлов

## 📊 Performance

- **Bundle Size** - оптимизированные chunks по фичам
- **Virtual Scrolling** - для больших списков сообщений
- **Caching Strategy** - эффективное кэширование с TanStack Query
- **Code Splitting** - lazy loading компонентов и роутов
- **Memoization** - оптимизация re-renders

## 🧪 Testing

- **Unit Tests** - компоненты и хуки (Vitest)
- **Integration Tests** - API интеграция (MSW)
- **Type Safety** - проверка типов на CI/CD
- **E2E Tests** - критические пользовательские сценарии

## 📈 Мониторинг

- **Performance Monitoring** - отслеживание медленных компонентов
- **Error Tracking** - централизованная обработка ошибок
- **User Analytics** - метрики использования фич
- **Bundle Analysis** - анализ размера бандла

---

**Примечание:** Эта документация предназначена для разработчиков, работающих с кодовой базой Apilaplas Frontend. Для получения дополнительной информации обращайтесь к команде разработки.