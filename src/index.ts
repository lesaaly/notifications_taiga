import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { DatabaseService, TaigaService } from "./services";
import { NotificationService } from "./services/notifications";

dotenv.config();

const { TELEGRAM_BOT_TOKEN, TAIGA_API_URL } = process.env;

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("Missing required environment variables");
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
const userStates = new Map<
  number,
  { step: "username" | "password"; username?: string }
>();
const db = new DatabaseService();
const notifications = new NotificationService(bot, db, TAIGA_API_URL as string);

// инициализация приложения
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  userStates.set(chatId, { step: "username" });
  await bot.sendMessage(
    chatId,
    "Для доступа к боту, введите ваш логин в Taiga"
  );
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  const state = userStates.get(chatId);

  if (state?.step === "username") {
    state.username = text;
    state.step = "password";
    userStates.set(chatId, state);
    await bot.sendMessage(chatId, "Введите ваш пароль в Taiga");
  } else if (state?.step === "password" && state.username && text) {
    try {
      const dataAuth = await TaigaService.authenticate(
        state.username,
        text,
        TAIGA_API_URL as string
      );
      console.log(dataAuth);
      try {
        await db.saveUser({
          chatId,
          taigaUsername: state.username,
          taigaAuthToken: dataAuth.auth_token,
          isRegistered: true,
          taigaUserId: dataAuth.id,
        });
        console.log('Пользователь успешно сохранен в базу данных');
        const savedUser = await db.getUser(chatId);
        console.log('Сохраненный пользователь:', savedUser);
      } catch (dbError) {
        console.error('Ошибка при сохранении пользователя в базу данных:', dbError);
        await bot.sendMessage(chatId, "Ошибка при сохранении данных. Попробуйте позже.");
        userStates.delete(chatId);
        return;
      }

      userStates.delete(chatId);
      await bot.sendMessage(chatId, "Вы успешно авторизованы");
    } catch (err) {
      await bot.sendMessage(chatId, "Неверный логин или пароль");
      userStates.delete(chatId);
    }
  }

  if (msg.text === "/notifications") {
    try {
      const savedUser = await db.getUser(chatId);
      const notificationsData = await notifications.getTaigaNotifications(
        chatId,
        savedUser?.taiga_user_id,
      );
      
      if (notificationsData === null) {
        await bot.sendMessage(chatId, "Сначала нужно зарегистрироваться. Используйте /start");
        return;
      }
      
      console.log(notificationsData.length);
      // if (notificationsData) {
      //   const message = notificationsData.map((n: any) =>
      //     `🔔 ${n.subject}\n${n.description || ''}\n`
      //   ).join('\n');
      //   await notifications.sendTelegramNotification(message || 'Нет новых уведомлений', chatId);
      // } else {
      //   await notifications.sendTelegramNotification('Не удалось получить уведомления', chatId);
      // }
    } catch (error) {
      console.error('Ошибка при получении уведомлений:', error);
      await bot.sendMessage(chatId, "Произошла ошибка при получении уведомлений");
    }
  }
});

// Запускаем инициализацию
console.log('Bot started successfully');
