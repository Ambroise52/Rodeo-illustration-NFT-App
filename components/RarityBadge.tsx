import React from 'react';
import { RarityTier } from '../types';
import { Icons } from './Icons';

interface RarityBadgeProps {
  tier: RarityTier;
  className?: string;
  showIcon?: boolean;
}

const RarityBadge: React.FC<RarityBadgeProps> = ({ tier, className = "", showIcon = true }) => {
  
  const getStyle = (t: RarityTier) => {
      switch(t) {
          case 'COMMON': return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
          case 'UNCOMMON': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
          case 'RARE': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
          case 'EPIC': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';
          case 'LEGENDARY': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      }
  };

  return (
    <div className={`
      inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
      text-[11px] font-semibold tracking-wide border
      ${getStyle(tier)} ${className}
    `}>
      {showIcon && tier !== 'COMMON' && tier !== 'UNCOMMON' && (
        <Icons.Sparkles className="w-3 h-3" />
      )}
      <span>{tier}</span>
    </div>
  );
};

export default RarityBadge;