# Development Guide
# Руководство по разработке Apilaplas Frontend

## 0. TypeScript Conventions

### Используем type вместо interface
```typescript
// ❌ Не рекомендуется
interface User {
  id: string;
  name: string;
}

// ✅ Рекомендуется
type User = {
  id: string;
  name: string;
};
```

### Избегаем enum в пользу современных альтернатив
```typescript
// ❌ Не используем enum
enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending'
}

// ✅ Вариант 1: Const assertion object
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending'
} as const;
export type Status = typeof STATUS[keyof typeof STATUS];

// Использование:
const userStatus: Status = STATUS.ACTIVE;

// ✅ Вариант 2: Union types
export type Status = 'active' | 'inactive' | 'pending';

// ✅ Вариант 3: Для сложных случаев с дополнительными данными
export const STATUS_CONFIG = {
  active: { label: 'Active', color: 'green' },
  inactive: { label: 'Inactive', color: 'gray' },
  pending: { label: 'Pending', color: 'yellow' }
} as const;
export type StatusKey = keyof typeof STATUS_CONFIG;
```

### Преимущества type над interface
- Более гибкий синтаксис для union и intersection types
- Лучше работает с utility types
- Консистентность в кодовой базе
- Поддержка mapped types и conditional types

### Современные TypeScript паттерны
```typescript
// Satisfies operator для типобезопасных объектов
export const ROUTES = {
  home: '/',
  chat: '/chat',
  settings: '/settings'
} as const satisfies Record<string, string>;

// Template literal types
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiEndpoint = `/api/${string}`;

// Discriminated unions
type ApiResponse<T> = 
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' };
```

## 1. Правила разработки компонентов

### 1.1 Naming Conventions

```typescript
// ✅ Компоненты - PascalCase
export const MessageList = () => {};
export const ChatSidebar = () => {};

// ✅ Хуки - camelCase с префиксом 'use'
export const useChat = () => {};
export const useMessages = () => {};

// ✅ Типы - PascalCase (используем type, не interface)
export type Message = {
  id: string;
  content: string;
  timestamp: Date;
  // ...
};
export type MessageStatus = 'pending' | 'sent' | 'delivered';

// ✅ Константы - SCREAMING_SNAKE_CASE
export const MAX_MESSAGE_LENGTH = 4000;
export const API_ENDPOINTS = {};

// ✅ Современный подход вместо enum
// ❌ Не используем enum
enum MessageStatus {
  Pending = 'pending',
  Sent = 'sent',
  Delivered = 'delivered'
}

// ✅ Используем const assertion
export const MESSAGE_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  DELIVERED: 'delivered'
} as const;
export type MessageStatus = typeof MESSAGE_STATUS[keyof typeof MESSAGE_STATUS];

// ✅ Или прямо union type
export type ChatMode = 'normal' | 'secure' | 'compare';

// ✅ Файлы и папки
// - Компоненты: PascalCase (MessageList.tsx)
// - Хуки: camelCase (useChat.ts)
// - Утилиты: camelCase (formatDate.ts)
// - Типы: camelCase с суффиксом (.types.ts)
// - API: camelCase с суффиксом (.api.ts)
```

### 1.2 Component Structure

```typescript
// Структура компонента (порядок важен!)
type MessageItemProps = {
  message: Message;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  className?: string;
  'data-testid'?: string;
};

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onEdit,
  onDelete,
  className,
  ...props
}) => {
  // 1. Хуки состояния (useState, useRef)
  const [isEditing, setIsEditing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // 2. Хуки из stores/context
  const { user } = useAuthStore();
  const { theme } = useUIStore();
  
  // 3. Хуки API/data fetching
  const { mutate: deleteMessage } = useDeleteMessage();
  
  // 4. Вычисляемые значения (useMemo)
  const canEdit = useMemo(() => 
    MessageService.canEdit(message, user?.id), 
    [message, user?.id]
  );
  
  const formattedTime = useMemo(() =>
    MessageService.formatTimestamp(message.timestamp),
    [message.timestamp]
  );
  
  // 5. Колбэки (useCallback)
  const handleEdit = useCallback(() => {
    if (canEdit && onEdit) {
      setIsEditing(true);
      onEdit(message.id);
    }
  }, [canEdit, message.id, onEdit]);
  
  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(message.id);
    }
  }, [message.id, onDelete]);
  
  // 6. Эффекты (useEffect)
  useEffect(() => {
    if (isEditing) {
      // Focus на input при редактировании
    }
  }, [isEditing]);
  
  // 7. Условный рендер
  if (!message) {
    return null;
  }
  
  // 8. Основной рендер
  return (
    <Box className={className} {...props}>
      {/* JSX содержимое */}
    </Box>
  );
};

// 9. Экспорт с memo если нужно
export default React.memo(MessageItem);
```

### 1.3 Props Guidelines

```typescript
// ✅ Хорошо - четкие, типизированные props
type ChatInterfaceProps = {
  chatId: string;
  mode?: 'normal' | 'secure' | 'compare';
  onMessageSend?: (message: string) => void;
  className?: string;
  'data-testid'?: string;
};

// ❌ Плохо - слишком много props, нет типизации
type BadComponentProps = {
  data: any;
  config: any;
  handlers: any;
  styles: any;
};

// ✅ Хорошо - группировка связанных props
type MessageListProps = {
  messages: Message[];
  user: User;
  config: ChatConfig;
  actions: MessageActions;
};

type MessageActions = {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
  onReply: (id: string) => void;
};

// ✅ Хорошо - композиция через children
type LayoutProps = {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
};
```

## 2. State Management с Zustand

### 2.1 Store Structure

```typescript
// Структура store (всегда одинаковая)
type ChatStore = {
  // 1. State
  currentChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  // 2. Actions (глаголы)
  setCurrentChat: (chat: Chat) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (messageId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // 3. Computed (геттеры)
  getMessageById: (messageId: string) => Message | undefined;
  getUnreadCount: () => number;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  // State
  currentChat: null,
  messages: [],
  isLoading: false,
  error: null,

  // Actions
  setCurrentChat: (chat) => set({ currentChat: chat }),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),

  updateMessage: (messageId, updates) => set((state) => ({
    messages: state.messages.map(msg =>
      msg.id === messageId ? { ...msg, ...updates } : msg
    ),
  })),

  deleteMessage: (messageId) => set((state) => ({
    messages: state.messages.filter(msg => msg.id !== messageId),
  })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Computed
  getMessageById: (messageId) => {
    const { messages } = get();
    return messages.find(msg => msg.id === messageId);
  },

  getUnreadCount: () => {
    const { messages } = get();
    return messages.filter(msg => !msg.isRead).length;
  },
}));
```

### 2.2 Store Best Practices

```typescript
// ✅ Используйте immer для сложных обновлений
import { immer } from 'zustand/middleware/immer';

const useChatStore = create<ChatStore>()(
  immer((set, get) => ({
    messages: [],
    
    addMessage: (message) => set((state) => {
      state.messages.push(message);
    }),
    
    updateMessage: (messageId, updates) => set((state) => {
      const message = state.messages.find(m => m.id === messageId);
      if (message) {
        Object.assign(message, updates);
      }
    }),
  }))
);

// ✅ Селекторы для оптимизации
const useCurrentChat = () => useChatStore(state => state.currentChat);
const useMessages = () => useChatStore(state => state.messages);
const useChatActions = () => useChatStore(state => ({
  setCurrentChat: state.setCurrentChat,
  addMessage: state.addMessage,
}));

// ✅ Подписка на изменения
const MessageCount = () => {
  const messageCount = useChatStore(state => state.messages.length);
  return <Text>{messageCount} messages</Text>;
};
```

## 3. API Integration с TanStack Query

### 3.1 Query Keys Factory

```typescript
// Всегда создавайте query keys factory
export const chatKeys = {
  all: ['chats'] as const,
  lists: () => [...chatKeys.all, 'list'] as const,
  list: (filters: string) => [...chatKeys.lists(), { filters }] as const,
  details: () => [...chatKeys.all, 'detail'] as const,
  detail: (id: string) => [...chatKeys.details(), id] as const,
  messages: (chatId: string) => [...chatKeys.detail(chatId), 'messages'] as const,
} as const;
```

### 3.2 API Hooks Pattern

```typescript
// Паттерн для API хуков
// 1. Query hook
export const useChat = (chatId: string) => {
  return useQuery({
    queryKey: chatKeys.detail(chatId),
    queryFn: async () => {
      const response = await apiClient.get<Chat>(`/chats/${chatId}`);
      return response.data;
    },
    enabled: !!chatId,
    staleTime: 1000 * 60 * 5, // 5 минут
  });
};

// 2. Mutation hook с оптимистичными обновлениями
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SendMessageRequest) => {
      const response = await apiClient.post<Message>(
        `/chats/${data.chatId}/messages`,
        data
      );
      return response.data;
    },
    
    // Оптимистичное обновление
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({ 
        queryKey: chatKeys.messages(newMessage.chatId) 
      });

      const previousMessages = queryClient.getQueryData(
        chatKeys.messages(newMessage.chatId)
      );

      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        ...newMessage,
        status: MESSAGE_STATUS.PENDING,
        timestamp: new Date(),
      };

      queryClient.setQueryData(
        chatKeys.messages(newMessage.chatId),
        (old: Message[] = []) => [...old, optimisticMessage]
      );

      return { previousMessages, optimisticMessage };
    },
    
    // Успешное выполнение
    onSuccess: (realMessage, variables, context) => {
      queryClient.setQueryData(
        chatKeys.messages(variables.chatId),
        (old: Message[] = []) =>
          old.map(msg =>
            msg.id === context?.optimisticMessage.id ? realMessage : msg
          )
      );
    },
    
    // Ошибка - откат изменений
    onError: (error, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          chatKeys.messages(variables.chatId),
          context.previousMessages
        );
      }
    },
  });
};

// 3. Infinite query для пагинации
export const useInfiniteMessages = (chatId: string) => {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(chatId),
    queryFn: ({ pageParam = 1 }) =>
      fetchMessages(chatId, { page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!chatId,
  });
};
```

### 3.3 Error Handling

```typescript
// Глобальный error handler
export const useErrorHandler = () => {
  const toast = useToast();

  return useCallback((error: any) => {
    const message = error?.response?.data?.message || error?.message || 'Something went wrong';
    
    toast({
      title: 'Error',
      description: message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }, [toast]);
};

// Использование в хуках
export const useSendMessage = () => {
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: sendMessageAPI,
    onError: handleError,
  });
};
```

## 4. TanStack Router Patterns

### 4.1 Route Definition

```typescript
// Паттерн определения роутов
const chatDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat/$chatId',
  
  // Валидация search params
  validateSearch: z.object({
    mode: z.enum(['normal', 'secure', 'compare']).default('normal'),
    model: z.string().optional(),
    page: z.number().default(1),
  }),
  
  // Предзагрузка данных
  loader: async ({ params, context }) => {
    const [chat, messages] = await Promise.all([
      queryClient.ensureQueryData({
        queryKey: chatKeys.detail(params.chatId),
        queryFn: () => fetchChat(params.chatId),
      }),
      queryClient.ensureQueryData({
        queryKey: chatKeys.messages(params.chatId),
        queryFn: () => fetchMessages(params.chatId),
      }),
    ]);
    
    return { chat, messages };
  },
  
  // Компонент
  component: ChatInterface,
  
  // Защита роута
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/auth/login' });
    }
  },
});
```

### 4.2 Navigation Patterns

```typescript
// Типизированная навигация
const ChatInterface = () => {
  const navigate = useNavigate({ from: chatDetailRoute.fullPath });
  const { chatId } = chatDetailRoute.useParams();
  const { mode, model } = chatDetailRoute.useSearch();

  // Обновление search params
  const switchMode = (newMode: 'normal' | 'secure' | 'compare') => {
    navigate({
      search: (prev) => ({ ...prev, mode: newMode }),
    });
  };

  // Навигация к другому чату
  const openChat = (newChatId: string) => {
    navigate({
      to: '/chat/$chatId',
      params: { chatId: newChatId },
      search: { mode: 'normal' },
    });
  };

  return (
    <Box>
      <ChatModeSelector mode={mode} onChange={switchMode} />
      <MessageList chatId={chatId} />
    </Box>
  );
};
```

## 5. Custom Hooks Patterns

### 5.1 Composition Pattern

```typescript
// Композиция хуков
export const useChat = (chatId: string) => {
  // Data
  const { data: chat, isLoading: chatLoading } = useQuery({
    queryKey: chatKeys.detail(chatId),
    queryFn: () => fetchChat(chatId),
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: chatKeys.messages(chatId),
    queryFn: () => fetchMessages(chatId),
  });

  // Mutations
  const sendMessage = useSendMessage();
  const deleteMessage = useDeleteMessage();

  // WebSocket
  const { isConnected } = useWebSocket({
    chatId,
    onMessage: (message) => {
      // Обновление кэша при получении сообщения
      queryClient.setQueryData(
        chatKeys.messages(chatId),
        (old: Message[] = []) => [...old, message]
      );
    },
  });

  // Derived state
  const isLoading = chatLoading || messagesLoading;
  const lastMessage = messages[messages.length - 1];
  const unreadCount = messages.filter(m => !m.isRead).length;

  return {
    // Data
    chat,
    messages,
    lastMessage,
    unreadCount,
    
    // State
    isLoading,
    isConnected,
    
    // Actions
    sendMessage: sendMessage.mutate,
    deleteMessage: deleteMessage.mutate,
    
    // Flags
    isSending: sendMessage.isPending,
    isDeleting: deleteMessage.isPending,
  };
};
```

### 5.2 WebSocket Hook

```typescript
export const useWebSocket = ({
  chatId,
  onMessage,
  onTyping,
  onUserJoined,
}: UseWebSocketOptions) => {
  const socketRef = useRef<Socket | null>(null);
  const { token, user } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token || !chatId) return;

    const socket = io(config.SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    // Подключение к чату
    socket.emit('join-chat', { chatId });

    // Обработчики событий
    socket.on('message', (message: Message) => {
      queryClient.setQueryData(
        chatKeys.messages(message.chatId),
        (old: Message[] = []) => [...old, message]
      );
      onMessage?.(message);
    });

    socket.on('typing', onTyping);
    socket.on('user-joined', onUserJoined);

    return () => {
      socket.emit('leave-chat', { chatId });
      socket.disconnect();
    };
  }, [token, chatId]);

  // Методы для отправки событий
  const sendTyping = useCallback((isTyping: boolean) => {
    socketRef.current?.emit('typing', { chatId, isTyping });
  }, [chatId]);

  const sendMessage = useCallback((content: string) => {
    socketRef.current?.emit('send-message', { chatId, content });
  }, [chatId]);

  return {
    socket: socketRef.current,
    sendTyping,
    sendMessage,
    isConnected: socketRef.current?.connected ?? false,
  };
};
```

## 6. Performance Best Practices

### 6.1 Мемоизация

```typescript
// React.memo для компонентов
export const MessageItem = React.memo<MessageItemProps>(({ 
  message, 
  onEdit, 
  onDelete 
}) => {
  const formattedTime = useMemo(
    () => MessageService.formatTimestamp(message.timestamp),
    [message.timestamp]
  );

  const handleEdit = useCallback(() => {
    onEdit?.(message.id);
  }, [message.id, onEdit]);

  return (
    <Box>
      <Text>{message.content}</Text>
      <Text fontSize="sm" color="gray.500">{formattedTime}</Text>
      <Button onClick={handleEdit}>Edit</Button>
    </Box>
  );
}, (prevProps, nextProps) => {
  // Кастомное сравнение если нужно
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.timestamp === nextProps.message.timestamp
  );
});

// useMemo для дорогих вычислений
export const useFilteredMessages = (messages: Message[], filter: string) => {
  return useMemo(() => {
    if (!filter) return messages;
    
    return messages.filter(message =>
      message.content.toLowerCase().includes(filter.toLowerCase())
    );
  }, [messages, filter]);
};

// useCallback для функций
export const useMessageActions = (messageId: string) => {
  const editMessage = useEditMessage();
  const deleteMessage = useDeleteMessage();

  const handleEdit = useCallback((content: string) => {
    editMessage.mutate({ messageId, content });
  }, [messageId, editMessage]);

  const handleDelete = useCallback(() => {
    deleteMessage.mutate(messageId);
  }, [messageId, deleteMessage]);

  return { handleEdit, handleDelete };
};
```

### 6.2 Virtual Scrolling

```typescript
export const MessageList: React.FC<{ messages: Message[] }> = ({ messages }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 10,
  });

  // Автоскролл к последнему сообщению
  useEffect(() => {
    if (messages.length > 0) {
      virtualizer.scrollToIndex(messages.length - 1, {
        align: 'end',
        behavior: 'smooth',
      });
    }
  }, [messages.length]);

  return (
    <Box ref={parentRef} h="100%" overflowY="auto">
      <Box h={virtualizer.getTotalSize()} position="relative">
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const message = messages[virtualRow.index];
          
          return (
            <Box
              key={virtualRow.index}
              position="absolute"
              top={0}
              left={0}
              w="100%"
              h={virtualRow.size}
              transform={`translateY(${virtualRow.start}px)`}
            >
              <MessageItem message={message} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
```

## 7. Testing Guidelines

### 7.1 Component Testing

```typescript
// features/chat/components/MessageItem/MessageItem.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MessageItem } from './MessageItem';

const mockMessage: Message = {
  id: '1',
  chatId: 'chat-1',
  userId: 'user-1',
  content: 'Test message',
  timestamp: new Date('2024-01-01T12:00:00Z'),
  type: 'text',
  status: 'sent',
  isEdited: false,
};

const renderMessageItem = (props: Partial<MessageItemProps> = {}) => {
  return render(
    <MessageItem
      message={mockMessage}
      onEdit={vi.fn()}
      onDelete={vi.fn()}
      {...props}
    />
  );
};

describe('MessageItem', () => {
  it('renders message content', () => {
    renderMessageItem();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    renderMessageItem({ onEdit });
    
    fireEvent.click(screen.getByLabelText('Edit message'));
    expect(onEdit).toHaveBeenCalledWith(mockMessage.id);
  });

  it('shows formatted timestamp', () => {
    renderMessageItem();
    expect(screen.getByText('12:00')).toBeInTheDocument();
  });
});
```

### 7.2 Hook Testing

```typescript
// features/chat/hooks/useChat.test.tsx
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { useChat } from './useChat';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

vi.mock('../api/chatApi', () => ({
  useQuery: vi.fn(),
  useSendMessage: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

describe('useChat', () => {
  it('should return chat data and actions', () => {
    const { result } = renderHook(() => useChat('chat-1'), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('chat');
    expect(result.current).toHaveProperty('messages');
    expect(result.current).toHaveProperty('sendMessage');
  });
});
```

## 8. Security Best Practices

### 8.1 Input Validation

```typescript
// Всегда валидируйте пользовательский ввод
const MessageInput = () => {
  const sendMessage = useSendMessage();
  
  const { control, handleSubmit } = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = (data: MessageForm) => {
    // Дополнительная санитизация
    const sanitizedContent = SecurityService.sanitizeText(data.content);
    
    sendMessage.mutate({
      ...data,
      content: sanitizedContent,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="content"
        control={control}
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            placeholder="Type your message..."
            isInvalid={!!fieldState.error}
            maxLength={MAX_MESSAGE_LENGTH}
          />
        )}
      />
    </form>
  );
};
```

### 8.2 XSS Protection

```typescript
// Безопасное отображение пользовательского контента
import DOMPurify from 'dompurify';

const MessageContent: React.FC<{ content: string }> = ({ content }) => {
  const sanitizedContent = useMemo(() => {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'code', 'pre'],
      ALLOWED_ATTR: [],
    });
  }, [content]);

  return (
    <Box
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      sx={{
        '& code': { bg: 'gray.100', px: 1, borderRadius: 'sm' },
        '& pre': { bg: 'gray.100', p: 3, borderRadius: 'md' },
      }}
    />
  );
};
```

---

Следование этим правилам обеспечит консистентность кода, хорошую производительность и безопасность приложения.