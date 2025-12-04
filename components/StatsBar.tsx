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
    <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      
      <div className="bg-dark-card border border-dark-border p-3 rounded-xl flex flex-col items-center justify-center">
        <span className="text-gray-500 text-[10px] font-mono uppercase tracking-widest mb-1">Total Gens</span>
        <span className="text-2xl font-black text-white">{totalCount}</span>
      </div>

      <div className="bg-dark-card border border-dark-border p-3 rounded-xl flex flex-col items-center justify-center">
        <span className="text-gray-500 text-[10px] font-mono uppercase tracking-widest mb-1">Session Value</span>
        <div className="flex items-center gap-1">
          <span className="text-2xl font-black text-neon-cyan">{sessionValue.toFixed(2)}</span>
          <span className="text-xs text-gray-400">{APP_CONFIG.CURRENCY_SYMBOL}</span>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border p-3 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
        {legendaryCount > 0 && <div className="absolute inset-0 bg-yellow-500/10 animate-pulse"></div>}
        <span className="text-gray-500 text-[10px] font-mono uppercase tracking-widest mb-1">Legendaries</span>
        <div className="flex items-center gap-1 z-10">
          <span className={`text-2xl font-black ${legendaryCount > 0 ? 'text-yellow-400' : 'text-white'}`}>{legendaryCount}</span>
          <Icons.Sparkles className={`w-4 h-4 ${legendaryCount > 0 ? 'text-yellow-400' : 'text-gray-600'}`} />
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border p-3 rounded-xl flex flex-col items-center justify-center">
         <span className="text-gray-500 text-[10px] font-mono uppercase tracking-widest mb-1">Best Drop</span>
         <div className="flex items-center gap-1">
          <span className="text-2xl font-black text-neon-pink">{bestDrop.toFixed(2)}</span>
          <span className="text-xs text-gray-400">{APP_CONFIG.CURRENCY_SYMBOL}</span>
        </div>
      </div>

    </div>
  );
};

export default StatsBar;