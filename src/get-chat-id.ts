import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const { TELEGRAM_BOT_TOKEN } = process.env;

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error('Missing TELEGRAM_BOT_TOKEN in environment variables');
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

console.log('Бот запущен. Отправьте любое сообщение боту, чтобы получить ваш CHAT_ID (не используйте символ "/" в начале сообщения)');

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log('\nВаш CHAT_ID:', chatId);
  console.log('\nДобавьте это значение в файл .env как CHAT_ID');

  bot.sendMessage(chatId, `Ваш CHAT_ID: ${chatId}`);

  bot.stopPolling();
}); 