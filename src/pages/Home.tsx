// frontend/src/pages/Home.tsx
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://anamorfos-backend.onrender.com/api";

interface Assistant {
  id: number;
  name: string;
  description: string;
}

interface Chat {
  id: number;
  title: string;
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const chatId = new URLSearchParams(window.location.search).get("chat_id") || "123456";
  const userId = 1; // можно подставить динамически позже

  useEffect(() => {
    axios.get(`${API_BASE}/assistants`).then(res => setAssistants(res.data));
    axios.get(`${API_BASE}/chats`).then(res => setChats(res.data));
  }, []);

  const createChat = async (assistantId: number) => {
    const title = prompt("Название нового чата?") || "Новый чат";
    const res = await axios.post(`${API_BASE}/chats`, {
      user_id: userId,
      assistant_id: assistantId,
      title
    });
    const newChatId = res.data.chat_id;
    window.location.href = `/?chat_id=${newChatId}`;
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 600, margin: "auto" }}>
      <h2>Мои чаты</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {chats.map(chat => (
          <li key={chat.id} style={{ marginBottom: 8 }}>
            <a href={`/?chat_id=${chat.id}`} style={{ textDecoration: "none", color: "#333" }}>
              💬 {chat.title}
            </a>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setShowPicker(!showPicker)}
        style={{ marginTop: 20, padding: "10px 15px", fontSize: 16 }}
      >
        ➕ Создать новый чат
      </button>

      {showPicker && (
        <div style={{ marginTop: 20 }}>
          <h3>Выбери ассистента</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {assistants.map(a => (
              <li key={a.id} style={{ marginBottom: 10 }}>
                <button
                  onClick={() => createChat(a.id)}
                  style={{
                    padding: "10px 15px",
                    width: "100%",
                    textAlign: "left",
                    background: "#f2f2f2",
                    border: "1px solid #ccc",
                    borderRadius: 6,
                    cursor: "pointer"
                  }}
                >
                  <strong>{a.name}</strong>
                  <div style={{ fontSize: 12, color: "#666" }}>{a.description}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
