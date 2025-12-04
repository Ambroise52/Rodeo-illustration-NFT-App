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

  useEffect(() => {
    if (animate) {
      let start = 0;
      const end = ethValue;
      const duration = 1500;
      const startTime = performance.now();

      const update = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(start + (end - start) * ease);

        if (progress < 1) requestAnimationFrame(update);
      };

      requestAnimationFrame(update);
    } else {
      setDisplayValue(ethValue);
    }
  }, [ethValue, animate]);

  return (
    <div className="w-full flex items-center justify-between bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border p-5 rounded-2xl shadow-apple">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-light-subtext dark:text-dark-subtext uppercase tracking-wide">Rarity</span>
        <RarityBadge tier={rarity} />
      </div>

      <div className="flex flex-col items-end gap-1">
         <span className="text-xs font-medium text-light-subtext dark:text-dark-subtext uppercase tracking-wide">Est. Value</span>
         <div className="flex items-baseline gap-1">
           <span className="text-2xl font-bold text-light-text dark:text-dark-text">
             {displayValue.toFixed(4)}
           </span>
           <span className="text-sm font-medium text-light-subtext dark:text-dark-subtext">{APP_CONFIG.CURRENCY_SYMBOL}</span>
         </div>
      </div>
    </div>
  );
};

export default DropInfo;