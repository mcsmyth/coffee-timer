import React from 'react';
import { Settings } from 'lucide-react';

interface SettingsButtonProps {
  onClick: () => void;
  overlay?: boolean;
}

export const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick, overlay = false }) => {
  if (overlay) {
    // Floating button style for full-screen mode
    return (
      <button
        onClick={onClick}
        className="fixed bottom-4 right-4 z-20 p-3 rounded-full 
                   bg-black/20 backdrop-blur-md hover:bg-black/30 
                   text-white border border-white/20
                   focus:outline-none focus:ring-2 focus:ring-white/50
                   transition-all duration-200
                   shadow-lg hover:scale-110"
        aria-label="Open settings"
        title="Settings"
      >
        <Settings className="w-6 h-6" />
      </button>
    );
  }

  // Standard button style for non-overlay mode
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg 
                 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                 text-gray-700 dark:text-gray-300
                 transition-colors duration-200"
      aria-label="Open settings"
    >
      <Settings className="w-5 h-5" />
      <span>Settings</span>
    </button>
  );
};
