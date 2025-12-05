import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Logo } from './Logo';

interface AuthProps {
  onLogin?: () => void;
}

const Auth: React.FC<AuthProps> = () => {
  return (
    <div className="bg-dark-bg flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <a href="#" className="flex flex-col items-center gap-4 self-center font-medium text-white hover:text-neon-cyan transition-colors">
          <div className="flex items-center justify-center">
            <Logo className="w-16 h-10" />
          </div>
          <span className="text-xl font-bold tracking-tight">Infinite NFT Creator</span>
        </a>
        
        <div className="flex justify-center">
          <SignIn 
            routing="hash" 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-dark-card border border-dark-border shadow-xl",
                headerTitle: "text-white",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton: "bg-white text-black hover:bg-gray-200",
                formButtonPrimary: "bg-neon-cyan text-black hover:bg-white",
                footerActionLink: "text-neon-cyan hover:text-white"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
