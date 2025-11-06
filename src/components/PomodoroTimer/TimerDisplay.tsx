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
                textShadow: '0 6px 30px rgba(0, 0, 0, 0.95), 0 4px 15px rgba(0, 0, 0, 0.9), 0 0 60px rgba(0, 0, 0, 0.7), 0 0 100px rgba(0, 0, 0, 0.5)',
              }
            : overlay && isComplete
            ? {
                textShadow: '0 6px 30px rgba(0, 0, 0, 0.95), 0 4px 15px rgba(239, 68, 68, 0.8), 0 0 60px rgba(239, 68, 68, 0.6)',
              }
            : undefined
        }
      >
        {formatTime(timeRemaining)}
      </div>
      {isComplete && (
        <p
          className={`mt-4 text-xl md:text-2xl font-semibold animate-bounce ${
            overlay ? 'text-red-200' : 'text-red-500'
          }`}
          style={
            overlay
              ? { textShadow: '0 4px 20px rgba(0, 0, 0, 0.95), 0 2px 10px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.6)' }
              : undefined
          }
        >
          Time's up! ☕
        </p>
      )}
    </div>
  );
};

