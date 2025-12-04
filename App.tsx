import React, { useState, useCallback, useMemo } from 'react';
import Header from './components/Header';
import PreviewArea from './components/PreviewArea';
import StatsBar from './components/StatsBar';
import CollapsibleSection from './components/CollapsibleSection';
import DropInfo from './components/DropInfo';
import Gallery from './components/Gallery';
import { Icons } from './components/Icons';
import { PROMPT_OPTIONS, APP_CONFIG, ANIMATION_MAPPINGS, RARITY_CONFIG, STYLE_OPTIONS, NEGATIVE_PROMPT } from './constants';
import { GeneratedData, RarityTier } from './types';
import { generateImage } from './services/geminiService';

function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Current View State
  const [currentView, setCurrentView] = useState<GeneratedData | null>(null);
  
  // History State
  const [history, setHistory] = useState<GeneratedData[]>([]);
  
  // Stats State
  const [totalGens, setTotalGens] = useState(0);
  const [sessionValue, setSessionValue] = useState(0);
  const [legendaryCount, setLegendaryCount] = useState(0);
  const [bestDrop, setBestDrop] = useState(0);
  
  const [videoPromptCopied, setVideoPromptCopied] = useState(false);
  const [milestoneMsg, setMilestoneMsg] = useState<string | null>(null);

  // Calculate total combinations
  const totalCombinations = useMemo(() => {
    const combos = 
      PROMPT_OPTIONS.CHARACTERS.length * 
      PROMPT_OPTIONS.ACTIONS.length * 
      PROMPT_OPTIONS.BACKGROUNDS.length * 
      PROMPT_OPTIONS.COLORS.length * 
      (PROMPT_OPTIONS.EFFECTS.length * (PROMPT_OPTIONS.EFFECTS.length - 1)) *
      (STYLE_OPTIONS.SHAPE_STYLES.length * STYLE_OPTIONS.COLOR_APPS.length);
    
    if (combos > 1000000) {
      return `${(combos / 1000000).toFixed(0)} Million+`;
    }
    return combos.toLocaleString();
  }, []);

  const determineRarity = (genCount: number): RarityTier => {
    // Easter Egg: Every 100th generation is Legendary
    if ((genCount + 1) % 100 === 0) return 'LEGENDARY';

    const rand = Math.random();
    if (rand < RARITY_CONFIG.LEGENDARY.chance) return 'LEGENDARY';
    if (rand < RARITY_CONFIG.LEGENDARY.chance + RARITY_CONFIG.EPIC.chance) return 'EPIC';
    if (rand < RARITY_CONFIG.LEGENDARY.chance + RARITY_CONFIG.EPIC.chance + RARITY_CONFIG.RARE.chance) return 'RARE';
    if (rand < RARITY_CONFIG.LEGENDARY.chance + RARITY_CONFIG.EPIC.chance + RARITY_CONFIG.RARE.chance + RARITY_CONFIG.UNCOMMON.chance) return 'UNCOMMON';
    return 'COMMON';
  };

  const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const generateNFT = useCallback(async (forcedTraits?: {char: string, action: string, bg: string, colors: string, effects: string[]}, strongerStyle: boolean = false) => {
    setIsGenerating(true);
    setError(null);
    setVideoPromptCopied(false);
    setMilestoneMsg(null);

    try {
      // 1. Determine Rarity (if reusing traits, keep rarity roughly same or recalculate? Let's recalculate for new drop fun)
      const rarity = determineRarity(totalGens);
      const rarityConfig = RARITY_CONFIG[rarity];

      // 2. Random Traits (or reuse)
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

      // 3. Construct Enhanced Image Prompt
      const effectsString = selectedEffects.join(", ");
      
      // Select Style options
      const shapeStyle = getRandomItem(STYLE_OPTIONS.SHAPE_STYLES);
      const colorApp = getRandomItem(STYLE_OPTIONS.COLOR_APPS);
      const lineWork = getRandomItem(STYLE_OPTIONS.LINE_WORKS);
      const composition = getRandomItem(STYLE_OPTIONS.COMPOSITIONS);
      const charDetail = getRandomItem(STYLE_OPTIONS.CHAR_DETAILS);
      const bgSimplicity = getRandomItem(STYLE_OPTIONS.BG_SIMPLICITIES);
      const quality = getRandomItem(STYLE_OPTIONS.QUALITY_BOOSTERS);

      const strongerSuffix = strongerStyle ? "NO OUTLINES, SHAPES ONLY, PURE VECTOR, SMOOTH GEOMETRY, MINIMALIST, NO BORDERS, " : "";

      const imagePrompt = `${char} ${action}, modern flat illustration, smooth geometric shapes with no outlines, clean vector aesthetic, limited color palette with ${colors}, overlapping layered shapes, minimalist contemporary style, simple clean design, shapes defined by color contrast, set against ${bg}, soft matte finish, professional digital illustration, behance style, ${effectsString}, ${shapeStyle}, ${colorApp}, ${lineWork}, ${composition}, ${charDetail}, ${bgSimplicity}, ${quality}, smooth organic forms, playful composition, no black outlines, no borders, 8K quality. ${strongerSuffix}Exclude: ${NEGATIVE_PROMPT}`;

      // 4. Construct Video Prompt
      const actionDetails = (ANIMATION_MAPPINGS.ACTIONS as any)[action] || { desc: "move dynamically", vibe: "fluid" };
      const bgMotion = (ANIMATION_MAPPINGS.BACKGROUNDS as any)[bg] || "move gently";
      
      const videoPrompt = `Animate this image into a 5-second seamless perfect loop with no hard cuts. The ${char.toLowerCase()} should ${actionDetails.desc}, creating smooth continuous motion that loops back to the starting position perfectly. The ${bg.toLowerCase()} should ${bgMotion}. Motion should be ${actionDetails.vibe} with smooth ease-in-out timing. Camera stays fixed. Ensure the final frame matches the first frame exactly for perfect looping. Style: modern minimalist animation, smooth vector-like movement, no jump cuts, professional NFT animation quality. Maintain the flat 2D illustration style throughout with no realistic motion blur or 3D effects. Keep the bold geometric shapes and clean vector aesthetic. Animation should be smooth but preserve the graphic design quality.`;

      // 5. Calculate ETH Value
      const ethValue = Math.random() * (rarityConfig.maxEth - rarityConfig.minEth) + rarityConfig.minEth;

      // 6. Generate Image
      const imageUrl = await generateImage(imagePrompt);

      // 7. Create Data Object
      const newData: GeneratedData = {
        id: Date.now().toString(),
        imagePrompt,
        videoPrompt,
        ethValue,
        timestamp: Date.now(),
        imageUrl,
        rarity,
        character: char,
        action,
        background: bg
      };

      // 8. Update State & History
      setCurrentView(newData);
      setHistory(prev => [newData, ...prev].slice(0, 10)); // Keep last 10
      
      // 9. Update Stats
      setTotalGens(prev => prev + 1);
      setSessionValue(prev => prev + ethValue);
      if (rarity === 'LEGENDARY') setLegendaryCount(prev => prev + 1);
      setBestDrop(prev => Math.max(prev, ethValue));

      // 10. Check Milestones
      const newCount = totalGens + 1;
      if (newCount === 1) setMilestoneMsg("Welcome! Your NFT journey begins!");
      else if (newCount === 10) setMilestoneMsg("10 Generations! You're a Collector!");
      else if (newCount === 50) setMilestoneMsg("50 Generations! You're a Curator!");
      else if (rarity === 'LEGENDARY') setMilestoneMsg("LEGENDARY DROP! 🌟");

    } catch (err: any) {
      console.error("Generation error:", err);
      setError("Failed to generate NFT. Please try again. System overload.");
    } finally {
      setIsGenerating(false);
    }
  }, [totalGens]);

  const handleRegenerateStronger = () => {
    if (currentView) {
      // Reuse current traits but force stronger style
      // We need to re-extract traits, or just use what we stored in currentView
      // Note: currentView doesn't store effects array, so we'll pick new effects or let it random. 
      // Simpler to let effects re-roll or we can try to parse. Let's let effects re-roll but keep main identity.
      const traits = {
        char: currentView.character,
        action: currentView.action,
        bg: currentView.background,
        colors: PROMPT_OPTIONS.COLORS.find(c => currentView.imagePrompt.includes(c)) || getRandomItem(PROMPT_OPTIONS.COLORS), // Try to find or random
        effects: [] // Let it pick new effects or none
      };
      generateNFT(traits, true);
    }
  };

  const copyVideoPrompt = () => {
    if (currentView?.videoPrompt) {
      navigator.clipboard.writeText(currentView.videoPrompt);
      setVideoPromptCopied(true);
      setTimeout(() => setVideoPromptCopied(false), 2000);
    }
  };

  const selectFromHistory = (item: GeneratedData) => {
    setCurrentView(item);
    setMilestoneMsg(null); // Clear any old milestone messages when switching views
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-white selection:bg-neon-cyan selection:text-black pb-20">
      <Header />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
        
        {/* Milestone Banner */}
        {milestoneMsg && (
          <div className="w-full mb-6 p-4 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border-y border-white/10 text-center animate-pulse">
            <span className="text-xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-pink">
              {milestoneMsg}
            </span>
          </div>
        )}

        {/* Preview Section */}
        <div className="w-full mb-4">
          <PreviewArea 
            isGenerating={isGenerating} 
            hasGenerated={!!currentView} 
            imageUrl={currentView?.imageUrl}
            onRegenerateStronger={currentView && !isGenerating ? handleRegenerateStronger : undefined}
          />
          {error && (
             <div className="mt-4 p-3 bg-red-900/30 border border-red-500 rounded text-red-200 text-sm font-mono text-center">
              {error}
            </div>
          )}
        </div>

        {/* Current Drop Info */}
        {currentView && !isGenerating && (
          <DropInfo 
            ethValue={currentView.ethValue} 
            rarity={currentView.rarity} 
            animate={true} 
          />
        )}

        {/* Action Button */}
        <button
          onClick={() => generateNFT()}
          disabled={isGenerating}
          className={`
            group relative w-full max-w-md mx-auto py-5 px-8 mb-6
            bg-neon-cyan text-black font-black text-xl tracking-wider uppercase
            clip-path-slant transition-all duration-200
            hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] hover:-translate-y-1
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
            before:absolute before:inset-0 before:bg-white/20 before:translate-x-full hover:before:-translate-x-full before:transition-transform before:duration-500 before:skew-x-12 overflow-hidden
          `}
          style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 85%, 95% 100%, 0 100%, 0 15%)' }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isGenerating ? 'Synthesizing...' : 'Generate NFT'}
            {!isGenerating && <Icons.Zap className="w-6 h-6" />}
          </span>
        </button>

        <div className="text-center mb-8">
           <span className="text-xs font-mono text-neon-cyan/70 tracking-widest uppercase border border-neon-cyan/20 px-3 py-1 rounded-full bg-neon-cyan/5">
              Possible Combinations: {totalCombinations}
           </span>
        </div>

        {/* Session Statistics */}
        <StatsBar 
          totalCount={totalGens} 
          sessionValue={sessionValue} 
          legendaryCount={legendaryCount}
          bestDrop={bestDrop}
        />

        {/* Results Section */}
        <div className="w-full max-w-2xl space-y-4">
          
          <CollapsibleSection
            title="Image Prompt Used"
            icon={<Icons.Image className="w-5 h-5 text-neon-pink" />}
            content={currentView?.imagePrompt}
            colorClass="text-neon-pink"
            defaultOpen={false}
          />
          
          {/* Enhanced Video Prompt Section */}
          <CollapsibleSection
            title="Meta AI Video Prompt"
            icon={<Icons.Video className="w-5 h-5 text-neon-purple" />}
            colorClass="text-neon-purple"
            defaultOpen={true}
            className="border-neon-purple/50 shadow-[0_0_15px_rgba(189,0,255,0.15)]"
          >
            {currentView?.videoPrompt ? (
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-black/40 rounded-lg border border-neon-purple/20">
                  <p className="font-mono text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {currentView.videoPrompt}
                  </p>
                </div>
                
                <button
                  onClick={copyVideoPrompt}
                  className={`
                    w-full py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200
                    ${videoPromptCopied 
                      ? 'bg-green-500 text-black hover:bg-green-400' 
                      : 'bg-neon-purple text-white hover:bg-purple-600 hover:shadow-[0_0_15px_rgba(189,0,255,0.4)]'
                    }
                  `}
                >
                  {videoPromptCopied ? (
                    <>
                      <Icons.Sparkles className="w-5 h-5" />
                      COPIED TO CLIPBOARD!
                    </>
                  ) : (
                    <>
                      <Icons.RefreshCw className="w-5 h-5" />
                      COPY VIDEO PROMPT
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-gray-500 font-mono">
                  Paste this into Meta AI (Image to Video) to animate your NFT
                </p>
              </div>
            ) : (
              <p className="text-gray-600 text-sm italic font-mono">
                Generate an image first to create a video prompt...
              </p>
            )}
          </CollapsibleSection>
        </div>

        {/* History Gallery */}
        <Gallery 
          history={history} 
          onSelect={selectFromHistory} 
          selectedId={currentView?.id} 
        />

      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-600 text-xs font-mono border-t border-dark-border mt-12">
        <p>INFINITE NFT CREATOR PRO v2.1 • SYSTEM ACTIVE</p>
      </footer>
    </div>
  );
}

export default App;