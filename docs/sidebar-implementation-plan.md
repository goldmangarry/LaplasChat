# План реализации Sidebar

Этот документ описывает план реализации компонента Sidebar на основе макета Figma и библиотеки компонентов Chakra UI.

## 1. Структура компонентов

Будут созданы следующие компоненты в директории `src/components/layout/Sidebar/`:

*   `Sidebar.tsx`: Основной компонент-контейнер.
*   `Logo.tsx`: Компонент для логотипа.
*   `NewChatButton.tsx`: Кнопка "Start new chat".
*   `ChatSearch.tsx`: Поле поиска.
*   `Navigation.tsx`: Блок с основными ссылками (Chat, Image, Video).
*   `ChatList.tsx`: Список последних чатов.
*   `ChatItem.tsx`: Элемент списка чатов.
*   `User.tsx`: Блок с информацией о пользователе.
*   `ThemeSwitcher.tsx`: Переключатель темы (светлая/темная).

## 2. Реализация с использованием Chakra UI

Компоненты будут реализованы с использованием библиотеки Chakra UI:

*   **Структура:** `Flex`, `VStack`, `Box`.
*   **Элементы:** `Button`, `Input`, `IconButton`, `Icon`, `Avatar`, `Text`, `Heading`.
*   **Стилизация:** Стили будут применяться через props (`bg`, `p`, `borderRadius` и т.д.), основываясь на данных из Figma.

## 3. Визуальная структура компонентов

```mermaid
graph TD
    A[Sidebar.tsx] --> B(Logo.tsx);
    A --> C{Основной контент};
    C --> D[NewChatButton.tsx];
    C --> E[ChatSearch.tsx];
    C --> F[Navigation.tsx];
    C --> G[ChatList.tsx];
    G --> H[ChatItem.tsx];
    A --> I{Футер};
    I --> J[User.tsx];
    I --> K[ThemeSwitcher.tsx];