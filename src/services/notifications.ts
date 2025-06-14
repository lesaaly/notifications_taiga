import axios from 'axios';
import TelegramBot from 'node-telegram-bot-api';
import { DatabaseService } from './database';

export class NotificationService {
  constructor(
    private bot: TelegramBot,
    private db: DatabaseService,
    private taigaApiUrl: string
  ) {}

  async getTaigaNotifications(chatId: number) {
    try {
      const user = await this.db.getUser(chatId);

      const response = await axios.get(`${this.taigaApiUrl}/tasks/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.taiga_auth_token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Taiga notifications:', error);
      return null;
    }
  }

  async sendTelegramNotification(message: string, chatId: number) {
    try {
      await this.bot.sendMessage(chatId, message);
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
    }
  }
} 