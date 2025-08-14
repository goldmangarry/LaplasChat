# План реализации центральной области чата

## Обзор
Центральная область чата имеет 2 состояния:
1. **Приветственный экран** - чат не выбран, показывается инпут с настройками, надпись "LaplasChat" и 3 карточки подсказок
2. **Активный чат** - чат выбран, показывается история сообщений и инпут снизу

## Архитектурное решение

### URL-based маршрутизация без принудительных редиректов
- **`/`** - приветственный экран (состояние 1: чат не выбран)
- **`/chat/{dialogId}`** - активный чат (состояние 2: чат выбран)
- **Временные ID**: `temp-{uuid}` для новых чатов до получения реального ID с сервера

### Решение проблемы с dialog_id
**Проблема:** При отправке первого сообщения мы не знаем `dialog_id` чата.

**Решение:**
1. Генерируем временный ID: `temp-${crypto.randomUUID()}`
2. Создаем название из первых 50 символов промпта пользователя
3. Сразу переходим на `/chat/{tempDialogId}` 
4. При получении ответа обновляем URL с реальным ID через `history.replaceState()` (без перезагрузки)

**Обработка переключений:**
- Если пользователь переключился на другой чат → временный чат остается в store, обновляется в фоне
- Если пользователь остался в том же чате → плавное обновление URL с реальным ID
- Сайдбар показывает временные чаты с именами из промптов до получения реальных данных

## Система настроек чатов

### Типы настроек
```typescript
// core/chat/types.ts
type ChatSettings = {
  model: string;           // для отправки на сервер (например: "gpt-4o-mini")
  provider: ModelProvider; // для отображения иконки провайдера ("openai" | "anthropic")
  max_tokens: number;      // для отправки на сервер
  temperature: number;     // для отправки на сервер (0.0 - 2.0)
  has_encrypted_messages: boolean; // Secure mode
};

type DefaultChatSettings = ChatSettings; // дефолтные настройки для нового чата
```

### Состояние в Zustand store
```typescript
// core/chat/store.ts
type ChatState = {
  activeDialogId: string | null;
  defaultSettings: ChatSettings; // дефолтные настройки
  
  // Настройки существующих чатов (синхронизируется с сервером)
  chatSettings: Map<string, ChatSettings>;
  
  // Временные чаты с их настройками
  tempChats: Map<string, {
    name: string; // первые 50 символов промпта пользователя
    messages: ChatMessage[];
    settings: ChatSettings; // настройки зафиксированы при отправке первого запроса
    isWaitingForResponse: boolean;
    realDialogId?: string;
  }>;
  
  // Получение текущих активных настроек
  getCurrentSettings: () => ChatSettings;
};
```

### Логика приоритета настроек
Функция `getCurrentSettings()` возвращает настройки по приоритету:
1. **Временный чат активен** → настройки временного чата
2. **Существующий чат активен** → настройки из `chatSettings` Map
3. **Нет активного чата** → дефолтные настройки

### API маршрутизация запросов
- `has_encrypted_messages: false` → отправка на `/api/chat`
- `has_encrypted_messages: true` → отправка на `/api/chat/secure-mode`

### Дефолтные настройки (предварительные)
```typescript
const DEFAULT_CHAT_SETTINGS: ChatSettings = {
  model: "gpt-4o-mini",
  provider: "openai", 
  max_tokens: 4000,
  temperature: 0.7,
  has_encrypted_messages: false
};
```

## Структура компонентов

### Core Layer (бизнес-логика)
- **`src/core/chat/store.ts`** - Zustand store для управления состоянием чата и настройками
- **`src/core/chat/types.ts`** - типы для настроек чата и состояния
- **`src/core/chat/helpers.ts`** - утилиты для работы с временными ID и названиями

### Widget Layer (сложные переиспользуемые компоненты)
- **`src/widgets/chat-area/`** - основной виджет центральной области
  - `index.ts` - экспорт виджета
  - `ui/index.tsx` - переключатель между состояниями
  - `ui/components/chat-welcome/` - приветственный экран
  - `ui/components/chat-view/` - активный чат с историей
  - `ui/components/suggestion-cards/` - 3 карточки с подсказками
  - `model/` - бизнес-логика виджета

- **`src/widgets/chat-header/`** - хедер чата с основными настройками
  - `ui/index.tsx` - основной компонент хедера
  - `ui/components/model-selector/` - селектор модели с иконками провайдеров

- **`src/widgets/chat-settings-drawer/`** - правый drawer с дополнительными настройками
  - `ui/index.tsx` - основной компонент drawer'а
  - `ui/components/parameter-sliders/` - слайдеры для max_tokens и temperature
  - `ui/components/advanced-settings/` - дополнительные настройки

### Features Layer (бизнес-функции)
- **`src/features/chat-input/`** - инпут для отправки сообщений
  - `index.ts` - экспорт feature
  - `ui/index.tsx` - основной компонент инпута
  - `ui/components/secure-toggle/` - переключатель Secure mode с иконкой щита
  - `ui/components/send-button/` - кнопка отправки сообщения
  - `model/` - бизнес-логика отправки сообщений
    - `store.ts` - состояние инпута (текст, loading)
    - `helpers.ts` - утилиты для отправки
    - `types.ts` - типы для feature

### UI Components (простые переиспользуемые компоненты)
- **`src/components/shared/message-list/`** - список сообщений с loading состояниями
- **`src/components/shared/provider-icon/`** - иконки провайдеров моделей

### Routing Layer
- **`src/routes/chat.$dialogId.tsx`** - динамический роут для чатов
  - Поддерживает как реальные, так и временные ID (с префиксом `temp-`)
  - Загружает историю сообщений для реальных чатов
  - Отображает временные сообщения для temp чатов
- **Обновление `src/routes/index.tsx`** - интеграция ChatArea виджета

## Расположение элементов управления

### Chat Header (хедер чата)
**Расположение:** Сверху в области чата
**Содержимое:**
- Селектор модели с иконкой провайдера (dropdown)
- Кнопка открытия drawer'а с дополнительными настройками

### Chat Input (инпут для сообщений)
**Расположение:** Снизу в области чата
**Содержимое:**
- Поле ввода текста сообщения
- Toggle для Secure mode (переключатель с иконкой щита)
- Кнопка отправки

### Settings Drawer (правый drawer)
**Расположение:** Справа, открывается по клику на кнопку в хедере
**Содержимое:**
- Слайдер Max Tokens с числовым значением
- Слайдер Temperature с числовым значением
- Возможность добавления дополнительных настроек в будущем

### Логика отображения
- **Приветственный экран (/):** хедер с дефолтными настройками
- **Активный чат (/chat/{id}):** хедер с настройками конкретного чата
- **Временный чат:** хедер с зафиксированными настройками

## Пользовательские сценарии

### Сценарий 1: Дефолтное состояние (/)
- Показываем приветственный экран с надписью "LaplasChat"
- Хедер отображает дефолтные настройки (можно менять)
- 3 карточки с подсказками для быстрой отправки
- Инпут для ввода сообщения

### Сценарий 2: Отправка первого сообщения
1. Пользователь вводит сообщение или нажимает на подсказку
2. Генерируем временный ID и название чата (первые 50 символов)
3. Фиксируем текущие настройки из хедера для временного чата
4. Переходим на `/chat/{tempDialogId}`
5. Отправляем запрос на соответствующий endpoint (обычный/secure)
6. Показываем сообщение пользователя и индикатор загрузки ответа

### Сценарий 3: Получение ответа от сервера
1. Получаем реальный `dialog_id` в ответе
2. Обновляем временный чат с реальным ID
3. Если пользователь все еще в этом чате → обновляем URL через `history.replaceState()`
4. Показываем ответ ассистента
5. Инвалидируем кеш списка чатов для обновления сайдбара

### Сценарий 4: Переключение между чатами
- При клике на чат в сайдбаре → переход на `/chat/{dialogId}`
- Хедер обновляется с настройками выбранного чата
- Для реальных чатов → получаем историю через API
- Для временных чатов → показываем сохраненные сообщения из store

### Сценарий 5: Изменение настроек
- **В хедере:** изменение модели применяется мгновенно
- **В инпуте:** изменение secure mode применяется мгновенно
- **В drawer:** изменение параметров применяется мгновенно
- В дефолтном состоянии → изменения применяются к `defaultSettings`
- В активном чате → изменения применяются к настройкам конкретного чата
- При следующей отправке сообщения используются актуальные настройки

## Синхронизация с сервером

### Загрузка существующих чатов
- При получении списка чатов через `/api/chat/history`
- Извлекаем настройки из поля `last_model_info` каждого диалога
- Сохраняем в `chatSettings` Map по `dialog_id`

### Создание реального чата
- При получении ответа с реальным `dialog_id`
- Переносим настройки из временного чата в `chatSettings`
- Обновляем временный чат с `realDialogId`
- Синхронизируем с React Query кешем

### Обновление NavChats
- NavChats уже готов - показывает иконку `ShieldCheck` для зашифрованных чатов
- При создании нового чата автоматически появится в списке после инвалидации кеша

## Интернационализация

### Новые ключи для переводов
```json
// src/shared/locales/en.json и ru.json
{
  "chatArea": {
    "welcome": "LaplasChat",
    "placeholder": "Type your message...",
    "send": "Send",
    "waitingResponse": "Waiting for response...",
    "suggestions": {
      "explainPhysics": "Explain quantum physics",
      "writePoem": "Write a poem about coding", 
      "helpCoding": "Help me with a coding problem"
    }
  },
  "chatHeader": {
    "model": "Model",
    "openSettings": "Settings"
  },
  "chatInput": {
    "secureMode": "Secure Mode",
    "placeholder": "Type your message...",
    "send": "Send"
  },
  "chatSettings": {
    "title": "Chat Settings",
    "maxTokens": "Max Tokens", 
    "temperature": "Temperature",
    "advancedSettings": "Advanced Settings"
  }
}
```

## Детали реализации

### Генерация временного ID и названия
```typescript
const generateTempChat = (userMessage: string) => {
  const tempDialogId = `temp-${crypto.randomUUID()}`;
  const tempChatName = userMessage.slice(0, 50) + (userMessage.length > 50 ? '...' : '');
  return { tempDialogId, tempChatName };
};
```

### Обновление URL без редиректа
```typescript
const updateUrlWithRealId = (tempId: string, realId: string) => {
  if (window.location.pathname === `/chat/${tempId}`) {
    window.history.replaceState(null, '', `/chat/${realId}`);
  }
};
```

### React Query интеграция
- Используем существующие хуки из `src/core/api/chat/hooks.ts`
- При получении реального ID инвалидируем кеш: `queryClient.invalidateQueries(['chat', 'history'])`
- Для временных чатов не делаем запросы к серверу

## Компоненты UI

### ChatHeader
```typescript
// Показывает текущие настройки и позволяет их изменять
interface ChatHeaderProps {
  settings: ChatSettings;
  onSettingsChange: (settings: Partial<ChatSettings>) => void;
  onOpenDrawer: () => void;
}
```

### SettingsDrawer
```typescript
// Drawer с параметрами max_tokens и temperature
interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Pick<ChatSettings, 'max_tokens' | 'temperature'>;
  onSettingsChange: (settings: Partial<ChatSettings>) => void;
}
```

### ModelSelector
```typescript
// Dropdown с выбором модели и иконкой провайдера
interface ModelSelectorProps {
  selectedModel: string;
  selectedProvider: ModelProvider;
  onModelChange: (model: string, provider: ModelProvider) => void;
  models: Model[]; // список доступных моделей
}
```

## Безопасность

### Обработка Secure Mode
- При `has_encrypted_messages: true` все запросы идут на `/api/chat/secure-mode`
- В NavChats автоматически показывается иконка щита
- Пользователь может переключать режим в инпуте чата (toggle с иконкой щита)

### Валидация настроек
- `temperature` ограничена диапазоном 0.0 - 2.0
- `max_tokens` имеет разумные ограничения в зависимости от модели
- `model` валидируется против списка доступных моделей

## Производительность

### Оптимизации
- Временные чаты хранятся только в клиентском store (не на сервере до получения ответа)
- Ленивая загрузка истории сообщений только при переходе в чат
- Дебаунс при изменении настроек для избежания частых перерендеров
- Мемоизация компонентов настроек

### Управление памятью
- Очистка временных чатов после получения реальных ID
- Ограничение количества сообщений в истории чата
- Периодическая очистка неактивных чатов из кеша