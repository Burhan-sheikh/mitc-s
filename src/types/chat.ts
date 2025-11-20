/**
 * Chat and messaging type definitions
 */

export type ChatStatus = 'open' | 'closed' | 'important';

export interface ChatParticipants {
  [uid: string]: boolean;
}

export interface ChatMessage {
  senderId: string;
  text: string;
  timestamp: number;
  type: 'text' | 'image';
  meta?: Record<string, any>;
}

export interface Chat {
  participants: ChatParticipants;
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: number;
  };
  status: ChatStatus;
  createdAt: number;
  createdBy: string;
}

export interface ChatWithId extends Chat {
  id: string;
}

export interface MessageWithId extends ChatMessage {
  id: string;
}