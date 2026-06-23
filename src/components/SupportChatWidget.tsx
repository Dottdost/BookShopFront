import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  createChat,
  getChatMessages,
  getMyChats,
  normalizeMessageText,
  sendChatMessage,
} from "../services/chatApi";
import { useChatConnection } from "../hooks/useChatConnection";
import type { ChatMessage } from "../types/chat";
import styles from "../styles/SupportChat.module.css";

const getMessageSenderId = (message: ChatMessage) =>
  message.senderId ?? message.senderUserId ?? "";

const SupportChatWidget = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const [chatId, setChatId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const appendMessage = useCallback((message: ChatMessage) => {
    setMessages((currentMessages) => {
      if (message.id && currentMessages.some((item) => item.id === message.id)) {
        return currentMessages;
      }

      return [...currentMessages, message];
    });
  }, []);

  const { connected } = useChatConnection({
    enabled: isAuthenticated,
    onMessageReceived: appendMessage,
  });

  const loadMessages = useCallback(async (id: string) => {
    if (!id) {
      return;
    }

    try {
      const loadedMessages = await getChatMessages(id);
      setMessages(loadedMessages);
    } catch (err) {
      console.error(err);
      setError("Failed to load messages.");
    }
  }, []);

  const loadChat = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const chats = await getMyChats();
      const currentChat = chats[0];

      if (currentChat?.id) {
        setChatId(currentChat.id);
        await loadMessages(currentChat.id);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load chat.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, loadMessages]);

  useEffect(() => {
    if (open) {
      void loadChat();
    }
  }, [open, loadChat]);

  useEffect(() => {
    if (!open || !chatId) {
      return;
    }

    const interval = window.setInterval(() => {
      void loadMessages(chatId);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [open, chatId, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sortedMessages = useMemo(
    () =>
      [...messages].sort((a, b) => {
        const firstDate = new Date(a.createdAt ?? a.sentAt ?? 0).getTime();
        const secondDate = new Date(b.createdAt ?? b.sentAt ?? 0).getTime();
        return firstDate - secondDate;
      }),
    [messages],
  );

  const handleSend = async () => {
    const trimmedText = text.trim();

    if (!trimmedText || sending) {
      return;
    }

    setSending(true);
    setError("");

    try {
      let currentChatId = chatId;

      if (!currentChatId) {
        const createdChat = await createChat();
        currentChatId = createdChat.id;
        setChatId(createdChat.id);
      }

      const optimisticMessage: ChatMessage = {
        id: `local-${Date.now()}`,
        chatId: currentChatId,
        senderId: user?.id,
        senderName: user?.userName,
        text: trimmedText,
        createdAt: new Date().toISOString(),
      };

      appendMessage(optimisticMessage);
      setText("");

      await sendChatMessage({ chatId: currentChatId, text: trimmedText });
      await loadMessages(currentChatId);
    } catch (err) {
      console.error(err);
      setError("Send failed.");
    } finally {
      setSending(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.widgetRoot}>
      {open && (
        <section className={styles.widgetPanel}>
          <header className={styles.chatHeader}>
            <div>
              <h3>Cheshire Support</h3>
              <p>Ask anything about your order or books.</p>
            </div>
            <button type="button" onClick={() => setOpen(false)}>
              ×
            </button>
          </header>

          <div className={styles.connectionStatus}>
            {connected ? "Live chat connected" : "Connecting... messages still update"}
          </div>

          <div className={styles.messageList}>
            {loading && <p className={styles.emptyState}>Loading chat...</p>}
            {!loading && sortedMessages.length === 0 && (
              <p className={styles.emptyState}>Write your first message 👋</p>
            )}

            {sortedMessages.map((message, index) => {
              const isMine = getMessageSenderId(message) === user?.id || message.isMine;

              return (
                <article
                  key={message.id ?? `${message.chatId}-${index}`}
                  className={`${styles.messageBubble} ${isMine ? styles.mine : styles.theirs}`}
                >
                  <span>{normalizeMessageText(message)}</span>
                  <small>{message.senderName ?? message.userName ?? (isMine ? "You" : "Support")}</small>
                </article>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <div className={styles.inputRow}>
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void handleSend();
                }
              }}
              placeholder="Type your message..."
            />
            <button type="button" onClick={handleSend} disabled={sending || !text.trim()}>
              {sending ? "..." : "Send"}
            </button>
          </div>
        </section>
      )}

      <button className={styles.floatingButton} type="button" onClick={() => setOpen(true)}>
        💬
      </button>
    </div>
  );
};

export default SupportChatWidget;
