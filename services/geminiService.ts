import { GoogleGenAI, Chat, HarmCategory, HarmBlockThreshold } from "@google/genai";
// FIX: Import ChatMode as a value to use enum members in switch statement.
import { type Message, ChatMode, type GroundingSource } from '../types';
import { MODE_CONFIG, SYSTEM_INSTRUCTION } from '../constants';
import type React from 'react';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const getChat = (mode: 'STANDARD' | 'QUICK', chatRef: React.MutableRefObject<Chat | null>): Chat => {
  if (!chatRef.current) {
    chatRef.current = ai.chats.create({
      model: MODE_CONFIG[mode].model,
      safetySettings,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
  }
  return chatRef.current;
};

export const handleGeneration = async (
  input: string,
  mode: ChatMode,
  history: Message[],
  onChunk: (chunk: string) => void,
  standardChatRef: React.MutableRefObject<Chat | null>,
  quickChatRef: React.MutableRefObject<Chat | null>
): Promise<{ sources?: GroundingSource[] } | void> => {
  
  // FIX: Use ChatMode enum members in switch cases for better type safety and consistency.
  switch (mode) {
    case ChatMode.QUICK: {
      const chat = getChat('QUICK', quickChatRef);
      const result = await chat.sendMessageStream({ message: input });
      for await (const chunk of result) {
        onChunk(chunk.text);
      }
      break;
    }

    case ChatMode.DEEP_THOUGHT: {
      const response = await ai.models.generateContent({
        model: MODE_CONFIG.DEEP_THOUGHT.model,
        contents: `${SYSTEM_INSTRUCTION}\n\nUser: ${input}`,
        safetySettings,
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
        },
      });
      onChunk(response.text);
      break;
    }
    
    case ChatMode.WEB_SEARCH: {
      const response = await ai.models.generateContent({
        model: MODE_CONFIG.WEB_SEARCH.model,
        contents: input,
        safetySettings,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      onChunk(response.text);
      const sources: GroundingSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((c: any) => ({
          uri: c.web?.uri,
          title: c.web?.title,
        }))
        .filter((s: any) => s.uri && s.title) || [];
      return { sources };
    }

    case ChatMode.STANDARD:
    default: {
      const chat = getChat('STANDARD', standardChatRef);
      const result = await chat.sendMessage({ message: input });
      onChunk(result.text);
      break;
    }
  }
};
