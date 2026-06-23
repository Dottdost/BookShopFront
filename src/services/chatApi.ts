import axios from "axios";
import type { ChatMessage, ChatSummary, SendMessageRequest } from "../types/chat";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:44308";

const chatClient = axios.create({
  baseURL: API_BASE_URL,
});

chatClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const unwrapValues = <T>(data: T | { $values?: T }): T => {
  if (data && typeof data === "object" && "$values" in data) {
    return (data as { $values?: T }).$values as T;
  }

  return data as T;
};

export const normalizeMessageText = (message: ChatMessage) =>
  message.text ?? message.message ?? message.content ?? "";

export const getMyChats = async (): Promise<ChatSummary[]> => {
  const response = await chatClient.get<ChatSummary[] | { $values?: ChatSummary[] }>(
    "/api/chat/my",
  );

  const data = unwrapValues(response.data);
  return Array.isArray(data) ? data : data ? [data as ChatSummary] : [];
};

export const getWaitingChats = async (): Promise<ChatSummary[]> => {
  const response = await chatClient.get<ChatSummary[] | { $values?: ChatSummary[] }>(
    "/api/chat/waiting",
  );

  const data = unwrapValues(response.data);
  return Array.isArray(data) ? data : [];
};

export const createChat = async (): Promise<ChatSummary> => {
  const response = await chatClient.post<ChatSummary>("/api/chat/create");
  return response.data;
};

export const takeChat = async (chatId: string): Promise<void> => {
  await chatClient.post(`/api/chat/take/${chatId}`);
};

export const exitChat = async (chatId: string): Promise<void> => {
  await chatClient.post(`/api/chat/exit/${chatId}`);
};

export const closeChat = async (chatId: string): Promise<void> => {
  await chatClient.post(`/api/chat/close/${chatId}`);
};

export const getChatMessages = async (chatId: string): Promise<ChatMessage[]> => {
  const response = await chatClient.get<ChatMessage[] | { $values?: ChatMessage[] }>(
    `/api/chat/${chatId}/messages`,
  );

  const data = unwrapValues(response.data);
  return Array.isArray(data) ? data : [];
};

export const sendChatMessage = async (payload: SendMessageRequest): Promise<void> => {
  await chatClient.post("/api/chat/send-message", payload);
};

export const getChatHubUrl = () => `${API_BASE_URL}/chatHub`;
