import React, { useState, useEffect } from 'react';
import { Music } from 'lucide-react';

interface SongChangeToastProps {}

export const SongChangeToast: React.FC<SongChangeToastProps> = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [songName, setSongName] = useState<string>('');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [fadeOutTimeoutId, setFadeOutTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleSongChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ songName: string }>;
      if (customEvent.detail && customEvent.detail.songName) {
        // Clear any existing timeouts
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (fadeOutTimeoutId) {
          clearTimeout(fadeOutTimeoutId);
        }

        // Show the toast with new song name
        setSongName(customEvent.detail.songName);
        setIsVisible(true);
        setIsFadingOut(false);

        // Start fade out after 2.5 seconds
        const newTimeoutId = setTimeout(() => {
          setIsFadingOut(true);
        }, 2500);

        // Fully hide after fade out animation completes (3 seconds total)
        const newFadeOutTimeoutId = setTimeout(() => {
          setIsVisible(false);
          setIsFadingOut(false);
        }, 3000);

        setTimeoutId(newTimeoutId);
        setFadeOutTimeoutId(newFadeOutTimeoutId);
      }
    };

    window.addEventListener('songChanged', handleSongChange as EventListener);

    return () => {
      window.removeEventListener('songChanged', handleSongChange as EventListener);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (fadeOutTimeoutId) {
        clearTimeout(fadeOutTimeoutId);
      }
    };
  }, [timeoutId, fadeOutTimeoutId]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50
                  transition-all duration-500 ease-in-out
                  ${isFadingOut
                    ? 'opacity-0 translate-y-4'
                    : 'opacity-100 translate-y-0'
                  }`}
    >
      <div className="flex items-center gap-3 px-6 py-3
                      bg-black/90 backdrop-blur-md
                      text-white rounded-full
                      shadow-2xl border border-white/20">
        <Music className="w-5 h-5 text-blue-400" />
        <span className="font-medium">{songName}</span>
      </div>
    </div>
  );
};
