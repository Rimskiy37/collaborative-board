# Collaborative Board

Интерактивная совместная доска для работы нескольких пользователей в реальном времени.

## Команда

| Участник | Роль |
|----------|------|
| Бабуров Иван | Project Manager / Интеграция |
| Симанков Никита | Backend-разработчик |
| Макиёв Платон | Frontend-разработчик |

## Стек технологий

- **Frontend:** React
- **Backend:** Node.js + Express
- **Realtime:** WebSocket (ws)

## Структура проекта
/client   — React-приложение
/server   — Node.js + Express + WebSocket

## Запуск проекта

### Backend
```bash
cd server
npm install
npm start
```

### Frontend
```bash
cd client
npm install
npm start
```

Открой браузер: http://localhost:3000

## Архитектура

Клиент подключается к серверу по WebSocket. При создании доски генерируется уникальный ID. Все действия с объектами (создание, перемещение, удаление) передаются через WebSocket и синхронизируются между всеми участниками в реальном времени.