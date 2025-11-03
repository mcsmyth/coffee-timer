import React from 'react';
import { formatTime } from '../../utils/timerUtils';

interface TimerDisplayProps {
  timeRemaining: number;
  isComplete: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeRemaining, isComplete }) => {
  return (
    <div className="text-center">
      <div
        className={`text-7xl md:text-8xl font-mono font-bold transition-colors duration-300 ${
          isComplete ? 'text-red-500 animate-pulse' : 'text-gray-800 dark:text-gray-200'
        }`}
      >
        {formatTime(timeRemaining)}
      </div>
      {isComplete && (
        <p className="mt-4 text-xl text-red-500 font-semibold animate-bounce">
          Time's up! ☕
        </p>
      )}
    </div>
  );
};

