import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

declare global {
  interface Window {
    Telegram?: any;
  }
}

export default function App() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      const userId = tg.initDataUnsafe?.user?.id;
      if (userId) {
        localStorage.setItem("user_id", String(userId));
      }
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}


