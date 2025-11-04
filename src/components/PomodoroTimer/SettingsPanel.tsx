import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { COFFEE_SHOP_IMAGES, getCoffeeShopImageUrl } from '../../config/coffeeShopImages';
import { getSelectedCoffeeShopImageId, setSelectedCoffeeShopImageId } from '../../utils/settingsUtils';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const [selectedImageId, setSelectedImageId] = useState<string>(getSelectedCoffeeShopImageId());

  // Update selected image when localStorage changes
  useEffect(() => {
    setSelectedImageId(getSelectedCoffeeShopImageId());
  }, [isOpen]);

  const handleImageSelect = (imageId: string) => {
    setSelectedImageId(imageId);
    setSelectedCoffeeShopImageId(imageId);
    
    // Dispatch event so CoffeeMug component can update
    window.dispatchEvent(new CustomEvent('coffeeShopImageChanged'));
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
        </div>
      </div>
    </>
  );
};
