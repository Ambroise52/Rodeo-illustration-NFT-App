import React, { useState } from 'react';
import { Icons } from './Icons';

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  content?: string;
  children?: React.ReactNode;
  colorClass: string;
  defaultOpen?: boolean;
  className?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  icon, 
  content,
  children,
  colorClass,
  defaultOpen = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`border border-dark-border rounded-xl overflow-hidden bg-dark-card transition-all duration-300 w-full mb-4 ${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-black/20 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`${colorClass} p-2 rounded-lg bg-white/5`}>
            {icon}
          </div>
          <span className="font-bold text-gray-200 tracking-wide">{title}</span>
        </div>
        {isOpen ? <Icons.ChevronUp className="w-5 h-5 text-gray-500" /> : <Icons.ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      
      {isOpen && (
        <div className="p-4 border-t border-dark-border bg-black/40">
          {children ? (
            children
          ) : content ? (
            <div className="relative group">
               <p className="font-mono text-sm text-gray-300 leading-relaxed break-words whitespace-pre-wrap">
                 {content}
               </p>
               <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[10px] bg-dark-border text-gray-400 px-2 py-1 rounded hover:text-white hover:bg-gray-700"
                  >
                    {copied ? (
                      <>
                        <Icons.Sparkles className="w-3 h-3 text-neon-cyan" />
                        <span className="text-neon-cyan">COPIED</span>
                      </>
                    ) : (
                      'COPY'
                    )}
                  </button>
               </div>
            </div>
          ) : (
            <p className="text-gray-600 text-sm italic font-mono">No data generated yet...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;