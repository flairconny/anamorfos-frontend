import axios from "axios";

const BASE_URL = "https://anamorfos-api.onrender.com/api";


export async function getAssistants() {
  const res = await axios.get(`${BASE_URL}/assistants`);
  return res.data;
}

export async function createChat(userId: number, assistantId: number, title: string) {
  const res = await axios.post(`${BASE_URL}/chats`, { user_id: userId, assistant_id: assistantId, title });
  return res.data.chat_id;
}

export async function getChatMessages(chatId: number) {
  const res = await axios.get(`${BASE_URL}/chats/${chatId}`);
  return res.data;
}

export async function sendMessage(chatId: number, role: string, content: string) {
  await axios.post(`${BASE_URL}/chats/${chatId}/message`, { role, content });
}

export async function generateAssistantResponse(chatId: number) {
  const res = await axios.post(`${BASE_URL}/chats/${chatId}/generate`);
  return res.data;
}
