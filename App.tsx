import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import PreviewArea from './components/PreviewArea';
import StatsBar from './components/StatsBar';
import CollapsibleSection from './components/CollapsibleSection';
import DropInfo from './components/DropInfo';
import Gallery from './components/Gallery';
import FilterBar from './components/FilterBar';
import DetailsModal from './components/DetailsModal';
import BatchResult from './components/BatchResult';
import { Icons } from './components/Icons';
import { PROMPT_OPTIONS, APP_CONFIG, ANIMATION_MAPPINGS, RARITY_CONFIG, STYLE_OPTIONS, NEGATIVE_PROMPT } from './constants';
import { GeneratedData, RarityTier, FilterState, SortOption, ExportType } from './types';
import { generateImage } from './services/geminiService';
import { downloadBulk, downloadPackage } from './utils/exportUtils';

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMode, setGenerationMode] = useState<'SINGLE' | 'BATCH'>('SINGLE');
  const [batchProgress, setBatchProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Data State
  const [currentView, setCurrentView] = useState<GeneratedData | null>(null);
  const [batchResults, setBatchResults] = useState<GeneratedData[]>([]);
  const [history, setHistory] = useState<GeneratedData[]>([]);
  
  // Filter/UI State
  const [filterState, setFilterState] = useState<FilterState>({ search: '', rarity: 'ALL', favoritesOnly: false });
  const [sortOption, setSortOption] = useState<SortOption>('NEWEST');
  const [modalItem, setModalItem] = useState<GeneratedData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stats State
  const [totalGens, setTotalGens] = useState(0);
  const [sessionValue, setSessionValue] = useState(0);
  const [legendaryCount, setLegendaryCount] = useState(0);
  const [bestDrop, setBestDrop] = useState(0);
  
  const [videoPromptCopied, setVideoPromptCopied] = useState(false);
  const [milestoneMsg, setMilestoneMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // --- Theme Logic ---
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // --- Helpers ---
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const totalCombinations = useMemo(() => {
    const combos = 
      PROMPT_OPTIONS.CHARACTERS.length * 
      PROMPT_OPTIONS.ACTIONS.length * 
      PROMPT_OPTIONS.BACKGROUNDS.length * 
      PROMPT_OPTIONS.COLORS.length * 
      (PROMPT_OPTIONS.EFFECTS.length * (PROMPT_OPTIONS.EFFECTS.length - 1)) *
      STYLE_OPTIONS.ILLUSTRATION_STYLES.length;
    
    if (combos > 1000000) return `${(combos / 1000000).toFixed(0)} Million+`;
    return combos.toLocaleString();
  }, []);

  const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const determineRarity = (genCount: number): RarityTier => {
    if ((genCount + 1) % 100 === 0) return 'LEGENDARY';
    const rand = Math.random();
    if (rand < RARITY_CONFIG.LEGENDARY.chance) return 'LEGENDARY';
    if (rand < RARITY_CONFIG.LEGENDARY.chance + RARITY_CONFIG.EPIC.chance) return 'EPIC';
    if (rand < RARITY_CONFIG.LEGENDARY.chance + RARITY_CONFIG.EPIC.chance + RARITY_CONFIG.RARE.chance) return 'RARE';
    if (rand < RARITY_CONFIG.LEGENDARY.chance + RARITY_CONFIG.EPIC.chance + RARITY_CONFIG.RARE.chance + RARITY_CONFIG.UNCOMMON.chance) return 'UNCOMMON';
    return 'COMMON';
  };

  // --- Generation Logic ---
  const createNFTData = async (forcedTraits?: any, strongerStyle: boolean = false): Promise<GeneratedData> => {
    const rarity = determineRarity(totalGens + (generationMode === 'BATCH' ? Math.floor(Math.random() * 10) : 0));
    const rarityConfig = RARITY_CONFIG[rarity];

    const char = forcedTraits?.char || getRandomItem(PROMPT_OPTIONS.CHARACTERS);
    const action = forcedTraits?.action || getRandomItem(PROMPT_OPTIONS.ACTIONS);
    const bg = forcedTraits?.bg || getRandomItem(PROMPT_OPTIONS.BACKGROUNDS);
    const colors = forcedTraits?.colors || getRandomItem(PROMPT_OPTIONS.COLORS);
    
    let selectedEffects: string[] = [];
    if (forcedTraits?.effects) {
      selectedEffects = forcedTraits.effects;
    } else {
      const numEffects = rarityConfig.effectsCount[Math.floor(Math.random() * rarityConfig.effectsCount.length)];
      const shuffledEffects = [...PROMPT_OPTIONS.EFFECTS].sort(() => 0.5 - Math.random());
      selectedEffects = shuffledEffects.slice(0, Math.max(1, numEffects));
    }

    const effectsString = selectedEffects.join(", ");
    
    // Contemporary Illustration Style Variables
    const personality = getRandomItem(STYLE_OPTIONS.CHARACTER_PERSONALITIES);
    const actionVibe = getRandomItem(STYLE_OPTIONS.ACTION_VIBES);
    const illustrationStyle = getRandomItem(STYLE_OPTIONS.ILLUSTRATION_STYLES);
    const lineWork = getRandomItem(STYLE_OPTIONS.LINE_WORKS);
    const colorApp = getRandomItem(STYLE_OPTIONS.COLOR_APPS);
    const composition = getRandomItem(STYLE_OPTIONS.COMPOSITIONS);
    const quality = getRandomItem(STYLE_OPTIONS.QUALITY_BOOSTERS);
    
    const strongerSuffix = strongerStyle ? "HIGHLY EXPRESSIVE, DYNAMIC ENERGY, BOLD COLORS, AWARD WINNING QUALITY, " : "";

    const imagePrompt = `${char} ${personality} ${action} ${actionVibe}, ${illustrationStyle}, ${lineWork}, ${colorApp} with ${colors}, ${bg}, contemporary digital art, stylized character design, ${composition}, ${effectsString}, ${quality}, playful energetic mood, trending illustration style, professional character art, expressive pose, 2024 digital illustration aesthetic, high quality character illustration. ${strongerSuffix}Exclude: ${NEGATIVE_PROMPT}`;

    const actionDetails = (ANIMATION_MAPPINGS.ACTIONS as any)[action] || { desc: "move dynamically", vibe: "fluid" };
    const bgMotion = (ANIMATION_MAPPINGS.BACKGROUNDS as any)[bg] || "move gently";
    const videoPrompt = `Animate this image into a 5-second seamless perfect loop with no hard cuts. The ${char.toLowerCase()} should ${actionDetails.desc}, creating smooth continuous motion that loops back to the starting position perfectly. The ${bg.toLowerCase()} should ${bgMotion}. Motion should be ${actionDetails.vibe} with smooth ease-in-out timing. Camera stays fixed. Ensure the final frame matches the first frame exactly for perfect looping. Style: modern minimalist animation, smooth vector-like movement, no jump cuts, professional NFT animation quality. Maintain the hand-drawn digital illustration style throughout with expressive movement. Keep the bold linework and vibrant colors. Animation should be fluid and preserve the artistic quality.`;

    const ethValue = Math.random() * (rarityConfig.maxEth - rarityConfig.minEth) + rarityConfig.minEth;
    const imageUrl = await generateImage(imagePrompt);

    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      imagePrompt,
      videoPrompt,
      ethValue,
      timestamp: Date.now(),
      imageUrl,
      rarity,
      character: char,
      action,
      background: bg,
      colorScheme: colors,
      effects: selectedEffects,
      isFavorite: false
    };
  };

  const handleGenerateSingle = async (forcedTraits?: any, strongerStyle: boolean = false) => {
    setIsGenerating(true);
    setGenerationMode('SINGLE');
    setError(null);
    setBatchResults([]); 
    try {
      const data = await createNFTData(forcedTraits, strongerStyle);
      setCurrentView(data);
      setHistory(prev => [data, ...prev]);
      updateStats(data);
      showToast(strongerStyle ? "Style Enhanced" : "Asset Created");
    } catch (e) {
      console.error(e);
      setError("Generation failed. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBatch = async () => {
    setIsGenerating(true);
    setGenerationMode('BATCH');
    setBatchProgress(0);
    setError(null);
    setCurrentView(null);
    const newBatch: GeneratedData[] = [];

    try {
      for (let i = 0; i < 3; i++) {
        const data = await createNFTData();
        newBatch.push(data);
        setBatchProgress(i + 1);
        updateStats(data);
      }
      setBatchResults(newBatch);
      setHistory(prev => [...newBatch, ...prev]);
      showToast("Batch Complete");
    } catch (e) {
      console.error(e);
      setError("Batch generation failed partially.");
    } finally {
      setIsGenerating(false);
      setBatchProgress(0);
    }
  };

  const updateStats = (data: GeneratedData) => {
    setTotalGens(prev => prev + 1);
    setSessionValue(prev => prev + data.ethValue);
    setBestDrop(prev => Math.max(prev, data.ethValue));
    
    if (data.rarity === 'LEGENDARY') {
      setLegendaryCount(prev => prev + 1);
      setMilestoneMsg("Legendary Drop Acquired");
    }
  };

  const handleRegenerateStronger = (item?: GeneratedData) => {
    const target = item || currentView;
    if (target) {
      const traits = {
        char: target.character,
        action: target.action,
        bg: target.background,
        colors: target.colorScheme,
        effects: []
      };
      handleGenerateSingle(traits, true);
    }
  };

  // --- Interaction Logic ---
  const toggleFavorite = (id: string) => {
    setHistory(prev => prev.map(item => {
      if (item.id === id) {
        const newState = !item.isFavorite;
        if (newState) showToast("Saved to Favorites");
        return { ...item, isFavorite: newState };
      }
      return item;
    }));
    if (currentView?.id === id) setCurrentView(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    setBatchResults(prev => prev.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
    if (modalItem?.id === id) setModalItem(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
  };

  const deleteItem = (id: string) => {
    setHistory(prev => prev.filter(i => i.id !== id));
    if (currentView?.id === id) setCurrentView(null);
    setBatchResults(prev => prev.filter(i => i.id !== id));
    showToast("Asset Deleted");
  };

  const handleExport = async (type: ExportType) => {
    showToast("Preparing Download...");
    try {
      if (type === 'BULK_ALL') {
        await downloadBulk(history, 'all-generations');
      } else if (type === 'BULK_FAVORITES') {
        await downloadBulk(history.filter(i => i.isFavorite), 'favorites');
      }
      showToast("Download Ready");
    } catch (e) {
      showToast("Export Failed");
    }
  };

  // --- Filtering & Sorting ---
  const filteredHistory = useMemo(() => {
    let result = [...history];
    if (filterState.favoritesOnly) result = result.filter(i => i.isFavorite);
    if (filterState.rarity !== 'ALL') result = result.filter(i => i.rarity === filterState.rarity);
    if (filterState.search) {
      const q = filterState.search.toLowerCase();
      result = result.filter(i => 
        i.character.toLowerCase().includes(q) || 
        i.action.toLowerCase().includes(q) || 
        i.background.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      if (sortOption === 'NEWEST') return b.timestamp - a.timestamp;
      if (sortOption === 'OLDEST') return a.timestamp - b.timestamp;
      if (sortOption === 'HIGHEST_ETH') return b.ethValue - a.ethValue;
      if (sortOption === 'LOWEST_ETH') return a.ethValue - b.ethValue;
      if (sortOption === 'RARITY_DESC') {
        const tiers = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];
        return tiers.indexOf(b.rarity) - tiers.indexOf(a.rarity);
      }
      return 0;
    });
    return result;
  }, [history, filterState, sortOption]);

  const openModal = (item: GeneratedData) => {
    setModalItem(item);
    setIsModalOpen(true);
  };

  const navigateModal = (direction: 'next' | 'prev') => {
    if (!modalItem) return;
    const idx = filteredHistory.findIndex(i => i.id === modalItem.id);
    if (idx === -1) return;
    
    let newIdx = direction === 'next' ? idx + 1 : idx - 1;
    if (newIdx >= 0 && newIdx < filteredHistory.length) {
      setModalItem(filteredHistory[newIdx]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-24 pb-12 transition-colors duration-500 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text font-sans antialiased selection:bg-light-accent selection:text-white">
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 right-1/2 translate-x-1/2 md:translate-x-0 md:right-8 z-[150] bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-md border border-light-border dark:border-dark-border text-light-text dark:text-dark-text px-6 py-3 rounded-full shadow-apple-hover animate-slide-up flex items-center gap-3">
          <Icons.Sparkles className="w-4 h-4 text-light-accent dark:text-dark-accent" />
          <span className="font-medium text-sm">{toastMsg}</span>
        </div>
      )}

      <DetailsModal 
        item={modalItem} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onNext={() => navigateModal('next')}
        onPrev={() => navigateModal('prev')}
        onToggleFavorite={toggleFavorite}
        onDelete={deleteItem}
        onDownloadPackage={downloadPackage}
        onRegenerateStronger={handleRegenerateStronger}
      />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6">
        
        {/* Intro */}
        <div className="text-center mb-10 space-y-2 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-light-text dark:text-dark-text">
            Studio
          </h2>
          <p className="text-light-subtext dark:text-dark-subtext font-medium text-lg">
            Create limitless 3D assets & animations with Gemini 2.5
          </p>
        </div>

        {/* Top Stats */}
        <StatsBar 
          totalCount={totalGens} 
          sessionValue={sessionValue} 
          legendaryCount={legendaryCount}
          bestDrop={bestDrop}
        />

        {/* Milestone Banner */}
        {milestoneMsg && (
          <div className="w-full max-w-2xl mx-auto mb-8 p-4 bg-light-accent/10 dark:bg-dark-accent/10 border border-light-accent/20 dark:border-dark-accent/20 rounded-xl text-center backdrop-blur-md">
            <span className="text-light-accent dark:text-dark-accent font-semibold tracking-wide">
              {milestoneMsg}
            </span>
          </div>
        )}

        {/* MAIN WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Controls & Preview (Left) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="sticky top-32">
              
              {/* Preview Container */}
              {!batchResults.length || currentView ? (
                <PreviewArea 
                  isGenerating={isGenerating && generationMode === 'SINGLE'} 
                  hasGenerated={!!currentView} 
                  imageUrl={currentView?.imageUrl}
                  onRegenerateStronger={() => handleRegenerateStronger(currentView || undefined)}
                  isFavorite={currentView?.isFavorite}
                  onToggleFavorite={currentView ? () => toggleFavorite(currentView.id) : undefined}
                />
              ) : null}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleGenerateSingle()}
                  disabled={isGenerating}
                  className="flex-1 h-14 bg-light-text dark:bg-white text-white dark:text-black font-semibold rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                >
                   {isGenerating && generationMode === 'SINGLE' ? (
                     <Icons.RefreshCw className="w-5 h-5 animate-spin" />
                   ) : 'Generate Asset'}
                </button>
                <button
                  onClick={() => handleGenerateBatch()}
                  disabled={isGenerating}
                  className="w-14 h-14 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-white/5 rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 shadow-apple"
                  title="Generate 3 Variations"
                >
                  <Icons.Layers className={`w-6 h-6 ${isGenerating && generationMode === 'BATCH' ? 'animate-bounce' : ''}`} />
                </button>
              </div>

              {/* Progress Bar */}
              {isGenerating && generationMode === 'BATCH' && (
                <div className="mt-4 w-full bg-light-border dark:bg-dark-border rounded-full h-1 overflow-hidden">
                  <div 
                    className="h-full bg-light-accent dark:bg-dark-accent transition-all duration-300" 
                    style={{ width: `${(batchProgress / 3) * 100}%` }}
                  ></div>
                </div>
              )}

              <p className="text-center mt-6 text-xs text-light-subtext dark:text-dark-subtext font-medium">
                 {totalCombinations} combinations available
              </p>
            </div>
          </div>

          {/* Details / Batch / Prompts (Right) */}
          <div className="lg:col-span-7 flex flex-col gap-6 pt-2">
             
             {/* Batch Results View */}
             {batchResults.length > 0 && !isGenerating && (
               <BatchResult 
                 results={batchResults} 
                 onSelect={openModal}
                 onToggleFavorite={toggleFavorite}
                 onDownload={downloadPackage}
               />
             )}

             {/* Prompts Section */}
             {currentView && (
               <div className="space-y-6 animate-slide-up">
                  <DropInfo ethValue={currentView.ethValue} rarity={currentView.rarity} animate={!batchResults.length} />
                  
                  <div className="space-y-4">
                    <CollapsibleSection
                      title="Video Animation Prompt"
                      icon={<Icons.Video className="w-5 h-5" />}
                      colorClass="text-light-accent dark:text-dark-accent"
                      defaultOpen={true}
                    >
                      <div className="space-y-4">
                        <p className="text-sm text-light-text dark:text-dark-text leading-relaxed opacity-80">{currentView.videoPrompt}</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(currentView.videoPrompt);
                            setVideoPromptCopied(true);
                            setTimeout(() => setVideoPromptCopied(false), 2000);
                          }}
                          className={`w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                            videoPromptCopied 
                              ? 'bg-success text-white' 
                              : 'bg-light-bg dark:bg-white/5 text-light-text dark:text-white hover:bg-light-border dark:hover:bg-white/10'
                          }`}
                        >
                          {videoPromptCopied ? 'Copied' : 'Copy Prompt'}
                        </button>
                      </div>
                    </CollapsibleSection>

                    <CollapsibleSection
                      title="Image Generation Prompt"
                      icon={<Icons.Image className="w-5 h-5" />}
                      content={currentView.imagePrompt}
                      colorClass="text-light-subtext dark:text-dark-subtext"
                    />
                  </div>
               </div>
             )}
          </div>
        </div>

        {/* COLLECTION GALLERY */}
        <div className="w-full border-t border-light-border dark:border-dark-border pt-12">
           <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Library</h2>
             
             {/* Simple Export Dropdown */}
             <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg text-sm font-medium hover:bg-light-bg dark:hover:bg-white/5 transition-colors">
                  <Icons.Package className="w-4 h-4" /> Export
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                  <button onClick={() => handleExport('BULK_ALL')} className="w-full text-left px-4 py-3 hover:bg-light-bg dark:hover:bg-white/5 text-sm">Export All</button>
                  <button onClick={() => handleExport('BULK_FAVORITES')} className="w-full text-left px-4 py-3 hover:bg-light-bg dark:hover:bg-white/5 text-sm text-red-500">Export Favorites</button>
                </div>
             </div>
           </div>

           <FilterBar 
             filterState={filterState} 
             sortOption={sortOption}
             onFilterChange={(newState) => setFilterState(prev => ({ ...prev, ...newState }))}
             onSortChange={setSortOption}
             resultCount={filteredHistory.length}
           />

           <Gallery 
             history={filteredHistory} 
             onSelect={openModal} 
             selectedId={currentView?.id}
             title={filterState.favoritesOnly ? "Favorites" : "All Assets"} 
           />
        </div>

      </main>

      <footer className="py-12 text-center mt-20 border-t border-light-border dark:border-dark-border">
        <p className="text-light-subtext dark:text-dark-subtext text-xs font-medium">
          Infinite Creator Pro © 2024
        </p>
      </footer>
    </div>
  );
}

export default App;