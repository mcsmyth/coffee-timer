import React, { useState, useEffect } from 'react';
import { usePomodoroTimer } from '../../hooks/usePomodoroTimer';
import { DEFAULT_PRESETS } from '../../utils/timerUtils';
import { CoffeeMug } from './CoffeeMug';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { TimerPresets } from './TimerPresets';
import { CustomTimerInput } from './CustomTimerInput';
import { MusicPlayer } from './MusicPlayer';

const STORAGE_KEY = 'pomodoro_custom_time';

export const PomodoroTimer: React.FC = () => {
  // Load saved custom time from localStorage or use default Pomodoro
  const getInitialTime = (): number => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
    return DEFAULT_PRESETS.POMODORO;
  };

  const [initialTime, setInitialTime] = useState<number>(getInitialTime());
  const timer = usePomodoroTimer(initialTime);

  // Play notification sound when timer completes
  useEffect(() => {
    if (timer.isComplete) {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  }, [timer.isComplete]);

  const handlePresetSelect = (seconds: number) => {
    setInitialTime(seconds);
    timer.setTime(seconds);
  };

  const handleCustomTimeSet = (seconds: number) => {
    setInitialTime(seconds);
    timer.setTime(seconds);
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, seconds.toString());
  };

  return (
    <>
      {/* Coffee Shop Full Screen View when timer is running */}
      {timer.isRunning && (
        <div className="fixed inset-0 z-10">
          <CoffeeMug
            timeRemaining={timer.timeRemaining}
            initialTime={initialTime}
            isComplete={timer.isComplete}
            isRunning={timer.isRunning}
          >
            <div className="text-center space-y-4">
              {/* Timer Display */}
              <TimerDisplay
                timeRemaining={timer.timeRemaining}
                isComplete={timer.isComplete}
                overlay={true}
              />

              {/* Timer Controls */}
              <TimerControls
                isRunning={timer.isRunning}
                isComplete={timer.isComplete}
                onStart={timer.start}
                onPause={timer.pause}
                onReset={timer.reset}
              />
            </div>
          </CoffeeMug>
        </div>
      )}

      {/* Standard Layout when timer is NOT running */}
      <div className={`max-w-4xl mx-auto px-4 py-8 ${timer.isRunning ? 'opacity-0 pointer-events-none' : ''}`}>
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            ☕ Pomodoro Timer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay focused with a cup of coffee
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          {/* Coffee Shop Preview when timer is not running */}
          <CoffeeMug
            timeRemaining={timer.timeRemaining}
            initialTime={initialTime}
            isComplete={timer.isComplete}
            isRunning={false}
          />

          {/* Timer Display - shown when NOT running */}
          <TimerDisplay
            timeRemaining={timer.timeRemaining}
            isComplete={timer.isComplete}
          />

          {/* Timer Controls - shown when NOT running */}
          <TimerControls
            isRunning={timer.isRunning}
            isComplete={timer.isComplete}
            onStart={timer.start}
            onPause={timer.pause}
            onReset={timer.reset}
          />

          {/* Music Player */}
          <MusicPlayer isRunning={timer.isRunning} sessionId={timer.sessionId} />

          {/* Timer Presets */}
          <TimerPresets
            selectedTime={initialTime}
            onSelectPreset={handlePresetSelect}
          />

          {/* Custom Timer Input */}
          <CustomTimerInput
            currentTime={initialTime}
            onSetCustomTime={handleCustomTimeSet}
          />
        </div>
      </div>
    </>
  );
};

