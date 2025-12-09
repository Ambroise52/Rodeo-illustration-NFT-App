
import React from 'react';
import { GeneratedData } from '../types';
import RarityBadge from './RarityBadge';
import { Icons } from './Icons';
import { APP_CONFIG } from '../constants';

interface BatchResultProps {
  results: GeneratedData[];
  onSelect: (item: GeneratedData) => void;
  onToggleFavorite: (id: string) => void;
  onDownload: (item: GeneratedData) => void;
}

const BatchResult: React.FC<BatchResultProps> = ({ results, onSelect, onToggleFavorite, onDownload }) => {
  if (results.length === 0) return null;

  return (
    <div className="w-full mb-8">
      <h3 className="text-sm font-mono text-neon-cyan uppercase tracking-widest mb-4 flex items-center gap-2">
        <Icons.Layers className="w-4 h-4" />
        Batch Generation Complete
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.map((item) => (
          <div 
            key={item.id} 
            className="group relative bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-neon-cyan/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
          >
            {/* Image */}
            <div className="aspect-square relative cursor-pointer" onClick={() => onSelect(item)}>
              <img src={item.imageUrl} alt="Generated NFT" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
              
              {/* Overlay Actions */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
                  className={`p-2 rounded-full backdrop-blur-md ${item.isFavorite ? 'bg-neon-pink text-white' : 'bg-black/50 text-white hover:bg-neon-pink'}`}
                >
                  <Icons.Heart className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <RarityBadge tier={item.rarity} className="scale-75 origin-left" showIcon={false} />
                <span className="text-sm font-mono font-bold text-white">
                  {item.ethValue.toFixed(2)} {APP_CONFIG.CURRENCY_SYMBOL}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => onSelect(item)}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded text-xs font-bold text-white transition-colors"
                >
                  View Details
                </button>
                <button 
                  onClick={() => onDownload(item)}
                  className="p-2 bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan rounded text-white transition-colors"
                >
                  <Icons.Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BatchResult;
