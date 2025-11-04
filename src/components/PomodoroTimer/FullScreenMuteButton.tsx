import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface FullScreenMuteButtonProps {
  onToggleMute?: (isMuted: boolean) => void;
}

const MUTE_STORAGE_KEY = 'pomodoro_music_muted';

export const FullScreenMuteButton: React.FC<FullScreenMuteButtonProps> = ({ onToggleMute }) => {
  // Load mute state from localStorage (same key as MusicPlayer)
  const getInitialMuteState = (): boolean => {
    const saved = localStorage.getItem(MUTE_STORAGE_KEY);
    return saved === 'true';
  };

  const [isMuted, setIsMuted] = useState<boolean>(getInitialMuteState());

  // Sync with localStorage changes from MusicPlayer
  useEffect(() => {
    // Listen for custom event from MusicPlayer
    const handleMuteToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ isMuted: boolean }>;
      if (customEvent.detail) {
        setIsMuted(customEvent.detail.isMuted);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === MUTE_STORAGE_KEY) {
        setIsMuted(e.newValue === 'true');
      }
    };

    window.addEventListener('musicMuteToggled', handleMuteToggle as EventListener);
    window.addEventListener('storage', handleStorageChange);
    
    // Also check localStorage periodically in case same-tab changes aren't caught
    const interval = setInterval(() => {
      const currentState = localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
      if (currentState !== isMuted) {
        setIsMuted(currentState);
      }
    }, 100);

    return () => {
      window.removeEventListener('musicMuteToggled', handleMuteToggle as EventListener);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isMuted]);

  const handleToggle = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    localStorage.setItem(MUTE_STORAGE_KEY, String(newMuteState));
    
    // Dispatch custom event so MusicPlayer can react to the change
    window.dispatchEvent(new CustomEvent('musicMuteToggled', { detail: { isMuted: newMuteState } }));
    
    // Notify parent if callback provided
    if (onToggleMute) {
      onToggleMute(newMuteState);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed top-4 right-4 z-20 p-3 rounded-full 
                 bg-black/20 backdrop-blur-md hover:bg-black/30 
                 text-white border border-white/20
                 focus:outline-none focus:ring-2 focus:ring-white/50
                 transition-all duration-200
                 shadow-lg hover:scale-110"
      aria-label={isMuted ? 'Unmute music' : 'Mute music'}
      title={isMuted ? 'Unmute music' : 'Mute music'}
    >
      {isMuted ? (
        <VolumeX className="w-6 h-6" />
      ) : (
        <Volume2 className="w-6 h-6" />
      )}
    </button>
  );
};
