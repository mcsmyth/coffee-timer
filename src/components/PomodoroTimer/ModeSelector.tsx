import React from 'react';
import { DEFAULT_PRESETS, minutesToSeconds } from '../../utils/timerUtils';

interface ModeSelectorProps {
  selectedTime: number; // in seconds
  onSelectPreset: (seconds: number) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedTime, onSelectPreset }) => {
  const modes = [
    { 
      label: 'Pomodoro', 
      seconds: DEFAULT_PRESETS.POMODORO,
      shortLabel: 'pomodoro'
    },
    { 
      label: 'Short Break', 
      seconds: DEFAULT_PRESETS.SHORT_BREAK,
      shortLabel: 'short break'
    },
    { 
      label: 'Long Break', 
      seconds: DEFAULT_PRESETS.MEDIUM_BREAK,
      shortLabel: 'long break'
    },
  ];

  return (
    <div className="flex justify-center gap-2">
      {modes.map((mode) => {
        const isSelected = selectedTime === mode.seconds;
        
        return (
          <button
            key={mode.seconds}
            onClick={() => onSelectPreset(mode.seconds)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isSelected
                ? 'bg-white text-gray-900 shadow-lg'
                : 'border border-white text-white hover:bg-white/10'
            }`}
            aria-label={`Set timer to ${mode.label}`}
          >
            {mode.shortLabel}
          </button>
        );
      })}
    </div>
  );
};
