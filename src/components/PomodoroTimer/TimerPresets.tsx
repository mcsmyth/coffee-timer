import React, { useState, useRef, useEffect } from 'react';
import { DEFAULT_PRESETS_MINUTES, minutesToSeconds, secondsToMinutes } from '../../utils/timerUtils';

interface TimerPresetsProps {
  selectedTime: number; // in seconds
  onSelectPreset: (seconds: number) => void;
  onSetCustomTime: (seconds: number) => void;
  customTime: number; // in seconds
}

export const TimerPresets: React.FC<TimerPresetsProps> = ({ 
  selectedTime, 
  onSelectPreset,
  onSetCustomTime,
  customTime,
}) => {
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [customMinutes, setCustomMinutes] = useState<number>(secondsToMinutes(customTime));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCustomMinutes(secondsToMinutes(customTime));
  }, [customTime]);

  useEffect(() => {
    if (isEditingCustom && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingCustom]);

  const presets = [
    { label: 'Short Break', minutes: DEFAULT_PRESETS_MINUTES.SHORT_BREAK, color: 'bg-blue-500 hover:bg-blue-600' },
    { label: 'Medium Break', minutes: DEFAULT_PRESETS_MINUTES.MEDIUM_BREAK, color: 'bg-indigo-500 hover:bg-indigo-600' },
    { label: 'Pomodoro', minutes: DEFAULT_PRESETS_MINUTES.POMODORO, color: 'bg-red-500 hover:bg-red-600' },
    { label: 'Extended', minutes: DEFAULT_PRESETS_MINUTES.EXTENDED, color: 'bg-purple-500 hover:bg-purple-600' },
  ];

  const handleCustomClick = () => {
    if (!isEditingCustom) {
      // First select the custom time, then enter edit mode
      const seconds = minutesToSeconds(customMinutes);
      if (customMinutes >= 1 && customMinutes <= 60) {
        onSelectPreset(seconds);
      }
      setIsEditingCustom(true);
    }
  };

  const handleCustomSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (customMinutes >= 1 && customMinutes <= 60) {
      const seconds = minutesToSeconds(customMinutes);
      onSetCustomTime(seconds);
      onSelectPreset(seconds);
      setIsEditingCustom(false);
    }
  };

  const handleCustomBlur = () => {
    handleCustomSubmit();
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setCustomMinutes(value);
    } else if (e.target.value === '') {
      setCustomMinutes(0);
    }
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCustomSubmit();
    } else if (e.key === 'Escape') {
      setIsEditingCustom(false);
      setCustomMinutes(secondsToMinutes(customTime));
    }
  };

  const isCustomSelected = selectedTime === customTime && !presets.some(p => minutesToSeconds(p.minutes) === selectedTime);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
      {presets.map((preset) => {
        const seconds = minutesToSeconds(preset.minutes);
        const isSelected = selectedTime === seconds;
        
        return (
          <button
            key={preset.label}
            onClick={() => onSelectPreset(seconds)}
            className={`px-4 py-3 rounded-lg text-white font-semibold transition-all duration-200 shadow-lg backdrop-blur-sm ${
              isSelected
                ? `${preset.color} ring-4 ring-offset-2 ring-offset-white/50 dark:ring-offset-black/50 ring-white/50 scale-105 opacity-100`
                : `${preset.color} opacity-90 hover:opacity-100`
            }`}
            style={
              isSelected
                ? { textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' }
                : { textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' }
            }
            aria-label={`Set timer to ${preset.minutes} minutes`}
          >
            <div className="text-sm font-medium">{preset.label}</div>
            <div className="text-lg font-bold">{preset.minutes} min</div>
          </button>
        );
      })}
      
      {/* Custom Timer Button */}
      <div
        className={`px-4 py-3 rounded-lg text-white font-semibold transition-all duration-200 shadow-lg backdrop-blur-sm ${
          isCustomSelected
            ? 'bg-teal-500 ring-4 ring-offset-2 ring-offset-white/50 dark:ring-offset-black/50 ring-white/50 scale-105 opacity-100'
            : 'bg-teal-500 hover:bg-teal-600 opacity-90 hover:opacity-100'
        }`}
        style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' }}
      >
        {isEditingCustom ? (
          <form onSubmit={handleCustomSubmit} className="h-full flex flex-col justify-center">
            <div className="text-sm font-medium mb-1">Custom</div>
            <input
              ref={inputRef}
              type="number"
              min="1"
              max="60"
              value={customMinutes || ''}
              onChange={handleCustomChange}
              onBlur={handleCustomBlur}
              onKeyDown={handleCustomKeyDown}
              className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded px-2 py-1 text-lg font-bold text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
              placeholder="min"
              style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
              aria-label="Custom timer minutes"
            />
          </form>
        ) : (
          <button
            onClick={handleCustomClick}
            className="w-full text-left h-full flex flex-col justify-center"
            aria-label={`Set timer to ${customMinutes} minutes`}
          >
            <div className="text-sm font-medium">Custom</div>
            <div className="text-lg font-bold">{customMinutes} min</div>
          </button>
        )}
      </div>
    </div>
  );
};

