export interface ChatSummary {
  id: string;
  userId?: string;
  userName?: string;
  customerName?: string;
  adminId?: string | null;
  adminName?: string | null;
  supportUserId?: string | null;
  supportName?: string | null;
  status?: string | number;
  createdAt?: string;
  updatedAt?: string;
  closedAt?: string | null;
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface ChatMessage {
  id?: string;
  chatId: string;
  senderId?: string;
  senderUserId?: string;
  senderName?: string;
  userName?: string;
  senderRole?: string;
  text?: string;
  message?: string;
  content?: string;
  body?: string;
  createdAt?: string;
  sentAt?: string;
  isMine?: boolean;
}

export interface SendMessageRequest {
  chatId: string;
  text: string;
}
