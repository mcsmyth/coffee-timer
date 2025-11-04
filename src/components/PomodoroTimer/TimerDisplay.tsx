import React from 'react';
import { formatTime } from '../../utils/timerUtils';

interface TimerDisplayProps {
  timeRemaining: number;
  isComplete: boolean;
  overlay?: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeRemaining, isComplete, overlay = false }) => {
  return (
    <div className="text-center">
      <div
        className={`text-7xl md:text-8xl font-mono font-bold transition-colors duration-300 ${
          isComplete 
            ? 'text-red-500 animate-pulse' 
            : overlay 
              ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]' 
              : 'text-gray-800 dark:text-gray-200'
        }`}
        style={overlay && !isComplete ? { textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 2px 4px rgba(0, 0, 0, 0.8)' } : undefined}
      >
        {formatTime(timeRemaining)}
      </div>
      {isComplete && (
        <p 
          className={`mt-4 text-xl font-semibold animate-bounce ${
            overlay ? 'text-red-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]' : 'text-red-500'
          }`}
          style={overlay ? { textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)' } : undefined}
        >
          Time's up! ☕
        </p>
      )}
    </div>
  );
};

