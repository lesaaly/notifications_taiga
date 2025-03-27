import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const {
  TAIGA_API_URL,
  TAIGA_USERNAME,
  TAIGA_PASSWORD
} = process.env;

if (!TAIGA_API_URL || !TAIGA_USERNAME || !TAIGA_PASSWORD) {
  throw new Error('Missing required environment variables');
}

async function getAuthToken() {
  try {
    const response = await axios.post(`${TAIGA_API_URL}/auth`, {
      type: 'normal',
      username: TAIGA_USERNAME,
      password: TAIGA_PASSWORD
    });

    console.log('Токен авторизации:', response.data.auth_token);
    console.log('\nДобавьте этот токен в ваш .env файл как TAIGA_AUTH_TOKEN');
  } catch (error: any) {
    console.error('Ошибка при получении токена:', error.response?.data || error.message);
  }
}

getAuthToken(); 