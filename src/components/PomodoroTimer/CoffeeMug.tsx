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
  return (
    <div className="flex justify-center items-center my-8">
      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl transition-all duration-500">
        {/* Coffee Shop Image - shown when timer is running */}
        {isRunning ? (
          <div className="relative">
            <img
              src="/images/coffee-shop.png"
              alt="Lo-Fi Coffee Shop"
              className="w-full h-auto object-cover transition-opacity duration-500"
              style={{ 
                maxHeight: '600px',
                objectPosition: 'center'
              }}
            />
            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40 pointer-events-none" />
            
            {/* Overlay timer display and controls when running */}
            {children && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 pointer-events-none">
                <div className="pointer-events-auto bg-black/30 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10">
                  {children}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Placeholder/Preview when timer is not running */
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
            <img
              src="/images/coffee-shop.png"
              alt="Lo-Fi Coffee Shop"
              className="w-full h-auto object-cover opacity-40 transition-opacity duration-500 grayscale"
              style={{ 
                maxHeight: '600px',
                objectPosition: 'center'
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                Start the timer to enter the coffee shop
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

