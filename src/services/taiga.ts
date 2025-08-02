import axios from "axios";

export class TaigaService {
  static async authenticate(
    username: string,
    password: string,
    apiUrl: string
  ) {
    try {
      const response = await axios.post(`${apiUrl}/auth`, {
        type: "normal",
        username,
        password,
      });

      return response.data;
    } catch (error) {
      throw new Error("Ошибка аутентификации");
    }
  }
}
