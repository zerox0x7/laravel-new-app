export enum Sender {
  USER = 'user',
  AI = 'ai'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
  isStreaming?: boolean;
}

export interface TenancyTopic {
  id: string;
  title: string;
  prompt: string;
  icon: string;
}

export enum ViewMode {
  CHAT = 'chat',
  ARCHITECT = 'architect'
}