import React, { useState } from 'react';
import { Icons } from './Icons';

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  content?: string;
  children?: React.ReactNode;
  colorClass: string; // Kept for interface compatibility but largely unused for color now
  defaultOpen?: boolean;
  className?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  icon, 
  content,
  children,
  defaultOpen = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 w-full ${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-light-text dark:text-dark-text opacity-70">
            {icon}
          </div>
          <span className="font-semibold text-light-text dark:text-dark-text text-sm">{title}</span>
        </div>
        {isOpen ? <Icons.ChevronUp className="w-4 h-4 text-light-subtext" /> : <Icons.ChevronDown className="w-4 h-4 text-light-subtext" />}
      </button>
      
      {isOpen && (
        <div className="p-5 pt-0 border-t border-transparent">
          {children ? (
            children
          ) : content ? (
            <p className="text-sm text-light-subtext dark:text-dark-subtext leading-relaxed whitespace-pre-wrap font-sans">
              {content}
            </p>
          ) : (
            <p className="text-light-subtext text-sm italic">No data yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;