import React from 'react';

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
  // Use PUBLIC_URL for GitHub Pages compatibility
  const imagePath = `${process.env.PUBLIC_URL || ''}/images/coffee-shop.png`;

  // When running, it should be full screen
  if (isRunning) {
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
        {/* Very subtle overlay gradient for minimal interference */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15 pointer-events-none" />
        
        {/* Direct children - no wrapper container */}
        {children}
      </div>
    );
  }

  // When not running, show preview version
  return (
    <div className="flex justify-center items-center my-8">
      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl transition-all duration-500" style={{ minHeight: '400px' }}>
        <div className="relative bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden w-full" style={{ minHeight: '400px' }}>
          <img
            src={imagePath}
            alt="Lo-Fi Coffee Shop"
            className="w-full h-full object-cover opacity-40 transition-opacity duration-500 grayscale"
            style={{ 
              minHeight: '400px',
              objectPosition: 'center',
              display: 'block'
            }}
            onError={(e) => {
              console.error('Failed to load coffee shop image:', imagePath);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              Start the timer to enter the coffee shop
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

