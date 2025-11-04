import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  isComplete: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  overlay?: boolean;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  isComplete,
  onStart,
  onPause,
  onReset,
  overlay = false,
}) => {
  if (overlay) {
    // Floating button style for full-screen mode
    return (
      <div className="flex justify-center gap-3">
        {!isRunning ? (
          <button
            onClick={onStart}
            className="flex items-center justify-center gap-2 w-14 h-14 rounded-full bg-black/80 hover:bg-black/90 text-white transition-all duration-200 shadow-xl hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Start timer"
          >
            <Play size={24} className="ml-0.5" />
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex items-center justify-center gap-2 w-14 h-14 rounded-full bg-black/80 hover:bg-black/90 text-white transition-all duration-200 shadow-xl hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Pause timer"
          >
            <Pause size={24} />
          </button>
        )}
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 w-14 h-14 rounded-full bg-black/80 hover:bg-black/90 text-white transition-all duration-200 shadow-xl hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Reset timer"
          disabled={!isRunning && !isComplete}
        >
          <RotateCcw size={24} />
        </button>
      </div>
    );
  }

  // Standard button style for non-overlay mode
  return (
    <div className="flex justify-center gap-4 mt-6">
      {!isRunning ? (
        <button
          onClick={onStart}
          className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Start timer"
        >
          <Play size={20} />
          Start
        </button>
      ) : (
        <button
          onClick={onPause}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
          aria-label="Pause timer"
        >
          <Pause size={20} />
          Pause
        </button>
      )}
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Reset timer"
        disabled={!isRunning && !isComplete}
      >
        <RotateCcw size={20} />
        Reset
      </button>
    </div>
  );
};

