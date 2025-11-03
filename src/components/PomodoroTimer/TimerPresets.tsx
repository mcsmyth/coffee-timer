import React from 'react';
import { DEFAULT_PRESETS_MINUTES, minutesToSeconds } from '../../utils/timerUtils';

interface TimerPresetsProps {
  selectedTime: number; // in seconds
  onSelectPreset: (seconds: number) => void;
}

export const TimerPresets: React.FC<TimerPresetsProps> = ({ selectedTime, onSelectPreset }) => {
  const presets = [
    { label: 'Short Break', minutes: DEFAULT_PRESETS_MINUTES.SHORT_BREAK, color: 'bg-blue-500 hover:bg-blue-600' },
    { label: 'Medium Break', minutes: DEFAULT_PRESETS_MINUTES.MEDIUM_BREAK, color: 'bg-indigo-500 hover:bg-indigo-600' },
    { label: 'Pomodoro', minutes: DEFAULT_PRESETS_MINUTES.POMODORO, color: 'bg-red-500 hover:bg-red-600' },
    { label: 'Extended', minutes: DEFAULT_PRESETS_MINUTES.EXTENDED, color: 'bg-purple-500 hover:bg-purple-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
      {presets.map((preset) => {
        const seconds = minutesToSeconds(preset.minutes);
        const isSelected = selectedTime === seconds;
        
        return (
          <button
            key={preset.label}
            onClick={() => onSelectPreset(seconds)}
            className={`px-4 py-3 rounded-lg text-white font-semibold transition-all duration-200 shadow-md ${
              isSelected
                ? `${preset.color} ring-4 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-gray-400 scale-105`
                : `${preset.color} opacity-80 hover:opacity-100`
            }`}
            aria-label={`Set timer to ${preset.minutes} minutes`}
          >
            <div className="text-sm font-medium">{preset.label}</div>
            <div className="text-lg font-bold">{preset.minutes} min</div>
          </button>
        );
      })}
    </div>
  );
};

