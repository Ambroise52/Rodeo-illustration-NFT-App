import React from 'react';
import { Icons } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 md:px-8 border-b border-dark-border bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-dark-card border border-neon-cyan/30 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Icons.Cpu className="w-8 h-8 text-neon-cyan" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">
              INFINITE <span className="text-neon-cyan">NFT</span> CREATOR <span className="text-xs align-top bg-neon-cyan text-black px-1 rounded font-bold">PRO</span>
            </h1>
            <p className="text-gray-400 text-xs md:text-sm font-mono tracking-wide mt-1">
              GENERATE UNIQUE ASSETS + PERFECT VIDEO PROMPTS
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-card border border-dark-border text-xs text-gray-400">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             System Online
           </span>
        </div>
      </div>
    </header>
  );
};

export default Header;