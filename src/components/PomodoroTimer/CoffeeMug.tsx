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
      <div className="relative w-screen h-screen overflow-hidden">
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
        {/* Light overlay gradient for minimal interference */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/20 pointer-events-none" />
        
        {/* Overlay timer display and controls - very transparent */}
        {children && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 pointer-events-none">
            <div className="pointer-events-auto bg-black/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10">
              {children}
            </div>
          </div>
        )}
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

