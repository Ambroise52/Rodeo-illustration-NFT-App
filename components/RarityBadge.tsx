import React from 'react';
import { RARITY_CONFIG } from '../constants';
import { RarityTier } from '../types';
import { Icons } from './Icons';

interface RarityBadgeProps {
  tier: RarityTier;
  className?: string;
  showIcon?: boolean;
}

const RarityBadge: React.FC<RarityBadgeProps> = ({ tier, className = "", showIcon = true }) => {
  const config = RARITY_CONFIG[tier];
  
  return (
    <div className={`
      relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
      font-black text-xs tracking-wider uppercase shadow-lg border
      ${config.bg} ${config.color} ${config.border} ${config.glow || ''}
      ${className}
    `}>
      {/* Sparkle effects for high tiers */}
      {tier === 'LEGENDARY' && (
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-500/0 via-yellow-200/50 to-yellow-500/0 animate-shimmer"></span>
      )}
      
      {showIcon && tier !== 'COMMON' && tier !== 'UNCOMMON' && (
        <Icons.Sparkles className={`w-3 h-3 ${tier === 'LEGENDARY' ? 'animate-pulse' : ''}`} />
      )}
      
      <span className="relative z-10">{tier}</span>
    </div>
  );
};

export default RarityBadge;