import { useEffect, useState } from "react";
import axios from "axios";

interface Assistant {
  id: number;
  name: string;
  description: string;
}

export default function Home() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  useEffect(() => {
      const tg = window.Telegram?.WebApp;
      if (tg?.initDataUnsafe?.user?.id) {
        setUserId(tg.initDataUnsafe.user.id);
      }
    }, []);

  const [showAssistantForm, setShowAssistantForm] = useState(false);
  const [showChatForm, setShowChatForm] = useState(false);
  const [newAssistant, setNewAssistant] = useState({
    name: "",
    description: "",
    prompt: ""
  });
  const [chatTitle, setChatTitle] = useState("");
  const [selectedAssistantId, setSelectedAssistantId] = useState<number | null>(null);
  const [chooseAssistant, setChooseAssistant] = useState(false);

  useEffect(() => {
    axios.get("https://anamorfos-backend.onrender.com/api/assistants")
      .then(res => setAssistants(res.data))
      .catch(() => setAssistants([]));
  }, []);

const handleCreateAssistant = async () => {
  if (!userId) return alert("Ошибка: не удалось получить ваш Telegram ID");
  await axios.post("https://anamorfos-backend.onrender.com/api/assistants", {
    ...newAssistant,
    config_json: JSON.stringify({ model: "gpt-4-1106-preview" }),
    user_id: userId
  });
  setShowAssistantForm(false);
  location.reload();
};

const handleCreateChat = async () => {
  if (!userId) return alert("Ошибка: не удалось получить ваш Telegram ID");
  const assistant_id = chooseAssistant ? selectedAssistantId : null;
  const payload = {
    user_id: userId,
    assistant_id: assistant_id ?? 0,
    title: chatTitle || "Новый чат"
  };
  await axios.post("https://anamorfos-backend.onrender.com/api/chats", payload);
  setShowChatForm(false);
  location.reload();
};

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Твои ассистенты</h1>

      <button
        onClick={() => setShowAssistantForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
      >
        ➕ Создать ассистента
      </button>

      <button
        onClick={() => setShowChatForm(true)}
        className="bg-green-500 text-white px-4 py-2 rounded ml-2"
      >
        💬 Новый чат
      </button>

      <div className="mt-6">
        {assistants.length > 0 ? (
          <ul>
            {assistants.map(a => (
              <li key={a.id} className="border p-2 rounded mb-2">
                <strong>{a.name}</strong><br />
                <span className="text-sm text-gray-600">{a.description}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Ассистенты не найдены</p>
        )}
      </div>

      {showAssistantForm && (
        <div className="mt-6 border p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Новый ассистент</h2>
          <input
            placeholder="Имя"
            value={newAssistant.name}
            onChange={e => setNewAssistant({ ...newAssistant, name: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            placeholder="Описание"
            value={newAssistant.description}
            onChange={e => setNewAssistant({ ...newAssistant, description: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <textarea
            placeholder="Промт"
            value={newAssistant.prompt}
            onChange={e => setNewAssistant({ ...newAssistant, prompt: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <button
            onClick={handleCreateAssistant}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >Создать</button>
        </div>
      )}

      {showChatForm && (
        <div className="mt-6 border p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Создание чата</h2>
          <input
            placeholder="Название чата"
            value={chatTitle}
            onChange={e => setChatTitle(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <label className="block mb-2">
            <input
              type="checkbox"
              checked={chooseAssistant}
              onChange={e => setChooseAssistant(e.target.checked)}
              className="mr-2"
            />
            Выбрать ассистента
          </label>
          {chooseAssistant && (
            <select
              value={selectedAssistantId || ""}
              onChange={e => setSelectedAssistantId(parseInt(e.target.value))}
              className="border p-2 w-full mb-2"
            >
              <option value="">-- Выберите ассистента --</option>
              {assistants.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          )}
          <button
            onClick={handleCreateChat}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >Создать чат</button>
        </div>
      )}
    </div>
  );
}
