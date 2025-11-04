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
        className={`font-mono font-bold transition-colors duration-300 ${
          overlay
            ? 'text-8xl md:text-9xl lg:text-[12rem]'
            : 'text-7xl md:text-8xl'
        } ${
          isComplete 
            ? 'text-red-500 animate-pulse' 
            : overlay 
              ? 'text-white' 
              : 'text-gray-800 dark:text-gray-200'
        }`}
        style={
          overlay && !isComplete
            ? {
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.9), 0 2px 8px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.5)',
              }
            : undefined
        }
      >
        {formatTime(timeRemaining)}
      </div>
      {isComplete && (
        <p
          className={`mt-4 text-xl md:text-2xl font-semibold animate-bounce ${
            overlay ? 'text-red-300' : 'text-red-500'
          }`}
          style={
            overlay
              ? { textShadow: '0 2px 12px rgba(0, 0, 0, 0.9), 0 4px 20px rgba(239, 68, 68, 0.5)' }
              : undefined
          }
        >
          Time's up! ☕
        </p>
      )}
    </div>
  );
};

