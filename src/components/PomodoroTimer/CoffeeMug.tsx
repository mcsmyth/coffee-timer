import React, { useState, useEffect } from 'react';
import { getImageById, getCoffeeShopImageUrl } from '../../config/coffeeShopImages';
import { getSelectedCoffeeShopImageId } from '../../utils/settingsUtils';

interface CoffeeMugProps {
  timeRemaining: number;
  initialTime: number;
  isComplete: boolean;
  isRunning: boolean;
  children?: React.ReactNode;
}

export const CoffeeMug: React.FC<CoffeeMugProps> = ({
  timeRemaining,
  initialTime,
  isComplete,
  isRunning,
  children,
}) => {
  const [imagePath, setImagePath] = useState<string>('');

  // Load selected image from settings
  useEffect(() => {
    const selectedImageId = getSelectedCoffeeShopImageId();
    const selectedImage = getImageById(selectedImageId);
    
    if (selectedImage) {
      setImagePath(getCoffeeShopImageUrl(selectedImage.filename));
    } else {
      // Fallback to default
      const defaultImage = getImageById('coffee-shop-1');
      if (defaultImage) {
        setImagePath(getCoffeeShopImageUrl(defaultImage.filename));
      }
    }

    // Listen for settings changes
    const handleSettingsChange = () => {
      const newSelectedImageId = getSelectedCoffeeShopImageId();
      const newSelectedImage = getImageById(newSelectedImageId);
      if (newSelectedImage) {
        setImagePath(getCoffeeShopImageUrl(newSelectedImage.filename));
      }
    };

    window.addEventListener('coffeeShopImageChanged', handleSettingsChange);
    
    return () => {
      window.removeEventListener('coffeeShopImageChanged', handleSettingsChange);
    };
  }, []);

  // Always show fullscreen background
  // Don't render if imagePath is not loaded yet
  if (!imagePath) {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gray-900">
        <div className="absolute inset-0 flex items-center justify-center text-white">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/* Coffee Shop Image - Full coverage */}
      <img
        src={imagePath}
        alt="Lo-Fi Coffee Shop"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{
          objectPosition: 'center',
          display: 'block'
        }}
        onError={(e) => {
          console.error('Failed to load coffee shop image:', imagePath);
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      {/* Stronger gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 pointer-events-none" />
      
      {/* Direct children - no wrapper container */}
      {children}
    </div>
  );
};

