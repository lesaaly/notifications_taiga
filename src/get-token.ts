import dotenv from 'dotenv';
import { db } from './services/database';

dotenv.config();

async function main() {
  try {
    // Проверяем подключение
    const user = await db.getUser(123456789);
    console.log('Подключение успешно');
    console.log('Пользователь:', user);
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

main();

