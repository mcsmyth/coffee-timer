import { useState, useEffect, useCallback, useRef } from 'react';

interface UsePomodoroTimerReturn {
  timeRemaining: number; // in seconds
  isRunning: boolean;
  isComplete: boolean;
  sessionId: number; // Increments when a new timer session starts
  start: () => void;
  pause: () => void;
  reset: () => void;
  setTime: (seconds: number) => void;
}

export const usePomodoroTimer = (initialTime: number = 1500): UsePomodoroTimerReturn => {
  const [timeRemaining, setTimeRemaining] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wasCompleteRef = useRef<boolean>(false);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsComplete(true);
          wasCompleteRef.current = true;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const start = useCallback(() => {
    // Increment sessionId if starting a new session
    // (timer was complete or at full time)
    if (wasCompleteRef.current || timeRemaining === initialTime) {
      setSessionId(prev => prev + 1);
    }
    wasCompleteRef.current = false;
    setIsRunning(true);
    setIsComplete(false);
  }, [timeRemaining, initialTime]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsComplete(false);
    wasCompleteRef.current = false;
    setTimeRemaining(initialTime);
  }, [initialTime]);

  const setTime = useCallback((seconds: number) => {
    setIsRunning(false);
    setIsComplete(false);
    wasCompleteRef.current = false;
    setTimeRemaining(seconds);
  }, []);

  return {
    timeRemaining,
    isRunning,
    isComplete,
    sessionId,
    start,
    pause,
    reset,
    setTime,
  };
};

