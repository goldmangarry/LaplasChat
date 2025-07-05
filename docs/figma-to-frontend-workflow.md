# Figma to Frontend Development Workflow

Этот документ описывает оптимизированный процесс разработки фронтенда с использованием макетов Figma и MCP инструментов.

## Общий процесс

### 1. Получение данных из Figma

#### Шаг 1: Анализ макета
- Получить ссылку на Figma макет от дизайнера
- Извлечь `fileKey` и `nodeId` из URL
- Использовать MCP для получения данных

#### Шаг 2: Получение структуры и изображений
```javascript
// Пример URL: https://figma.com/design/ABC123/ComponentName?node-id=1-2
// fileKey: ABC123
// nodeId: 1:2
```

**Команды MCP для получения данных:**
- `mcp__figma-dev-mode-mcp-server__get_code` - получить код компонента
- `mcp__figma-dev-mode-mcp-server__get_image` - получить изображение
- `mcp__figma-dev-mode-mcp-server__get_variable_defs` - получить переменные дизайна
- `mcp__Framelink_Figma_MCP__get_figma_data` - получить структуру файла

### 2. Анализ требований

#### Определение типа компонента
- **UI компонент** → получить документацию Chakra UI v3
- **Новый роут** → получить документацию TanStack Router
- **Состояние** → получить документацию Zustand
- **API интеграция** → получить документацию TanStack Query

#### Команды для получения документации
```bash
# Chakra UI v3
mcp__context7__resolve-library-id "chakra-ui v3"
mcp__context7__get-library-docs "/chakra-ui/chakra-ui"

# TanStack Router
mcp__context7__resolve-library-id "tanstack router"
mcp__context7__get-library-docs "/tanstack/router"

# Zustand
mcp__context7__resolve-library-id "zustand"
mcp__context7__get-library-docs "/pmndrs/zustand"
```

### 3. Разработка компонента

#### Структура кода
1. **Создать TypeScript типы** на основе данных Figma
2. **Реализовать компонент** согласно архитектуре проекта
3. **Использовать Core Layer** для бизнес-логики
4. **Применить Chakra UI v3** с композиционной структурой

#### Пример структуры компонента
```typescript
// types/ComponentName.ts
export type ComponentNameProps = {
  title: string;
  description?: string;
  variant?: 'primary' | 'secondary';
};

// components/ComponentName/ComponentName.tsx
import { ComponentNameProps } from '../../types/ComponentName';

export const ComponentName = ({ title, description, variant = 'primary' }: ComponentNameProps) => {
  return (
    <Card.Root variant={variant}>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      {description && (
        <Card.Body>
          <Text>{description}</Text>
        </Card.Body>
      )}
    </Card.Root>
  );
};
```

### 4. Финальные проверки

#### Обязательные проверки после разработки
```bash
# 1. Линтинг
yarn lint

# 2. TypeScript проверки
yarn build

# 3. Проверка в браузере
yarn dev
```

#### Использование MCP для браузерного тестирования
```javascript
// Запуск браузера
mcp__playwright__browser_navigate "http://localhost:5173"

// Создание скриншота
mcp__playwright__browser_take_screenshot

// Взаимодействие с элементами
mcp__playwright__browser_click
mcp__playwright__browser_type
```

### 5. Проверка архитектуры проекта

#### Обязательная проверка соблюдения архитектуры
После завершения каждой задачи проверить:

1. **Структура файлов:**
   - Компоненты в `/src/components/FeatureName/`
   - Типы в `/src/types/`
   - Core Layer в `/src/core/`
   - Утилиты в `/src/utils/`

2. **TypeScript конвенции:**
   - Использование `type` вместо `interface`
   - Отсутствие `enum` (использовать union types)
   - Строгая типизация с Zod схемами

3. **Chakra UI v3 паттерны:**
   - Композиционная структура (Component.Root, Component.Item)
   - Правильное использование theme tokens
   - Responsive design patterns

4. **Архитектурные принципы:**
   - Feature-driven организация
   - Изоляция бизнес-логики в Core Layer
   - Отсутствие UI зависимостей в Core Layer

#### Команды для проверки архитектуры
```bash
# Проверить структуру файлов
ls -la src/components/
ls -la src/types/
ls -la src/core/

# Проверить импорты и зависимости
grep -r "import.*from" src/core/ # не должно быть UI импортов
grep -r "interface" src/ # должно быть минимум interface
grep -r "enum" src/ # должно быть минимум enum
```

## Детальный Workflow

### Этап 1: Подготовка
1. **TodoRead()** - проверить текущие задачи
2. **TodoWrite()** - создать план работы
3. Получить ссылку на Figma макет

### Этап 2: Анализ макета
1. Извлечь `fileKey` и `nodeId` из URL
2. Использовать `mcp__figma-dev-mode-mcp-server__get_code` для получения кода
3. Использовать `mcp__figma-dev-mode-mcp-server__get_image` для получения изображения
4. Проанализировать структуру компонента

### Этап 3: Получение документации
1. Определить необходимые библиотеки
2. Использовать `mcp__context7__resolve-library-id` для поиска
3. Использовать `mcp__context7__get-library-docs` для получения документации

### Этап 4: Разработка
1. Создать типы TypeScript
2. Реализовать компонент согласно архитектуре
3. Использовать композиционную структуру Chakra UI v3
4. Обновить состояние задач в TodoWrite

### Этап 5: Тестирование и проверка
1. Запустить `yarn lint`
2. Запустить `yarn build`
3. Запустить `yarn dev`
4. Использовать MCP Playwright для браузерного тестирования
5. Создать скриншот для сравнения с макетом

### Этап 6: Проверка архитектуры
1. Проверить структуру файлов
2. Проверить TypeScript конвенции
3. Проверить Chakra UI v3 паттерны
4. Проверить архитектурные принципы
5. Убедиться в отсутствии нарушений

## Важные принципы

### Архитектурные требования
- **TypeScript-first**: используйте `type` вместо `interface`
- **Chakra UI v3**: композиционная структура (Component.Root, Component.Item)
- **Feature-driven**: организация по бизнес-функциям
- **Core Layer**: бизнес-логика без UI зависимостей

### Обязательные проверки
- Все задачи должны быть отслежены через TodoWrite/TodoRead
- Только одна задача в статусе `in_progress`
- Задача помечается `completed` только при полной готовности
- Всегда проверять работоспособность в браузере
- **Обязательная проверка соблюдения архитектуры проекта**

### Безопасность
- Никогда не комментировать секреты
- Использовать валидацию через Zod
- Санитизация пользовательского ввода

## Примеры команд

### Получение данных Figma
```bash
# Получить код компонента
mcp__figma-dev-mode-mcp-server__get_code nodeId="1:2"

# Получить изображение
mcp__figma-dev-mode-mcp-server__get_image nodeId="1:2"

# Получить переменные
mcp__figma-dev-mode-mcp-server__get_variable_defs nodeId="1:2"
```

### Получение документации
```bash
# Поиск библиотеки
mcp__context7__resolve-library-id "chakra-ui"

# Получение документации
mcp__context7__get-library-docs "/chakra-ui/chakra-ui" topic="components"
```

### Браузерное тестирование
```bash
# Навигация
mcp__playwright__browser_navigate "http://localhost:5173"

# Скриншот
mcp__playwright__browser_take_screenshot

# Взаимодействие
mcp__playwright__browser_click element="button" ref="submit-btn"
```

## Чек-лист для каждой задачи

- [ ] TodoRead() в начале сессии
- [ ] TodoWrite() для планирования задач
- [ ] Получить данные из Figma через MCP
- [ ] Получить документацию необходимых библиотек
- [ ] Создать типы TypeScript
- [ ] Реализовать компонент согласно архитектуре
- [ ] Запустить `yarn lint`
- [ ] Запустить `yarn build`
- [ ] Проверить в браузере через MCP
- [ ] Создать скриншот для сравнения
- [ ] **Проверить соблюдение архитектуры проекта**
- [ ] Обновить статус задач в TodoWrite

## Проверка архитектуры - детальный чек-лист

### Структура файлов
- [ ] Компоненты в правильных папках `/src/components/FeatureName/`
- [ ] Типы в `/src/types/`
- [ ] Core Layer в `/src/core/`
- [ ] Отсутствие UI зависимостей в Core Layer

### TypeScript конвенции
- [ ] Использование `type` вместо `interface`
- [ ] Отсутствие `enum`
- [ ] Строгая типизация
- [ ] Zod схемы для валидации

### Chakra UI v3 паттерны
- [ ] Композиционная структура
- [ ] Правильное использование theme tokens
- [ ] Responsive design
- [ ] Accessibility поддержка

### Архитектурные принципы
- [ ] Feature-driven организация
- [ ] Изоляция бизнес-логики
- [ ] Отсутствие циклических зависимостей
- [ ] Правильная организация импортов

Этот процесс обеспечивает качественную и быструю разработку фронтенда с использованием всех доступных инструментов и строгим соблюдением архитектуры проекта.