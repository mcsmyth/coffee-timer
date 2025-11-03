/**
 * Formats seconds into MM:SS format
 * @param seconds - Total seconds to format
 * @returns Formatted string in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Converts minutes to seconds
 * @param minutes - Minutes to convert
 * @returns Seconds equivalent
 */
export const minutesToSeconds = (minutes: number): number => {
  return minutes * 60;
};

/**
 * Converts seconds to minutes
 * @param seconds - Seconds to convert
 * @returns Minutes equivalent
 */
export const secondsToMinutes = (seconds: number): number => {
  return Math.floor(seconds / 60);
};

/**
 * Calculates fill percentage based on remaining time
 * @param timeRemaining - Remaining time in seconds
 * @param initialTime - Initial time in seconds
 * @returns Fill percentage (0-100)
 */
export const calculateFillPercentage = (timeRemaining: number, initialTime: number): number => {
  if (initialTime === 0) return 0;
  return Math.max(0, Math.min(100, (timeRemaining / initialTime) * 100));
};

/**
 * Default timer presets in seconds
 */
export const DEFAULT_PRESETS = {
  SHORT_BREAK: 5 * 60,      // 5 minutes
  MEDIUM_BREAK: 15 * 60,    // 15 minutes
  POMODORO: 25 * 60,        // 25 minutes (classic)
  EXTENDED: 30 * 60,        // 30 minutes
};

/**
 * Default timer presets in minutes (for display)
 */
export const DEFAULT_PRESETS_MINUTES = {
  SHORT_BREAK: 5,
  MEDIUM_BREAK: 15,
  POMODORO: 25,
  EXTENDED: 30,
};

