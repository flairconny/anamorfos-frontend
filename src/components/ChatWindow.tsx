import React, { useEffect, useState } from "react";
import { getChatMessages, sendMessage } from "../api/minibot";
import { generateAssistantResponse } from "../api/minibot";

export default function ChatWindow({ chatId }: { chatId: number }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    getChatMessages(chatId).then(setMessages);
  }, [chatId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(chatId, "user", input);
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    const assistantReply = await generateAssistantResponse(chatId);
    setMessages((prev) => [...prev, assistantReply]);
  };

  return (
    <div className="p-4">
      <div className="h-96 overflow-y-scroll border rounded p-2 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <span className="block">{m.content}</span>
          </div>
        ))}
      </div>
      <input
        className="border p-2 w-full mb-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Напишите сообщение..."
      />
    </div>
  );
}
