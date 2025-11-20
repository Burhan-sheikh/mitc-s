import { useState, useEffect, useCallback } from 'react';
import { 
  listenToMessages, 
  listenToUserChats, 
  sendMessage as sendChatMessage,
  createChat,
  updateChatStatus
} from '@/lib/rtdb';
import type { Chat, ChatMessage, ChatStatus } from '@/types';

export function useChat(chatId: string | undefined) {
  const [messages, setMessages] = useState<(ChatMessage & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId) {
      setLoading(false);
      return;
    }

    const unsubscribe = listenToMessages(chatId, (msgs) => {
      setMessages(msgs);
      setLoading(false);
    });

    return unsubscribe;
  }, [chatId]);

  const sendMessage = useCallback(
    async (senderId: string, text: string, type: 'text' | 'image' = 'text') => {
      if (!chatId) throw new Error('No chat ID');
      await sendChatMessage(chatId, senderId, text, type);
    },
    [chatId]
  );

  return {
    messages,
    loading,
    sendMessage
  };
}

export function useUserChats(userId: string | undefined) {
  const [chats, setChats] = useState<(Chat & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = listenToUserChats(userId, (userChats) => {
      setChats(userChats);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const startNewChat = useCallback(
    async (participantUids: string[]) => {
      if (!userId) throw new Error('User not authenticated');
      return await createChat([userId, ...participantUids], userId);
    },
    [userId]
  );

  const changeChatStatus = useCallback(
    async (chatId: string, status: ChatStatus) => {
      await updateChatStatus(chatId, status);
    },
    []
  );

  return {
    chats,
    loading,
    startNewChat,
    changeChatStatus
  };
}