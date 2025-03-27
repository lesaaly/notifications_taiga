# Taiga Notifications Telegram Bot

Telegram бот для получения уведомлений из Taiga.

## Установка

1. Клонируйте репозиторий
2. Установите зависимости:
```bash
npm install
```
3. Создайте файл `.env` на основе `.env.example` и заполните необходимые переменные окружения:
- `TELEGRAM_BOT_TOKEN` - токен вашего Telegram бота (получить у @BotFather)
- `TAIGA_API_URL` - URL вашего API Taiga
- `TAIGA_AUTH_TOKEN` - токен авторизации Taiga
- `CHAT_ID` - ID чата Telegram для отправки уведомлений

## Запуск

Для разработки:
```bash
npm run dev
```

Для продакшена:
```bash
npm run build
npm start
```

## Использование

Отправьте команду `/notifications` боту, чтобы получить текущие уведомления из Taiga.