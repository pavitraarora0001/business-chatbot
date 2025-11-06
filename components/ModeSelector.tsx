import React, { useState, useRef, useEffect } from 'react';
import type { ChatMode } from '../types';
import { MODE_CONFIG } from '../constants';
import type { ModeKey } from '../constants';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { BoltIcon } from './icons/BoltIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';

interface ModeSelectorProps {
  selectedMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

const modeIcons: Record<ModeKey, React.ReactNode> = {
    STANDARD: <ChatBubbleIcon className="w-6 h-6" />,
    QUICK: <BoltIcon className="w-6 h-6" />,
    DEEP_THOUGHT: <BrainCircuitIcon className="w-6 h-6" />,
    WEB_SEARCH: <GlobeIcon className="w-6 h-6" />
};

export const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedMode, onModeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const modes = Object.keys(MODE_CONFIG) as ModeKey[];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);
  
  const handleSelect = (mode: ModeKey) => {
    onModeChange(mode as ChatMode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 bg-slate-800/80 rounded-lg border border-white/20 hover:bg-slate-700/80 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title={MODE_CONFIG[selectedMode as ModeKey].name}
      >
        <div className="text-cyan-400">{modeIcons[selectedMode as ModeKey]}</div>
        <ChevronDownIcon className={`w-4 h-4 text-gray-400 absolute top-1 right-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 w-64 bg-slate-800/80 border border-white/20 rounded-lg shadow-xl z-10 overflow-hidden backdrop-blur-md">
            <ul className="divide-y divide-white/10">
                {modes.map((modeKey) => (
                    <li key={modeKey}>
                        <button 
                            onClick={() => handleSelect(modeKey)}
                            className={`w-full text-left p-3 hover:bg-slate-700/50 transition-colors ${selectedMode === modeKey ? 'bg-cyan-900/50' : ''}`}
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl text-cyan-400">{modeIcons[modeKey]}</span>
                                <div>
                                    <p className={`font-semibold ${selectedMode === modeKey ? 'text-cyan-300' : 'text-white'}`}>{MODE_CONFIG[modeKey].name}</p>
                                    <p className="text-xs text-gray-400">{MODE_CONFIG[modeKey].description}</p>
                                </div>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
      )}
    </div>
  );
};