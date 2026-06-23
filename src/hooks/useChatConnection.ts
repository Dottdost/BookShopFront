import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { getChatHubUrl } from "../services/chatApi";
import type { ChatMessage } from "../types/chat";

interface UseChatConnectionOptions {
  enabled: boolean;
  chatId?: string;
  onMessageReceived: (message: ChatMessage) => void;
}

type SignalRPayload = Record<string, unknown>;

function isPayload(value: unknown): value is SignalRPayload {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function createMessageFromArgs(
  args: unknown[],
  fallbackChatId?: string,
): ChatMessage | null {
  const first = args[0];

  if (isPayload(first)) {
    return {
      id: getString(first.id),
      chatId: getString(first.chatId) ?? fallbackChatId ?? "",
      senderId: getString(first.senderId),
      senderUserId: getString(first.senderUserId),
      senderName: getString(first.senderName),
      userName: getString(first.userName),
      senderRole: getString(first.senderRole),
      text: getString(first.text),
      message: getString(first.message),
      content: getString(first.content),
      body: getString(first.body),
      createdAt: getString(first.createdAt),
      sentAt: getString(first.sentAt),
    };
  }

  const senderId = getString(args[0]);
  const text = getString(args[1]);

  if (!text) return null;

  return {
    id: `signalr-${Date.now()}-${Math.random()}`,
    chatId: fallbackChatId ?? "",
    senderId,
    text,
    createdAt: new Date().toISOString(),
  };
}

export const useChatConnection = ({
  enabled,
  chatId,
  onMessageReceived,
}: UseChatConnectionOptions) => {
  const onMessageReceivedRef = useRef(onMessageReceived);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived;
  }, [onMessageReceived]);

  useEffect(() => {
    if (!enabled) {
      setConnected(false);
      return;
    }

    let cancelled = false;

    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      "";

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(getChatHubUrl(), {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    const handleIncomingMessage = (...args: unknown[]) => {
      console.log("CHAT SIGNALR RECEIVED:", args);

      const message = createMessageFromArgs(args, chatId);

      if (!message) return;

      onMessageReceivedRef.current(message);
    };

    async function joinCurrentChat() {
      if (!chatId) return;

      if (connection.state !== signalR.HubConnectionState.Connected) return;

      await connection.invoke("JoinChat", chatId);
      console.log("Joined chat group:", chatId);
    }

    async function start() {
      try {
        console.log("Trying to connect chat hub:", getChatHubUrl());

        connection.on("ReceiveMessage", handleIncomingMessage);
        connection.on("MessageReceived", handleIncomingMessage);
        connection.on("NewMessage", handleIncomingMessage);
        connection.on("ChatMessageReceived", handleIncomingMessage);

        connection.onreconnecting(() => {
          setConnected(false);
        });

        connection.onreconnected(async () => {
          setConnected(true);

          try {
            await joinCurrentChat();
          } catch (error) {
            console.error("Rejoin chat group failed:", error);
          }
        });

        connection.onclose((error) => {
          console.log("Chat hub closed:", error);
          setConnected(false);
        });

        await connection.start();

        if (cancelled) return;

        console.log("Chat hub connected.");
        setConnected(true);

        await joinCurrentChat();
      } catch (error) {
        console.error("Chat hub connection failed:", error);
        setConnected(false);
      }
    }

    void start();

    return () => {
      cancelled = true;

      async function cleanup() {
        try {
          connection.off("ReceiveMessage", handleIncomingMessage);
          connection.off("MessageReceived", handleIncomingMessage);
          connection.off("NewMessage", handleIncomingMessage);
          connection.off("ChatMessageReceived", handleIncomingMessage);

          if (
            chatId &&
            connection.state === signalR.HubConnectionState.Connected
          ) {
            await connection.invoke("LeaveChat", chatId);
            console.log("Left chat group:", chatId);
          }

          await connection.stop();
        } catch {
          // ignore
        }

        setConnected(false);
      }

      void cleanup();
    };
  }, [enabled, chatId]);

  return { connected };
};
