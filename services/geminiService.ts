import { GoogleGenAI, Chat, GenerateContentStreamResult } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { Message, Sender } from '../types';

let chatSession: Chat | null = null;

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = () => {
  const ai = getClient();
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      maxOutputTokens: 4000,
    },
  });
};

export const sendMessageStream = async (
  message: string,
  onChunk: (text: string) => void
): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    throw new Error("Failed to initialize chat session");
  }

  try {
    const result: GenerateContentStreamResult = await chatSession.sendMessageStream({
        message
    });
    
    let fullText = "";
    
    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
    }
    
    return fullText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};