import React, { useState, useEffect } from 'react';
import { X, Music, Moon, Sun } from 'lucide-react';
import { COFFEE_SHOP_IMAGES, getCoffeeShopImageUrl } from '../../config/coffeeShopImages';
import { MUSIC_PLAYLIST } from '../../config/musicPlaylist';
import { getSelectedCoffeeShopImageId, setSelectedCoffeeShopImageId, getSelectedSongIndex, setSelectedSongIndex } from '../../utils/settingsUtils';
import { saveDarkModePreference } from '../../utils/darkModeUtils';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, isDarkMode, setIsDarkMode }) => {
  const [selectedImageId, setSelectedImageId] = useState<string>(getSelectedCoffeeShopImageId);
  const [selectedSongIndex, setSelectedSongIndexState] = useState<number>(() =>
    getSelectedSongIndex(MUSIC_PLAYLIST.length)
  );

  // Update selected image when localStorage changes
  useEffect(() => {
    setSelectedImageId(getSelectedCoffeeShopImageId());
  }, [isOpen]);

  // Update selected song when localStorage changes
  useEffect(() => {
    setSelectedSongIndexState(getSelectedSongIndex(MUSIC_PLAYLIST.length));
  }, [isOpen]);

  const handleImageSelect = (imageId: string) => {
    setSelectedImageId(imageId);
    setSelectedCoffeeShopImageId(imageId);
    
    // Dispatch event so CoffeeMug component can update
    window.dispatchEvent(new CustomEvent('coffeeShopImageChanged'));
  };

  const handleSongSelect = (songIndex: number) => {
    setSelectedSongIndexState(songIndex);
    setSelectedSongIndex(songIndex);
  };

  const handleDarkModeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    saveDarkModePreference(newMode);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Settings Panel */}
      <div
        className="fixed top-0 right-0 h-full z-50 
                   bg-white dark:bg-gray-900 shadow-2xl
                   w-full sm:w-96 max-w-sm
                   transform transition-transform duration-300 ease-in-out
                   overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              aria-label="Close settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-blue-500" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Dark Mode
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={handleDarkModeToggle}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={isDarkMode}
                aria-label="Toggle dark mode"
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
                    isDarkMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Coffee Shop Image Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Coffee Shop Image
            </h3>
            <div className="space-y-3">
              {COFFEE_SHOP_IMAGES.map((image) => {
                const isSelected = selectedImageId === image.id;
                return (
                  <button
                    key={image.id}
                    onClick={() => handleImageSelect(image.id)}
                    className={`w-full text-left rounded-lg border-2 transition-all duration-200 overflow-hidden ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {/* Image Preview */}
                    <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-800">
                      <img
                        src={getCoffeeShopImageUrl(image.filename)}
                        alt={image.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Hide broken images
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* Image Name */}
                    <div className="p-3 bg-white dark:bg-gray-800">
                      <p className={`font-medium ${
                        isSelected
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {image.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Music Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Music className="w-5 h-5" />
              Background Music
            </h3>
            <div className="space-y-2">
              {MUSIC_PLAYLIST.map((song, index) => {
                const isSelected = selectedSongIndex === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleSongSelect(index)}
                    className={`w-full text-left rounded-lg border-2 transition-all duration-200 p-3 ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${
                          isSelected
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {song.title || song.filename}
                        </p>
                        {isSelected && (
                          <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                            Currently selected
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <div className="ml-3 bg-blue-500 text-white rounded-full p-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
