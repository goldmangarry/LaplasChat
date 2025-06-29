# Progress Tracker - Sidebar Layout Fix

## Текущий статус: В процессе разработки
**Дата создания:** 2025-06-29  
**Дизайн:** [Figma - Laplas Chat](https://www.figma.com/design/w0nvzD6duIk4Lby2J4kGnD/Laplas--Copy-?node-id=43-6743&m=dev)

## Задачи

### ✅ COMPLETED
- **figma-analysis** - Проанализировать дизайн страницы в Figma и понять требования к сайдбару
  - **Priority:** High
  - **Completed:** 2025-06-29
  - **Details:** Изучен макет Figma, определена структура сайдбара

### 🔄 IN PROGRESS
*Текущие активные задачи (максимум 1)*

### ⏳ PENDING
- **sidebar-structure** - Определить структуру сайдбара: хедер с лого, тогглы режимов, поиск чатов, список чатов по категориям
  - **Priority:** High
  - **Depends on:** figma-analysis

- **sidebar-header** - Исправить хедер сайдбара: лого apilaplas + кнопка Start new chat
  - **Priority:** High
  - **Depends on:** sidebar-structure

- **mode-toggles** - Добавить тогглы режимов: Secure mode (активный) и Compare mode
  - **Priority:** Medium
  - **Depends on:** sidebar-header

- **search-chats** - Реализовать поиск чатов с плейсхолдером 'Search for chats...'
  - **Priority:** Medium
  - **Depends on:** mode-toggles

- **chat-categories** - Организовать чаты по категориям: Chat, Image (soon), Video (soon)
  - **Priority:** Medium
  - **Depends on:** search-chats

- **chat-list** - Стилизовать список чатов с аватарами и превью текста
  - **Priority:** High
  - **Depends on:** chat-categories

- **user-profile** - Добавить профиль пользователя внизу сайдбара
  - **Priority:** Low
  - **Depends on:** chat-list

## Анализ макета Figma

### Структура сайдбара:
1. **Хедер (верх)**
   - Лого "apilaplas" (слева)
   - Кнопка "Start new chat" (черная, с иконкой +)

2. **Режимы (под хедером)**
   - Toggle "Secure mode" (активный, розовый)
   - Toggle "Compare mode" (неактивный)

3. **Поиск**
   - Поле поиска с плейсхолдером "Search for chats..."

4. **Категории чатов**
   - Chat (активная категория)
   - Image (soon) - неактивная
   - Video (soon) - неактивная

5. **Список чатов**
   - Каждый чат: аватар + название + превью текста
   - Примеры: "Create html game environ...", "What is UX audit?", "Create POS syst...", etc.

6. **Профиль пользователя (низ)**
   - Аватар + имя "Mauro Sicard" + email

## Технические требования

### Архитектура
- Использовать **Chakra UI v3** с композиционной структурой (Component.Root + Component.Item)
- Следовать TypeScript conventions: `type` вместо `interface`, избегать `enum`
- Компоненты размещать в `/src/components/ui` или `/src/components/layout`
- Бизнес-логику выносить в Core Layer

### Компоненты для создания/исправления
1. `Sidebar` - основной контейнер
2. `SidebarHeader` - хедер с лого и кнопкой
3. `ModeToggle` - переключатели режимов
4. `ChatSearch` - поиск чатов
5. `ChatCategories` - категории чатов
6. `ChatList` - список чатов
7. `ChatItem` - элемент чата
8. `UserProfile` - профиль пользователя

## Критерии завершения

Проект считается завершенным когда:
- ✅ Все компоненты созданы и работают без ошибок
- ✅ Макет полностью соответствует дизайну Figma
- ✅ Нет TypeScript ошибок
- ✅ Нет runtime ошибок в консоли
- ✅ Компоненты рендерятся корректно в браузере
- ✅ Соблюдены архитектурные принципы проекта

## История изменений

**2025-06-29**
- Создан трекер прогресса
- Проанализирован макет Figma
- Определена структура задач
- Выделены ключевые компоненты для разработки