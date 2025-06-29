# Progress Tracker Guide для Laplas Chat

## Обзор
Этот документ описывает правила работы с TodoWrite/TodoRead системой для отслеживания прогресса разработки Laplas Chat. Соблюдение этих правил критически важно для координации работы между разными сессиями чата.

## Обязательные правила для ассистента

### 1. Постоянное использование todo системы
- **ВСЕГДА** используй TodoWrite для планирования задач в начале сессии
- **ВСЕГДА** обновляй статус задач в реальном времени (pending → in_progress → completed)
- **НИКОГДА** не работай над задачами без их отслеживания в todo list

### 2. Статусы задач
```typescript
type TaskStatus = 'pending' | 'in_progress' | 'completed'
```

**Правила смены статусов:**
- `pending` → `in_progress`: когда начинаешь работу над задачей
- `in_progress` → `completed`: когда задача ПОЛНОСТЬЮ выполнена
- `in_progress` → `pending`: если встретил блокер или нужно переключиться

**ВАЖНО:** Только ОДНА задача может быть в статусе `in_progress` одновременно!

### 3. Критерии завершения задач
Задача считается `completed` ТОЛЬКО когда:
- ✅ Код написан и работает без ошибок
- ✅ Компонент успешно рендерится в браузере
- ✅ Нет TypeScript ошибок
- ✅ Следует архитектурным принципам проекта

**НЕ отмечай задачу как completed если:**
- ❌ Есть TypeScript ошибки
- ❌ Компонент не рендерится
- ❌ Есть runtime ошибки в консоли
- ❌ Не соответствует макету/требованиям

### 4. Детализация задач
Создавай конкретные, измеримые задачи:

```typescript
// ✅ Хорошо
{
  id: "create-message-component",
  content: "Создать компонент Message с аватаром, текстом и действиями",
  status: "pending",
  priority: "high"
}

// ❌ Плохо  
{
  id: "chat-stuff",
  content: "Сделать чат",
  status: "pending", 
  priority: "medium"
}
```

### 5. Обязательная проверка архитектуры
Перед началом работы **ВСЕГДА** читай:
- `/docs/architecture-overview.md` - общие принципы
- `/docs/tech-stack.md` - технологический стек  
- `/docs/development-guide.md` - паттерны разработки
- `/docs/core-layer.md` - бизнес-логика
- `CLAUDE.md` - инструкции проекта

**ОБЯЗАТЕЛЬНО проверяй:**
- Используешь ли правильную версию Chakra UI (v3 с композиционной структурой)
- Следуешь ли TypeScript conventions (`type` вместо `interface`, без `enum`)
- Создаешь ли компоненты в правильных папках (`src/components/ui`, `src/components/layout`)
- Используешь ли Core Layer для бизнес-логики

## Workflow для новых сессий

### 1. Инициализация (обязательно в начале каждого чата)
```typescript
// 1. Прочитай текущий прогресс
await TodoRead()

// 2. Прочитай архитектурную документацию
await Read('/docs/architecture-overview.md')
await Read('CLAUDE.md')

// 3. Добавь новые задачи если нужно
await TodoWrite([...existingTodos, ...newTodos])
```

### 2. Работа с задачами
```typescript
// Начинаешь работу над задачей
await TodoWrite([
  { ...task, status: 'in_progress' }
])

// Создаешь компонент/код
await Write(componentPath, componentCode)

// Проверяешь что работает без ошибок
// ТОЛЬКО потом отмечаешь как completed

await TodoWrite([
  { ...task, status: 'completed' }
])
```

### 3. Перед переключением между задачами
- Обновляй статус текущей задачи
- Убедись что нет hanging `in_progress` задач
- Создавай новые подзадачи если основная задача оказалась сложнее

## Типичные ошибки (избегай их!)

### ❌ Работа без todo tracking
```typescript
// НЕПРАВИЛЬНО - сразу создаешь код без планирования
await Write('component.tsx', code)
```

### ❌ Множественные in_progress задачи  
```typescript
// НЕПРАВИЛЬНО - две задачи одновременно в работе
[
  { id: 'task1', status: 'in_progress' },
  { id: 'task2', status: 'in_progress' }  // ❌
]
```

### ❌ Преждевременное completed
```typescript
// НЕПРАВИЛЬНО - помечаешь completed при наличии ошибок
// TypeScript Error: Property 'Avatar' does not exist
await TodoWrite([{ ...task, status: 'completed' }]) // ❌
```

### ❌ Игнорирование архитектуры
```typescript
// НЕПРАВИЛЬНО - используешь старый API без проверки docs
<Avatar name="test" /> // ❌ Chakra UI v3 требует Avatar.Root + Avatar.Fallback
```

## Приоритеты задач

### High Priority
- Критические баги (TypeScript ошибки, runtime errors)
- Базовая функциональность (core компоненты)
- Архитектурные задачи

### Medium Priority  
- UI компоненты
- Стилизация
- Интеграции

### Low Priority
- Полировка
- Оптимизации
- Дополнительные features

## Примеры правильного workflow

### Пример 1: Создание нового компонента
```typescript
// 1. Планирование
await TodoWrite([{
  id: 'create-mode-toggle',
  content: 'Создать компонент ModeToggle для переключения Secure/Compare режимов',
  status: 'pending',
  priority: 'high'
}])

// 2. Проверка архитектуры  
await Read('docs/development-guide.md')

// 3. Начало работы
await TodoWrite([{
  id: 'create-mode-toggle', 
  status: 'in_progress',
  // остальные поля без изменений
}])

// 4. Реализация
await Write('src/components/ui/ModeToggle.tsx', componentCode)

// 5. Тестирование и проверка (в браузере/консоли)

// 6. Завершение (только если всё работает!)
await TodoWrite([{
  id: 'create-mode-toggle',
  status: 'completed', 
  // остальные поля без изменений
}])
```

### Пример 2: Исправление ошибки
```typescript
// 1. Обнаружена ошибка
console.error("Avatar component not rendering")

// 2. Создаешь задачу для исправления  
await TodoWrite([{
  id: 'fix-avatar-v3-structure',
  content: 'Исправить структуру Avatar для Chakra UI v3 (использовать Avatar.Root + Avatar.Fallback)',
  status: 'in_progress',
  priority: 'high'  
}])

// 3. Исследуешь проблему
await Read('src/components/ui/ChatItem.tsx') 
// Проверяешь документацию по Chakra UI v3

// 4. Исправляешь
await Edit('src/components/ui/ChatItem.tsx', oldCode, newCode)

// 5. Проверяешь в браузере что ошибка исчезла

// 6. Отмечаешь как completed
await TodoWrite([{
  id: 'fix-avatar-v3-structure',
  status: 'completed',
  // остальные поля
}])
```

## Заключение

Соблюдение этих правил критически важно для:
- Координации между разными сессиями чата  
- Поддержания качества кода
- Соблюдения архитектурных принципов
- Избежания дублирования работы
- Отслеживания прогресса проекта

**Помни: лучше потратить 2 минуты на обновление todo, чем час на исправление архитектурных ошибок!**