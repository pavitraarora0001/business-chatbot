import React, { useState } from 'react';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import type { ChatMode } from '../types';
import { ModeSelector } from './ModeSelector';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, mode, setMode }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="px-4 md:px-6 py-3 bg-black/30 border-t border-white/10 backdrop-blur-sm sticky bottom-0">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end space-x-3">
        <ModeSelector selectedMode={mode} onModeChange={setMode} />
        <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about our services..."
              className="w-full bg-slate-800/80 text-gray-200 rounded-lg p-3 pr-12 border border-white/20 focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none transition-shadow"
              rows={1}
              style={{maxHeight: '150px'}}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 bottom-2 p-2 rounded-full text-white bg-gradient-to-br from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 disabled:bg-gray-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110"
              aria-label="Send message"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
        </div>
      </form>
    </div>
  );
};