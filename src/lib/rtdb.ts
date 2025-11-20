import { ref, push, set, update, remove, onValue, off, query, orderByChild, equalTo, limitToLast, get } from 'firebase/database';
import { rtdb } from './firebase';
import type { Chat, ChatMessage, ChatParticipants } from '@/types';

/**
 * Real-time Database utilities for chat functionality
 */

// Create a new chat
export async function createChat(participantUids: string[], userId: string): Promise<string> {
  const chatsRef = ref(rtdb, 'chats');
  const newChatRef = push(chatsRef);
  const chatId = newChatRef.key!;

  const participants: ChatParticipants = {};
  participantUids.forEach(uid => {
    participants[uid] = true;
  });

  const chatData: Partial<Chat> = {
    participants,
    status: 'open',
    createdAt: Date.now(),
    createdBy: userId
  };

  await set(newChatRef, chatData);
  return chatId;
}

// Send a message in a chat
export async function sendMessage(
  chatId: string,
  senderId: string,
  text: string,
  type: 'text' | 'image' = 'text',
  meta?: Record<string, any>
): Promise<void> {
  const messagesRef = ref(rtdb, `chats/${chatId}/messages`);
  const newMessageRef = push(messagesRef);

  const message: ChatMessage = {
    senderId,
    text,
    timestamp: Date.now(),
    type,
    meta
  };

  await set(newMessageRef, message);

  // Update last message in chat
  const chatRef = ref(rtdb, `chats/${chatId}`);
  await update(chatRef, {
    lastMessage: {
      text,
      senderId,
      timestamp: Date.now()
    }
  });
}

// Listen to messages in a chat
export function listenToMessages(
  chatId: string,
  callback: (messages: (ChatMessage & { id: string })[]) => void,
  limit: number = 50
): () => void {
  const messagesRef = ref(rtdb, `chats/${chatId}/messages`);
  const messagesQuery = query(messagesRef, limitToLast(limit));

  const unsubscribe = onValue(messagesQuery, (snapshot) => {
    const messages: (ChatMessage & { id: string })[] = [];
    snapshot.forEach((child) => {
      messages.push({
        id: child.key!,
        ...child.val()
      });
    });
    callback(messages);
  });

  return () => off(messagesQuery, 'value', unsubscribe);
}

// Listen to all chats for a user
export function listenToUserChats(
  userId: string,
  callback: (chats: (Chat & { id: string })[]) => void
): () => void {
  const chatsRef = ref(rtdb, 'chats');
  const userChatsQuery = query(chatsRef, orderByChild(`participants/${userId}`), equalTo(true));

  const unsubscribe = onValue(userChatsQuery, (snapshot) => {
    const chats: (Chat & { id: string })[] = [];
    snapshot.forEach((child) => {
      chats.push({
        id: child.key!,
        ...child.val()
      });
    });
    callback(chats);
  });

  return () => off(userChatsQuery, 'value', unsubscribe);
}

// Update chat status
export async function updateChatStatus(
  chatId: string,
  status: 'open' | 'closed' | 'important'
): Promise<void> {
  const chatRef = ref(rtdb, `chats/${chatId}`);
  await update(chatRef, { status });
}

// Add participant to chat
export async function addParticipant(chatId: string, userId: string): Promise<void> {
  const participantRef = ref(rtdb, `chats/${chatId}/participants/${userId}`);
  await set(participantRef, true);
}

// Remove participant from chat
export async function removeParticipant(chatId: string, userId: string): Promise<void> {
  const participantRef = ref(rtdb, `chats/${chatId}/participants/${userId}`);
  await remove(participantRef);
}

// Get all messages from a chat (one-time read)
export async function getChatMessages(chatId: string): Promise<(ChatMessage & { id: string })[]> {
  const messagesRef = ref(rtdb, `chats/${chatId}/messages`);
  const snapshot = await get(messagesRef);
  
  const messages: (ChatMessage & { id: string })[] = [];
  snapshot.forEach((child) => {
    messages.push({
      id: child.key!,
      ...child.val()
    });
  });
  
  return messages;
}