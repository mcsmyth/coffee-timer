import React, { useState, useEffect } from 'react';
import { secondsToMinutes, minutesToSeconds } from '../../utils/timerUtils';

interface CustomTimerInputProps {
  currentTime: number; // in seconds
  onSetCustomTime: (seconds: number) => void;
}

export const CustomTimerInput: React.FC<CustomTimerInputProps> = ({
  currentTime,
  onSetCustomTime,
}) => {
  const [minutes, setMinutes] = useState<number>(secondsToMinutes(currentTime));
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setMinutes(secondsToMinutes(currentTime));
  }, [currentTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (minutes < 1 || minutes > 60) {
      setError('Please enter a value between 1 and 60 minutes');
      return;
    }

    setError('');
    onSetCustomTime(minutesToSeconds(minutes));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setMinutes(value);
      setError('');
    } else if (e.target.value === '') {
      setMinutes(0);
      setError('');
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 items-end">
        <div className="flex-1">
          <label htmlFor="custom-minutes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Custom Timer (minutes)
          </label>
          <input
            id="custom-minutes"
            type="number"
            min="1"
            max="60"
            value={minutes || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter minutes (1-60)"
            aria-label="Custom timer minutes"
          />
          {error && (
            <p className="mt-1 text-sm text-red-500" role="alert">
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={minutes < 1 || minutes > 60}
        >
          Set Timer
        </button>
      </form>
    </div>
  );
};

