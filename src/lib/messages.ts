import { apiFetch } from "./api";

export type Chat = {
  conversationId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string | null;
  otherUserLastActiveAt?: string | null;
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string | null;
  imageUrl?: string | null;
  read: boolean;
  isLocked: boolean;
  price: number | null;
  isUnlocked: boolean;
  createdAt: string;
};

/** GET /messages/chats?userId= — lista de conversaciones del usuario. */
export function getChats(userId: string, token: string) {
  return apiFetch<Chat[]>(`/messages/chats?userId=${userId}`, {}, token);
}

/** GET /messages?conversationId= — mensajes de una conversación. */
export function getMessages(conversationId: string, token: string) {
  return apiFetch<Message[]>(`/messages?conversationId=${conversationId}`, {}, token);
}

/** POST /messages — enviar mensaje de texto. */
export function sendMessage(
  senderId: string,
  receiverId: string,
  text: string,
  token: string,
) {
  return apiFetch<Message>(
    "/messages",
    { method: "POST", body: JSON.stringify({ senderId, receiverId, text, isLocked: false }) },
    token,
  );
}

/** POST /messages/read — marca la conversación como leída. */
export function markAsRead(conversationId: string, userId: string, token: string) {
  return apiFetch<{ success: boolean }>(
    "/messages/read",
    { method: "POST", body: JSON.stringify({ conversationId, userId }) },
    token,
  );
}
