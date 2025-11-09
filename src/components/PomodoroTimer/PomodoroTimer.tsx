import React, { useState, useEffect } from 'react';
import { usePomodoroTimer } from '../../hooks/usePomodoroTimer';
import { DEFAULT_PRESETS, minutesToSeconds } from '../../utils/timerUtils';
import { CoffeeMug } from './CoffeeMug';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { TimerPresets } from './TimerPresets';
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

interface PomodoroTimerProps {
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ isDarkMode, setIsDarkMode }) => {
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

  const getCustomTime = (): number => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
    return minutesToSeconds(1); // Default to 1 minute
  };

  const [initialTime, setInitialTime] = useState<number>(getInitialTime());
  const [customTime, setCustomTime] = useState<number>(getCustomTime());
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const timer = usePomodoroTimer(initialTime);

  // Reusable AudioContext to prevent memory leaks
  const audioContextRef = React.useRef<AudioContext | null>(null);

  // Initialize AudioContext once
  useEffect(() => {
    return () => {
      // Cleanup AudioContext on unmount
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // Play notification sound when timer completes
  useEffect(() => {
    if (timer.isComplete) {
      // Create AudioContext lazily on first use
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
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

      // Disconnect nodes after sound completes to free memory
      setTimeout(() => {
        oscillator.disconnect();
        gainNode.disconnect();
      }, 600);
    }
  }, [timer.isComplete]);

  const handlePresetSelect = (seconds: number) => {
    setInitialTime(seconds);
    timer.setTime(seconds);
  };

  const handleCustomTimeSet = (seconds: number) => {
    setInitialTime(seconds);
    setCustomTime(seconds);
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
      {/* Coffee Shop Full Screen View - Always visible */}
      <div className="fixed inset-0 z-0">
        <CoffeeMug>
          {/* When timer is running - Centered layout */}
          {timer.isRunning && (
            <>
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
            </>
          )}

          {/* When timer is NOT running - Scrollable content layout */}
          {!timer.isRunning && (
            <div className="absolute inset-0 z-20 overflow-y-auto">
              <div className="min-h-full flex flex-col items-center justify-center px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg" style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)' }}>
                    ☕ Caffeination
                  </h1>
                  <p className="text-white text-lg drop-shadow-md" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)' }}>
                    Stay focused in your workflow with a cup of coffee (or matcha), some lofi jazz, and some coffee shop vibes.
                  </p>
                </div>

                {/* Content Container with semi-transparent background */}
                <div className="w-full max-w-4xl">
                  {/* Timer Display */}
                  <div className="mb-6">
                    <TimerDisplay
                      timeRemaining={timer.timeRemaining}
                      isComplete={timer.isComplete}
                      overlay={true}
                    />
                  </div>

                  {/* Timer Controls */}
                  <div className="mb-6">
                    <TimerControls
                      isRunning={timer.isRunning}
                      isComplete={timer.isComplete}
                      onStart={timer.start}
                      onPause={timer.pause}
                      onReset={timer.reset}
                      overlay={true}
                    />
                  </div>

                  {/* Timer Presets */}
                  <div className="mb-8">
                    <TimerPresets
                      selectedTime={initialTime}
                      onSelectPreset={handlePresetSelect}
                      onSetCustomTime={handleCustomTimeSet}
                      customTime={customTime}
                    />
                  </div>

                  {/* Todo List */}
                  <div className="mb-8">
                    <TodoList
                      isTimerRunning={timer.isRunning}
                      sessionId={timer.sessionId}
                      isTimerActive={timer.isRunning}
                    />
                  </div>

                  {/* Settings and Analytics Buttons */}
                  <div className="flex justify-center gap-4 pb-8">
                    <SettingsButton onClick={() => setIsSettingsOpen(true)} overlay={true} />
                    <button
                      onClick={() => setShowAnalytics(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-gray-900 rounded-lg transition-colors duration-200 shadow-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                      aria-label="View Analytics"
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span>Analytics</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </CoffeeMug>

        {/* Music Player - Always mounted outside conditionals to maintain audio playback */}
        {/* Hidden when timer is running (use opacity instead of display:none to keep audio playing) */}
        <div className={`fixed bottom-32 inset-x-0 z-30 transition-opacity duration-300 ${timer.isRunning ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex justify-center">
            <MusicPlayer isRunning={timer.isRunning} sessionId={timer.sessionId} />
          </div>
        </div>
        
        {/* Todo List Panel - accessible during timer */}
        {timer.isRunning && (
          <TodoListPanel
            isTimerRunning={timer.isRunning}
            sessionId={timer.sessionId}
            isTimerActive={timer.isRunning}
          />
        )}
        
        {/* Mute Button - top-right corner */}
        {timer.isRunning && <FullScreenMuteButton />}
        
        {/* Settings Button - bottom-right corner */}
        <SettingsButton onClick={() => setIsSettingsOpen(true)} overlay={true} />
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
    </>
  );
};

