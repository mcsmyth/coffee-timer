import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { MUSIC_PLAYLIST, getSongUrl } from '../../config/musicPlaylist';
import { getSelectedSongIndex } from '../../utils/settingsUtils';

interface MusicPlayerProps {
  isRunning: boolean;
  sessionId: number; // Changes when a new timer session starts
}

const MUTE_STORAGE_KEY = 'pomodoro_music_muted';

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ isRunning, sessionId }) => {
  // Load mute state from localStorage
  const getInitialMuteState = (): boolean => {
    const saved = localStorage.getItem(MUTE_STORAGE_KEY);
    return saved === 'true';
  };

  // Load selected song index from localStorage
  const getInitialSongIndex = (): number => {
    return getSelectedSongIndex(MUSIC_PLAYLIST.length);
  };

  const [isMuted, setIsMuted] = useState<boolean>(getInitialMuteState());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(getInitialSongIndex());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Listen for song selection changes from settings
  useEffect(() => {
    const handleSongChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ songIndex: number }>;
      if (customEvent.detail) {
        const newIndex = customEvent.detail.songIndex;
        if (newIndex >= 0 && newIndex < MUSIC_PLAYLIST.length) {
          setCurrentSongIndex(newIndex);
        }
      }
    };

    window.addEventListener('selectedSongChanged', handleSongChange as EventListener);

    return () => {
      window.removeEventListener('selectedSongChanged', handleSongChange as EventListener);
    };
  }, []);

  // Function to play next song in playlist
  const playNextSong = useCallback(() => {
    const nextIndex = (currentSongIndex + 1) % MUSIC_PLAYLIST.length;
    console.log(`Moving to next song: ${MUSIC_PLAYLIST[nextIndex].title || MUSIC_PLAYLIST[nextIndex].filename} (${nextIndex + 1}/${MUSIC_PLAYLIST.length})`);
    setCurrentSongIndex(nextIndex);
  }, [currentSongIndex]);

  // Function to skip to next song manually
  const skipToNextSong = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    playNextSong();
  }, [playNextSong]);

  // Create and manage audio element
  useEffect(() => {
    // Validate playlist
    if (MUSIC_PLAYLIST.length === 0) {
      console.error('Music playlist is empty');
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Create audio element on first mount
    if (!audioRef.current) {
      try {
        audioRef.current = new Audio();
        audioRef.current.volume = 0.3; // Set volume to 30% for background music
        audioRef.current.preload = 'auto';
      } catch (error) {
        setIsLoading(false);
        setHasError(true);
        console.error('Failed to create audio element:', error);
        return;
      }
    }

    // Get current song URL
    const currentSong = MUSIC_PLAYLIST[currentSongIndex];
    const musicUrl = getSongUrl(currentSong.filename);

    console.log(`Loading song ${currentSongIndex + 1}/${MUSIC_PLAYLIST.length}:`, currentSong.title || currentSong.filename);
    console.log('URL:', musicUrl);

    // Set up event handlers
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
      }
      console.error('Could not load music track from:', musicUrl);
    };

    const handleStalled = () => {
      console.warn('Audio loading stalled');
    };

    const handleEnded = () => {
      console.log('Song ended, playing next song');
      playNextSong();
    };

    const audio = audioRef.current;

    // Add event listeners
    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('ended', handleEnded);

    // Load the new song
    setIsLoading(true);
    audio.src = musicUrl;
    audio.load();

    // Set a timeout to warn if loading takes too long
    timeoutRef.current = setTimeout(() => {
      console.warn('Audio loading timeout - still loading after 10 seconds');
    }, 10000);

    return () => {
      // Cleanup event listeners
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSongIndex, playNextSong]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
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

  // Skip to next song when a new timer session starts
  useEffect(() => {
    // Skip the initial mount (sessionId = 0) and only trigger on actual session changes
    // Also only trigger if we have multiple songs
    if (sessionId > 1 && MUSIC_PLAYLIST.length > 1) {
      console.log(`New timer session detected (session ${sessionId}), selecting next song`);
      playNextSong();
    }
  }, [sessionId, playNextSong]);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    // Save to localStorage
    localStorage.setItem(MUTE_STORAGE_KEY, String(newMuteState));
    // Dispatch custom event so other components (like FullScreenMuteButton) can react
    window.dispatchEvent(new CustomEvent('musicMuteToggled', { detail: { isMuted: newMuteState } }));
  };

  // Listen for mute toggle events from other components (like FullScreenMuteButton)
  useEffect(() => {
    const handleMuteToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ isMuted: boolean }>;
      if (customEvent.detail) {
        setIsMuted(customEvent.detail.isMuted);
      }
    };

    window.addEventListener('musicMuteToggled', handleMuteToggle as EventListener);

    return () => {
      window.removeEventListener('musicMuteToggled', handleMuteToggle as EventListener);
    };
  }, []);

  const currentSong = MUSIC_PLAYLIST[currentSongIndex];
  const showPlaylistControls = MUSIC_PLAYLIST.length > 1;

  return (
    <div className="flex flex-col items-center mt-4 gap-2">
      {/* Current song info */}
      {!hasError && currentSong && (
        <div className="text-xs text-white text-center drop-shadow-md" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)' }}>
          {currentSong.title || currentSong.filename}
          {showPlaylistControls && (
            <span className="ml-2">
              ({currentSongIndex + 1}/{MUSIC_PLAYLIST.length})
            </span>
          )}
        </div>
      )}

      {/* Music controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleMute}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 shadow-lg backdrop-blur-sm ${
            isMuted || hasError
              ? 'bg-black/60 hover:bg-black/70 text-white border border-white/30'
              : 'bg-blue-500/90 hover:bg-blue-600/90 text-white border border-white/30'
          }`}
          style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' }}
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

        {/* Skip button - only show if there are multiple songs */}
        {showPlaylistControls && !hasError && (
          <button
            onClick={skipToNextSong}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 bg-black/60 hover:bg-black/70 text-white border border-white/30 shadow-lg backdrop-blur-sm"
            style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' }}
            aria-label="Skip to next song"
            title="Skip to next song"
          >
            <SkipForward size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

