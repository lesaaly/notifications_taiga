import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const {
  TELEGRAM_BOT_TOKEN,
  TAIGA_API_URL,
  TAIGA_AUTH_TOKEN,
  CHAT_ID
} = process.env;

if (!TELEGRAM_BOT_TOKEN || !TAIGA_API_URL || !TAIGA_AUTH_TOKEN || !CHAT_ID) {
  throw new Error('Missing required environment variables');
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Конфигурация axios для работы с API Taiga
const taigaApi = axios.create({
  baseURL: TAIGA_API_URL,
  headers: {
    'Authorization': `Bearer ${TAIGA_AUTH_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function getTaigaNotifications() {
  try {
    const response = await taigaApi.get('task-statuses');
    return response.data;
  } catch (error) {
    console.error('Error fetching Taiga notifications:', error);
    return null;
  }
}

async function sendTelegramNotification(message: string) {
  try {
    await bot.sendMessage(Number(CHAT_ID), message);
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
}

// Обработка входящих сообщений
bot.on('message', async (msg) => {
  if (msg.text === '/notifications') {
    const notifications = await getTaigaNotifications();
    if (notifications) {
      const message = notifications.map((n: any) => 
        `🔔 ${n.subject}\n${n.description || ''}\n`
      ).join('\n');
      await sendTelegramNotification(message || 'Нет новых уведомлений');
    } else {
      await sendTelegramNotification('Не удалось получить уведомления');
    }
  }
});

console.log('Bot started'); 