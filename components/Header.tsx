import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { Logo } from './Logo';
import { UserProfile } from '../types';
import { supabase } from '../services/supabaseClient';
import { dataService } from '../services/dataService';
import { NotificationsPopover } from './Notifications';
import { Avatar, AvatarFallback, Button } from './UIShared';

interface HeaderProps {
  userProfile: UserProfile | null;
  activeTab: 'generator' | 'collections' | 'profile';
  onTabChange: (tab: 'generator' | 'collections' | 'profile') => void;
}

const Header: React.FC<HeaderProps> = ({ userProfile, activeTab, onTabChange }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (userProfile) {
      dataService.getUnreadCount(userProfile.id).then(setUnreadCount);
    }
  }, [userProfile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="w-full border-b border-dark-border bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => onTabChange('generator')}>
            <div className="group-hover:scale-105 transition-transform">
               <Logo className="w-10 h-8 md:w-12 md:h-8" />
            </div>
            <span className="hidden md:block font-black tracking-tighter text-white text-lg">
              OLLY
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
            {[
              { id: 'generator', label: 'Generator', icon: Icons.Zap },
              { id: 'collections', label: 'Collections', icon: Icons.Grid },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as any)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                  activeTab === item.id 
                    ? 'bg-neon-cyan text-black shadow-lg shadow-neon-cyan/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-3 h-3" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        {userProfile && (
          <div className="flex items-center gap-3">
             {/* Notification Bell */}
             <div className="relative">
                <button 
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors relative"
                >
                  <Icons.Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-neon-pink rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                {showNotifs && userProfile && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)}></div>
                    <NotificationsPopover userId={userProfile.id} />
                  </>
                )}
             </div>

             {/* Profile Menu */}
             <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-dark-border"
                >
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-tr from-neon-purple to-neon-cyan text-black font-bold">
                       {userProfile.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Icons.ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-dark-card border border-dark-border rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-white/5 mb-2">
                      <p className="text-xs text-gray-500 uppercase font-mono">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{userProfile.username}</p>
                    </div>
                    <button 
                      onClick={() => { onTabChange('profile'); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-left"
                    >
                      <Icons.User className="w-4 h-4" /> Profile Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left mt-1"
                    >
                      <Icons.X className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
             </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;