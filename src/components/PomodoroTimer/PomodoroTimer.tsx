import React, { useState, useEffect } from 'react';
import { usePomodoroTimer } from '../../hooks/usePomodoroTimer';
import { DEFAULT_PRESETS } from '../../utils/timerUtils';
import { CoffeeMug } from './CoffeeMug';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { TimerPresets } from './TimerPresets';
import { CustomTimerInput } from './CustomTimerInput';
import { MusicPlayer } from './MusicPlayer';
import { TodoList } from './TodoList';
import { TodoListPanel } from './TodoListPanel';
import { ModeSelector } from './ModeSelector';
import { FullScreenMuteButton } from './FullScreenMuteButton';
import { SettingsButton } from './SettingsButton';
import { SettingsPanel } from './SettingsPanel';
import { AnalyticsView } from './AnalyticsView';
import { BarChart3 } from 'lucide-react';

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
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
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

  // Show analytics view if requested
  if (showAnalytics) {
    return <AnalyticsView onBack={() => setShowAnalytics(false)} />;
  }

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
            {/* Mode Selector - Top Center */}
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-20">
              <ModeSelector
                selectedTime={initialTime}
                onSelectPreset={handlePresetSelect}
              />
            </div>

            {/* Timer Display - Centered */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <TimerDisplay
                timeRemaining={timer.timeRemaining}
                isComplete={timer.isComplete}
                overlay={true}
              />
            </div>

            {/* Timer Controls - Below Timer */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 z-20" style={{ marginTop: '180px' }}>
              <TimerControls
                isRunning={timer.isRunning}
                isComplete={timer.isComplete}
                onStart={timer.start}
                onPause={timer.pause}
                onReset={timer.reset}
                overlay={true}
              />
            </div>
          </CoffeeMug>
          
          {/* Todo List Panel - accessible during timer */}
          <TodoListPanel
            isTimerRunning={timer.isRunning}
            sessionId={timer.sessionId}
            isTimerActive={timer.isRunning}
          />
          
          {/* Mute Button - top-right corner */}
          <FullScreenMuteButton />
          
          {/* Settings Button - bottom-right corner */}
          <SettingsButton onClick={() => setIsSettingsOpen(true)} overlay={true} />
        </div>
      )}

      {/* Settings Panel */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Standard Layout when timer is NOT running */}
      <div className={`max-w-4xl mx-auto px-4 py-8 ${timer.isRunning ? 'opacity-0 pointer-events-none' : ''}`}>
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            ☕ Caffeination
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay focused in your workflow with a cup of coffee, some lofi jazz, and some coffee shop vibes.
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

          {/* Todo List */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <TodoList
              isTimerRunning={timer.isRunning}
              sessionId={timer.sessionId}
              isTimerActive={timer.isRunning}
            />
          </div>

          {/* Settings and Analytics Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-center gap-4">
            <SettingsButton onClick={() => setIsSettingsOpen(true)} />
            <button
              onClick={() => setShowAnalytics(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="View Analytics"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

