export type RarityTier = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface GeneratedData {
  id: string;
  imagePrompt: string;
  videoPrompt: string;
  ethValue: number;
  timestamp: number;
  imageUrl?: string;
  rarity: RarityTier;
  character: string;
  action: string;
  background: string;
}

export type Category = 'CHARACTERS' | 'ACTIONS' | 'BACKGROUNDS' | 'COLORS' | 'EFFECTS';

export interface PromptOptions {
  CHARACTERS: string[];
  ACTIONS: string[];
  BACKGROUNDS: string[];
  COLORS: string[];
  EFFECTS: string[];
}