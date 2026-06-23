import axios from "axios";
import type {
  ChatMessage,
  ChatSummary,
  SendMessageRequest,
} from "../types/chat";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:44308";

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
  if (isRecord(data)) {
    const values = data.$values;

    if (Array.isArray(values)) {
      const first = values[0];

      return isRecord(first) ? first : null;
    }

    return data;
  }

  return null;
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

  console.log("MY CHATS RESPONSE:", response.data);

  return removeRefs<ChatSummary>(unwrapArray(response.data));
};

export const getWaitingChats = async (): Promise<ChatSummary[]> => {
  const response = await chatClient.get("/api/chat/waiting");

  console.log("WAITING CHATS RESPONSE:", response.data);

  return removeRefs<ChatSummary>(unwrapArray(response.data));
};

export const createChat = async (): Promise<ChatSummary> => {
  const response = await chatClient.post("/api/chat/create");

  console.log("CREATE CHAT RESPONSE:", response.data);

  const chat = unwrapObject(response.data);

  if (!chat?.id || typeof chat.id !== "string") {
    throw new Error("Unexpected create chat response format.");
  }

  return chat as unknown as ChatSummary;
};

export const takeChat = async (chatId: string): Promise<void> => {
  await chatClient.post(`/api/chat/take/${chatId}`);
};

export const exitChat = async (_chatId: string): Promise<void> => {
  // Exit в UI не должен закрывать/удалять чат на backend.
  // Он просто убирает открытый чат у админа.
  return Promise.resolve();
};

export const closeChat = async (chatId: string): Promise<void> => {
  await chatClient.post(`/api/chat/close/${chatId}`);
};

export const getChatMessages = async (
  chatId: string,
): Promise<ChatMessage[]> => {
  const response = await chatClient.get(`/api/chat/${chatId}/messages`);

  console.log("CHAT MESSAGES RESPONSE:", response.data);

  return removeRefs<ChatMessage>(unwrapArray(response.data));
};

export const sendChatMessage = async (
  payload: SendMessageRequest,
): Promise<void> => {
  await chatClient.post("/api/chat/send-message", payload);
};
