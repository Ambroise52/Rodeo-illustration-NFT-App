import React, { useState } from 'react';
import { Icons } from './Icons';
import { Logo } from './Logo';
import { UserProfile } from '../types';
import { supabase } from '../services/supabaseClient';

interface HeaderProps {
  userProfile: UserProfile | null;
}

const Header: React.FC<HeaderProps> = ({ userProfile }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="w-full py-4 px-4 md:px-8 border-b border-dark-border bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-dark-card border border-dark-border rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.05)] group transition-all hover:border-neon-cyan/40 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]">
            <Logo className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-105 transition-transform duration-300" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter text-white">
              INFINITE <span className="text-neon-cyan">NFT</span>
            </h1>
          </div>
        </div>
        
        {userProfile && (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 bg-dark-card hover:bg-white/5 border border-dark-border py-1.5 px-3 rounded-full transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-purple to-neon-cyan flex items-center justify-center text-black font-bold text-xs">
                {userProfile.username.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-sm font-bold text-gray-200 hidden md:block">{userProfile.username}</span>
              <Icons.ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-dark-card border border-dark-border rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                 <div className="px-3 py-2 border-b border-white/5 mb-2">
                   <p className="text-xs text-gray-500 uppercase font-mono">Signed in as</p>
                   <p className="text-sm font-bold text-white truncate">{userProfile.username}</p>
                 </div>
                 <button 
                   onClick={handleLogout}
                   className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                 >
                   <Icons.X className="w-4 h-4" /> Sign Out
                 </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;