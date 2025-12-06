import React, { useEffect, useState } from 'react';
import { GeneratedData } from '../types';
import RarityBadge from './RarityBadge';
import { Icons } from './Icons';
import { APP_CONFIG } from '../constants';

interface DetailsModalProps {
  item: GeneratedData | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onDownloadPackage: (item: GeneratedData) => void;
  onRemix: (item: GeneratedData) => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ 
  item, 
  isOpen, 
  onClose, 
  onNext, 
  onPrev,
  onToggleFavorite,
  onDelete,
  onDownloadPackage,
  onRemix
}) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === ' ') {
        e.preventDefault();
        if (item) onToggleFavorite(item.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, item, onNext, onPrev, onClose, onToggleFavorite]);

  const handleCopyVideoPrompt = () => {
    if (item) {
      navigator.clipboard.writeText(item.videoPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Navigation Buttons */}
      <button onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white z-20">
        <Icons.ArrowLeft className="w-8 h-8" />
      </button>
      <button onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white z-20">
        <Icons.ArrowRight className="w-8 h-8" />
      </button>

      {/* Close Button */}
      <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-colors text-gray-400 z-20">
        <Icons.X className="w-6 h-6" />
      </button>

      <div className="w-full max-w-6xl h-[90vh] flex flex-col md:flex-row gap-8 p-4 md:p-8 relative">
        
        {/* Left: Image */}
        <div className="flex-1 flex items-center justify-center relative bg-dark-card/50 rounded-2xl border border-dark-border p-2">
            <img 
              src={item.imageUrl} 
              alt={item.imagePrompt} 
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" 
            />
            {/* Quick Actions Overlay */}
            <div className="absolute bottom-6 flex gap-3">
               <button 
                onClick={() => onToggleFavorite(item.id)}
                className={`p-3 rounded-full backdrop-blur-md border transition-all hover:scale-110 ${item.isFavorite ? 'bg-neon-pink/20 border-neon-pink text-neon-pink' : 'bg-black/50 border-white/20 text-white hover:bg-white/10'}`}
               >
                 <Icons.Heart className={`w-6 h-6 ${item.isFavorite ? 'fill-current' : ''}`} />
               </button>
               <button 
                 onClick={() => onDownloadPackage(item)}
                 className="p-3 bg-black/50 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/10 hover:scale-110 transition-all"
                 title="Download Package"
               >
                 <Icons.Download className="w-6 h-6" />
               </button>
            </div>
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-[400px] flex flex-col gap-6 overflow-y-auto pr-2">
          
          {/* Header Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <RarityBadge tier={item.rarity} />
              <span className="text-gray-500 text-xs font-mono">{new Date(item.timestamp).toLocaleDateString()}</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
              {item.ethValue.toFixed(4)} <span className="text-neon-cyan">{APP_CONFIG.CURRENCY_SYMBOL}</span>
            </h2>
            <button
               onClick={() => onRemix(item)}
               className="w-full mt-2 py-2 flex items-center justify-center gap-2 bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan hover:text-black rounded transition-all text-xs font-bold"
             >
               <Icons.RefreshCw className="w-3 h-3" />
               Regenerate Variant
             </button>
          </div>

          {/* Traits Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-dark-card p-3 rounded-lg border border-dark-border">
              <span className="text-[10px] text-gray-500 uppercase font-mono block mb-1">Character</span>
              <span className="text-sm font-bold text-gray-200">{item.character}</span>
            </div>
            <div className="bg-dark-card p-3 rounded-lg border border-dark-border">
              <span className="text-[10px] text-gray-500 uppercase font-mono block mb-1">Action</span>
              <span className="text-sm font-bold text-gray-200">{item.action}</span>
            </div>
            <div className="bg-dark-card p-3 rounded-lg border border-dark-border col-span-2">
              <span className="text-[10px] text-gray-500 uppercase font-mono block mb-1">Background</span>
              <span className="text-sm font-bold text-gray-200">{item.background}</span>
            </div>
          </div>

          {/* Prompts */}
          <div className="space-y-4 flex-1">
             <div className="space-y-2">
               <div className="flex items-center justify-between">
                 <h3 className="text-xs font-mono text-neon-purple uppercase flex items-center gap-2">
                   <Icons.Video className="w-3 h-3" /> Video Prompt
                 </h3>
                 <button
                   onClick={handleCopyVideoPrompt}
                   className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all duration-200 flex items-center gap-1 ${isCopied ? 'bg-green-500 text-white scale-105' : 'bg-white text-black hover:bg-gray-200 active:scale-95'}`}
                 >
                   {isCopied ? (
                     <>
                        <Icons.Sparkles className="w-3 h-3" />
                        COPIED!
                     </>
                   ) : (
                     'COPY'
                   )}
                 </button>
               </div>
               <div className="p-3 bg-black/30 rounded border border-dark-border text-xs text-gray-400 font-mono max-h-32 overflow-y-auto">
                 {item.videoPrompt}
               </div>
             </div>
             
             <div className="space-y-2">
               <h3 className="text-xs font-mono text-neon-pink uppercase flex items-center gap-2">
                 <Icons.Image className="w-3 h-3" /> Image Prompt
               </h3>
               <div className="p-3 bg-black/30 rounded border border-dark-border text-xs text-gray-400 font-mono max-h-32 overflow-y-auto">
                 {item.imagePrompt}
               </div>
             </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-4 border-t border-dark-border">
            <button 
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this NFT?")) {
                  onDelete(item.id);
                  onClose();
                }
              }}
              className="w-full py-2 flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10 rounded transition-colors text-sm font-bold"
            >
              <Icons.Trash className="w-4 h-4" /> Delete Asset
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailsModal;