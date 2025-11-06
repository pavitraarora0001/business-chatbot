import React, { useState, useCallback, useRef, useEffect } from 'react';
// FIX: Import ChatMode as a value to use its enum members.
import { type Message, ChatMode } from './types';
import { ChatWindow } from './components/ChatWindow';
import { MessageInput } from './components/MessageInput';
import { handleGeneration } from './services/geminiService';
import { SYSTEM_INSTRUCTION } from './constants';
import type { Chat } from '@google/genai';
import { LogoIcon } from './components/icons/LogoIcon';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'model',
      content: "Hello! I'm a helpful assistant for our creative agency. How can I help you with our services today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // FIX: Initialize state with the ChatMode enum member for type safety.
  const [mode, setMode] = useState<ChatMode>(ChatMode.STANDARD);

  const standardChatRef = useRef<Chat | null>(null);
  const quickChatRef = useRef<Chat | null>(null);

  useEffect(() => {
    // Reset chats if the system instruction were to change, for example.
    standardChatRef.current = null;
    quickChatRef.current = null;
  }, []);

  const sendMessage = useCallback(async (input: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    const modelResponseId = (Date.now() + 1).toString();
    const modelMessage: Message = {
      id: modelResponseId,
      role: 'model',
      content: '',
      sources: [],
    };
    setMessages((prev) => [...prev, modelMessage]);

    try {
      const chatHistory = messages.filter(m => m.role !== 'user' || m.content !== input);
      
      await handleGeneration(
        input,
        mode,
        chatHistory,
        (chunk) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === modelResponseId ? { ...msg, content: msg.content + chunk } : msg
            )
          );
        },
        standardChatRef,
        quickChatRef
      ).then((fullResponse) => {
        if (fullResponse && fullResponse.sources) {
           setMessages((prev) =>
            prev.map((msg) =>
              msg.id === modelResponseId ? { ...msg, sources: fullResponse.sources } : msg
            )
          );
        }
      });

    } catch (e: any) {
      const errorMessage = `Error: ${e.message || 'An unknown error occurred.'}`;
      setError(errorMessage);
       setMessages((prev) =>
        prev.map((msg) =>
          msg.id === modelResponseId ? { ...msg, content: errorMessage } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, mode, messages]);

  return (
    <div className="flex flex-col h-screen text-white font-sans">
        <header className="p-4 border-b border-white/10 shadow-lg bg-black/30 backdrop-blur-sm flex items-center justify-center space-x-3 sticky top-0 z-20">
            <LogoIcon className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-xl font-bold text-center text-white">Gemini Business Chatbot</h1>
              <p className="text-center text-sm text-gray-400">Your AI-powered business assistant</p>
            </div>
        </header>
        <ChatWindow messages={messages} isLoading={isLoading} />
        {error && <div className="p-2 text-center text-red-400 bg-red-900/50">{error}</div>}
        <MessageInput onSendMessage={sendMessage} isLoading={isLoading} mode={mode} setMode={setMode} />
    </div>
  );
};

export default App;
