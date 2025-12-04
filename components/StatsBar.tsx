import React from 'react';
import { Icons } from './Icons';
import { APP_CONFIG } from '../constants';

interface StatsBarProps {
  totalCount: number;
  sessionValue: number;
  legendaryCount: number;
  bestDrop: number;
}

const StatsBar: React.FC<StatsBarProps> = ({ totalCount, sessionValue, legendaryCount, bestDrop }) => {
  return (
    <div className="w-full max-w-5xl mx-auto mb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-light-border dark:divide-dark-border bg-light-card dark:bg-dark-card rounded-2xl shadow-apple border border-light-border dark:border-dark-border overflow-hidden">
        
        <div className="p-6 flex flex-col items-center text-center hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
          <span className="text-xs font-medium text-light-subtext dark:text-dark-subtext uppercase tracking-wide mb-1">Generated</span>
          <span className="text-2xl font-semibold text-light-text dark:text-dark-text">{totalCount}</span>
        </div>

        <div className="p-6 flex flex-col items-center text-center hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
          <span className="text-xs font-medium text-light-subtext dark:text-dark-subtext uppercase tracking-wide mb-1">Value</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-light-text dark:text-dark-text">{sessionValue.toFixed(2)}</span>
            <span className="text-sm text-light-subtext dark:text-dark-subtext">{APP_CONFIG.CURRENCY_SYMBOL}</span>
          </div>
        </div>

        <div className="p-6 flex flex-col items-center text-center hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors relative">
          <span className="text-xs font-medium text-light-subtext dark:text-dark-subtext uppercase tracking-wide mb-1">Legendary</span>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-semibold ${legendaryCount > 0 ? 'text-yellow-500' : 'text-light-text dark:text-dark-text'}`}>{legendaryCount}</span>
            {legendaryCount > 0 && <Icons.Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />}
          </div>
        </div>

        <div className="p-6 flex flex-col items-center text-center hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
           <span className="text-xs font-medium text-light-subtext dark:text-dark-subtext uppercase tracking-wide mb-1">Best Drop</span>
           <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-light-text dark:text-dark-text">{bestDrop.toFixed(2)}</span>
            <span className="text-sm text-light-subtext dark:text-dark-subtext">{APP_CONFIG.CURRENCY_SYMBOL}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StatsBar;