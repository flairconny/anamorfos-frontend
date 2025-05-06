import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";

export default function App() {
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;

    if (user) {
      console.log("👤 Пользователь:", user);

      axios.post("https://anamorfos-backend.onrender.com/api/auth", {
        telegram_chat_id: user.id,
        name: user.first_name,
        username: user.username,
      }).then(() => {
        console.log("✅ Авторизация прошла успешно");
      }).catch((err) => {
        console.error("❌ Ошибка при авторизации:", err);
      });
    } else {
      console.warn("⚠️ Telegram WebApp user not found");
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}


