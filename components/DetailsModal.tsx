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
  onRegenerateStronger: (item: GeneratedData) => void;
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
  onRegenerateStronger
}) => {
  const [copiedVideoPrompt, setCopiedVideoPrompt] = useState(false);

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

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-light-bg/80 dark:bg-black/80 backdrop-blur-xl transition-opacity duration-300">
      
      {/* Navigation & Controls */}
      <button onClick={onClose} className="absolute top-6 right-6 p-3 bg-white dark:bg-white/10 rounded-full hover:bg-gray-100 dark:hover:bg-white/20 transition-colors shadow-sm z-50">
        <Icons.X className="w-5 h-5 text-light-text dark:text-white" />
      </button>

      <button onClick={onPrev} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white dark:bg-white/10 rounded-full hover:bg-gray-100 dark:hover:bg-white/20 transition-colors shadow-lg z-50 hidden md:block">
        <Icons.ArrowLeft className="w-6 h-6 text-light-text dark:text-white" />
      </button>
      <button onClick={onNext} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white dark:bg-white/10 rounded-full hover:bg-gray-100 dark:hover:bg-white/20 transition-colors shadow-lg z-50 hidden md:block">
        <Icons.ArrowRight className="w-6 h-6 text-light-text dark:text-white" />
      </button>

      {/* Main Card */}
      <div className="w-full max-w-5xl max-h-[90vh] bg-light-card dark:bg-dark-card rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative mx-4">
        
        {/* Left: Image */}
        <div className="flex-1 bg-gray-50 dark:bg-black flex items-center justify-center relative p-8">
            <img 
              src={item.imageUrl} 
              alt={item.imagePrompt} 
              className="max-h-full max-w-full object-contain rounded-xl shadow-apple" 
            />
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
               <button 
                onClick={() => onToggleFavorite(item.id)}
                className={`p-3 rounded-full backdrop-blur-xl border shadow-lg transition-transform hover:scale-110 ${item.isFavorite ? 'bg-red-500 border-red-500 text-white' : 'bg-white/80 border-white/40 text-gray-700 hover:bg-white'}`}
               >
                 <Icons.Heart className={`w-5 h-5 ${item.isFavorite ? 'fill-current' : ''}`} />
               </button>
               <button 
                 onClick={() => onDownloadPackage(item)}
                 className="p-3 bg-white/80 backdrop-blur-xl border border-white/40 rounded-full text-gray-700 hover:bg-white hover:scale-110 transition-transform shadow-lg"
                 title="Download Package"
               >
                 <Icons.Download className="w-5 h-5" />
               </button>
            </div>
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-[400px] bg-light-card dark:bg-dark-card p-8 flex flex-col overflow-y-auto border-l border-light-border dark:border-dark-border">
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <RarityBadge tier={item.rarity} />
              <span className="text-xs text-light-subtext dark:text-dark-subtext font-medium">{new Date(item.timestamp).toLocaleDateString()}</span>
            </div>
            <h2 className="text-4xl font-bold text-light-text dark:text-dark-text tracking-tight">
              {item.ethValue.toFixed(4)} <span className="text-light-subtext dark:text-dark-subtext text-2xl align-top">{APP_CONFIG.CURRENCY_SYMBOL}</span>
            </h2>
          </div>

          <div className="space-y-6 flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-light-bg dark:bg-white/5">
                 <p className="text-[10px] uppercase tracking-wide text-light-subtext dark:text-dark-subtext mb-1">Character</p>
                 <p className="text-sm font-semibold text-light-text dark:text-dark-text">{item.character}</p>
              </div>
              <div className="p-3 rounded-xl bg-light-bg dark:bg-white/5">
                 <p className="text-[10px] uppercase tracking-wide text-light-subtext dark:text-dark-subtext mb-1">Action</p>
                 <p className="text-sm font-semibold text-light-text dark:text-dark-text">{item.action}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase text-light-text dark:text-dark-text flex items-center gap-2">
                  <Icons.Video className="w-3 h-3" /> Animation Prompt
                </span>
                <button
                   onClick={() => {
                     navigator.clipboard.writeText(item.videoPrompt);
                     setCopiedVideoPrompt(true);
                     setTimeout(() => setCopiedVideoPrompt(false), 2000);
                   }}
                   className="text-[10px] font-medium text-light-accent dark:text-dark-accent hover:underline"
                 >
                   {copiedVideoPrompt ? 'Copied!' : 'Copy'}
                 </button>
              </div>
              <div className="p-4 rounded-xl bg-light-bg dark:bg-white/5 text-xs leading-relaxed text-light-subtext dark:text-dark-subtext h-32 overflow-y-auto">
                {item.videoPrompt}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-light-border dark:border-dark-border space-y-3">
             <button
              onClick={() => {
                onRegenerateStronger(item);
                onClose();
              }}
              className="w-full py-3 bg-light-text dark:bg-white text-white dark:text-black rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Icons.RefreshCw className="w-4 h-4" /> Enhance Style
            </button>
            
            <button 
              onClick={() => {
                if (window.confirm("Delete this asset?")) {
                  onDelete(item.id);
                  onClose();
                }
              }}
              className="w-full py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-medium text-sm transition-colors"
            >
              Delete Asset
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailsModal;