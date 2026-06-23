import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { getChatHubUrl } from "../services/chatApi";
import type { ChatMessage } from "../types/chat";

interface UseChatConnectionOptions {
  enabled: boolean;
  onMessageReceived: (message: ChatMessage) => void;
}

export const useChatConnection = ({
  enabled,
  onMessageReceived,
}: UseChatConnectionOptions) => {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const onMessageReceivedRef = useRef(onMessageReceived);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived;
  }, [onMessageReceived]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;
    const token = localStorage.getItem("accessToken");

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(getChatHubUrl(), {
        accessTokenFactory: () => token ?? "",
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    const handleIncomingMessage = (message: ChatMessage) => {
      onMessageReceivedRef.current(message);
    };

    connection.on("ReceiveMessage", handleIncomingMessage);
    connection.on("MessageReceived", handleIncomingMessage);
    connection.on("NewMessage", handleIncomingMessage);
    connection.on("ChatMessageReceived", handleIncomingMessage);

    connection.onreconnected(() => setConnected(true));
    connection.onreconnecting(() => setConnected(false));
    connection.onclose(() => setConnected(false));

    connection
      .start()
      .then(() => {
        if (!cancelled) {
          connectionRef.current = connection;
          setConnected(true);
        }
      })
      .catch((error) => {
        console.error("Chat hub connection failed", error);
        setConnected(false);
      });

    return () => {
      cancelled = true;
      connection.off("ReceiveMessage", handleIncomingMessage);
      connection.off("MessageReceived", handleIncomingMessage);
      connection.off("NewMessage", handleIncomingMessage);
      connection.off("ChatMessageReceived", handleIncomingMessage);
      connection.stop().catch(() => undefined);
      connectionRef.current = null;
      setConnected(false);
    };
  }, [enabled]);

  return { connected };
};
