import axios from 'axios';
import TelegramBot from 'node-telegram-bot-api';
import { DatabaseService } from './database';

export class NotificationService {
  constructor(
    private bot: TelegramBot,
    private db: DatabaseService,
    private taigaApiUrl: string
  ) {}

  async getTaigaNotifications(chatId: number, taigaUserId: string) {
    try {
      const user = await this.db.getUser(chatId);
      
      if (!user) {
        console.error('Пользователь не найден в базе данных');
        return null;
      }

      if (!user.taiga_auth_token) {
        console.error('Токен аутентификации отсутствует');
        return null;
      }

      const response = await axios.get(`${this.taigaApiUrl}/tasks`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.taiga_auth_token}`,
        },
        params: {
          assigned_to: taigaUserId,
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
      console.error('Error sending Telegram notification:');
    }
  }
} 