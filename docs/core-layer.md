# Core Layer Architecture
# Архитектура Core слоя Apilaplas Frontend

## 1. Принципы Core слоя

### 1.1 Основные правила

**Core слой НЕ МОЖЕТ зависеть от:**
- React компонентов
- UI библиотек (Chakra UI)
- Внешних API клиентов
- Browser APIs (кроме базовых JS APIs)
- Routing библиотек

**Core слой МОЖЕТ содержать:**
- Типы (type aliases)
- Бизнес-логику как чистые функции
- Константы и const assertions
- Валидаторы (Zod схемы)
- Глобальные stores (Zustand)

### 1.2 Архитектурная диаграмма

```
┌─────────────────────────────────────────────┐
│              Features Layer                 │
│         ↓ uses Core layer ↓                │
├─────────────────────────────────────────────┤
│               Shared Layer                  │
│         ↓ uses Core layer ↓                │
├─────────────────────────────────────────────┤
│                CORE LAYER                   │
│    ✅ Types, Services, Constants             │
│    ✅ Business Logic, Validators             │
│    ✅ Global Stores                         │
│    ❌ NO external dependencies              │
└─────────────────────────────────────────────┘
```

## 2. Структура Core слоя

```
src/core/
├── types/                 # Доменные типы
│   ├── user.types.ts      # Пользовательские типы
│   ├── message.types.ts   # Типы сообщений и чатов
│   ├── admin.types.ts     # Административные типы
│   ├── auth.types.ts      # Типы аутентификации
│   └── common.types.ts    # Общие типы
├── services/              # Бизнес-логика как чистые функции
│   ├── userService.ts     # Логика работы с пользователями
│   ├── messageService.ts  # Логика обработки сообщений
│   ├── chatService.ts     # Логика чатов
│   ├── authService.ts     # Логика аутентификации
│   ├── securityService.ts # Логика безопасности
│   └── validationService.ts # Сервис валидации
├── stores/                # Глобальные Zustand stores
│   ├── authStore.ts       # Аутентификация пользователя
│   ├── uiStore.ts         # UI состояние (тема, сайдбар)
│   └── configStore.ts     # Конфигурация приложения
├── validators/            # Zod схемы валидации
│   ├── userValidators.ts  # Валидация пользователей
│   ├── messageValidators.ts # Валидация сообщений
│   ├── chatValidators.ts  # Валидация чатов
│   └── commonValidators.ts # Общие валидаторы
└── constants/             # Бизнес-константы
    ├── permissions.ts     # Константы разрешений
    ├── limits.ts          # Лимиты приложения
    ├── messageTypes.ts    # Типы сообщений
    └── routes.ts          # Маршруты приложения
```

## 3. Доменные типы

### 3.1 User Types

```typescript
// core/types/user.types.ts
export type User = {
  readonly id: UserId;
  readonly email: string;
  readonly name: string;
  readonly avatar?: string;
  readonly permissions: Permission[];
  readonly organizationId: OrganizationId;
  readonly status: UserStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly lastSeenAt?: Date;
};

// Branded types для type safety
export type UserId = string & { readonly __brand: 'UserId' };
export type OrganizationId = string & { readonly __brand: 'OrganizationId' };

// Используем const assertion вместо enum
export const PERMISSION = {
  // Основные разрешения
  CHAT_ACCESS: 'chat_access',
  ADMIN_ACCESS: 'admin_access',
  
  // Управление пользователями
  MANAGE_USERS: 'manage_users',
  VIEW_USER_ANALYTICS: 'view_user_analytics',
  
  // Управление организацией
  MANAGE_ORGANIZATION: 'manage_organization',
  MANAGE_BILLING: 'manage_billing',
  VIEW_BILLING: 'view_billing',
  
  // Системные разрешения
  SYSTEM_ADMIN: 'system_admin',
  AUDIT_LOGS: 'audit_logs',
} as const;
export type Permission = typeof PERMISSION[keyof typeof PERMISSION];

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
} as const;
export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

export type Organization = {
  readonly id: OrganizationId;
  readonly name: string;
  readonly domain?: string;
  readonly settings: OrganizationSettings;
  readonly billing: BillingInfo;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export type OrganizationSettings = {
  readonly allowedDomains: string[];
  readonly maxUsers: number;
  readonly features: FeatureFlags;
  readonly security: SecuritySettings;
};

export type FeatureFlags = {
  readonly factChecking: boolean;
  readonly multiModel: boolean;
  readonly fileUploads: boolean;
  readonly analytics: boolean;
};
```

### 3.2 Message Types

```typescript
// core/types/message.types.ts
export type Message = {
  readonly id: MessageId;
  readonly chatId: ChatId;
  readonly userId: UserId;
  readonly content: string;
  readonly timestamp: Date;
  readonly type: MessageType;
  readonly status: MessageStatus;
  readonly metadata?: MessageMetadata;
  readonly isEdited: boolean;
  readonly editedAt?: Date;
  readonly replyTo?: MessageId;
  readonly attachments: Attachment[];
};

export type MessageId = string & { readonly __brand: 'MessageId' };
export type ChatId = string & { readonly __brand: 'ChatId' };

export const MESSAGE_TYPE = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system',
  AI_RESPONSE: 'ai_response',
} as const;
export type MessageType = typeof MESSAGE_TYPE[keyof typeof MESSAGE_TYPE];

export const MESSAGE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
} as const;
export type MessageStatus = typeof MESSAGE_STATUS[keyof typeof MESSAGE_STATUS];

export type MessageMetadata = {
  readonly model?: string;
  readonly tokens?: number;
  readonly cost?: number;
  readonly processingTime?: number;
  readonly confidence?: number;
  readonly sources?: VerificationSource[];
};

export type Chat = {
  readonly id: ChatId;
  readonly title: string;
  readonly userId: UserId;
  readonly organizationId: OrganizationId;
  readonly mode: ChatMode;
  readonly model?: string;
  readonly settings: ChatSettings;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly lastMessageAt?: Date;
};

export const CHAT_MODE = {
  NORMAL: 'normal',
  SECURE: 'secure',
  COMPARE: 'compare',
} as const;
export type ChatMode = typeof CHAT_MODE[keyof typeof CHAT_MODE];

export type ChatSettings = {
  readonly temperature: number;
  readonly maxTokens: number;
  readonly enableFactChecking: boolean;
  readonly enableMemory: boolean;
};

export type Attachment = {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly size: number;
  readonly url: string;
  readonly uploadedAt: Date;
};
```

### 3.3 Verification Types

```typescript
// core/types/verification.types.ts
export type VerificationResult = {
  readonly messageId: MessageId;
  readonly claims: FactClaim[];
  readonly overallTrust: TrustLevel;
  readonly processedAt: Date;
  readonly sources: VerificationSource[];
};

export type FactClaim = {
  readonly id: string;
  readonly text: string;
  readonly status: VerificationStatus;
  readonly confidence: number;
  readonly sources: VerificationSource[];
  readonly explanation?: string;
};

export const VERIFICATION_STATUS = {
  VERIFIED: 'verified',
  DISPUTED: 'disputed',
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
} as const;
export type VerificationStatus = typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];

export const TRUST_LEVEL = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  UNKNOWN: 'unknown',
} as const;
export type TrustLevel = typeof TRUST_LEVEL[keyof typeof TRUST_LEVEL];

export type VerificationSource = {
  readonly id: string;
  readonly title: string;
  readonly url: string;
  readonly domain: string;
  readonly trustScore: number;
  readonly publishedAt?: Date;
  readonly relevanceScore: number;
};
```

## 4. Бизнес-сервисы

### 4.1 User Service

```typescript
// core/services/userService.ts
export const UserService = {
  // Проверка разрешений
  hasPermission: (user: User, permission: Permission): boolean => {
    return user.permissions.includes(permission);
  },

  hasAnyPermission: (user: User, permissions: Permission[]): boolean => {
    return permissions.some(permission => user.permissions.includes(permission));
  },

  canAccessAdmin: (user: User): boolean => {
    return UserService.hasPermission(user, PERMISSION.ADMIN_ACCESS);
  },

  canManageUsers: (user: User): boolean => {
    return UserService.hasPermission(user, PERMISSION.MANAGE_USERS);
  },

  canViewBilling: (user: User): boolean => {
    return UserService.hasAnyPermission(user, [
      PERMISSION.VIEW_BILLING,
      PERMISSION.MANAGE_BILLING,
    ]);
  },

  // Статус и активность
  isActive: (user: User): boolean => {
    return user.status === USER_STATUS.ACTIVE;
  },

  isOnline: (user: User): boolean => {
    if (!user.lastSeenAt) return false;
    
    const ONLINE_THRESHOLD = 5 * 60 * 1000; // 5 минут
    return Date.now() - user.lastSeenAt.getTime() < ONLINE_THRESHOLD;
  },

  getDisplayName: (user: User): string => {
    return user.name || user.email.split('@')[0];
  },

  getInitials: (user: User): string => {
    const name = UserService.getDisplayName(user);
    return name
      .split(' ')
      .map(part => part[0]?.toUpperCase())
      .slice(0, 2)
      .join('');
  },

  // Организация
  belongsToOrganization: (user: User, organizationId: OrganizationId): boolean => {
    return user.organizationId === organizationId;
  },

  // Валидация
  validateUserData: (userData: Partial<User>): ValidationResult => {
    const errors: string[] = [];

    if (userData.email && !isValidEmail(userData.email)) {
      errors.push('Invalid email format');
    }

    if (userData.name && (userData.name.length < 1 || userData.name.length > 100)) {
      errors.push('Name must be between 1 and 100 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
} as const;

// Вспомогательные функции
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

### 4.2 Message Service

```typescript
// core/services/messageService.ts
export const MessageService = {
  // Валидация
  validateContent: (content: string): ValidationResult => {
    const errors: string[] = [];

    if (!content.trim()) {
      errors.push('Message cannot be empty');
    }

    if (content.length > MAX_MESSAGE_LENGTH) {
      errors.push(`Message too long (max ${MAX_MESSAGE_LENGTH} characters)`);
    }

    // Проверка на потенциально вредоносный контент
    if (containsMaliciousContent(content)) {
      errors.push('Message contains prohibited content');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Права доступа
  canEdit: (message: Message, userId: UserId): boolean => {
    const EDIT_TIME_LIMIT = 15 * 60 * 1000; // 15 минут
    const isOwner = message.userId === userId;
    const withinTimeLimit = Date.now() - message.timestamp.getTime() < EDIT_TIME_LIMIT;
    const isNotSystemMessage = message.type !== MESSAGE_TYPE.SYSTEM;

    return isOwner && withinTimeLimit && isNotSystemMessage;
  },

  canDelete: (message: Message, user: User): boolean => {
    const isOwner = message.userId === user.id;
    const isAdmin = UserService.hasPermission(user, PERMISSION.ADMIN_ACCESS);
    const isNotSystemMessage = message.type !== MESSAGE_TYPE.SYSTEM;

    return (isOwner || isAdmin) && isNotSystemMessage;
  },

  canReply: (message: Message): boolean => {
    return message.type !== MESSAGE_TYPE.SYSTEM;
  },

  // Форматирование
  formatTimestamp: (timestamp: Date): string => {
    const now = new Date();
    const diffInMinutes = (now.getTime() - timestamp.getTime()) / (1000 * 60);

    if (diffInMinutes < 1) {
      return 'Just now';
    }

    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    }

    const diffInHours = diffInMinutes / 60;
    if (diffInHours < 24) {
      return timestamp.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }

    if (diffInHours < 48) {
      return `Yesterday ${timestamp.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    }

    return timestamp.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Обработка контента
  extractMentions: (content: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }

    return [...new Set(mentions)]; // Remove duplicates
  },

  extractHashtags: (content: string): string[] => {
    const hashtagRegex = /#(\w+)/g;
    const hashtags: string[] = [];
    let match;

    while ((match = hashtagRegex.exec(content)) !== null) {
      hashtags.push(match[1]);
    }

    return [...new Set(hashtags)];
  },

  // Поиск
  searchInContent: (messages: Message[], query: string): Message[] => {
    if (!query.trim()) return messages;

    const normalizedQuery = query.toLowerCase().trim();
    
    return messages.filter(message => 
      message.content.toLowerCase().includes(normalizedQuery) ||
      message.attachments.some(att => 
        att.name.toLowerCase().includes(normalizedQuery)
      )
    );
  },

  // Группировка сообщений
  groupMessagesByDate: (messages: Message[]): Record<string, Message[]> => {
    return messages.reduce((groups, message) => {
      const dateKey = message.timestamp.toDateString();
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(message);
      return groups;
    }, {} as Record<string, Message[]>);
  },

  // Статистика
  calculateReadTime: (content: string): number => {
    const WORDS_PER_MINUTE = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / WORDS_PER_MINUTE);
  },

  getMessageStats: (messages: Message[]): MessageStats => {
    const totalMessages = messages.length;
    const textMessages = messages.filter(m => m.type === MESSAGE_TYPE.TEXT).length;
    const imageMessages = messages.filter(m => m.type === MESSAGE_TYPE.IMAGE).length;
    const fileMessages = messages.filter(m => m.type === MESSAGE_TYPE.FILE).length;
    const editedMessages = messages.filter(m => m.isEdited).length;

    const totalCharacters = messages.reduce((sum, m) => sum + m.content.length, 0);
    const avgMessageLength = totalMessages > 0 ? totalCharacters / totalMessages : 0;

    return {
      totalMessages,
      textMessages,
      imageMessages,
      fileMessages,
      editedMessages,
      avgMessageLength: Math.round(avgMessageLength),
    };
  },
} as const;

// Вспомогательные типы
type MessageStats = {
  totalMessages: number;
  textMessages: number;
  imageMessages: number;
  fileMessages: number;
  editedMessages: number;
  avgMessageLength: number;
};

// Вспомогательные функции
const containsMaliciousContent = (content: string): boolean => {
  const maliciousPatterns = [
    /javascript:/i,
    /<script/i,
    /data:text\/html/i,
    /vbscript:/i,
  ];

  return maliciousPatterns.some(pattern => pattern.test(content));
};
```

### 4.3 Security Service

```typescript
// core/services/securityService.ts
export const SecurityService = {
  // Обфускация персональных данных
  obfuscatePersonalData: (text: string): string => {
    return text
      // Кредитные карты
      .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARD_NUMBER]')
      // Email адреса
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
      // Телефоны (различные форматы)
      .replace(/\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/g, '[PHONE]')
      // SSN (США)
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]')
      // IP адреса
      .replace(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g, '[IP_ADDRESS]')
      // Банковские счета
      .replace(/\b\d{10,}\b/g, '[ACCOUNT_NUMBER]');
  },

  // Санитизация HTML
  sanitizeHtml: (html: string): string => {
    // Простая санитизация - в продакшене использовать DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  },

  // Валидация файлов
  validateFileUpload: (file: File): ValidationResult => {
    const errors: string[] = [];

    // Разрешенные типы файлов
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    // Максимальный размер файла (10MB)
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`);
    }

    if (file.size > maxSize) {
      errors.push(`File size ${formatFileSize(file.size)} exceeds limit of ${formatFileSize(maxSize)}`);
    }

    // Проверка имени файла
    if (!isValidFileName(file.name)) {
      errors.push('Invalid file name');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Проверка безопасности пароля
  validatePasswordStrength: (password: string): PasswordStrengthResult => {
    const checks = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noSequences: !hasCommonSequences(password),
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    
    let strength: 'weak' | 'medium' | 'strong';
    if (passedChecks < 3) {
      strength = 'weak';
    } else if (passedChecks < 5) {
      strength = 'medium';
    } else {
      strength = 'strong';
    }

    return {
      strength,
      checks,
      isValid: strength !== 'weak',
    };
  },

  // Генерация безопасных идентификаторов
  generateSecureId: (): string => {
    return crypto.randomUUID();
  },

  // Хеширование (простое - для клиента)
  hashString: async (input: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  // Проверка на подозрительную активность
  detectSuspiciousActivity: (
    messages: Message[], 
    timeWindow: number = 60000 // 1 минута
  ): SuspiciousActivityResult => {
    const now = Date.now();
    const recentMessages = messages.filter(
      m => now - m.timestamp.getTime() < timeWindow
    );

    const flags: string[] = [];

    // Слишком много сообщений за короткое время
    if (recentMessages.length > 10) {
      flags.push('High message frequency');
    }

    // Дублирующийся контент
    const contentMap = new Map<string, number>();
    recentMessages.forEach(m => {
      const count = contentMap.get(m.content) || 0;
      contentMap.set(m.content, count + 1);
    });

    const duplicateContent = Array.from(contentMap.entries()).some(
      ([_, count]) => count > 3
    );

    if (duplicateContent) {
      flags.push('Duplicate content detected');
    }

    // Подозрительные паттерны в тексте
    const suspiciousPatterns = [
      /(.)\1{10,}/, // Повторяющиеся символы
      /[A-Z]{20,}/, // Много заглавных букв подряд
    ];

    const hasSuspiciousPatterns = recentMessages.some(m =>
      suspiciousPatterns.some(pattern => pattern.test(m.content))
    );

    if (hasSuspiciousPatterns) {
      flags.push('Suspicious text patterns');
    }

    return {
      isSuspicious: flags.length > 0,
      flags,
      riskLevel: flags.length === 0 ? 'low' : flags.length === 1 ? 'medium' : 'high',
    };
  },
} as const;

// Вспомогательные типы
type PasswordStrengthResult = {
  strength: 'weak' | 'medium' | 'strong';
  checks: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
    noSequences: boolean;
  };
  isValid: boolean;
};

type SuspiciousActivityResult = {
  isSuspicious: boolean;
  flags: string[];
  riskLevel: 'low' | 'medium' | 'high';
};

// Вспомогательные функции
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const isValidFileName = (fileName: string): boolean => {
  // Проверка на недопустимые символы
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
  const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
  
  return !invalidChars.test(fileName) && 
         !reservedNames.test(fileName) && 
         fileName.length <= 255 &&
         fileName.trim().length > 0;
};

const hasCommonSequences = (password: string): boolean => {
  const commonSequences = [
    '123456789',
    'abcdefghij',
    'qwertyuiop',
    'password',
    '11111111',
  ];

  return commonSequences.some(seq => 
    password.toLowerCase().includes(seq.toLowerCase())
  );
};
```

## 5. Глобальные Stores

### 5.1 Auth Store

```typescript
// core/stores/authStore.ts
type AuthState = {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Computed
  permissions: Permission[];
  canAccessAdmin: boolean;
  canManageUsers: boolean;
};

type AuthActions = {
  // Authentication
  login: (user: User, tokens: { token: string; refreshToken: string }) => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  
  // User management
  updateUser: (updates: Partial<User>) => void;
  updatePermissions: (permissions: Permission[]) => void;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Persistence
  loadFromStorage: () => void;
  clearStorage: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Computed values
      get permissions() {
        return get().user?.permissions || [];
      },

      get canAccessAdmin() {
        const { user } = get();
        return user ? UserService.canAccessAdmin(user) : false;
      },

      get canManageUsers() {
        const { user } = get();
        return user ? UserService.canManageUsers(user) : false;
      },

      // Actions
      login: (user, tokens) => {
        set({
          user,
          token: tokens.token,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().logout();
          return;
        }

        try {
          set({ isLoading: true, error: null });
          
          // Refresh logic would go here
          // const response = await authApi.refresh(refreshToken);
          
          // For now, just simulate
          set({ isLoading: false });
        } catch (error) {
          set({
            error: 'Failed to refresh authentication',
            isLoading: false,
          });
          get().logout();
        }
      },

      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },

      updatePermissions: (permissions) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, permissions } });
        }
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      loadFromStorage: () => {
        // This is handled by persist middleware
      },

      clearStorage: () => {
        // Clear any additional storage if needed
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Селекторы для оптимизации
export const useCurrentUser = () => useAuthStore(state => state.user);
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useAuthActions = () => useAuthStore(state => ({
  login: state.login,
  logout: state.logout,
  updateUser: state.updateUser,
}));
```

### 5.2 UI Store

```typescript
// core/stores/uiStore.ts
type UIState = {
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Layout
  sidebarOpen: boolean;
  sidebarWidth: number;
  
  // Chat UI
  chatMode: ChatMode;
  selectedModel: string | null;
  
  // Notifications
  notifications: UINotification[];
  
  // Modals and overlays
  activeModal: string | null;
  modalData: any;
  
  // Loading states
  globalLoading: boolean;
  loadingMessage: string | null;
};

type UIActions = {
  // Theme management
  setTheme: (theme: UIState['theme']) => void;
  toggleTheme: () => void;
  
  // Layout management
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarWidth: (width: number) => void;
  
  // Chat UI
  setChatMode: (mode: ChatMode) => void;
  setSelectedModel: (model: string | null) => void;
  
  // Notifications
  addNotification: (notification: Omit<UINotification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Modals
  openModal: (modalType: string, data?: any) => void;
  closeModal: () => void;
  
  // Loading states
  setGlobalLoading: (loading: boolean, message?: string) => void;
};

type UINotification = {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  timestamp: Date;
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
};

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      sidebarOpen: true,
      sidebarWidth: 280,
      chatMode: CHAT_MODE.NORMAL,
      selectedModel: null,
      notifications: [],
      activeModal: null,
      modalData: null,
      globalLoading: false,
      loadingMessage: null,

      // Theme actions
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        applyThemeToDocument(theme);
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      // Layout actions
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      setSidebarWidth: (sidebarWidth) => {
        // Clamp width between min and max values
        const clampedWidth = Math.max(200, Math.min(400, sidebarWidth));
        set({ sidebarWidth: clampedWidth });
      },

      // Chat UI actions
      setChatMode: (chatMode) => set({ chatMode }),
      setSelectedModel: (selectedModel) => set({ selectedModel }),

      // Notification actions
      addNotification: (notification) => {
        const id = SecurityService.generateSecureId();
        const timestamp = new Date();
        
        set((state) => ({
          notifications: [
            ...state.notifications,
            { ...notification, id, timestamp },
          ],
        }));

        // Auto-remove notification after duration
        if (notification.duration !== 0) {
          const duration = notification.duration || 5000;
          setTimeout(() => {
            get().removeNotification(id);
          }, duration);
        }
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },

      clearNotifications: () => set({ notifications: [] }),

      // Modal actions
      openModal: (modalType, modalData = null) => {
        set({ activeModal: modalType, modalData });
      },

      closeModal: () => {
        set({ activeModal: null, modalData: null });
      },

      // Loading actions
      setGlobalLoading: (globalLoading, loadingMessage = null) => {
        set({ globalLoading, loadingMessage });
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        sidebarWidth: state.sidebarWidth,
        chatMode: state.chatMode,
        selectedModel: state.selectedModel,
      }),
    }
  )
);

// Utility function to apply theme
const applyThemeToDocument = (theme: UIState['theme']) => {
  const root = document.documentElement;
  
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', theme);
  }
};

// Селекторы
export const useTheme = () => useUIStore(state => state.theme);
export const useSidebar = () => useUIStore(state => ({
  isOpen: state.sidebarOpen,
  width: state.sidebarWidth,
  toggle: state.toggleSidebar,
  setOpen: state.setSidebarOpen,
}));
export const useNotifications = () => useUIStore(state => ({
  notifications: state.notifications,
  add: state.addNotification,
  remove: state.removeNotification,
  clear: state.clearNotifications,
}));
```

## 6. Validators

### 6.1 User Validators

```typescript
// core/validators/userValidators.ts
import { z } from 'zod';

export const userIdSchema = z.string().uuid('Invalid user ID format');

export const emailSchema = z
  .string()
  .email('Invalid email format')
  .max(254, 'Email too long');

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name too long')
  .regex(/^[a-zA-Z\s\-']+$/, 'Name contains invalid characters');

export const userSchema = z.object({
  id: userIdSchema,
  email: emailSchema,
  name: nameSchema,
  avatar: z.string().url().optional(),
  permissions: z.array(z.enum(Object.values(PERMISSION) as [string, ...string[]])),
  organizationId: z.string().uuid(),
  status: z.enum(Object.values(USER_STATUS) as [string, ...string[]]),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastSeenAt: z.date().optional(),
});

export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastSeenAt: true,
});

export const updateUserSchema = userSchema.partial().extend({
  id: userIdSchema,
});

export const userPermissionsSchema = z.object({
  userId: userIdSchema,
  permissions: z.array(z.enum(Object.values(PERMISSION) as [string, ...string[]])),
});

// Валидация пароля
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .refine(
    (password) => /[A-Z]/.test(password),
    'Password must contain at least one uppercase letter'
  )
  .refine(
    (password) => /[a-z]/.test(password),
    'Password must contain at least one lowercase letter'
  )
  .refine(
    (password) => /\d/.test(password),
    'Password must contain at least one number'
  )
  .refine(
    (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    'Password must contain at least one special character'
  );

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  organizationId: z.string().uuid().optional(),
});
```

### 6.2 Message Validators

```typescript
// core/validators/messageValidators.ts
export const messageIdSchema = z.string().uuid('Invalid message ID format');
export const chatIdSchema = z.string().uuid('Invalid chat ID format');

export const messageContentSchema = z
  .string()
  .min(1, 'Message cannot be empty')
  .max(MAX_MESSAGE_LENGTH, `Message too long (max ${MAX_MESSAGE_LENGTH} characters)`)
  .refine(
    (content) => content.trim().length > 0,
    'Message cannot be only whitespace'
  );

export const attachmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  type: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_]*\/[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_.]*$/),
  size: z.number().positive().max(MAX_FILE_SIZE),
  url: z.string().url(),
  uploadedAt: z.date(),
});

export const messageSchema = z.object({
  id: messageIdSchema,
  chatId: chatIdSchema,
  userId: userIdSchema,
  content: messageContentSchema,
  timestamp: z.date(),
  type: z.enum(Object.values(MESSAGE_TYPE) as [string, ...string[]]),
  status: z.enum(Object.values(MESSAGE_STATUS) as [string, ...string[]]),
  metadata: z.object({
    model: z.string().optional(),
    tokens: z.number().positive().optional(),
    cost: z.number().positive().optional(),
    processingTime: z.number().positive().optional(),
    confidence: z.number().min(0).max(1).optional(),
  }).optional(),
  isEdited: z.boolean(),
  editedAt: z.date().optional(),
  replyTo: messageIdSchema.optional(),
  attachments: z.array(attachmentSchema).max(MAX_ATTACHMENTS),
});

export const sendMessageSchema = z.object({
  chatId: chatIdSchema,
  content: messageContentSchema,
  type: z.enum(Object.values(MESSAGE_TYPE) as [string, ...string[]]).default(MESSAGE_TYPE.TEXT),
  replyTo: messageIdSchema.optional(),
  attachments: z.array(z.string().uuid()).max(MAX_ATTACHMENTS).optional(),
});

export const editMessageSchema = z.object({
  id: messageIdSchema,
  content: messageContentSchema,
});

export const chatSettingsSchema = z.object({
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().positive().max(4000).default(2000),
  enableFactChecking: z.boolean().default(false),
  enableMemory: z.boolean().default(true),
});

export const chatSchema = z.object({
  id: chatIdSchema,
  title: z.string().min(1).max(200),
  userId: userIdSchema,
  organizationId: z.string().uuid(),
  mode: z.enum(Object.values(CHAT_MODE) as [string, ...string[]]),
  model: z.string().optional(),
  settings: chatSettingsSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  lastMessageAt: z.date().optional(),
});

export const createChatSchema = chatSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastMessageAt: true,
});

export const updateChatSchema = z.object({
  id: chatIdSchema,
  title: z.string().min(1).max(200).optional(),
  mode: z.enum(Object.values(CHAT_MODE) as [string, ...string[]]).optional(),
  model: z.string().optional(),
  settings: chatSettingsSchema.partial().optional(),
});
```

## 7. Constants

### 7.1 Application Constants

```typescript
// core/constants/limits.ts
export const MAX_MESSAGE_LENGTH = 4000;
export const MAX_CHAT_TITLE_LENGTH = 200;
export const MAX_ATTACHMENTS = 5;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_UPLOAD_SIZE = 50 * 1024 * 1024; // 50MB total

export const PAGINATION_LIMITS = {
  MESSAGES: 50,
  CHATS: 20,
  USERS: 100,
  SEARCH_RESULTS: 30,
} as const;

export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 seconds
  WEBSOCKET_RECONNECT: 5000, // 5 seconds
  TYPING_INDICATOR: 3000, // 3 seconds
  AUTO_SAVE: 2000, // 2 seconds
} as const;

export const CACHE_DURATIONS = {
  USER_DATA: 1000 * 60 * 15, // 15 minutes
  CHAT_LIST: 1000 * 60 * 5, // 5 minutes
  MESSAGES: 1000 * 60 * 2, // 2 minutes
  ORGANIZATION_DATA: 1000 * 60 * 30, // 30 minutes
} as const;

// core/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  CHAT: '/chat',
  CHAT_DETAIL: '/chat/$chatId',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_BILLING: '/admin/billing',
  ADMIN_ANALYTICS: '/admin/analytics',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const;

// core/constants/api.ts
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  
  // Users
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  USER_PERMISSIONS: '/users/permissions',
  
  // Chats
  CHATS: '/chats',
  CHAT_MESSAGES: '/chats/:chatId/messages',
  CHAT_PARTICIPANTS: '/chats/:chatId/participants',
  
  // Files
  UPLOAD: '/files/upload',
  DOWNLOAD: '/files/:fileId/download',
  
  // Organization
  ORGANIZATION: '/organization',
  ORGANIZATION_MEMBERS: '/organization/members',
  ORGANIZATION_BILLING: '/organization/billing',
  
  // Analytics
  ANALYTICS_USAGE: '/analytics/usage',
  ANALYTICS_COSTS: '/analytics/costs',
} as const;

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  
  // Chat
  JOIN_CHAT: 'join-chat',
  LEAVE_CHAT: 'leave-chat',
  SEND_MESSAGE: 'send-message',
  MESSAGE_RECEIVED: 'message',
  
  // Typing
  TYPING_START: 'typing-start',
  TYPING_STOP: 'typing-stop',
  TYPING_UPDATE: 'typing',
  
  // Presence
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
  USER_STATUS: 'user-status',
  
  // System
  ERROR: 'error',
  RECONNECT: 'reconnect',
} as const;
```

---

Core слой обеспечивает надежную основу для всего приложения, изолируя бизнес-логику от внешних зависимостей и обеспечивая type safety на всех уровнях.