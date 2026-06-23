import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  getChatMessages,
  getMyChats,
  getWaitingChats,
  normalizeMessageText,
  sendChatMessage,
  takeChat,
} from "../services/chatApi";
import { useChatConnection } from "../hooks/useChatConnection";
import type { ChatMessage, ChatSummary } from "../types/chat";
import styles from "../styles/SupportChat.module.css";

const getMessageSenderId = (message: ChatMessage) =>
  message.senderId ?? message.senderUserId ?? "";

const SupportChatsPage = () => {
  const { user, roles } = useSelector((state: RootState) => state.auth);
  const isAdmin = roles.some(
    (role) =>
      role.roleName === "Admin" ||
      role.roleName === "AppAdmin" ||
      role.roleName === "SuperAdmin",
  );

  const [waitingChats, setWaitingChats] = useState<ChatSummary[]>([]);
  const [myChats, setMyChats] = useState<ChatSummary[]>([]);
  const [activeChat, setActiveChat] = useState<ChatSummary | null>(null);
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
    enabled: isAdmin,
    onMessageReceived: appendMessage,
  });

  const loadChats = useCallback(async () => {
    if (!isAdmin) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [waiting, mine] = await Promise.all([getWaitingChats(), getMyChats()]);
      setWaitingChats(waiting);
      setMyChats(mine);
    } catch (err) {
      console.error(err);
      setError("Failed to load chats.");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const openChat = useCallback(async (chat: ChatSummary) => {
    setActiveChat(chat);
    setError("");

    try {
      const loadedMessages = await getChatMessages(chat.id);
      setMessages(loadedMessages);
    } catch (err) {
      console.error(err);
      setError("Failed to load messages.");
    }
  }, []);

  const handleTakeChat = async (chat: ChatSummary) => {
    setError("");

    try {
      await takeChat(chat.id);
      await loadChats();
      await openChat(chat);
    } catch (err) {
      console.error(err);
      setError("Failed to take chat.");
    }
  };

  const handleSend = async () => {
    const trimmedText = text.trim();

    if (!trimmedText || !activeChat?.id || sending) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const optimisticMessage: ChatMessage = {
        id: `local-${Date.now()}`,
        chatId: activeChat.id,
        senderId: user?.id,
        senderName: user?.userName,
        text: trimmedText,
        createdAt: new Date().toISOString(),
      };

      appendMessage(optimisticMessage);
      setText("");

      await sendChatMessage({ chatId: activeChat.id, text: trimmedText });
      const loadedMessages = await getChatMessages(activeChat.id);
      setMessages(loadedMessages);
    } catch (err) {
      console.error(err);
      setError("Send failed.");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    void loadChats();
  }, [loadChats]);

  useEffect(() => {
    if (!activeChat?.id) {
      return;
    }

    const interval = window.setInterval(() => {
      void getChatMessages(activeChat.id).then(setMessages).catch(() => undefined);
      void loadChats();
    }, 3000);

    return () => window.clearInterval(interval);
  }, [activeChat?.id, loadChats]);

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

  if (!isAdmin) {
    return <main className={styles.page}>Only admins can open support chats.</main>;
  }

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Support Chats</h1>
          <p>{connected ? "Live chat connected" : "Connecting... polling is active"}</p>
        </div>
        <button type="button" onClick={loadChats}>
          Refresh
        </button>
      </div>

      {error && <p className={styles.errorText}>{error}</p>}

      <div className={styles.adminLayout}>
        <aside className={styles.chatSidebar}>
          <section>
            <h3>Waiting</h3>
            {loading && <p className={styles.emptyState}>Loading...</p>}
            {!loading && waitingChats.length === 0 && (
              <p className={styles.emptyState}>No waiting chats</p>
            )}
            {waitingChats.map((chat) => (
              <button
                className={styles.chatListItem}
                type="button"
                key={chat.id}
                onClick={() => void handleTakeChat(chat)}
              >
                <strong>{chat.customerName ?? chat.userName ?? "Customer"}</strong>
                <span>{chat.lastMessage ?? "Take this chat"}</span>
              </button>
            ))}
          </section>

          <section>
            <h3>My chats</h3>
            {!loading && myChats.length === 0 && (
              <p className={styles.emptyState}>No active chats</p>
            )}
            {myChats.map((chat) => (
              <button
                className={`${styles.chatListItem} ${activeChat?.id === chat.id ? styles.activeChat : ""}`}
                type="button"
                key={chat.id}
                onClick={() => void openChat(chat)}
              >
                <strong>{chat.customerName ?? chat.userName ?? "Customer"}</strong>
                <span>{chat.lastMessage ?? chat.status ?? "Open chat"}</span>
              </button>
            ))}
          </section>
        </aside>

        <section className={styles.adminChatPanel}>
          {!activeChat ? (
            <div className={styles.emptyChat}>Choose a chat on the left.</div>
          ) : (
            <>
              <header className={styles.chatHeader}>
                <div>
                  <h3>{activeChat.customerName ?? activeChat.userName ?? "Customer"}</h3>
                  <p>Chat ID: {activeChat.id}</p>
                </div>
              </header>

              <div className={styles.messageList}>
                {sortedMessages.map((message, index) => {
                  const isMine = getMessageSenderId(message) === user?.id || message.isMine;

                  return (
                    <article
                      key={message.id ?? `${message.chatId}-${index}`}
                      className={`${styles.messageBubble} ${isMine ? styles.mine : styles.theirs}`}
                    >
                      <span>{normalizeMessageText(message)}</span>
                      <small>{message.senderName ?? message.userName ?? (isMine ? "You" : "Customer")}</small>
                    </article>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className={styles.inputRow}>
                <input
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void handleSend();
                    }
                  }}
                  placeholder="Type your reply..."
                />
                <button type="button" onClick={handleSend} disabled={sending || !text.trim()}>
                  {sending ? "..." : "Send"}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default SupportChatsPage;
