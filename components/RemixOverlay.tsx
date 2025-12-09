
import React from 'react';
import { Button, Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, Spinner } from './UIShared';

interface RemixOverlayProps {
  onCancel?: () => void;
}

export const RemixOverlay: React.FC<RemixOverlayProps> = ({ onCancel }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
       <div className="w-full max-w-md mx-4 bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden">
        <Empty className="w-full border-none bg-transparent p-6">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Spinner />
            </EmptyMedia>
            <EmptyTitle>Processing your request</EmptyTitle>
            <EmptyDescription>
              Please wait while we process your request. Do not refresh the page.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" size="sm" onClick={onCancel} disabled={!onCancel}>
              Cancel
            </Button>
          </EmptyContent>
        </Empty>
       </div>
    </div>
  );
};
