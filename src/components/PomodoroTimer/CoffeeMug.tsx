import React from 'react';
import { calculateFillPercentage } from '../../utils/timerUtils';

interface CoffeeMugProps {
  timeRemaining: number;
  initialTime: number;
  isComplete: boolean;
}

export const CoffeeMug: React.FC<CoffeeMugProps> = ({
  timeRemaining,
  initialTime,
  isComplete,
}) => {
  const fillPercentage = calculateFillPercentage(timeRemaining, initialTime);
  
  // Calculate the fill level (0-100) and map to pixel rows
  // The mug is 32x32 pixels, coffee fill area is from row 12 to row 28 (17 rows)
  const fillRows = Math.floor((fillPercentage / 100) * 17); // 17 rows for coffee

  return (
    <div className="flex justify-center items-center my-8">
      <div className="relative">
        {/* 8-bit Coffee Mug SVG - Higher resolution for more detail */}
        <svg
          width="320"
          height="320"
          viewBox="0 0 32 32"
          className="w-64 h-64 md:w-80 md:h-80"
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Mug shadow - more detailed */}
          <rect x="4" y="30" width="24" height="1" fill="#333" opacity="0.3" />
          <rect x="6" y="31" width="20" height="1" fill="#333" opacity="0.2" />
          
          {/* Left handle - curved and detailed */}
          <rect x="0" y="12" width="1" height="1" fill="#2a1c12" />
          <rect x="0" y="13" width="1" height="1" fill="#3d2817" />
          <rect x="0" y="14" width="1" height="1" fill="#3d2817" />
          <rect x="0" y="15" width="1" height="1" fill="#3d2817" />
          <rect x="0" y="16" width="1" height="1" fill="#3d2817" />
          <rect x="0" y="17" width="1" height="1" fill="#3d2817" />
          <rect x="0" y="18" width="1" height="1" fill="#2a1c12" />
          <rect x="1" y="13" width="1" height="1" fill="#2a1c12" />
          <rect x="1" y="14" width="1" height="1" fill="#3d2817" />
          <rect x="1" y="15" width="1" height="1" fill="#4a3423" />
          <rect x="1" y="16" width="1" height="1" fill="#4a3423" />
          <rect x="1" y="17" width="1" height="1" fill="#3d2817" />
          <rect x="1" y="18" width="1" height="1" fill="#2a1c12" />
          <rect x="2" y="14" width="1" height="1" fill="#2a1c12" />
          <rect x="2" y="15" width="1" height="1" fill="#3d2817" />
          <rect x="2" y="16" width="1" height="1" fill="#3d2817" />
          <rect x="2" y="17" width="1" height="1" fill="#2a1c12" />
          
          {/* Top rim - detailed with inner and outer edge */}
          <rect x="4" y="10" width="24" height="1" fill="#2a1c12" />
          <rect x="4" y="11" width="24" height="1" fill="#3d2817" />
          <rect x="5" y="11" width="22" height="1" fill="#4a3423" />
          
          {/* Left side wall */}
          <rect x="4" y="12" width="1" height="16" fill="#3d2817" />
          <rect x="4" y="12" width="1" height="4" fill="#2a1c12" />
          
          {/* Right side wall */}
          <rect x="27" y="12" width="1" height="16" fill="#3d2817" />
          <rect x="27" y="12" width="1" height="4" fill="#2a1c12" />
          
          {/* Bottom */}
          <rect x="5" y="27" width="22" height="1" fill="#2a1c12" />
          <rect x="5" y="28" width="22" height="1" fill="#3d2817" />
          
          {/* Mug body - medium brown with gradients */}
          <rect x="5" y="12" width="22" height="15" fill="#6b4423" />
          
          {/* Left side highlight */}
          <rect x="5" y="13" width="2" height="1" fill="#8b5a3c" />
          <rect x="5" y="14" width="3" height="1" fill="#8b5a3c" />
          <rect x="5" y="15" width="3" height="1" fill="#7a5333" />
          <rect x="5" y="16" width="2" height="1" fill="#8b5a3c" />
          <rect x="5" y="17" width="2" height="1" fill="#7a5333" />
          <rect x="5" y="18" width="2" height="1" fill="#8b5a3c" />
          <rect x="5" y="19" width="2" height="1" fill="#7a5333" />
          <rect x="5" y="20" width="2" height="1" fill="#8b5a3c" />
          
          {/* Right side shadow */}
          <rect x="25" y="13" width="2" height="1" fill="#5a3a1f" />
          <rect x="24" y="14" width="3" height="1" fill="#5a3a1f" />
          <rect x="24" y="15" width="3" height="1" fill="#4a2c1a" />
          <rect x="25" y="16" width="2" height="1" fill="#5a3a1f" />
          <rect x="25" y="17" width="2" height="1" fill="#4a2c1a" />
          <rect x="25" y="18" width="2" height="1" fill="#5a3a1f" />
          <rect x="25" y="19" width="2" height="1" fill="#4a2c1a" />
          <rect x="25" y="20" width="2" height="1" fill="#5a3a1f" />
          
          {/* Center highlight band */}
          <rect x="14" y="14" width="4" height="1" fill="#8b5a3c" opacity="0.5" />
          <rect x="13" y="15" width="6" height="1" fill="#8b5a3c" opacity="0.4" />
          <rect x="14" y="16" width="4" height="1" fill="#8b5a3c" opacity="0.5" />
          
          {/* Coffee fill - based on time remaining */}
          {/* Coffee fills from bottom (y=28) up to top (y=12) */}
          {Array.from({ length: fillRows }).map((_, rowIndex) => {
            const y = 28 - rowIndex; // Start from bottom (row 28)
            if (y < 12 || y > 28) return null;
            
            // Vary coffee color for depth - darker at bottom, lighter at top
            let coffeeColor = "#3e2723"; // Dark brown base
            if (isComplete) {
              coffeeColor = "#1a1a1a"; // Very dark when empty
            } else if (y >= 26) {
              coffeeColor = "#3e2723"; // Darkest at bottom
            } else if (y >= 24) {
              coffeeColor = "#4e342e"; // Medium dark
            } else if (y >= 22) {
              coffeeColor = "#5d4037"; // Medium
            } else if (y >= 18) {
              coffeeColor = "#6d4c41"; // Medium light
            } else if (y >= 15) {
              coffeeColor = "#5d4037"; // Medium
            } else {
              coffeeColor = "#4e342e"; // Medium dark near top
            }
            
            // Add some variation to coffee surface
            const coffeeWidth = y >= 14 && y <= 16 ? 20 : 22; // Slight curve at top
            const coffeeX = y >= 14 && y <= 16 ? 6 : 5; // Center when curved
            
            return (
              <rect
                key={`coffee-${rowIndex}`}
                x={coffeeX}
                y={y}
                width={coffeeWidth}
                height="1"
                fill={coffeeColor}
                className="transition-all duration-300"
              />
            );
          })}
          
          {/* Coffee surface with foam details */}
          {fillPercentage > 85 && (
            <>
              {/* Coffee surface line */}
              <rect x="6" y="12" width="20" height="1" fill="#5d4037" />
              {/* Foam bubbles when > 90% */}
              {fillPercentage > 90 && (
                <>
                  {/* Small bubbles */}
                  <rect x="8" y="11" width="1" height="1" fill="#8d6e63" />
                  <rect x="12" y="11" width="1" height="1" fill="#8d6e63" />
                  <rect x="16" y="11" width="1" height="1" fill="#8d6e63" />
                  <rect x="20" y="11" width="1" height="1" fill="#8d6e63" />
                  <rect x="24" y="11" width="1" height="1" fill="#8d6e63" />
                  {/* Medium bubbles */}
                  <rect x="10" y="10" width="1" height="1" fill="#a08679" />
                  <rect x="14" y="10" width="1" height="1" fill="#a08679" />
                  <rect x="18" y="10" width="1" height="1" fill="#a08679" />
                  <rect x="22" y="10" width="1" height="1" fill="#a08679" />
                  {/* Large bubble */}
                  {fillPercentage > 95 && (
                    <>
                      <rect x="15" y="9" width="2" height="2" fill="#b8a088" />
                      <rect x="16" y="9" width="1" height="1" fill="#c9b5a0" />
                    </>
                  )}
                  {/* Foam on surface */}
                  <rect x="7" y="12" width="1" height="1" fill="#a08679" />
                  <rect x="11" y="12" width="1" height="1" fill="#a08679" />
                  <rect x="15" y="12" width="1" height="1" fill="#a08679" />
                  <rect x="19" y="12" width="1" height="1" fill="#a08679" />
                  <rect x="23" y="12" width="1" height="1" fill="#a08679" />
                </>
              )}
            </>
          )}
          
          {/* Steam when complete - more detailed */}
          {isComplete && (
            <>
              {/* Left steam column */}
              <rect x="10" y="4" width="1" height="2" fill="#999" opacity="0.8" />
              <rect x="10" y="3" width="1" height="1" fill="#aaa" opacity="0.7" />
              <rect x="10" y="2" width="1" height="1" fill="#bbb" opacity="0.6" />
              {/* Center steam column */}
              <rect x="15" y="3" width="1" height="3" fill="#999" opacity="0.8" />
              <rect x="15" y="2" width="1" height="1" fill="#aaa" opacity="0.7" />
              <rect x="15" y="1" width="1" height="1" fill="#bbb" opacity="0.6" />
              <rect x="15" y="0" width="1" height="1" fill="#ccc" opacity="0.5" />
              {/* Right steam column */}
              <rect x="20" y="4" width="1" height="2" fill="#999" opacity="0.8" />
              <rect x="20" y="3" width="1" height="1" fill="#aaa" opacity="0.7" />
              <rect x="20" y="2" width="1" height="1" fill="#bbb" opacity="0.6" />
              {/* Small wisps */}
              <rect x="12" y="5" width="1" height="1" fill="#999" opacity="0.6" />
              <rect x="18" y="5" width="1" height="1" fill="#999" opacity="0.6" />
            </>
          )}
          
          {/* Handle detail - right side with highlights and shadows */}
          <rect x="28" y="14" width="1" height="1" fill="#2a1c12" />
          <rect x="28" y="15" width="1" height="1" fill="#5d4037" />
          <rect x="28" y="16" width="1" height="1" fill="#8b5a3c" />
          <rect x="28" y="17" width="1" height="1" fill="#6b4423" />
          <rect x="28" y="18" width="1" height="1" fill="#8b5a3c" />
          <rect x="28" y="19" width="1" height="1" fill="#5d4037" />
          <rect x="28" y="20" width="1" height="1" fill="#8b5a3c" />
          <rect x="28" y="21" width="1" height="1" fill="#6b4423" />
          <rect x="28" y="22" width="1" height="1" fill="#5d4037" />
          <rect x="28" y="23" width="1" height="1" fill="#2a1c12" />
          {/* Handle inner highlight */}
          <rect x="29" y="16" width="1" height="1" fill="#4a3423" />
          <rect x="29" y="17" width="1" height="1" fill="#5a3f2f" />
          <rect x="29" y="18" width="1" height="1" fill="#4a3423" />
          <rect x="29" y="19" width="1" height="1" fill="#5a3f2f" />
          <rect x="29" y="20" width="1" height="1" fill="#4a3423" />
          <rect x="29" y="21" width="1" height="1" fill="#5a3f2f" />
        </svg>
        
        {/* Fill percentage indicator */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -mb-2">
          <div className="text-sm font-mono font-bold text-gray-600 dark:text-gray-400">
            {Math.round(fillPercentage)}%
          </div>
        </div>
      </div>
    </div>
  );
};

