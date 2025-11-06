import React from 'react';
import type { Message as MessageType } from '../types';
import { UserIcon } from './icons/UserIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex items-start space-x-4 ${isModel ? '' : 'flex-row-reverse space-x-reverse'} fade-in`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
          isModel ? 'bg-cyan-500/20' : 'bg-gray-600'
        }`}
      >
        {isModel ? (
          <SparklesIcon className="w-5 h-5 text-cyan-400" />
        ) : (
          <UserIcon className="w-5 h-5 text-white" />
        )}
      </div>
      <div
        className={`max-w-xl rounded-lg px-4 py-3 shadow-lg ${
          isModel
            ? 'bg-slate-700/50 text-gray-200 rounded-tl-none backdrop-blur-sm border border-white/10'
            : 'bg-sky-600 text-white rounded-tr-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <h4 className="text-xs font-semibold text-gray-300 mb-1.5">Sources:</h4>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-gray-700/50 hover:bg-gray-700 text-cyan-300 px-2 py-1 rounded-full transition-colors truncate"
                  title={source.title}
                >
                  {new URL(source.uri).hostname}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};