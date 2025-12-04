import React from 'react';
import { Icons } from './Icons';

interface PreviewAreaProps {
  isGenerating: boolean;
  hasGenerated: boolean;
  imageUrl?: string;
  onRegenerateStronger?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ 
  isGenerating, 
  hasGenerated, 
  imageUrl, 
  onRegenerateStronger, 
  isFavorite, 
  onToggleFavorite 
}) => {
  
  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `infinite-nft-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full aspect-square max-w-lg mx-auto relative group mb-8">
      
      {/* Main Container */}
      <div className="relative w-full h-full bg-light-card dark:bg-dark-card rounded-3xl shadow-apple transition-all duration-500 overflow-hidden border border-light-border dark:border-dark-border">
        
        {/* Content */}
        <div className="w-full h-full flex flex-col items-center justify-center">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-6 p-8 text-center animate-pulse">
              <div className="w-16 h-16 rounded-full border-4 border-light-accent dark:border-dark-accent border-t-transparent animate-spin"></div>
              <div className="space-y-2">
                <p className="text-light-text dark:text-dark-text font-medium text-lg">Synthesizing Art</p>
                <p className="text-light-subtext dark:text-dark-subtext text-sm">Creating unique geometry with Gemini AI...</p>
              </div>
            </div>
          ) : hasGenerated && imageUrl ? (
             <div className="relative w-full h-full animate-fade-in group/image">
                <img 
                  src={imageUrl} 
                  alt="Generated NFT" 
                  className="w-full h-full object-cover"
                />
                
                {/* Actions Overlay */}
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                   {onToggleFavorite && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                      className={`p-3 rounded-full backdrop-blur-xl border border-white/20 shadow-lg transition-transform hover:scale-110 ${isFavorite ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'}`}
                    >
                      <Icons.Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Bottom Bar Actions */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 group-hover/image:opacity-100 transition-all duration-300 translate-y-4 group-hover/image:translate-y-0">
                    <button 
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white/90 dark:bg-black/80 backdrop-blur-xl text-light-text dark:text-white text-sm font-semibold rounded-full shadow-lg hover:scale-105 transition-transform"
                    >
                      <Icons.Download className="w-4 h-4" />
                      Save
                    </button>
                    
                    {onRegenerateStronger && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onRegenerateStronger(); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-light-accent dark:bg-dark-accent text-white text-sm font-semibold rounded-full shadow-lg hover:brightness-110 hover:scale-105 transition-all"
                      >
                        <Icons.RefreshCw className="w-4 h-4" />
                        Enhance Style
                      </button>
                    )}
                </div>
             </div>
          ) : (
            <div className="flex flex-col items-center gap-4 opacity-40 p-6 text-center">
              <div className="w-20 h-20 rounded-2xl bg-light-bg dark:bg-white/5 flex items-center justify-center">
                 <Icons.Image className="w-8 h-8 text-light-subtext dark:text-dark-subtext" />
              </div>
              <p className="text-light-subtext dark:text-dark-subtext font-medium text-sm">Ready to Create</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewArea;