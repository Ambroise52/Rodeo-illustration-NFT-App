
import React from 'react';
import { Button, Item, ItemContent, ItemTitle, ItemDescription, ItemFooter, ItemMedia, ItemActions, Progress, Spinner } from './UIShared';

interface DownloadProgressProps {
  filename: string;
  progress: number;
  onCancel?: () => void;
  className?: string;
}

export const DownloadProgress: React.FC<DownloadProgressProps> = ({ filename, progress, onCancel, className }) => {
  return (
    <div className={className || "fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-4"}>
      <div className="flex w-full max-w-md flex-col gap-4 [--radius:1rem]">
        <Item variant="outline" className="bg-dark-card border-neon-cyan/30 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
          <ItemMedia variant="icon">
            <Spinner className="text-neon-cyan" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Downloading...</ItemTitle>
            <ItemDescription>{filename}</ItemDescription>
          </ItemContent>
          {onCancel && (
            <ItemActions className="hidden sm:flex">
              <Button variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>
            </ItemActions>
          )}
          <ItemFooter>
            <Progress value={progress} />
          </ItemFooter>
        </Item>
      </div>
    </div>
  );
};
