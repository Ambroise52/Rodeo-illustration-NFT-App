import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 100 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="Infinite NFT Creator Logo"
    >
      <defs>
        <linearGradient id="blue_grad" x1="0" y1="30" x2="60" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0080FF" />
          <stop offset="100%" stopColor="#00F0FF" />
        </linearGradient>
        <linearGradient id="white_glass" x1="40" y1="30" x2="100" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Left Ring (Blue) - Bottom part (under White) */}
      <circle cx="35" cy="30" r="20" stroke="url(#blue_grad)" strokeWidth="10" />

      {/* Right Ring (White) */}
      <circle cx="65" cy="30" r="20" stroke="url(#white_glass)" strokeWidth="10" />

      {/* Left Ring (Blue) - Top part (over White) to create interlocking effect */}
      {/* Drawing an arc for the top half of the blue circle */}
      <path 
        d="M 15 30 A 20 20 0 0 1 55 30" 
        stroke="url(#blue_grad)" 
        strokeWidth="10" 
        strokeLinecap="round"
      />
      
      {/* Highlights for 3D effect */}
      <path d="M 25 15 Q 35 10 45 15" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none" />
      <path d="M 55 15 Q 65 10 75 15" stroke="white" strokeWidth="2" strokeOpacity="0.8" fill="none" />

    </svg>
  );
};
