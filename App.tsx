import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
      (STYLE_OPTIONS.SHAPE_STYLES.length * STYLE_OPTIONS.COLOR_APPS.length);
    
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
    const shapeStyle = getRandomItem(STYLE_OPTIONS.SHAPE_STYLES);
    const colorApp = getRandomItem(STYLE_OPTIONS.COLOR_APPS);
    const lineWork = getRandomItem(STYLE_OPTIONS.LINE_WORKS);
    const composition = getRandomItem(STYLE_OPTIONS.COMPOSITIONS);
    const charDetail = getRandomItem(STYLE_OPTIONS.CHAR_DETAILS);
    const bgSimplicity = getRandomItem(STYLE_OPTIONS.BG_SIMPLICITIES);
    const quality = getRandomItem(STYLE_OPTIONS.QUALITY_BOOSTERS);
    const strongerSuffix = strongerStyle ? "NO OUTLINES, SHAPES ONLY, PURE VECTOR, SMOOTH GEOMETRY, MINIMALIST, NO BORDERS, " : "";

    const imagePrompt = `${char} ${action}, modern flat illustration, smooth geometric shapes with no outlines, clean vector aesthetic, limited color palette with ${colors}, overlapping layered shapes, minimalist contemporary style, simple clean design, shapes defined by color contrast, set against ${bg}, soft matte finish, professional digital illustration, behance style, ${effectsString}, ${shapeStyle}, ${colorApp}, ${lineWork}, ${composition}, ${charDetail}, ${bgSimplicity}, ${quality}, smooth organic forms, playful composition, no black outlines, no borders, 8K quality. ${strongerSuffix}Exclude: ${NEGATIVE_PROMPT}`;

    const actionDetails = (ANIMATION_MAPPINGS.ACTIONS as any)[action] || { desc: "move dynamically", vibe: "fluid" };
    const bgMotion = (ANIMATION_MAPPINGS.BACKGROUNDS as any)[bg] || "move gently";
    const videoPrompt = `Animate this image into a 5-second seamless perfect loop with no hard cuts. The ${char.toLowerCase()} should ${actionDetails.desc}, creating smooth continuous motion that loops back to the starting position perfectly. The ${bg.toLowerCase()} should ${bgMotion}. Motion should be ${actionDetails.vibe} with smooth ease-in-out timing. Camera stays fixed. Ensure the final frame matches the first frame exactly for perfect looping. Style: modern minimalist animation, smooth vector-like movement, no jump cuts, professional NFT animation quality. Maintain the flat 2D illustration style throughout with no realistic motion blur or 3D effects. Keep the bold geometric shapes and clean vector aesthetic. Animation should be smooth but preserve the graphic design quality.`;

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
    setBatchResults([]); // Clear batch results
    try {
      const data = await createNFTData(forcedTraits, strongerStyle);
      setCurrentView(data);
      setHistory(prev => [data, ...prev]);
      updateStats(data);
      showToast("NFT Generated Successfully! 🎨");
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
    setCurrentView(null); // Clear single view
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
      showToast("Batch Generation Complete! 🚀");
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
      setMilestoneMsg("LEGENDARY DROP! 🌟");
    }
    
    const count = totalGens + 1;
    if (count === 1) setMilestoneMsg("Welcome! Your NFT journey begins!");
    else if (count === 10) setMilestoneMsg("10 Generations! You're a Collector!");
    else if (count === 50) setMilestoneMsg("50 Generations! You're a Curator!");
  };

  const handleRegenerateStronger = () => {
    if (currentView) {
      const traits = {
        char: currentView.character,
        action: currentView.action,
        bg: currentView.background,
        colors: currentView.colorScheme,
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
        if (newState) showToast("Added to Favorites ⭐");
        return { ...item, isFavorite: newState };
      }
      return item;
    }));
    
    // Also update current views if needed
    if (currentView?.id === id) setCurrentView(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    setBatchResults(prev => prev.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
    if (modalItem?.id === id) setModalItem(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
  };

  const deleteItem = (id: string) => {
    setHistory(prev => prev.filter(i => i.id !== id));
    if (currentView?.id === id) setCurrentView(null);
    setBatchResults(prev => prev.filter(i => i.id !== id));
    showToast("Asset Deleted 🗑️");
  };

  const handleExport = async (type: ExportType) => {
    showToast("Preparing Export... 📦");
    try {
      if (type === 'BULK_ALL') {
        await downloadBulk(history, 'all-generations');
      } else if (type === 'BULK_FAVORITES') {
        await downloadBulk(history.filter(i => i.isFavorite), 'favorites');
      } else if (type === 'BULK_SESSION') {
        // Just exporting current history as session for now
        await downloadBulk(history, 'session-export');
      }
      showToast("Export Ready! ✅");
    } catch (e) {
      showToast("Export Failed ❌");
    }
  };

  // --- Filtering & Sorting ---

  const filteredHistory = useMemo(() => {
    let result = [...history];

    // Filter
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

    // Sort
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

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isGenerating || isModalOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key.toLowerCase() === 'g') handleGenerateSingle();
      if (e.key.toLowerCase() === 'b') handleGenerateBatch();
      if (e.key.toLowerCase() === 'f') setFilterState(prev => ({ ...prev, favoritesOnly: !prev.favoritesOnly }));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isGenerating, isModalOpen]);


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
    <div className="min-h-screen flex flex-col bg-dark-bg text-white selection:bg-neon-cyan selection:text-black pb-20 font-sans">
      <Header />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 right-4 z-[150] bg-dark-card border border-neon-cyan/50 text-white px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.2)] animate-in slide-in-from-right fade-in duration-300 flex items-center gap-2">
          <Icons.Sparkles className="w-4 h-4 text-neon-cyan" />
          <span className="font-bold tracking-wide text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Details Modal */}
      <DetailsModal 
        item={modalItem} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onNext={() => navigateModal('next')}
        onPrev={() => navigateModal('prev')}
        onToggleFavorite={toggleFavorite}
        onDelete={deleteItem}
        onDownloadPackage={downloadPackage}
      />

      <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">
        
        {/* Top Stats */}
        <StatsBar 
          totalCount={totalGens} 
          sessionValue={sessionValue} 
          legendaryCount={legendaryCount}
          bestDrop={bestDrop}
        />

        {/* Milestone Banner */}
        {milestoneMsg && (
          <div className="w-full mb-6 p-4 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border-y border-white/10 text-center animate-pulse">
            <span className="text-xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-pink">
              {milestoneMsg}
            </span>
          </div>
        )}

        {/* MAIN GENERATION AREA */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Left: Generation Controls & Preview */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="sticky top-24">
               {/* Generation Buttons */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => handleGenerateSingle()}
                  disabled={isGenerating}
                  className="flex-1 py-4 bg-neon-cyan text-black font-black text-lg tracking-wider hover:bg-white hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                   {isGenerating && generationMode === 'SINGLE' ? 'SYNTHESIZING...' : 'GENERATE NFT'}
                </button>
                <button
                  onClick={() => handleGenerateBatch()}
                  disabled={isGenerating}
                  className="px-4 bg-dark-card border border-dark-border text-white hover:border-neon-pink hover:text-neon-pink transition-all rounded-lg disabled:opacity-50"
                  title="Generate 3 Variations"
                >
                  <Icons.Layers className={`w-6 h-6 ${isGenerating && generationMode === 'BATCH' ? 'animate-bounce' : ''}`} />
                </button>
              </div>

              {/* Progress for Batch */}
              {isGenerating && generationMode === 'BATCH' && (
                <div className="w-full bg-dark-card rounded-full h-2 mb-4 overflow-hidden border border-dark-border">
                  <div 
                    className="h-full bg-neon-pink transition-all duration-300" 
                    style={{ width: `${(batchProgress / 3) * 100}%` }}
                  ></div>
                </div>
              )}

              {/* Main Preview (Only shows single generation results or empty state) */}
              {!batchResults.length || currentView ? (
                <PreviewArea 
                  isGenerating={isGenerating && generationMode === 'SINGLE'} 
                  hasGenerated={!!currentView} 
                  imageUrl={currentView?.imageUrl}
                  onRegenerateStronger={currentView && !isGenerating ? handleRegenerateStronger : undefined}
                  isFavorite={currentView?.isFavorite}
                  onToggleFavorite={currentView ? () => toggleFavorite(currentView.id) : undefined}
                />
              ) : null}

              <div className="text-center mt-2">
                 <span className="text-[10px] font-mono text-neon-cyan/50 tracking-widest uppercase">
                    Total Possible Combinations: {totalCombinations}
                 </span>
              </div>
            </div>
          </div>

          {/* Right: Results / Batch Grid / Prompts */}
          <div className="lg:col-span-7 flex flex-col gap-6">
             
             {/* Batch Results View */}
             {batchResults.length > 0 && !isGenerating && (
               <BatchResult 
                 results={batchResults} 
                 onSelect={openModal}
                 onToggleFavorite={toggleFavorite}
                 onDownload={downloadPackage}
               />
             )}

             {/* Prompts Section (Visible if Single Item Selected) */}
             {currentView && (
               <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <DropInfo ethValue={currentView.ethValue} rarity={currentView.rarity} animate={!batchResults.length} />
                  
                  <CollapsibleSection
                    title="Meta AI Video Prompt"
                    icon={<Icons.Video className="w-5 h-5 text-neon-purple" />}
                    colorClass="text-neon-purple"
                    defaultOpen={true}
                    className="border-neon-purple/50 shadow-[0_0_15px_rgba(189,0,255,0.15)]"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="p-4 bg-black/40 rounded-lg border border-neon-purple/20">
                        <p className="font-mono text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{currentView.videoPrompt}</p>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(currentView.videoPrompt);
                          setVideoPromptCopied(true);
                          setTimeout(() => setVideoPromptCopied(false), 2000);
                        }}
                        className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${videoPromptCopied ? 'bg-green-500 text-black' : 'bg-neon-purple text-white hover:bg-purple-600'}`}
                      >
                        {videoPromptCopied ? 'COPIED!' : 'COPY VIDEO PROMPT'}
                      </button>
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection
                    title="Image Prompt"
                    icon={<Icons.Image className="w-5 h-5 text-neon-pink" />}
                    content={currentView.imagePrompt}
                    colorClass="text-neon-pink"
                  />
               </div>
             )}
          </div>
        </div>

        {/* GALLERY & FILTERS */}
        <div className="w-full border-t border-dark-border pt-8 mt-8">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-2xl font-black tracking-tight">COLLECTION</h2>
             
             {/* Bulk Export Menu */}
             <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border rounded-lg hover:border-white transition-colors text-xs font-bold uppercase tracking-wider">
                  <Icons.Package className="w-4 h-4" /> Export Options
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50">
                  <button onClick={() => handleExport('BULK_ALL')} className="w-full text-left px-4 py-2 hover:bg-white/5 text-sm">Export All</button>
                  <button onClick={() => handleExport('BULK_FAVORITES')} className="w-full text-left px-4 py-2 hover:bg-white/5 text-sm text-neon-pink">Export Favorites</button>
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
             title={filterState.favoritesOnly ? "Favorite Collection" : "All Generations"} 
           />
        </div>

      </main>

      <footer className="py-6 text-center text-gray-600 text-[10px] font-mono border-t border-dark-border mt-12">
        <div className="flex justify-center gap-4 mb-2">
           <span>G = Generate</span>
           <span>B = Batch</span>
           <span>F = Favorites</span>
        </div>
        <p>INFINITE NFT CREATOR PRO v3.0 • SYSTEM ACTIVE</p>
      </footer>
    </div>
  );
}

export default App;
