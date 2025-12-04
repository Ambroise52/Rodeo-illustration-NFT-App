import React, { useEffect, useState } from 'react';
import { RarityTier } from '../types';
import { RARITY_CONFIG, APP_CONFIG } from '../constants';
import RarityBadge from './RarityBadge';

interface DropInfoProps {
  ethValue: number;
  rarity: RarityTier;
  animate: boolean;
}

const DropInfo: React.FC<DropInfoProps> = ({ ethValue, rarity, animate }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const config = RARITY_CONFIG[rarity];

  useEffect(() => {
    if (animate) {
      let start = 0;
      const end = ethValue;
      const duration = 1500;
      const startTime = performance.now();

      const update = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quartic
        const ease = 1 - Math.pow(1 - progress, 4);
        
        setDisplayValue(start + (end - start) * ease);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    } else {
      setDisplayValue(ethValue);
    }
  }, [ethValue, animate]);

  return (
    <div className="w-full flex items-center justify-between bg-dark-card border border-dark-border p-4 rounded-xl mb-4 relative overflow-hidden">
      {/* Background glow based on rarity */}
      <div className={`absolute inset-0 opacity-10 ${config.bg}`}></div>
      
      <div className="flex flex-col z-10">
        <span className="text-gray-500 text-xs font-mono mb-1 uppercase tracking-widest">Rarity Tier</span>
        <RarityBadge tier={rarity} />
      </div>

      <div className="flex flex-col items-end z-10">
         <span className="text-gray-500 text-xs font-mono mb-1 uppercase tracking-widest">Market Value</span>
         <div className="flex items-baseline gap-1">
           <span className={`text-3xl font-black font-mono tracking-tighter ${config.color} drop-shadow-lg`}>
             {displayValue.toFixed(4)}
           </span>
           <span className="text-sm font-bold text-gray-400">{APP_CONFIG.CURRENCY_SYMBOL}</span>
         </div>
      </div>
    </div>
  );
};

export default DropInfo;