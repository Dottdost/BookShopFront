import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  closeChat,
  exitChat,
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

interface SupportChatsPageProps {
  embedded?: boolean;
}

const getMessageSenderId = (message: ChatMessage) =>
  message.senderId ?? message.senderUserId ?? "";

const getAdminId = (chat: ChatSummary) =>
  chat.adminId ?? chat.supportUserId ?? "";

function isClosedChat(chat: ChatSummary) {
  const status = String(chat.status ?? "").toLowerCase();

  return Boolean(chat.closedAt) || status === "closed";
}

function getChatDate(chat: ChatSummary) {
  return new Date(
    chat.updatedAt ??
      chat.lastMessageAt ??
      chat.createdAt ??
      chat.closedAt ??
      0,
  ).getTime();
}

function sortChats(chats: ChatSummary[]) {
  return [...chats]
    .filter((chat) => chat?.id && !isClosedChat(chat))
    .sort((a, b) => getChatDate(b) - getChatDate(a));
}

const isAdminMessage = (
  message: ChatMessage,
  chat: ChatSummary,
  currentUserId?: string,
) => {
  const senderId = getMessageSenderId(message);
  const adminId = getAdminId(chat);

  if (message.isMine || message.senderRole?.toLowerCase() === "admin") {
    return true;
  }

  if (!senderId) {
    return false;
  }

  if (senderId === currentUserId || senderId === "admin") {
    return true;
  }

  if (adminId) {
    return senderId === adminId;
  }

  return Boolean(chat.userId && senderId !== chat.userId);
};

const SupportChatsPage = ({ embedded = false }: SupportChatsPageProps) => {
  const { t } = useTranslation();
  const { user, roles = [] } = useSelector((state: RootState) => state.auth);

  const getCustomerName = (chat: ChatSummary) =>
    chat.customerName ?? chat.userName ?? chat.userId ?? t("supportChat.customerName");

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

  const activeChatIdRef = useRef("");
  const messageListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    activeChatIdRef.current = activeChat?.id ?? "";
  }, [activeChat?.id]);

  const scrollMessagesToBottom = () => {
    const container = messageListRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  };

  const loadChats = useCallback(
    async (silent = false) => {
      if (!isAdmin) return;

      if (!silent) setLoading(true);

      setError("");

      try {
        const [waiting, mine] = await Promise.all([
          getWaitingChats(),
          getMyChats(),
        ]);

        setWaitingChats(sortChats(waiting));
        setMyChats(sortChats(mine));
      } catch (err) {
        console.error(err);

        if (!silent) {
          setError(t("supportChat.failedLoadChats"));
        }
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [isAdmin, t],
  );

  const appendMessage = useCallback(
    (message: ChatMessage) => {
      const activeChatId = activeChatIdRef.current;

      if (!message.chatId || message.chatId !== activeChatId) {
        void loadChats(true);
        return;
      }

      setMessages((currentMessages) => {
        if (
          message.id &&
          currentMessages.some((item) => item.id === message.id)
        ) {
          return currentMessages;
        }

        return [...currentMessages, message];
      });

      void loadChats(true);
    },
    [loadChats],
  );

  const { connected } = useChatConnection({
    enabled: isAdmin && Boolean(activeChat?.id),
    chatId: activeChat?.id,
    onMessageReceived: appendMessage,
  });

  const openChat = useCallback(async (chat: ChatSummary) => {
    setActiveChat(chat);
    setText("");
    setError("");

    try {
      const loadedMessages = await getChatMessages(chat.id);
      setMessages(loadedMessages);

      window.setTimeout(() => {
        scrollMessagesToBottom();
      }, 50);
    } catch (err) {
      console.error(err);
      setError(t("supportChat.failedLoadMessages"));
    }
  }, [t]);

  const handleTakeChat = async (chat: ChatSummary) => {
    setError("");

    try {
      await takeChat(chat.id);

      const takenChat: ChatSummary = {
        ...chat,
        adminId: chat.adminId ?? user?.id ?? null,
        supportUserId: chat.supportUserId ?? user?.id ?? null,
        supportName: chat.supportName ?? user?.userName ?? null,
      };

      await openChat(takenChat);
      await loadChats(true);
    } catch (err) {
      console.error(err);
      setError(t("supportChat.failedTakeChat"));
    }
  };

  const handleExitChat = async () => {
    if (!activeChat?.id) return;

    setError("");

    try {
      await exitChat(activeChat.id);

      setActiveChat(null);
      setMessages([]);
      setText("");

      await loadChats(true);
    } catch (err) {
      console.error(err);
      setError(t("supportChat.failedExitChat"));
    }
  };

  const handleCloseChat = async () => {
    if (!activeChat?.id) return;

    setError("");

    try {
      await closeChat(activeChat.id);

      setActiveChat(null);
      setMessages([]);
      setText("");

      await loadChats(true);
    } catch (err) {
      console.error(err);
      setError(t("supportChat.failedCloseChat"));
    }
  };

  const handleSend = async () => {
    const trimmedText = text.trim();

    if (!trimmedText || !activeChat?.id || sending) return;

    setSending(true);
    setError("");

    try {
      const optimisticMessage: ChatMessage = {
        id: `admin-local-${Date.now()}`,
        chatId: activeChat.id,
        senderId:
          activeChat.adminId ??
          activeChat.supportUserId ??
          user?.id ??
          user?.userName ??
          "admin",
        senderName: user?.userName ?? activeChat.supportName ?? t("supportChat.adminName"),
        senderRole: "Admin",
        text: trimmedText,
        createdAt: new Date().toISOString(),
        isMine: true,
      };

      appendMessage(optimisticMessage);
      setText("");

      window.setTimeout(() => {
        scrollMessagesToBottom();
      }, 50);

      await sendChatMessage({
        chatId: activeChat.id,
        text: trimmedText,
      });

      const loadedMessages = await getChatMessages(activeChat.id);
      setMessages(loadedMessages);

      await loadChats(true);
    } catch (err) {
      console.error(err);
      setError(t("supportChat.sendFailed"));
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    void loadChats();
  }, [loadChats]);

  useEffect(() => {
    if (!isAdmin) return;

    const interval = window.setInterval(() => {
      void loadChats(true);
    }, 1800);

    return () => window.clearInterval(interval);
  }, [isAdmin, loadChats]);

  useEffect(() => {
    if (!activeChat?.id) return;

    const interval = window.setInterval(() => {
      void getChatMessages(activeChat.id)
        .then((loadedMessages) => {
          setMessages(loadedMessages);
        })
        .catch(() => undefined);
    }, 1500);

    return () => window.clearInterval(interval);
  }, [activeChat?.id]);

  useEffect(() => {
    if (messages.length === 0) return;

    scrollMessagesToBottom();
  }, [messages.length]);

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
    return <main className={styles.page}>{t("supportChat.onlyAdmins")}</main>;
  }

  return (
    <main className={`${styles.page} ${embedded ? styles.embeddedPage : ""}`}>
      <div className={styles.pageHeader}>
        <div>
          <h1>{t("supportChat.title")}</h1>

          <p>
            {activeChat?.id
              ? connected
                ? t("supportChat.liveConnected")
                : t("supportChat.connecting")
              : t("supportChat.chooseChatStatus")}
          </p>
        </div>

        <button type="button" onClick={() => void loadChats()}>
          {t("common.refresh")}
        </button>
      </div>

      {error && <p className={styles.errorText}>{error}</p>}

      <div className={styles.adminLayout}>
        <aside className={styles.chatSidebar}>
          <section>
            <h3>{t("supportChat.waitingChats")}</h3>

            {loading && <p className={styles.emptyState}>{t("common.loading")}</p>}

            {!loading && waitingChats.length === 0 && (
              <p className={styles.emptyState}>{t("supportChat.noWaiting")}</p>
            )}

            {waitingChats.map((chat) => (
              <button
                className={styles.chatListItem}
                type="button"
                key={chat.id}
                onClick={() => void handleTakeChat(chat)}
              >
                <strong>{getCustomerName(chat)}</strong>
                <span>{chat.lastMessage ?? t("supportChat.takeThisChat")}</span>
              </button>
            ))}
          </section>

          <section>
            <h3>{t("supportChat.myChats")}</h3>

            {!loading && myChats.length === 0 && (
              <p className={styles.emptyState}>{t("supportChat.noActive")}</p>
            )}

            {myChats.map((chat) => (
              <button
                className={`${styles.chatListItem} ${
                  activeChat?.id === chat.id ? styles.activeChat : ""
                }`}
                type="button"
                key={chat.id}
                onClick={() => void openChat(chat)}
              >
                <strong>{getCustomerName(chat)}</strong>
                <span>{chat.lastMessage ?? chat.status ?? t("supportChat.openChat")}</span>
              </button>
            ))}
          </section>
        </aside>

        <section className={styles.adminChatPanel}>
          {!activeChat ? (
            <div className={styles.emptyChat}>{t("supportChat.chooseLeft")}</div>
          ) : (
            <>
              <header className={styles.chatHeader}>
                <div>
                  <h3>{getCustomerName(activeChat)}</h3>

                  <div className={styles.chatMeta}>
                    <span className={styles.statusPill}>
                      {activeChat.status ?? t("supportChat.active")}
                    </span>

                    <p>{t("supportChat.chatId", { id: activeChat.id })}</p>
                  </div>
                </div>

                <div className={styles.headerActions}>
                  <button type="button" onClick={handleExitChat}>
                    {t("supportChat.exit")}
                  </button>

                  <button
                    type="button"
                    className={styles.dangerButton}
                    onClick={handleCloseChat}
                  >
                    {t("supportChat.close")}
                  </button>
                </div>
              </header>

              <div className={styles.messageList} ref={messageListRef}>
                {sortedMessages.length === 0 && (
                  <p className={styles.emptyState}>{t("supportChat.noMessages")}</p>
                )}

                {sortedMessages.map((message, index) => {
                  const isMine = isAdminMessage(message, activeChat, user?.id);

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
                          (isMine ? t("supportChat.you") : t("supportChat.customerName"))}
                      </small>
                    </article>
                  );
                })}
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
                  placeholder={t("supportChat.typeReply")}
                />

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending || !text.trim()}
                >
                  {sending ? "..." : t("supportChat.send")}
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
