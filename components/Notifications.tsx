
import React from 'react';
import { Icons } from './Icons';
import { Button, Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from './UIShared';

export const NotificationsPopover: React.FC = () => {
  return (
    <div className="absolute top-12 right-0 w-80 z-50 animate-in fade-in slide-in-from-top-2">
      <div className="bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-dark-border bg-black/20">
          <h3 className="font-bold text-white text-sm">Notifications</h3>
        </div>
        
        <div className="p-4">
          <Empty className="border-none bg-transparent p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Icons.Sparkles className="text-gray-500" />
              </EmptyMedia>
              <EmptyTitle className="text-base">No Notifications</EmptyTitle>
              <EmptyDescription>
                You're all caught up. New alerts for drops and sales will appear here.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm">
                <Icons.RefreshCw className="w-3 h-3 mr-2" />
                Refresh
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      </div>
    </div>
  );
};
