const DARK_MODE_STORAGE_KEY = 'pomodoro_dark_mode';

/**
 * Gets the initial dark mode preference
 * Priority: localStorage > system preference > default (false)
 */
export const getInitialDarkMode = (): boolean => {
  try {
    const saved = localStorage.getItem(DARK_MODE_STORAGE_KEY);
    if (saved !== null) {
      return saved === 'true';
    }

    // Fall back to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
  } catch (error) {
    console.error('Error reading dark mode preference:', error);
  }

  return false;
};

/**
 * Saves dark mode preference to localStorage
 */
export const saveDarkModePreference = (isDarkMode: boolean): void => {
  try {
    localStorage.setItem(DARK_MODE_STORAGE_KEY, isDarkMode.toString());
  } catch (error) {
    console.error('Error saving dark mode preference:', error);
  }
};

/**
 * Applies dark mode class to document root element
 */
export const applyDarkMode = (isDarkMode: boolean): void => {
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

/**
 * Toggles dark mode state and persists the change
 */
export const toggleDarkMode = (currentMode: boolean): boolean => {
  const newMode = !currentMode;
  saveDarkModePreference(newMode);
  applyDarkMode(newMode);
  return newMode;
};
