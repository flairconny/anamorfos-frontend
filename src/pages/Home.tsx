import React, { useEffect, useState } from "react";
import { getAssistants, createChat } from "../api/minibot";
import ChatWindow from "../components/ChatWindow";
import { useSearchParams } from "react-router-dom";

export default function Home() {
  const [assistants, setAssistants] = useState<any[]>([]);
  const [chatId, setChatId] = useState<number | null>(null);
  const [searchParams] = useSearchParams();
  const chatIdFromUrl = searchParams.get("chat_id");

  useEffect(() => {
      if (chatIdFromUrl) {
        console.log("Получен chat_id из URL:", chatIdFromUrl);
        // Можно сохранить в локальное хранилище, сессии или использовать в запросах
      }
  }, [chatIdFromUrl]);


  useEffect(() => {
    getAssistants().then(setAssistants);
  }, []);

  const handleCreate = async (assistantId: number) => {
    const id = await createChat(1, assistantId, "Чат с ассистентом");
    setChatId(id);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Выберите ассистента:</h2>
      <div className="flex gap-2 mb-4">
        {assistants.map((a) => (
          <button key={a.id} onClick={() => handleCreate(a.id)} className="border p-2 rounded">
            {a.name}
          </button>
        ))}
      </div>
      {chatId && <ChatWindow chatId={chatId} />}
    </div>
  );
}
