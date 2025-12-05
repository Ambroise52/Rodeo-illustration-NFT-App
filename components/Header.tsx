import React from 'react';
import { Logo } from './Logo';
import { UserProfile } from '../types';
import { UserButton } from '@clerk/clerk-react';

interface HeaderProps {
  userProfile: UserProfile | null;
}

const Header: React.FC<HeaderProps> = ({ userProfile }) => {
  return (
    <header className="w-full py-4 px-4 md:px-8 border-b border-dark-border bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Logo Container - Removed box styling for organic SVG look */}
          <div className="group transition-transform duration-300 hover:scale-105">
            <Logo className="w-12 h-8 md:w-16 md:h-10 drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter text-white">
              INFINITE <span className="text-neon-cyan">NFT</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {userProfile && (
            <div className="hidden md:block text-right">
              <p className="text-xs text-gray-500 font-mono uppercase">Creator</p>
              <p className="text-sm font-bold text-white">{userProfile.username}</p>
            </div>
          )}
          
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9 border-2 border-neon-cyan/50",
                userButtonPopoverCard: "bg-dark-card border border-dark-border",
                userButtonPopoverFooter: "hidden"
              }
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
