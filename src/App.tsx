import React, { useState, useEffect } from 'react';
import { PomodoroTimer } from './components/PomodoroTimer';
import { getInitialDarkMode, applyDarkMode } from './utils/darkModeUtils';

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialDarkMode());

  // Apply dark mode on mount and whenever it changes
  useEffect(() => {
    applyDarkMode(isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PomodoroTimer isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
    </div>
  );
}

export default App;

