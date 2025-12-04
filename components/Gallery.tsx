import React from 'react';
import { GeneratedData } from '../types';
import RarityBadge from './RarityBadge';
import { APP_CONFIG, RARITY_CONFIG } from '../constants';
import { Icons } from './Icons';

interface GalleryProps {
  history: GeneratedData[];
  onSelect: (item: GeneratedData) => void;
  selectedId: string | undefined;
  title?: string;
}

const Gallery: React.FC<GalleryProps> = ({ history, onSelect, selectedId, title = "Generation History" }) => {
  if (history.length === 0) {
    return (
      <div className="w-full text-center py-12 border border-dashed border-gray-800 rounded-xl">
        <Icons.Box className="w-12 h-12 text-gray-800 mx-auto mb-2" />
        <p className="text-gray-600 font-mono text-sm">No items found in this collection.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-neon-cyan"></span>
        {title} ({history.length})
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {history.map((item) => {
           const rarityConfig = RARITY_CONFIG[item.rarity];
           return (
             <button
               key={item.id}
               onClick={() => onSelect(item)}
               className={`
                 relative aspect-[4/5] rounded-lg overflow-hidden border transition-all duration-300 group
                 ${selectedId === item.id ? 'border-neon-cyan ring-2 ring-neon-cyan/20 scale-105 z-10' : 'border-dark-border hover:border-gray-500 hover:scale-105'}
               `}
             >
               {item.imageUrl ? (
                 <img src={item.imageUrl} alt="NFT" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-gray-900 flex items-center justify-center">?</div>
               )}
               
               {/* Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
               
               {/* Favorite Marker */}
               {item.isFavorite && (
                 <div className="absolute top-2 right-2 text-neon-pink">
                   <Icons.Heart className="w-3 h-3 fill-current" />
                 </div>
               )}

               {/* Rarity Stripe */}
               <div className={`absolute top-0 left-0 right-0 h-1 ${rarityConfig.badgeColor}`}></div>

               {/* Info */}
               <div className="absolute bottom-2 left-2 right-2 flex flex-col items-start">
                 <span className={`text-[10px] font-bold ${rarityConfig.color}`}>{item.rarity}</span>
                 <span className="text-xs font-mono text-white">{item.ethValue.toFixed(2)} {APP_CONFIG.CURRENCY_SYMBOL}</span>
               </div>
             </button>
           );
        })}
      </div>
    </div>
  );
};

export default Gallery;
