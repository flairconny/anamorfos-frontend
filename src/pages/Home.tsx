import { useEffect, useState } from "react";
import axios from "axios";

interface Assistant {
  id: number;
  name: string;
  description: string;
  user_id: number | null;
}

export default function Home() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    axios
      .get("https://anamorfos-backend.onrender.com/api/assistants")
      .then((res) => {
        const filtered = res.data.filter(
          (a: Assistant) => a.user_id === null || String(a.user_id) === userId
        );
        setAssistants(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка при получении ассистентов:", err);
        setLoading(false);
      });
  }, [userId]);

  const createChat = async (assistantId: number) => {
    try {
      const response = await axios.post(
        "https://anamorfos-backend.onrender.com/api/chats",
        {
          user_id: userId,
          assistant_id: assistantId,
          title: "Новый чат",
        }
      );
      const chatId = response.data.chat_id;
      alert(`Чат создан! ID: ${chatId}`);
    } catch (err) {
      console.error("Ошибка при создании чата:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Выбери ассистента</h1>
      {loading && <p>Загрузка...</p>}
      {!loading && assistants.length === 0 && <p>Ассистенты не найдены</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {assistants.map((a) => (
          <div
            key={a.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              width: "250px",
              background: "#f9f9f9",
            }}
          >
            <h2>{a.name}</h2>
            <p>{a.description}</p>
            <button onClick={() => createChat(a.id)}>Начать чат</button>
          </div>
        ))}
      </div>
    </div>
  );
}


