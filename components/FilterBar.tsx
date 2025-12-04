import React from 'react';
import { Icons } from './Icons';
import { FilterState, SortOption, RarityTier } from '../types';

interface FilterBarProps {
  filterState: FilterState;
  sortOption: SortOption;
  onFilterChange: (newState: Partial<FilterState>) => void;
  onSortChange: (option: SortOption) => void;
  resultCount: number;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  filterState, 
  sortOption, 
  onFilterChange, 
  onSortChange,
  resultCount
}) => {
  return (
    <div className="w-full bg-dark-card border border-dark-border rounded-xl p-4 mb-6 space-y-4">
      
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search characters, actions, themes..."
            value={filterState.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full bg-black/40 border border-dark-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-neon-cyan outline-none transition-colors"
          />
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-dark-border">
          <button
            onClick={() => onFilterChange({ favoritesOnly: false })}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-colors ${!filterState.favoritesOnly ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-400 hover:text-white'}`}
          >
            <Icons.Grid className="w-3 h-3" /> All
          </button>
          <button
            onClick={() => onFilterChange({ favoritesOnly: true })}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-colors ${filterState.favoritesOnly ? 'bg-neon-pink/20 text-neon-pink' : 'text-gray-400 hover:text-white'}`}
          >
            <Icons.Heart className="w-3 h-3" /> Favorites
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-t border-dark-border pt-4">
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500 font-mono uppercase mr-2"><Icons.Filter className="inline w-3 h-3 mb-0.5" /> Rarity:</span>
          
          {(['ALL', 'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => onFilterChange({ rarity: tier })}
              className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                filterState.rarity === tier 
                  ? 'bg-white/10 border-white text-white' 
                  : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-mono uppercase">{resultCount} Results</span>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-black/40 border border-dark-border text-white text-xs rounded px-2 py-1 outline-none focus:border-neon-cyan"
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
            <option value="HIGHEST_ETH">Highest Value</option>
            <option value="LOWEST_ETH">Lowest Value</option>
            <option value="RARITY_DESC">Highest Rarity</option>
          </select>
        </div>
      </div>

    </div>
  );
};

export default FilterBar;
