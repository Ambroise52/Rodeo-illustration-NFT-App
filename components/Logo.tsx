import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src="/apple-touch-icon.png"
    alt="Infinite NFT Creator Logo"
    className={`object-contain ${className}`}
    onError={(e) => {
      // Fallback if image isn't loaded yet
      e.currentTarget.style.display = 'none';
    }}
  />
);