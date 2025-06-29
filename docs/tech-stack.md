# Technology Stack
# Технологический стек Apilaplas Frontend

## 1. Основные библиотеки

### 1.1 Финальный package.json

```json
{
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    
    // Routing (type-safe)
    "@tanstack/react-router": "^1.78.0",
    
    // UI Framework
    "@chakra-ui/react": "^3.0.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "framer-motion": "^11.0.0",
    
    // State Management
    "zustand": "^5.0.0",
    "immer": "^10.0.0",
    
    // Data Fetching
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    
    // Forms & Validation
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    
    // Real-time Communication
    "socket.io-client": "^4.7.0",
    
    // Performance
    "@tanstack/react-virtual": "^3.0.0",
    
    // Icons & Utilities
    "react-icons": "^5.0.0",
    "date-fns": "^3.0.0"
  },
  
  "devDependencies": {
    "@tanstack/router-devtools": "^1.78.0",
    "@tanstack/router-cli": "^1.78.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "msw": "^2.0.0"
  }
}
```

## 2. Обоснование выбора библиотек

### 2.1 UI Framework: Chakra UI v3

**Почему Chakra UI:**
✅ **Простота кастомизации тем** - критично для корпоративных клиентов  
✅ **Отличная поддержка ИИ** - Claude прекрасно знает Chakra UI  
✅ **Accessibility из коробки** - важно для корпоративного приложения  
✅ **Композиционный подход** - идеально для чат-интерфейса  
✅ **TypeScript first** - полная типизация  

**Пример кастомизации под клиента:**
```typescript
const createClientTheme = (clientColors: ClientColors) => 
  extendTheme({
    colors: {
      brand: clientColors.primary,
      secondary: clientColors.secondary,
    },
    fonts: {
      heading: clientColors.headingFont || 'Inter, sans-serif',
      body: clientColors.bodyFont || 'Inter, sans-serif',
    },
    components: {
      Button: {
        defaultProps: { colorScheme: 'brand' },
      },
    },
  });
```

**Альтернативы рассмотренные:**
- ❌ **Radix + Tailwind** - слишком много настройки для быстрой разработки
- ❌ **Mantine** - хорошо, но Chakra лучше для тем
- ❌ **MUI** - тяжелый, сложнее кастомизация

### 2.2 State Management: Zustand

**Почему Zustand:**
✅ **Простота** - минимальный boilerplate по сравнению с Redux  
✅ **TypeScript поддержка** - отличная типизация  
✅ **Производительность** - меньше re-renders  
✅ **Хорошая поддержка ИИ** - современная библиотека  
✅ **Real-time ready** - легко интегрируется с WebSocket  

**Пример store:**
```typescript
type ChatStore = {
  messages: Message[];
  currentChat: Chat | null;
  addMessage: (message: Message) => void;
  setCurrentChat: (chat: Chat) => void;
};

const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  currentChat: null,
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  setCurrentChat: (chat) => set({ currentChat: chat }),
}));
```

**vs Redux Toolkit:**
- Redux: больше boilerplate, но мощнее для сложной логики
- Zustand: проще, достаточно для чат-приложения

### 2.3 Routing: TanStack Router

**Почему TanStack Router:**
✅ **100% type-safe** - ошибки роутинга на этапе компиляции  
✅ **Search params как first-class citizens** - критично для чата  
✅ **Отличная производительность** - code splitting, preloading  
✅ **Современность** - активно развивается, хорошая поддержка ИИ  

**Пример типизированного роутинга:**
```typescript
const chatDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat/$chatId',
  validateSearch: z.object({
    mode: z.enum(['normal', 'secure', 'compare']).default('normal'),
    model: z.string().optional(),
  }),
  component: ChatInterface,
});

// В компоненте - полностью типизировано!
const { chatId } = chatDetailRoute.useParams();
const { mode, model } = chatDetailRoute.useSearch();
```

**vs React Router:**
- React Router: проще, но без type safety
- TanStack Router: сложнее настройка, но полная типизация

### 2.4 Data Fetching: TanStack Query

**Почему TanStack Query:**
✅ **Отличное кэширование** - автоматическая синхронизация данных  
✅ **Real-time поддержка** - легко интегрируется с WebSocket  
✅ **Оптимистичные обновления** - важно для чата  
✅ **Background refetching** - данные всегда актуальны  
✅ **TypeScript поддержка** - полная типизация  

**Пример API хука:**
```typescript
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessageAPI,
    onMutate: async (newMessage) => {
      // Оптимистичное обновление
      const optimisticMessage = { ...newMessage, status: 'pending' };
      queryClient.setQueryData(['messages', newMessage.chatId], old => 
        [...old, optimisticMessage]
      );
    },
    onSuccess: (realMessage) => {
      // Заменяем оптимистичное сообщение настоящим
      queryClient.setQueryData(['messages', realMessage.chatId], old =>
        old.map(msg => msg.id === realMessage.tempId ? realMessage : msg)
      );
    },
  });
};
```

**vs SWR/Apollo:**
- SWR: проще, но меньше возможностей
- Apollo: мощнее, но только для GraphQL
- TanStack Query: лучший баланс для REST API

### 2.5 Forms: React Hook Form + Zod

**Почему React Hook Form:**
✅ **Производительность** - минимальные re-renders  
✅ **TypeScript интеграция** - с Zod полная типизация  
✅ **Гибкость** - любые UI библиотеки  
✅ **Хорошая поддержка ИИ**  

**Пример типизированной формы:**
```typescript
const messageSchema = z.object({
  content: z.string().min(1).max(4000),
  attachments: z.array(z.string()).optional(),
});

type MessageForm = z.infer<typeof messageSchema>;

const MessageInput = () => {
  const { control, handleSubmit } = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
  });

  return (
    <Controller
      name="content"
      control={control}
      render={({ field, fieldState }) => (
        <Textarea
          {...field}
          isInvalid={!!fieldState.error}
          placeholder="Type your message..."
        />
      )}
    />
  );
};
```

**vs Formik:**
- Formik: проще API, но больше re-renders
- RHF: сложнее, но лучше производительность

### 2.6 Real-time: Socket.io

**Почему Socket.io:**
✅ **Надежность** - fallback на polling при проблемах с WebSocket  
✅ **Reconnection logic** - автоматическое переподключение  
✅ **Namespace support** - изоляция чатов  
✅ **Хорошая поддержка ИИ**  

**vs нативный WebSocket:**
- Native WebSocket: легче, но нужно самостоятельно реализовывать reconnection
- Socket.io: тяжелее, но более надежный для продакшена

### 2.7 Performance: TanStack Virtual

**Почему TanStack Virtual:**
✅ **Современность** - новая версия react-window  
✅ **TypeScript поддержка** - полная типизация  
✅ **Гибкость** - поддержка сложных сценариев  
✅ **Производительность** - оптимизировано для больших списков  

**Пример виртуализации:**
```typescript
const MessageList = ({ messages }: { messages: Message[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 10,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <MessageItem
            key={virtualRow.index}
            message={messages[virtualRow.index]}
            style={{ height: virtualRow.size }}
          />
        ))}
      </div>
    </div>
  );
};
```

### 2.8 Icons: React Icons

**Почему React Icons:**
✅ **Большой выбор** - иконки из множества пакетов  
✅ **Tree shaking** - импортируются только используемые иконки  
✅ **Простота использования** - как обычные React компоненты  
✅ **Хорошая поддержка ИИ**  

**vs Lucide:**
- Lucide: красивее, но меньше выбор
- React Icons: больше выбор, хорошо для разных стилей

### 2.9 Date/Time: date-fns

**Почему date-fns:**
✅ **Tree-shakeable** - импортируются только нужные функции  
✅ **Функциональный подход** - immutable операции  
✅ **TypeScript поддержка** - полная типизация  
✅ **Модульность** - каждая функция отдельно  

**vs dayjs/moment:**
- moment: deprecated, тяжелый
- dayjs: легче, но меньше функций
- date-fns: лучший баланс

### 2.10 Validation: Zod

**Почему Zod:**
✅ **TypeScript first** - схемы генерируют типы  
✅ **Runtime validation** - валидация в runtime  
✅ **Композиция схем** - легко переиспользовать  
✅ **Отличная поддержка ИИ**  

**Пример схемы:**
```typescript
const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  permissions: z.array(z.nativeEnum(Permission)),
});

type User = z.infer<typeof userSchema>; // Автоматическая типизация!
```

## 3. Dev Tools и Testing

### 3.1 Testing: Vitest

**Почему Vitest:**
✅ **Интеграция с Vite** - использует ту же конфигурацию  
✅ **Скорость** - быстрее Jest  
✅ **ESM поддержка** - нативная поддержка ES модулей  
✅ **TypeScript из коробки**  

**vs Jest:**
- Jest: более зрелый, больше плагинов
- Vitest: быстрее, лучше интеграция с Vite

### 3.2 Mocking: MSW

**Почему MSW (Mock Service Worker):**
✅ **Реалистичное тестирование** - перехватывает реальные HTTP запросы  
✅ **Browser/Node поддержка** - работает везде  
✅ **TypeScript поддержка**  

## 4. Архитектурные паттерны стека

### 4.1 Data Flow

```
User Action → Component → Hook → API/Store → TanStack Query → Cache → UI Update
                   ↓
              WebSocket → Real-time Update → Store → UI Update
```

### 4.2 State Layers

```
UI State (local useState) ← Immediate interactions
     ↓
Feature State (Zustand) ← Feature-specific state
     ↓
Global State (Zustand) ← User, config, UI state
     ↓
Server State (TanStack Query) ← API data, cache
```

### 4.3 Type Safety Flow

```
Zod Schema → TypeScript Types → Component Props → API Contracts → Runtime Validation
```

## 5. Bundle Optimization

### 5.1 Code Splitting Strategy

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core chunks
          react: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
          ui: ['@chakra-ui/react', '@emotion/react'],
          
          // Feature chunks
          chat: ['./src/features/chat'],
          admin: ['./src/features/admin'],
          
          // Utility chunks
          utils: ['date-fns', 'zod'],
          icons: ['react-icons'],
        },
      },
    },
  },
});
```

### 5.2 Performance Targets

- **Initial Bundle**: < 250KB gzipped
- **Chat Feature**: < 100KB gzipped  
- **Admin Feature**: < 150KB gzipped
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s

---

Этот стек обеспечивает отличный баланс между простотой разработки, производительностью и поддержкой ИИ-ассистентов для быстрой итерации.