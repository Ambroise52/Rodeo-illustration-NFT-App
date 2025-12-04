import React from 'react';
import { GeneratedData } from '../types';
import RarityBadge from './RarityBadge';
import { APP_CONFIG } from '../constants';
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
      <div className="w-full text-center py-20 rounded-2xl border-2 border-dashed border-light-border dark:border-dark-border bg-light-bg dark:bg-white/[0.02]">
        <Icons.Box className="w-10 h-10 text-light-subtext dark:text-dark-subtext mx-auto mb-3 opacity-50" />
        <p className="text-light-subtext dark:text-dark-subtext font-medium text-sm">No items in this collection.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6 opacity-60">
        <Icons.Grid className="w-4 h-4 text-light-text dark:text-dark-text" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-light-text dark:text-dark-text">
          {title} ({history.length})
        </h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {history.map((item) => (
             <button
               key={item.id}
               onClick={() => onSelect(item)}
               className={`
                 relative aspect-[4/5] rounded-2xl overflow-hidden bg-light-card dark:bg-dark-card shadow-sm transition-all duration-300 group
                 ${selectedId === item.id ? 'ring-2 ring-light-accent dark:ring-dark-accent ring-offset-2 ring-offset-light-bg dark:ring-offset-dark-bg' : 'hover:shadow-apple-hover hover:-translate-y-1'}
               `}
             >
               <img src={item.imageUrl} alt="NFT" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               
               {/* Overlay Gradient */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
               
               {/* Badge Top Left */}
               <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 backdrop-blur text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.rarity}
                  </div>
               </div>

               {/* Favorite Top Right */}
               {item.isFavorite && (
                 <div className="absolute top-3 right-3 text-white drop-shadow-md">
                   <Icons.Heart className="w-4 h-4 fill-current" />
                 </div>
               )}

               {/* Bottom Info */}
               <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                 <span className="text-white font-medium text-sm">{item.ethValue.toFixed(2)} {APP_CONFIG.CURRENCY_SYMBOL}</span>
               </div>
             </button>
        ))}
      </div>
    </div>
  );
};

export default Gallery;