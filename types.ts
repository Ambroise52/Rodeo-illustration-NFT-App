
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
  colorScheme?: string;
  effects?: string[];
  isFavorite?: boolean;
  collectionId?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  createdAt: number;
  previewImages?: string[]; // For UI display
  tags: string[]; // Keywords for AI context
}

export interface UserProfile {
  id: string;
  username: string;
  totalGenerations: number;
  totalValue: number;
  legendaryCount: number;
  createdAt: number;
  avatarUrl?: string;
  bio?: string;
}

export type Category = 'CHARACTERS' | 'ACTIONS' | 'BACKGROUNDS' | 'COLORS' | 'EFFECTS';

export interface PromptOptions {
  CHARACTERS: string[];
  ACTIONS: string[];
  BACKGROUNDS: string[];
  COLORS: string[];
  EFFECTS: string[];
}

export type SortOption = 'NEWEST' | 'OLDEST' | 'HIGHEST_ETH' | 'LOWEST_ETH' | 'RARITY_DESC';

export interface FilterState {
  search: string;
  rarity: RarityTier | 'ALL';
  favoritesOnly: boolean;
  minEth?: number;
  maxEth?: number;
}

export type ExportType = 'SINGLE_IMAGE' | 'SINGLE_PROMPT' | 'SINGLE_VIDEO' | 'SINGLE_PACKAGE' | 'BULK_ALL' | 'BULK_FAVORITES' | 'BULK_RARITY' | 'BULK_SESSION';