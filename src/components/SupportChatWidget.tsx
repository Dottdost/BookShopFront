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
import type { ChatMessage, ChatSummary } from "../types/chat";
import styles from "../styles/SupportChat.module.css";

const getMessageSenderId = (message: ChatMessage) =>
  message.senderId ?? message.senderUserId ?? "";

function isClosedChat(chat: ChatSummary) {
  const status = String(chat.status ?? "").toLowerCase();

  return Boolean(chat.closedAt) || status === "closed";
}

function isWaitingChat(chat: ChatSummary) {
  const status = String(chat.status ?? "").toLowerCase();

  return status === "1" || status === "waiting" || status === "pending";
}

function getChatDate(chat: ChatSummary) {
  return new Date(
    chat.createdAt ??
      chat.updatedAt ??
      chat.lastMessageAt ??
      chat.closedAt ??
      0,
  ).getTime();
}

function pickWaitingUserChat(chats: ChatSummary[]) {
  const waitingChats = chats.filter(
    (chat) => chat?.id && !isClosedChat(chat) && isWaitingChat(chat),
  );

  if (waitingChats.length === 0) return null;

  return [...waitingChats].sort((a, b) => getChatDate(b) - getChatDate(a))[0];
}

const SupportChatWidget = () => {
  const {
    user,
    roles = [],
    isAuthenticated,
  } = useSelector((state: RootState) => state.auth);

  const isAdmin = roles.some(
    (role) =>
      role.roleName === "Admin" ||
      role.roleName === "AppAdmin" ||
      role.roleName === "SuperAdmin",
  );

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
      if (
        message.id &&
        currentMessages.some((item) => item.id === message.id)
      ) {
        return currentMessages;
      }

      return [...currentMessages, message];
    });
  }, []);

  const { connected } = useChatConnection({
    enabled: isAuthenticated && !isAdmin && Boolean(chatId),
    chatId,
    onMessageReceived: appendMessage,
  });

  const loadMessages = useCallback(async (id: string) => {
    if (!id) return;

    try {
      const loadedMessages = await getChatMessages(id);
      setMessages(loadedMessages);
    } catch (err) {
      console.error(err);
      setError("Failed to load messages.");
    }
  }, []);

  const resetChatState = useCallback(() => {
    setChatId("");
    setMessages([]);
    setText("");
    setError("");
  }, []);

  const loadChat = useCallback(async () => {
    if (!isAuthenticated || isAdmin) return;

    setLoading(true);
    setError("");

    try {
      const chats = await getMyChats();
      const currentChat = pickWaitingUserChat(chats);

      if (currentChat?.id) {
        setChatId(currentChat.id);
        await loadMessages(currentChat.id);
      } else {
        resetChatState();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load chat.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin, loadMessages, resetChatState]);

  async function createFreshChat() {
    const createdChat = await createChat();

    setChatId(createdChat.id);
    setMessages([]);

    return createdChat.id;
  }

  async function resolveChatBeforeSend() {
    const chats = await getMyChats();
    const waitingChat = pickWaitingUserChat(chats);

    if (waitingChat?.id) {
      setChatId(waitingChat.id);

      if (waitingChat.id !== chatId) {
        await loadMessages(waitingChat.id);
      }

      return waitingChat.id;
    }

    return createFreshChat();
  }

  useEffect(() => {
    if (open) {
      void loadChat();
    }
  }, [open, loadChat]);

  useEffect(() => {
    if (!open || !chatId || isAdmin) return;

    const interval = window.setInterval(() => {
      void loadMessages(chatId);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [open, chatId, isAdmin, loadMessages]);

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

    if (!trimmedText || sending) return;

    setSending(true);
    setError("");

    try {
      const currentChatId = await resolveChatBeforeSend();

      const optimisticMessage: ChatMessage = {
        id: `local-${Date.now()}`,
        chatId: currentChatId,
        senderId: user?.id,
        senderName: user?.userName,
        text: trimmedText,
        createdAt: new Date().toISOString(),
        isMine: true,
      };

      appendMessage(optimisticMessage);
      setText("");

      await sendChatMessage({
        chatId: currentChatId,
        text: trimmedText,
      });

      await loadMessages(currentChatId);
    } catch (err) {
      console.error(err);
      setError("Send failed.");
    } finally {
      setSending(false);
    }
  };

  if (!isAuthenticated || isAdmin) {
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
            {chatId
              ? connected
                ? "Live chat connected"
                : "Connecting... messages still update"
              : "New chat will be created after your first message"}
          </div>

          <div className={styles.messageList}>
            {loading && <p className={styles.emptyState}>Loading chat...</p>}

            {!loading && sortedMessages.length === 0 && (
              <p className={styles.emptyState}>Write your first message 👋</p>
            )}

            {sortedMessages.map((message, index) => {
              const isMine =
                getMessageSenderId(message) === user?.id || message.isMine;

              return (
                <article
                  key={message.id ?? `${message.chatId}-${index}`}
                  className={`${styles.messageBubble} ${
                    isMine ? styles.mine : styles.theirs
                  }`}
                >
                  <span>{normalizeMessageText(message)}</span>

                  <small>
                    {message.senderName ??
                      message.userName ??
                      (isMine ? "You" : "Support")}
                  </small>
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

            <button
              type="button"
              onClick={handleSend}
              disabled={sending || !text.trim()}
            >
              {sending ? "..." : "Send"}
            </button>
          </div>
        </section>
      )}

      <button
        className={styles.floatingButton}
        type="button"
        onClick={() => setOpen(true)}
      >
        💬
      </button>
    </div>
  );
};

export default SupportChatWidget;
