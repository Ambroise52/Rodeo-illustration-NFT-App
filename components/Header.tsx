import React from 'react';
import { Icons } from './Icons';

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-xl border-b border-light-border dark:border-dark-border transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-light-accent dark:bg-dark-accent flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Icons.Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-light-text dark:text-dark-text leading-tight">
              Infinite Creator
            </h1>
            <p className="text-[10px] text-light-subtext dark:text-dark-subtext font-medium uppercase tracking-wider">
              Pro Studio
            </p>
          </div>
        </div>

        {/* Navigation / Actions */}
        <div className="flex items-center gap-4">
          <button 
             onClick={toggleTheme}
             className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all text-light-subtext dark:text-dark-subtext hover:text-light-text dark:hover:text-dark-text"
             title="Toggle Theme"
           >
             {theme === 'dark' ? <Icons.Sun className="w-5 h-5" /> : <Icons.Moon className="w-5 h-5" />}
           </button>
           
           <div className="h-4 w-[1px] bg-light-border dark:bg-dark-border mx-1"></div>

           <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-light-text dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 transition-opacity">
              Sign In
           </button>
        </div>
      </div>
    </header>
  );
};

export default Header;