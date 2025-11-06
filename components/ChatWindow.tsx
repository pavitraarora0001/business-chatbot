import React, { useRef, useEffect } from 'react';
import type { Message as MessageType } from '../types';
import { Message } from './Message';
import { SparklesIcon } from './icons/SparklesIcon';

interface ChatWindowProps {
  messages: MessageType[];
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-start space-x-4 fade-in">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse delay-0"></span>
              <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse delay-200"></span>
              <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse delay-400"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};