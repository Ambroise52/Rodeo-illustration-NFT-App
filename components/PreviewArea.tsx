import React from 'react';
import { Icons } from './Icons';

interface PreviewAreaProps {
  isGenerating: boolean;
  hasGenerated: boolean;
  imageUrl?: string;
  onRegenerateStronger?: () => void;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ isGenerating, hasGenerated, imageUrl, onRegenerateStronger }) => {
  
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
    <div className="w-full aspect-square max-w-md mx-auto relative group mb-6">
      {/* Decorative frame elements */}
      <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-purple-600 to-neon-pink rounded-xl opacity-30 blur-md group-hover:opacity-50 transition-opacity duration-500"></div>
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-cyan rounded-tl-xl z-20"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon-pink rounded-tr-xl z-20"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neon-pink rounded-bl-xl z-20"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-cyan rounded-br-xl z-20"></div>

      {/* Main Container */}
      <div className="relative w-full h-full bg-dark-card border border-dark-border rounded-xl flex flex-col items-center justify-center overflow-hidden z-10">
        
        {/* Grid Background Effect */}
        <div className="absolute inset-0 z-0 opacity-20" 
             style={{ 
               backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-4 p-6 text-center">
              <Icons.RefreshCw className="w-16 h-16 text-neon-cyan animate-spin" />
              <p className="text-neon-cyan font-mono text-sm animate-pulse">SYNTHESIZING NEURAL ART...</p>
              <p className="text-gray-500 text-xs max-w-[200px]">Generating unique geometry and assets via Gemini 2.5...</p>
            </div>
          ) : hasGenerated && imageUrl ? (
             <div className="relative w-full h-full animate-in fade-in zoom-in duration-500 group/image">
                <img 
                  src={imageUrl} 
                  alt="Generated NFT" 
                  className="w-full h-full object-cover rounded-lg"
                />
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 backdrop-blur-sm p-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-neon-cyan flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.5)]">
                       <Icons.Sparkles className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-white font-bold tracking-wide">NFT READY</span>
                  </div>
                  
                  <div className="flex flex-col w-full gap-3 max-w-xs">
                    <button 
                      onClick={handleDownload}
                      className="flex items-center justify-center gap-2 px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-neon-cyan hover:scale-105 transition-all duration-200"
                    >
                      <Icons.Download className="w-4 h-4" />
                      DOWNLOAD ASSET
                    </button>
                    
                    {onRegenerateStronger && (
                      <div className="flex flex-col gap-1 w-full">
                        <span className="text-[10px] text-gray-400 font-mono text-center">Style not flat enough?</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); onRegenerateStronger(); }}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-900/60 border border-purple-500/50 text-white text-xs font-bold rounded-full hover:bg-purple-600 hover:scale-105 transition-all duration-200"
                        >
                          <Icons.RefreshCw className="w-3 h-3" />
                          REGENERATE WITH STRONGER STYLE
                        </button>
                      </div>
                    )}
                  </div>
                </div>
             </div>
          ) : (
            <div className="flex flex-col items-center gap-4 opacity-50 p-6 text-center">
              <Icons.Image className="w-20 h-20 text-gray-600" />
              <p className="text-gray-500 font-mono text-sm">AWAITING GENERATION PROTOCOL</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewArea;