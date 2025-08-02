import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export class DatabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async saveUser(user: {
    chatId: number;
    taigaUsername: string;
    taigaAuthToken: string;
    isRegistered: boolean;
    taigaUserId: string;
  }) {
    const { data, error } = await this.supabase
      .from("users")
      .upsert({
        chat_id: user.chatId,
        taiga_username: user.taigaUsername,
        taiga_auth_token: user.taigaAuthToken,
        is_registered: user.isRegistered,
        taiga_user_id: user.taigaUserId,
      })
      .select();

    if (error) throw error;
    return data;
  }

  async getUser(chatId: number) {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("chat_id", chatId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async saveUserState(chatId: number, state: any) {
    const { data, error } = await this.supabase
      .from("user_states")
      .upsert({
        chat_id: chatId,
        state: state,
      })
      .select();

    if (error) throw error;
    return data;
  }

  async getUserState(chatId: number) {
    const { data, error } = await this.supabase
      .from("user_states")
      .select("state")
      .eq("chat_id", chatId)
      .single();

    if (error) throw error;
    return data?.state;
  }

  async deleteUserState(chatId: number) {
    const { error } = await this.supabase
      .from("user_states")
      .delete()
      .eq("chat_id", chatId);

    if (error) throw error;
  }
}

// Создаем экземпляр сервиса для использования в других частях проекта
export const db = new DatabaseService();
