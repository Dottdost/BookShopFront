import axios from "axios";
import type {
  ChatMessage,
  ChatSummary,
  SendMessageRequest,
} from "../types/chat";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://cheshireshelfapp-env.eba-pzcyg6yq.eu-north-1.elasticbeanstalk.com";

const chatClient = axios.create({
  baseURL: API_BASE_URL,
});

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getArrayFromRecord(record: JsonRecord, key: string): unknown[] | null {
  const value = record[key];

  if (Array.isArray(value)) return value;

  if (isRecord(value)) {
    const nestedValues = value.$values;

    if (Array.isArray(nestedValues)) return nestedValues;
  }

  return null;
}

function unwrapArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;

  if (!isRecord(data)) return [];

  const directValues = data.$values;

  if (Array.isArray(directValues)) return directValues;

  const possibleKeys = ["data", "items", "messages", "chats", "result"];

  for (const key of possibleKeys) {
    const found = getArrayFromRecord(data, key);

    if (found) return found;
  }

  return [];
}

function unwrapObject(data: unknown): JsonRecord | null {
  if (!isRecord(data)) return null;

  const values = data.$values;

  if (Array.isArray(values)) {
    const first = values[0];

    return isRecord(first) ? first : null;
  }

  return data;
}

function removeRefs<T>(items: unknown[]): T[] {
  return items.filter((item) => {
    if (!isRecord(item)) return false;

    return !("$ref" in item);
  }) as T[];
}

chatClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const normalizeMessageText = (message: ChatMessage) =>
  message.text ?? message.message ?? message.content ?? message.body ?? "";

export const getChatHubUrl = () => `${API_BASE_URL}/chatHub`;

export const getMyChats = async (): Promise<ChatSummary[]> => {
  const response = await chatClient.get("/api/chat/my");

  return removeRefs<ChatSummary>(unwrapArray(response.data));
};

export const getWaitingChats = async (): Promise<ChatSummary[]> => {
  const response = await chatClient.get("/api/chat/waiting");

  return removeRefs<ChatSummary>(unwrapArray(response.data));
};

export const createChat = async (): Promise<ChatSummary> => {
  const response = await chatClient.post("/api/chat/create");

  const chat = unwrapObject(response.data);

  if (!chat?.id || typeof chat.id !== "string") {
    console.log("CREATE CHAT RESPONSE:", response.data);
    throw new Error("Unexpected create chat response format.");
  }

  return chat as unknown as ChatSummary;
};

export const takeChat = async (chatId: string): Promise<void> => {
  await chatClient.post(`/api/chat/take/${chatId}`);
};

export const exitChat = async (_chatId: string): Promise<void> => {
  // Как в Expo: Exit у админа — это просто выйти из окна.
  // Backend не трогаем, чат не закрываем.
  return Promise.resolve();
};

export const closeChat = async (chatId: string): Promise<void> => {
  await chatClient.post(`/api/chat/close/${chatId}`);
};

export const getChatMessages = async (
  chatId: string,
): Promise<ChatMessage[]> => {
  const response = await chatClient.get(`/api/chat/${chatId}/messages`);

  return removeRefs<ChatMessage>(unwrapArray(response.data));
};

export const sendChatMessage = async (
  payload: SendMessageRequest,
): Promise<void> => {
  await chatClient.post("/api/chat/send-message", payload);
};
