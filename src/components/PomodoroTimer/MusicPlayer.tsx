import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  isRunning: boolean;
}

// Using a local lofi jazz track from the public/music folder
const LOFI_JAZZ_URL = '/music/lofi-jazz-cafe-327791.mp3';
const MUTE_STORAGE_KEY = 'pomodoro_music_muted';

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ isRunning }) => {
  // Load mute state from localStorage
  const getInitialMuteState = (): boolean => {
    const saved = localStorage.getItem(MUTE_STORAGE_KEY);
    return saved === 'true';
  };

  const [isMuted, setIsMuted] = useState<boolean>(getInitialMuteState());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Create audio element
    if (!audioRef.current) {
      try {
        // Use process.env.PUBLIC_URL if available (for GitHub Pages deployments)
        const musicUrl = process.env.PUBLIC_URL 
          ? `${process.env.PUBLIC_URL}${LOFI_JAZZ_URL}` 
          : LOFI_JAZZ_URL;
        
        console.log('Loading music from:', musicUrl);
        audioRef.current = new Audio(musicUrl);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3; // Set volume to 30% for background music
        audioRef.current.preload = 'auto';
        
        const handleCanPlay = () => {
          console.log('Audio can play through');
          setIsLoading(false);
          setHasError(false);
        };

        const handleLoadedData = () => {
          console.log('Audio data loaded');
          setIsLoading(false);
          setHasError(false);
        };

        const handleError = (e: Event) => {
          setIsLoading(false);
          setHasError(true);
          const error = audioRef.current?.error;
          if (error) {
            console.error('Audio error code:', error.code);
            console.error('Audio error message:', error.message);
            console.error('Audio error details:', {
              code: error.code,
              message: error.message,
              MEDIA_ERR_ABORTED: error.MEDIA_ERR_ABORTED,
              MEDIA_ERR_NETWORK: error.MEDIA_ERR_NETWORK,
              MEDIA_ERR_DECODE: error.MEDIA_ERR_DECODE,
              MEDIA_ERR_SRC_NOT_SUPPORTED: error.MEDIA_ERR_SRC_NOT_SUPPORTED,
            });
          }
          console.error('Could not load music track from:', musicUrl);
          console.error('Tried URL:', musicUrl);
          console.error('Full audio element state:', {
            src: audioRef.current?.src,
            networkState: audioRef.current?.networkState,
            readyState: audioRef.current?.readyState,
          });
        };

        const handleStalled = () => {
          console.warn('Audio loading stalled');
        };

        audioRef.current.addEventListener('canplaythrough', handleCanPlay);
        audioRef.current.addEventListener('loadeddata', handleLoadedData);
        audioRef.current.addEventListener('error', handleError);
        audioRef.current.addEventListener('stalled', handleStalled);

        // Set a timeout to mark as error if loading takes too long (10 seconds)
        timeoutRef.current = setTimeout(() => {
          if (isLoading) {
            console.warn('Audio loading timeout - still loading after 10 seconds');
            // Don't set as error yet, just log it
          }
        }, 10000);

        // Try to load the audio
        audioRef.current.load();
      } catch (error) {
        setIsLoading(false);
        setHasError(true);
        console.error('Failed to create audio element:', error);
      }
    }

    return () => {
      // Cleanup on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // Control playback based on timer state and mute state
  useEffect(() => {
    if (!audioRef.current || hasError) return;

    if (isRunning && !isMuted && !isLoading) {
      // Play when timer is running, not muted, and loaded
      audioRef.current.play().catch((error) => {
        console.warn('Audio playback failed:', error);
        // Some browsers require user interaction before playing audio
        // This is expected and the music will play once user starts the timer
      });
    } else {
      // Pause when timer is paused or muted
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isRunning, isMuted, isLoading, hasError]);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    // Save to localStorage
    localStorage.setItem(MUTE_STORAGE_KEY, String(newMuteState));
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <button
        onClick={toggleMute}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
          isMuted || hasError
            ? 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            : 'bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300'
        }`}
        aria-label={isMuted ? 'Unmute music' : 'Mute music'}
        title={hasError ? 'Music track not available. Check console for details.' : (isMuted ? 'Unmute music' : 'Mute music')}
      >
        {isMuted || hasError ? (
          <>
            <VolumeX size={18} />
            <span className="text-sm font-medium">
              {hasError ? 'Music Unavailable' : 'Music Off'}
            </span>
          </>
        ) : (
          <>
            <Volume2 size={18} />
            <span className="text-sm font-medium">Music On</span>
          </>
        )}
      </button>
    </div>
  );
};

