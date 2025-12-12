
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';
import { Logo } from './Logo';
import { Button } from './UIShared';
import { TermsOfService, PrivacyPolicy } from './LegalDocs';
import { dataService } from '../services/dataService';
import { Collection } from '../types';

// --- Types ---
type PageType = 
  | 'HOME' 
  | 'FEATURES' 
  | 'PRICING' 
  | 'ROADMAP' 
  | 'COLLECTIONS' 
  | 'DOCS' 
  | 'API' 
  | 'COMMUNITY' 
  | 'SUPPORT' 
  | 'ABOUT' 
  | 'CAREERS' 
  | 'CONTACT'
  | 'TERMS'
  | 'PRIVACY';

interface LandingPageProps {
  onStart: (mode: 'LOGIN' | 'SIGNUP') => void;
}

interface Job {
  role: string;
  dept: string;
  loc: string;
  description: string;
  requirements: string[];
}

// --- Animated Shiny Button Component ---
const AnimatedShinyButton = ({ onClick, children, className }: { onClick: () => void, children?: React.ReactNode, className?: string }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-10 py-6 overflow-hidden rounded-xl font-black text-xl group shadow-2xl shadow-neon-purple/20 ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
       <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple" />
       <motion.div 
         className="absolute inset-0 w-full h-full"
         initial={{ x: "-100%" }}
         animate={{ x: "100%" }}
         transition={{ 
           repeat: Infinity, 
           duration: 1.5, 
           ease: "easeInOut",
           repeatDelay: 1
         }}
       >
         <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]" />
       </motion.div>
       <span className="relative z-10 text-white drop-shadow-sm flex items-center gap-2 justify-center">
         {children}
       </span>
       <div className="absolute inset-0 rounded-xl ring-2 ring-white/0 group-hover:ring-white/30 transition-all duration-300" />
    </motion.button>
  )
};

// --- Background Animation Component ---
const GeometricBackground = () => {
  return null;
};

// --- Shared Components ---

const PageHeader: React.FC<{ title: string; subtitle: string; badge?: string }> = ({ title, subtitle, badge }) => (
  <div className="pt-32 pb-16 px-6 text-center relative overflow-hidden z-10">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-neon-cyan/5 rounded-full blur-[100px] -z-10"></div>
    {badge && (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neon-cyan mb-6 mx-auto">
        <Icons.Sparkles className="w-3 h-3" />
        <span>{badge}</span>
      </div>
    )}
    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white">{title}</h1>
    <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
  </div>
);

// --- Newsletter Component ---
const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('LOADING');
    setErrorMsg('');
    try {
      await dataService.subscribeToNewsletter(email);
      setStatus('SUCCESS');
    } catch (e: any) {
      console.error(e);
      setStatus('ERROR');
      if (e.message.includes('subscribed')) {
        setErrorMsg("You're already on the list! Check your spam folder.");
      } else {
        setErrorMsg(e.message || "Failed to subscribe.");
      }
    }
  };

  if (status === 'SUCCESS') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto mb-20 p-8 bg-gradient-to-br from-green-900/40 to-black border border-green-500/50 rounded-2xl backdrop-blur-sm text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)]">
            <Icons.Check className="w-8 h-8 text-black" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-white mb-2">Blueprint Sent!</h3>
        <p className="text-gray-300 mb-6">
          We've emailed the PDF to <span className="text-white font-bold">{email}</span>.
        </p>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-left space-y-4">
            <div className="flex items-start gap-3">
                <Icons.Star className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                    <p className="text-yellow-400 font-bold text-sm mb-1 uppercase tracking-wide">Don't see it?</p>
                    <p className="text-xs text-gray-300 leading-relaxed">
                        Please check your <strong>Spam</strong> or <strong>Promotions</strong> folder. Since this is an automated email, it sometimes lands there.
                    </p>
                </div>
            </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mb-20 relative group">
      <div className="relative p-8 bg-[#0a0a0a] border border-white/20 rounded-2xl backdrop-blur-sm overflow-hidden hover:border-white/40 transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <Icons.Sparkles className="w-32 h-32 text-white transform rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
           <div className="flex-1 text-center md:text-left">
             <div className="inline-block px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-[10px] font-bold text-yellow-400 uppercase tracking-wider mb-3">
               Free PDF Blueprint
             </div>
             <h3 className="text-2xl font-black text-white mb-2">Get the NFT Master Guide</h3>
             <p className="text-sm text-gray-400 leading-relaxed">
               Subscribe to our newsletter to receive the <span className="text-neon-cyan font-bold">PDF Guide</span> and unlock <span className="text-white font-bold">10 Free Credits</span> for your account.
             </p>
           </div>
           <div className="w-full md:w-auto min-w-[300px]">
             <form className="flex flex-col gap-3" onSubmit={handleSubscribe}>
                <div className="relative">
                  <Icons.MessageCircle className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <input 
                      type="email" 
                      placeholder="Enter your best email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-all placeholder:text-gray-600"
                      required
                      disabled={status === 'LOADING'}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={status === 'LOADING'}
                  className="bg-white text-black hover:bg-neon-cyan hover:scale-[1.02] font-bold h-12 text-sm border-none shadow-lg transition-all w-full"
                >
                    {status === 'LOADING' ? <Icons.RefreshCw className="w-4 h-4 animate-spin" /> : 'Subscribe & Unlock Credits'}
                </Button>
                {status === 'ERROR' && (
                  <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-center">
                    <p className="text-red-400 text-xs font-bold">{errorMsg}</p>
                  </div>
                )}
                <p className="text-[10px] text-gray-600 text-center">
                  PDF & Credits sent via email.
                </p>
             </form>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Logos ---

const EthereumLogo = () => (
  <img 
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD5ElEQVR4nO2ZfWgTZxzHH8fQscEQwTH/GGOwMehQtPiKw+FwY/UNC2v3ljS1ebnk+nKpmXmedozfU50oCIJOEQeDDWFjDDb2z9isTGRiU7U17aVRx1gZts+jRRTdmLqZPuPKTq7Xu5ikvdxl+IHfPwlJfh+e33P3fS4IPeR/Du4arZXi6h5UiQBce5JQfrkhnMrJct+zqNLAlB8mlAtfqEcEW9IZVEkk4cpKTFlOF9BKaldlVAkAZGZjyoe05o0CjdGzdxXl/FzkdTBwqjdvFNAq3DpwAnmZ7TtGXsSU37YT8Id7RCx+YRPyIgDiEUL5z8bmzQJabY2e+wNAPIq8BqYsZm7eSkCrSNvgF8hLdH40tgBTfqNQAX8kNR5rU5chr0CAf2PVvJ3AxL1BPj+KvBIX7JrPJ+DT7g1uxww9LpQq0OB2zNDjQqkCPjdjhjEuTEfA50bMMMeF6Qo0ljtmmOOCuTBwoSR/FcHmfrF09afijS3fiXeDp/NKhMsVM6zigl7bPxwRzYmLIiCdud9Y1ZIDE7Vo+WGxtuZr8VbDSet7Q7gMMcMuLmzr/F1Iiir84dSUxnQBvV6qPihWv3pUbK7/sfwxwxgXjGOSbzTMAsZaajFejsUMPS5YjUmpAlUW4+VYzIiT336yG5PpClSZxqv27eM3Z1xAiqvJxui528U0X6xA1ZIDonrVJ2LDm9+fRE4QgOHHJEU96o/05mZaYOGyQ+K1jd+O1dWdeBo5TSiRfi7cku7RLn3TFqj+WKxZ9+Xdev+x9Y42TSjz4x1XFhpfi8WzrzfJ/ZdLFVix5rPx2vru3ebvjCqD+2ZcILGXP4EpUwnlRzp2sfmF7o9C5zz036oGpDN34p3ZBcgJtBUgwP8iwK8TyrGWiR60Px4054FJn0sJWcm8g5yEAG+5fzOj/BLp4nX59ke+OZdMKxdpG/jK0ebtj5Cse8r+SGQ3BGN9Yytf+TxX+143Nb4XVYZqmuS+q5POBc39HCExqywCAMNzCWXDkxIoZf9Y7Y9Crl4Bqfee1Db0AionSeDLCbC/p6TSIvaHT0uhoZSIxYeiyA0I5R225wLg2WQXq4nG1c6AdPaO/Tlg8AfkFhPxGtixUk9kTXLf9TrDSrlCAvhTGBgrVsAf7s3J719ajLxARxdfS4DdK0Yg0p7FyEsQynYXKhBqTZ9GXkM7CmLgpwp4Ov1nBEYfR17kg50jz2Dg12z/H4j0jsvbMi8jL0OAbyTAxq0EXH8WWigE2EGzQKglPYAqhdb9v8whwPt1AS2wBSEzD1USBK4+T4Dd0h4CSO2Dzp62nAIDa5AU9YhjP/AQ5C7/Agi7eV7YmtI+AAAAAElFTkSuQmCC" 
    alt="Ethereum" 
    className="w-12 h-12 md:w-16 md:h-16 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 rounded-full"
  />
);

const IntegrationSection = () => {
  const logos = [
    { 
      id: 'coinbase', 
      src: 'https://logo.svgcdn.com/token-branded/coinbase.svg', 
      alt: 'Coinbase' 
    },
    { 
      id: 'supabase', 
      src: 'https://logo.svgcdn.com/devicon/supabase-original.svg', 
      alt: 'Supabase' 
    },
    { 
      id: 'claude', 
      src: 'https://logo.svgcdn.com/logos/claude-icon.svg', 
      alt: 'Claude' 
    },
    { 
      id: 'clerk', 
      src: 'https://workable-application-form.s3.amazonaws.com/advanced/production/5faba140a2e294c4d44b07eb/5a2307b9-37fe-9bd0-b5f4-2666152d200d', 
      alt: 'Clerk',
      className: 'scale-150' // Increased size for visibility
    },
    { 
      id: 'rodeo', 
      src: 'https://ik.imagekit.io/vloluweqt/Logos/1723083649527.jpg', 
      alt: 'Rodeo',
      className: 'rounded-xl'
    },
    { id: 'ethereum', component: <EthereumLogo /> },
    { id: 'github', component: <Icons.Github className="w-12 h-12 md:w-16 md:h-16 text-gray-500 group-hover:text-white transition-colors" /> },
  ];

  return (
    <section className="py-24 border-t border-white/5 bg-[#080808] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
         <h2 className="text-2xl md:text-3xl font-black mb-4">
           Works with your <span className="text-neon-cyan">Favorite Tools</span>
         </h2>
         <p className="text-gray-400 max-w-2xl mx-auto">Seamlessly integrated with the modern creative stack.</p>
      </div>
      
      {/* Added animationDirection: 'reverse' for left-to-right sliding */}
      <div className="flex w-full overflow-hidden mask-gradient-x">
        <div className="flex animate-marquee gap-12 md:gap-24 min-w-full shrink-0 items-center justify-around px-12 md:px-24" style={{ animationDirection: 'reverse' }}>
           {logos.map((logo) => (
             <div key={logo.id} className="group flex items-center justify-center shrink-0 transition-all duration-500 hover:scale-110">
               {logo.component ? logo.component : (
                 <img 
                   src={logo.src} 
                   alt={logo.alt} 
                   className={`w-12 h-12 md:w-16 md:h-16 object-contain transition-all duration-500 ${logo.className || ''}`}
                 />
               )}
             </div>
           ))}
        </div>
        <div className="flex animate-marquee gap-12 md:gap-24 min-w-full shrink-0 items-center justify-around px-12 md:px-24" aria-hidden="true" style={{ animationDirection: 'reverse' }}>
           {logos.map((logo) => (
             <div key={`${logo.id}-copy`} className="group flex items-center justify-center shrink-0 transition-all duration-500 hover:scale-110">
               {logo.component ? logo.component : (
                 <img 
                   src={logo.src} 
                   alt={logo.alt} 
                   className={`w-12 h-12 md:w-16 md:h-16 object-contain transition-all duration-500 ${logo.className || ''}`}
                 />
               )}
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

// --- Sub-Pages ---

const FeaturesView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
    <PageHeader title="Powerful Features" subtitle="Everything you need to create, manage, and scale your NFT collections using state-of-the-art AI." badge="Version 2.0 Live" />
    <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
      <motion.div 
        initial={{ opacity: 0, x: -50 }} 
        whileInView={{ opacity: 1, x: 0 }} 
        viewport={{ once: true }} 
        transition={{ duration: 0.6 }}
      >
         <div className="p-4 bg-neon-cyan/10 rounded-2xl w-fit mb-6 text-neon-cyan"><Icons.Zap className="w-8 h-8" /></div>
         <h2 className="text-3xl font-bold mb-4">Gemini 2.5 Flash Engine</h2>
         <p className="text-gray-400 leading-relaxed mb-6">Our core generation engine is powered by Google's latest Gemini 2.5 Flash model, optimized specifically for unique NFT art generation. It understands complex traits and rarity concepts better than any other model on the market.</p>
         <ul className="space-y-3">
           {["Sub-second generation times", "Perfect geometric consistency", "Advanced color theory application", "Zero-hallucination vector paths"].map((item, i) => (
             <motion.li 
                key={item} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="flex items-center gap-2 text-sm text-gray-300"
             >
                <Icons.Check className="w-4 h-4 text-neon-cyan" /> {item}
             </motion.li>
           ))}
         </ul>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        whileInView={{ opacity: 1, scale: 1 }} 
        viewport={{ once: true }} 
        transition={{ duration: 0.6 }}
        className="aspect-square bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden group"
      >
         <div className="absolute inset-0 bg-neon-cyan/5 group-hover:bg-neon-cyan/10 transition-colors"></div>
         <Icons.Cpu className="w-32 h-32 text-gray-800 group-hover:text-neon-cyan transition-colors duration-500" />
      </motion.div>
    </div>
    
    <div className="grid md:grid-cols-2 gap-16 items-center mb-24 md:flex-row-reverse">
      <motion.div 
        className="md:order-2"
        initial={{ opacity: 0, x: 50 }} 
        whileInView={{ opacity: 1, x: 0 }} 
        viewport={{ once: true }} 
        transition={{ duration: 0.6 }}
      >
         <div className="p-4 bg-neon-purple/10 rounded-2xl w-fit mb-6 text-neon-purple"><Icons.Video className="w-8 h-8" /></div>
         <h2 className="text-3xl font-bold mb-4">Smart Video Prompts</h2>
         <p className="text-gray-400 leading-relaxed mb-6">Don't just create static images. Olly automatically analyzes your generated artwork and crafts perfect text-to-video prompts compatible with Meta AI and Runway Gen-2, giving life to your creations.</p>
         <ul className="space-y-3">
           {["Context-aware motion descriptions", "Loop-perfect timing syntax", "Style-consistent animation rules", "One-click copy workflow"].map((item, i) => (
             <motion.li 
                key={item} 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="flex items-center gap-2 text-sm text-gray-300"
             >
                <Icons.Check className="w-4 h-4 text-neon-purple" /> {item}
             </motion.li>
           ))}
         </ul>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        whileInView={{ opacity: 1, scale: 1 }} 
        viewport={{ once: true }} 
        transition={{ duration: 0.6 }}
        className="aspect-square bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden group md:order-1"
      >
          <div className="absolute inset-0 bg-neon-purple/5 group-hover:bg-neon-purple/10 transition-colors"></div>
          <Icons.PlayCircle className="w-32 h-32 text-gray-800 group-hover:text-neon-purple transition-colors duration-500" />
      </motion.div>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
       {[
         { icon: Icons.Layers, title: "Batch Processing", desc: "Generate up to 100 variations at once with our bulk tool." },
         { icon: Icons.Grid, title: "Collection Manager", desc: "Organize assets into traits, rarities, and themes automatically." },
         { icon: Icons.Download, title: "Metadata Export", desc: "JSON standards compatible with OpenSea and Solana standards." },
         { icon: Icons.Globe, title: "Multi-Chain", desc: "Optimized for Ethereum, Polygon, and Solana formats." },
         { icon: Icons.Lock, title: "IP Protection", desc: "You own 100% of the commercial rights to your generations." },
         { icon: Icons.Sparkles, title: "Style Tuning", desc: "Fine-tune aesthetic parameters for consistent brand look." }
       ].map((feat, i) => (
         <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-all backdrop-blur-sm group"
         >
            <motion.div
               initial={{ scale: 0.5 }}
               whileInView={{ scale: 1 }}
               viewport={{ once: true }}
               transition={{ type: "spring", stiffness: 300, delay: i * 0.1 + 0.1 }}
            >
                <feat.icon className="w-8 h-8 text-gray-400 mb-4 group-hover:text-neon-cyan transition-colors" />
            </motion.div>
            <h3 className="font-bold text-lg mb-2">{feat.title}</h3>
            <p className="text-sm text-gray-400">{feat.desc}</p>
         </motion.div>
       ))}
    </div>
  </motion.div>
);

const PricingView = ({ onStart }: { onStart: (mode: 'LOGIN' | 'SIGNUP') => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
    <PageHeader title="Simple Pricing" subtitle="Start for free, upgrade as you scale. No hidden fees or gas costs." />
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div className="bg-[#111]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col relative group hover:border-white/30 transition-all">
        <h3 className="text-xl font-bold text-gray-300 mb-2">Explorer</h3>
        <div className="text-4xl font-black text-white mb-6">$0<span className="text-sm font-normal text-gray-500">/mo</span></div>
        <p className="text-sm text-gray-400 mb-8">Perfect for hobbyists and first-time creators.</p>
        <ul className="space-y-4 mb-8 flex-1">
          {["50 Generations / day", "Standard Resolution", "Personal License", "Community Support"].map(f => (
             <li key={f} className="flex items-center gap-3 text-sm text-gray-300"><Icons.Check className="w-4 h-4 text-gray-500" /> {f}</li>
          ))}
        </ul>
        <Button onClick={() => onStart('SIGNUP')} variant="outline" className="w-full">Get Started</Button>
      </div>
      <div className="bg-black/80 backdrop-blur-sm border border-neon-cyan rounded-2xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
        <div className="absolute top-0 center-0 w-full text-center -translate-y-1/2">
           <span className="bg-neon-cyan text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
        </div>
        <h3 className="text-xl font-bold text-neon-cyan mb-2">Studio</h3>
        <div className="text-4xl font-black text-white mb-6">$29<span className="text-sm font-normal text-gray-500">/mo</span></div>
        <p className="text-sm text-gray-400 mb-8">For professional artists and collection launches.</p>
        <ul className="space-y-4 mb-8 flex-1">
          {["Unlimited Generations", "4K Resolution Upscale", "Commercial License", "Priority Support", "Batch Generation Tool", "Video Prompt Engine"].map(f => (
             <li key={f} className="flex items-center gap-3 text-sm text-white"><Icons.Check className="w-4 h-4 text-neon-cyan" /> {f}</li>
          ))}
        </ul>
        <Button onClick={() => onStart('SIGNUP')} className="w-full bg-neon-cyan text-black hover:bg-white font-bold">Start Free Trial</Button>
      </div>
      <div className="bg-[#111]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col relative group hover:border-white/30 transition-all">
        <h3 className="text-xl font-bold text-gray-300 mb-2">Agency</h3>
        <div className="text-4xl font-black text-white mb-6">$99<span className="text-sm font-normal text-gray-500">/mo</span></div>
        <p className="text-sm text-gray-400 mb-8">For large teams and high-volume API access.</p>
        <ul className="space-y-4 mb-8 flex-1">
          {["API Access", "Custom Model Fine-tuning", "Dedicated Account Manager", "SSO & Team Management", "White-label Options"].map(f => (
             <li key={f} className="flex items-center gap-3 text-sm text-gray-300"><Icons.Check className="w-4 h-4 text-gray-500" /> {f}</li>
          ))}
        </ul>
        <Button onClick={() => onStart('SIGNUP')} variant="outline" className="w-full">Contact Sales</Button>
      </div>
    </div>
  </motion.div>
);

const RoadmapView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto px-6 pb-24 relative z-10">
    <PageHeader title="Product Roadmap" subtitle="Our vision for the future of AI-generated collectibles." badge="2025 Vision" />
    <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
      {[
        { q: "Q1 2025", title: "Mobile Studio App", desc: "Native iOS and Android applications for generating on the go. Includes AR preview features.", status: "In Progress", color: "text-neon-cyan" },
        { q: "Q2 2025", title: "Smart Contract Deployer", desc: "One-click deployment of ERC-721A contracts directly from Olly. No coding required.", status: "Planned", color: "text-neon-purple" },
        { q: "Q3 2025", title: "Collaborative Canvases", desc: "Real-time multiplayer generation workspaces for teams and DAOs.", status: "Planned", color: "text-neon-pink" },
        { q: "Q4 2025", title: "The Olly Token", desc: "Governance and utility token integration for decentralized platform ownership.", status: "Concept", color: "text-yellow-400" },
      ].map((item, i) => (
        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#050505] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-xs font-bold z-10">
            {i + 1}
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#111]/80 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-white/30 transition-all">
            <div className={`flex items-center justify-between mb-2 ${item.color}`}>
              <span className="font-bold">{item.q}</span>
              <span className="text-[10px] uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/10">{item.status}</span>
            </div>
            <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const CollectionsView = ({ onStart }: { onStart: (mode: 'LOGIN' | 'SIGNUP') => void }) => {
  const [collections, setCollections] = useState<(Collection & { itemCount: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        const data = await dataService.getLandingPageCollections(10);
        setCollections(data);
      } catch (e) {
        console.error("Failed to load collections for landing page", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
      <PageHeader title="Trending Collections" subtitle="Discover premier collections created by top artists using Olly." />
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Icons.RefreshCw className="w-8 h-8 animate-spin text-neon-cyan" />
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
          <Icons.Box className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Collections Yet</h3>
          <p className="text-gray-400 mb-6">Be the first to create a public collection on Olly.</p>
          <Button onClick={() => onStart('SIGNUP')} className="bg-neon-cyan text-black hover:bg-white font-bold">Start Creating</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((col, i) => (
            <div 
              key={col.id} 
              onClick={() => onStart('SIGNUP')}
              className="group cursor-pointer bg-[#111]/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-neon-cyan/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)] transition-all duration-300 flex flex-col h-full"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-gray-900">
                {col.previewImages && col.previewImages[0] ? (
                  <img 
                    src={col.previewImages[0]} 
                    alt={col.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5">
                    <Icons.Image className="w-12 h-12 text-white/10 group-hover:text-neon-cyan/50 transition-colors" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                  <Icons.Layers className="w-3 h-3 text-neon-cyan" />
                  <span className="text-xs font-bold text-white">{col.itemCount} Items</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">{col.name}</h3>
                <p className="text-gray-400 text-sm mb-6 line-clamp-2">{col.description || 'No description provided.'}</p>
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  {col.tags && col.tags.length > 0 ? (
                    <div className="flex gap-1 flex-wrap">
                      {col.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400 border border-white/5">#{tag}</span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-600">No tags</span>
                  )}
                  <button className="text-xs font-bold text-white group-hover:text-neon-cyan transition-colors flex items-center gap-1">
                    View <Icons.ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-16 text-center">
         <p className="text-gray-400 mb-4">Want to launch your own collection?</p>
         <Button onClick={() => onStart('SIGNUP')} className="bg-neon-cyan text-black hover:bg-white border-none">Start Creating</Button>
      </div>
    </motion.div>
  );
};

const DocumentationView = ({ onGoToApi }: { onGoToApi: () => void }) => {
  const [activeDoc, setActiveDoc] = useState('INTRODUCTION');
  const docMap: Record<string, React.ReactNode> = {
    INTRODUCTION: (
      <>
        <h1>Introduction to Olly</h1>
        <p className="lead text-xl text-gray-400">Olly is the first AI-powered NFT generation platform designed specifically for vector-style geometric art.</p>
        <div className="p-6 bg-[#111]/80 backdrop-blur-sm border-l-4 border-neon-cyan rounded-r-xl my-8">
          <h4 className="text-neon-cyan font-bold mb-2">Note for V2 Users</h4>
          <p className="text-sm m-0">We have upgraded our core engine to Gemini 2.5 Flash. Prompts from V1 may generate slightly different (higher quality) results.</p>
        </div>
        <h2>How it works</h2>
        <p>Olly combines prompt engineering with state-of-the-art diffusion models to create consistent, stylized assets. Unlike generic AI tools, Olly is fine-tuned for:</p>
        <ul>
          <li>Flat design aesthetics</li>
          <li>Geometric consistency</li>
          <li>Clean, background-removable subjects</li>
        </ul>
      </>
    ),
    QUICK_START: (
      <>
        <h1>Quick Start Guide</h1>
        <p className="lead text-xl text-gray-400">Create your first NFT in less than 2 minutes.</p>
        <ol className="list-decimal pl-6 space-y-4 text-gray-300">
          <li><strong>Create an Account:</strong> Sign up using your email or Google account to access the creator studio.</li>
          <li><strong>Navigate to Generator:</strong> The generator is your main workspace. Look for the <Icons.Zap className="inline w-4 h-4 mx-1" /> icon.</li>
          <li><strong>Select Traits:</strong> Choose a Character, Action, and Background from the dropdowns, or use the "Surprise Me" button for inspiration.</li>
          <li><strong>Generate:</strong> Click "Generate NFT" and wait for Gemini to synthesize your artwork.</li>
          <li><strong>Save or Export:</strong> Once generated, you can add it to your collection or download the asset package immediately.</li>
        </ol>
      </>
    ),
    PROMPT_GUIDE: (
      <>
        <h1>Prompt Guide</h1>
        <p className="lead text-xl text-gray-400">Mastering the Olly engine for specific results.</p>
        <p>While Olly handles the heavy lifting of prompt engineering, understanding how our engine interprets inputs can help you achieve specific looks.</p>
        <h3>Keywords</h3>
        <p>Our model responds strongly to specific aesthetic keywords:</p>
        <ul className="grid grid-cols-2 gap-2 text-sm font-mono text-neon-cyan">
          <li>"Geometric"</li>
          <li>"Flat Design"</li>
          <li>"Vector"</li>
          <li>"Minimalist"</li>
        </ul>
        <h3>High Detail Mode</h3>
        <p>Toggle the "High Detail" switch in the generator to enable a more complex rendering pipeline. This adds <code className="bg-white/10 px-1 rounded">8k resolution</code> and <code className="bg-white/10 px-1 rounded">intricate patterning</code> to the prompt automatically.</p>
      </>
    ),
    EXPORTING: (
      <>
        <h1>Exporting Assets</h1>
        <p>Olly supports multiple export formats to suit your workflow.</p>
        <h3>Single Asset Export</h3>
        <p>When viewing a generated image, click the <strong>Download</strong> button. This provides a ZIP file containing:</p>
        <ul>
          <li>High-res PNG image (2048x2048)</li>
          <li>Metadata JSON file</li>
          <li>Text file with the exact generation prompt</li>
        </ul>
        <h3>Bulk Export</h3>
        <p>From your Collection view, use the "Export All" option to download your entire history. This is perfect for migrating assets to IPFS for minting.</p>
      </>
    ),
    VIDEO_GEN: (
      <>
        <h1>Video Generation</h1>
        <p className="lead text-xl text-gray-400">Bring your static NFTs to life with motion.</p>
        <div className="p-4 bg-neon-purple/10 border border-neon-purple/20 rounded-lg mb-6">
          <p className="text-neon-purple text-sm font-bold">New Feature: Native Generation</p>
          <p className="text-xs text-gray-400">You can now generate videos directly within Olly using the "Animate" button on any asset details page.</p>
        </div>
        <h3>The Workflow</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Select any generated NFT from your gallery.</li>
          <li>Click the "Animate (Video)" button in the details panel.</li>
          <li>Olly uses Google's Veo model to interpolate motion based on the image context.</li>
          <li>The video will be saved to your collection alongside the image.</li>
        </ol>
        <h3>External Tools</h3>
        <p>Alternatively, you can copy the "Video Prompt" generated by Olly and use it in tools like Runway Gen-2 or Pika Labs for different motion styles.</p>
      </>
    ),
    BATCH_TOOLS: (
      <>
        <h1>Batch Tools</h1>
        <p>Generate entire collections rapidly.</p>
        <p>The Batch Generation tool (available to Studio users) allows you to queue up to 3 variations at once. This is useful for exploring a theme quickly.</p>
        <p>Simply toggle the generation mode icon next to the main button to switch from <Icons.Zap className="inline w-3 h-3" /> Single to <Icons.Layers className="inline w-3 h-3" /> Batch mode.</p>
      </>
    ),
    METADATA: (
      <>
        <h1>Metadata Standards</h1>
        <p>Olly exports metadata in a format compatible with the ERC-721 standard used by OpenSea and other marketplaces.</p>
        <h3>JSON Structure</h3>
        <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto border border-white/10 text-xs">
{`{
  "name": "Olly Gen #8392",
  "description": "A geometric warrior...",
  "image": "ipfs://...",
  "attributes": [
    {
      "trait_type": "Character",
      "value": "Samurai"
    },
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    }
  ]
}`}
        </pre>
      </>
    ),
    INTEGRATION: (
      <>
        <h1>Integration Guide</h1>
        <p>Use your Olly assets in other applications.</p>
        <h3>Unity / Unreal Engine</h3>
        <p>Since Olly generates flat, high-contrast images, they work exceptionally well as UI elements or sprites in 2D games. Use the PNG export with transparency (coming soon) for best results.</p>
        <h3>Web3 Minting</h3>
        <p>Upload your Bulk Export folder directly to services like Pinata or Thirdweb to deploy your collection to the blockchain.</p>
      </>
    )
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 pb-24 grid md:grid-cols-4 gap-12 pt-24 relative z-10">
      <div className="hidden md:block space-y-2 border-r border-white/5 pr-8 h-fit sticky top-24">
        <h3 className="font-bold text-white mb-4 uppercase text-xs tracking-wider text-gray-500">Getting Started</h3>
        {[
          { id: 'INTRODUCTION', label: 'Introduction' },
          { id: 'QUICK_START', label: 'Quick Start' },
          { id: 'PROMPT_GUIDE', label: 'Prompt Guide' },
          { id: 'EXPORTING', label: 'Exporting Assets' },
          { id: 'VIDEO_GEN', label: 'Video Generation' }
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveDoc(item.id)}
            className={`block w-full text-left text-sm py-1.5 transition-colors ${activeDoc === item.id ? 'text-neon-cyan font-bold pl-2 border-l-2 border-neon-cyan' : 'text-gray-400 hover:text-white border-l-2 border-transparent'}`}
          >
            {item.label}
          </button>
        ))}
        <h3 className="font-bold text-white mt-8 mb-4 uppercase text-xs tracking-wider text-gray-500">Advanced</h3>
        {[
          { id: 'BATCH_TOOLS', label: 'Batch Tools' },
          { id: 'METADATA', label: 'Metadata Standards' },
          { id: 'INTEGRATION', label: 'Integration' }
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveDoc(item.id)}
            className={`block w-full text-left text-sm py-1.5 transition-colors ${activeDoc === item.id ? 'text-neon-cyan font-bold pl-2 border-l-2 border-neon-cyan' : 'text-gray-400 hover:text-white border-l-2 border-transparent'}`}
          >
            {item.label}
          </button>
        ))}
        <button 
          onClick={onGoToApi}
          className="block w-full text-left text-sm py-1.5 transition-colors text-gray-400 hover:text-white border-l-2 border-transparent flex items-center gap-2"
        >
          API Reference <Icons.ArrowRight className="w-3 h-3" />
        </button>
      </div>
      <div className="md:hidden col-span-1 mb-8">
        <select 
          value={activeDoc} 
          onChange={(e) => setActiveDoc(e.target.value)}
          className="w-full bg-[#111] border border-white/20 text-white rounded-lg p-3 outline-none focus:border-neon-cyan"
        >
          <optgroup label="Getting Started">
            <option value="INTRODUCTION">Introduction</option>
            <option value="QUICK_START">Quick Start</option>
            <option value="PROMPT_GUIDE">Prompt Guide</option>
            <option value="EXPORTING">Exporting Assets</option>
            <option value="VIDEO_GEN">Video Generation</option>
          </optgroup>
          <optgroup label="Advanced">
            <option value="BATCH_TOOLS">Batch Tools</option>
            <option value="METADATA">Metadata Standards</option>
            <option value="INTEGRATION">Integration</option>
          </optgroup>
        </select>
      </div>
      <div className="md:col-span-3 prose prose-invert max-w-none prose-headings:text-white prose-a:text-neon-cyan prose-strong:text-white prose-code:text-neon-purple min-h-[500px]">
        {docMap[activeDoc]}
      </div>
    </motion.div>
  );
};

const ApiView = ({ onBack }: { onBack: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto px-6 pb-24 pt-24 relative z-10">
    <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors text-sm font-bold"
    >
        <Icons.ArrowLeft className="w-4 h-4" /> Back to Documentation
    </button>
    <div className="flex items-center justify-between mb-8">
       <h1 className="text-4xl font-bold">API Reference</h1>
       <div className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded text-xs font-mono font-bold">v2.1 Stable</div>
    </div>
    <p className="text-gray-400 mb-12">Programmatically generate assets using the Olly Engine.</p>
    <div className="space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 font-mono font-bold rounded">POST</span>
          <code className="text-white font-mono bg-white/5 px-3 py-1 rounded">https://api.olly.ai/v1/generate</code>
        </div>
        <p className="text-sm text-gray-400">Generate a new image based on provided prompt parameters.</p>
        <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
            <span className="text-xs text-gray-500">cURL Request</span>
            <button className="text-xs text-neon-cyan hover:text-white">Copy</button>
          </div>
          <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto">
{`curl -X POST https://api.olly.ai/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Geometric robot surfing on a data stream",
    "style_preset": "cyberpunk_flat",
    "aspect_ratio": "1:1",
    "variations": 4
  }'`}
          </pre>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-green-500/20 text-green-400 font-mono font-bold rounded">GET</span>
          <code className="text-white font-mono bg-white/5 px-3 py-1 rounded">https://api.olly.ai/v1/collections/{'{id}'}</code>
        </div>
        <p className="text-sm text-gray-400">Retrieve metadata for a specific collection.</p>
      </div>
    </div>
  </motion.div>
);

const CommunityView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
    <PageHeader title="Join the Community" subtitle="Connect with 50,000+ creators, developers, and collectors." />
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
       <a href="#" className="p-8 bg-[#5865F2]/10 border border-[#5865F2]/20 hover:bg-[#5865F2]/20 hover:border-[#5865F2] rounded-2xl group transition-all text-center backdrop-blur-sm">
          <div className="w-16 h-16 bg-[#5865F2] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
             <Icons.MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Discord</h2>
          <p className="text-[#5865F2] mb-6 font-bold">15,400+ Members</p>
          <p className="text-gray-400 text-sm">Live workshops, feedback channels, and community challenges.</p>
       </a>
       <a href="#" className="p-8 bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 hover:bg-[#1DA1F2]/20 hover:border-[#1DA1F2] rounded-2xl group transition-all text-center backdrop-blur-sm">
          <div className="w-16 h-16 bg-[#1DA1F2] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
             <Icons.Twitter className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Twitter / X</h2>
          <p className="text-[#1DA1F2] mb-6 font-bold">42,000+ Followers</p>
          <p className="text-gray-400 text-sm">Latest updates, artist spotlights, and daily inspiration.</p>
       </a>
    </div>
    <div className="bg-[#111]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
       <h3 className="text-2xl font-bold text-white mb-4">Become an Olly Ambassador</h3>
       <p className="text-gray-400 mb-8 max-w-xl mx-auto">Earn rewards, get early access to features, and help shape the future of the platform.</p>
       <Button variant="outline" className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black">Apply Now</Button>
    </div>
  </motion.div>
);

const SupportView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto px-6 pb-24 pt-24 relative z-10">
    <h1 className="text-4xl font-bold mb-8 text-center">How can we help?</h1>
    <div className="relative mb-12">
       <Icons.Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
       <input type="text" placeholder="Search articles..." className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-neon-cyan outline-none" />
    </div>
    <div className="space-y-6">
      {[
        { q: "How do I export my NFTs?", a: "Go to your Gallery, select an image, and click the Download button. You can choose to download just the image or the full metadata package." },
        { q: "Can I use the images commercially?", a: "Yes! If you are on the Studio or Agency plan, you have full commercial rights to all assets you generate." },
        { q: "What is the daily generation limit?", a: "Explorer users get 50 gens/day. Studio and Agency users have unlimited generations." },
        { q: "How do I report a bug?", a: "Please join our Discord and post in the #bug-reports channel, or email support@olly.ai." }
      ].map((faq, i) => (
        <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="font-bold text-white mb-2">{faq.q}</h3>
          <p className="text-sm text-gray-400">{faq.a}</p>
        </div>
      ))}
    </div>
    <div className="mt-12 text-center">
       <p className="text-gray-400 mb-4">Still need help?</p>
       <Button className="bg-white text-black hover:bg-neon-cyan">Contact Support</Button>
    </div>
  </motion.div>
);

const AboutView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
    <PageHeader title="About Olly" subtitle="We're on a mission to democratize digital art creation through ethical AI." />
    <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
      <div>
        <h2 className="text-3xl font-bold mb-6">The Story</h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Olly began in 2024 as a hackathon project to solve a simple problem: creating consistent, high-quality assets for indie games and NFT collections was too expensive for most creators.
        </p>
        <p className="text-gray-400 leading-relaxed">
          Today, we're a team of artists, engineers, and researchers building the world's most creator-friendly AI generation platform. We believe in tools that augment human creativity, not replace it.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
         <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80" className="rounded-2xl opacity-80" alt="Team" />
         <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80" className="rounded-2xl opacity-80 translate-y-8" alt="Team working" />
      </div>
    </div>
  </motion.div>
);

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`bg-[#111]/80 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-neon-cyan/50 shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'hover:border-white/30'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <div>
           <h3 className={`font-bold text-lg transition-colors ${isOpen ? 'text-neon-cyan' : 'text-white'}`}>{job.role}</h3>
           <p className="text-sm text-gray-500">{job.dept} • {job.loc}</p>
        </div>
        <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-neon-cyan text-black rotate-90' : 'bg-white/5 text-gray-400'}`}>
          <Icons.ChevronRight className="w-5 h-5" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0 border-t border-white/5">
               <div className="pt-6">
                 <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Role Overview</h4>
                 <p className="text-gray-400 text-sm leading-relaxed mb-6">
                   {job.description}
                 </p>
                 <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Requirements</h4>
                 <ul className="space-y-2 mb-8">
                   {job.requirements.map((req, i) => (
                     <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                       <Icons.Check className="w-4 h-4 text-neon-cyan mt-0.5 shrink-0" />
                       {req}
                     </li>
                   ))}
                 </ul>
                 <Button className="w-full sm:w-auto bg-white text-black hover:bg-neon-cyan hover:text-black font-bold border-none">
                   Apply for this Role
                 </Button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CareersView = () => {
  const jobs: Job[] = [
    { 
      role: "Senior React Engineer", 
      dept: "Engineering", 
      loc: "Remote",
      description: "Lead the frontend development of Olly's web platform. You'll architect complex UI interactions, optimize rendering performance for generative art previews, and collaborate closely with our AI team to integrate new model capabilities.",
      requirements: [
        "5+ years production experience with React & TypeScript",
        "Expertise in state management and performance tuning",
        "Experience with WebGL or Canvas manipulation is a huge plus",
        "Passion for generative art and creative tools"
      ]
    },
    { 
      role: "AI Research Scientist", 
      dept: "R&D", 
      loc: "San Francisco / Remote",
      description: "Push the boundaries of generative models. You will research and train novel diffusion models and LLMs specifically tailored for vector-style geometric art and animation consistency.",
      requirements: [
        "PhD or MS in Computer Science, AI, or related field",
        "Strong publication record in generative AI (NeurIPS, ICML, CVPR)",
        "Proficiency in PyTorch and distributed training",
        "Experience with LoRA and model fine-tuning techniques"
      ]
    },
    { 
      role: "Product Designer", 
      dept: "Design", 
      loc: "London / Remote",
      description: "Define the user experience for the next generation of creative tools. You will design intuitive interfaces that make powerful AI capabilities accessible to everyone, from hobbyists to professional artists.",
      requirements: [
        "Strong portfolio showcasing web application design",
        "Mastery of Figma and prototyping tools",
        "Experience designing for complex creative workflows",
        "Ability to conduct user research and usability testing"
      ]
    },
    { 
      role: "Community Manager", 
      dept: "Marketing", 
      loc: "Remote",
      description: "Be the voice of Olly. You will grow and nurture our vibrant community of artists and collectors on Discord and Twitter, manage events, and gather feedback to shape our roadmap.",
      requirements: [
        "3+ years experience in community management (Web3/Gaming preferred)",
        "Deep understanding of Discord community dynamics",
        "Excellent written communication and storytelling skills",
        "Passion for digital art and NFTs"
      ]
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto px-6 pb-24 pt-24 relative z-10">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Join the Team</h1>
        <p className="text-gray-400">Help us build the future of creative tools.</p>
      </div>
      <div className="space-y-4">
        {jobs.map((job, i) => (
          <JobCard key={i} job={job} />
        ))}
      </div>
    </motion.div>
  );
};

const ContactView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto px-6 pb-24 pt-24 relative z-10">
    <div className="bg-[#111]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Get in Touch</h2>
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Name</label>
            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-cyan outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Email</label>
            <input type="email" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-cyan outline-none" />
          </div>
        </div>
        <div className="space-y-2">
           <label className="text-sm text-gray-400">Message</label>
           <textarea rows={5} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-cyan outline-none"></textarea>
        </div>
        <Button className="w-full bg-white text-black hover:bg-neon-cyan font-bold py-6">Send Message</Button>
      </form>
    </div>
  </motion.div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [page, setPage] = useState<PageType>('HOME');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: { id: PageType; label: string }[] = [
    { id: 'FEATURES', label: 'Features' },
    { id: 'COLLECTIONS', label: 'Collections' },
    { id: 'PRICING', label: 'Pricing' },
    { id: 'ROADMAP', label: 'Roadmap' },
    { id: 'DOCS', label: 'Docs' },
  ];

  const renderContent = () => {
    switch (page) {
      case 'FEATURES': return <FeaturesView />;
      case 'PRICING': return <PricingView onStart={onStart} />;
      case 'ROADMAP': return <RoadmapView />;
      case 'COLLECTIONS': return <CollectionsView onStart={onStart} />;
      case 'DOCS': return <DocumentationView onGoToApi={() => setPage('API')} />;
      case 'API': return <ApiView onBack={() => setPage('DOCS')} />;
      case 'COMMUNITY': return <CommunityView />;
      case 'SUPPORT': return <SupportView />;
      case 'ABOUT': return <AboutView />;
      case 'CAREERS': return <CareersView />;
      case 'CONTACT': return <ContactView />;
      case 'TERMS': return <TermsOfService onBack={() => setPage('HOME')} />;
      case 'PRIVACY': return <PrivacyPolicy onBack={() => setPage('HOME')} />;
      default: return (
        <>
          <div className="pt-32 pb-20 px-6 text-center relative z-10">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neon-cyan mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
               </span>
               AI-Powered NFT Art Engine
             </div>
             <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1] text-white max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
               Generate Unique <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">NFT Art</span><br />
               in Seconds.
             </h1>
             <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
               Create, manage, and export professional NFT collections. 
               The ultimate AI tool for generating mint-ready digital collectibles and animations.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                <AnimatedShinyButton onClick={() => onStart('SIGNUP')}>
                   Start Creating Free <Icons.ArrowRight className="w-5 h-5" />
                </AnimatedShinyButton>
                <button onClick={() => setPage('COLLECTIONS')} className="px-8 py-4 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 border border-white/30 transition-all flex items-center gap-2">
                   <Icons.Grid className="w-5 h-5" /> Gallery
                </button>
             </div>

             <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24 text-left animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
                <div className="p-6 bg-[#111]/80 border border-white/10 rounded-xl backdrop-blur-sm hover:border-neon-cyan/30 transition-all group">
                   <div className="w-12 h-12 bg-neon-cyan/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icons.Sparkles className="w-6 h-6 text-neon-cyan" />
                   </div>
                   <h3 className="text-lg font-bold text-white mb-2">AI-Powered Art</h3>
                   <p className="text-sm text-gray-400">Generate thousands of unique traits and variations instantly using our tuned Gemini 2.5 engine.</p>
                </div>
                <div className="p-6 bg-[#111]/80 border border-white/10 rounded-xl backdrop-blur-sm hover:border-neon-purple/30 transition-all group">
                   <div className="w-12 h-12 bg-neon-purple/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icons.Grid className="w-6 h-6 text-neon-purple" />
                   </div>
                   <h3 className="text-lg font-bold text-white mb-2">Collection Manager</h3>
                   <p className="text-sm text-gray-400">Organize your assets, manage rarity tiers, and remix styles effortlessly.</p>
                </div>
                <div className="p-6 bg-[#111]/80 border border-white/10 rounded-xl backdrop-blur-sm hover:border-neon-pink/30 transition-all group">
                   <div className="w-12 h-12 bg-neon-pink/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icons.Download className="w-6 h-6 text-neon-pink" />
                   </div>
                   <h3 className="text-lg font-bold text-white mb-2">Mint Ready</h3>
                   <p className="text-sm text-gray-400">One-click export of images and ERC-721 metadata compatible with OpenSea and Solana.</p>
                </div>
             </div>
             
             <div className="mt-8 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-700">
               <button onClick={() => setPage('FEATURES')} className="text-sm font-bold text-gray-400 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors group">
                 More Features <Icons.ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
               </button>
             </div>
          </div>
          <IntegrationSection />
          <div className="mt-20">
             <NewsletterSection />
          </div>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neon-cyan selection:text-black overflow-x-hidden flex flex-col">
      <GeometricBackground />
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
           <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('HOME')}>
              <Logo className="w-8 h-8" />
              <span className="font-black text-xl tracking-tighter">OLLY</span>
           </div>
           <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${page === item.id ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  {item.label}
                </button>
              ))}
           </div>
           <div className="hidden md:flex items-center gap-4">
              <button onClick={() => onStart('LOGIN')} className="text-sm font-bold text-gray-300 hover:text-white">Log In</button>
              <Button onClick={() => onStart('SIGNUP')} className="bg-white text-black hover:bg-neon-cyan hover:scale-105 transition-all font-bold h-9">
                 Sign Up
              </Button>
           </div>
           <button className="md:hidden p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <Icons.X /> : <Icons.Menu />}
           </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-black border-b border-white/10 p-4 absolute w-full flex flex-col gap-4 animate-in slide-in-from-top-2">
             {navItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => { setPage(item.id); setIsMenuOpen(false); }}
                  className={`text-left px-4 py-3 text-sm font-bold rounded-lg transition-colors ${page === item.id ? 'bg-white/10 text-white' : 'text-gray-400'}`}
                >
                  {item.label}
                </button>
             ))}
             <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
                <Button onClick={() => onStart('LOGIN')} variant="outline" className="w-full justify-center">Log In</Button>
                <Button onClick={() => onStart('SIGNUP')} className="w-full justify-center bg-neon-cyan text-black">Sign Up</Button>
             </div>
          </div>
        )}
      </nav>
      <main className="flex-grow pt-20">
         <AnimatePresence mode="wait">
            {renderContent()}
         </AnimatePresence>
      </main>
      <footer className="border-t border-white/5 bg-[#050505] py-20 mt-auto relative z-10">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
               <div className="flex items-center gap-2">
                  <Logo className="w-6 h-6" />
                  <span className="font-black text-lg tracking-tighter">OLLY</span>
               </div>
               <p className="text-sm text-gray-500 leading-relaxed">
                 The world's first AI generation engine designed specifically for unique NFT art and seamless video loops.
               </p>
               <div className="flex gap-4">
                  <a href="#" className="text-gray-500 hover:text-white transition-colors"><Icons.Twitter className="w-5 h-5" /></a>
                  <a href="#" className="text-gray-500 hover:text-white transition-colors"><Icons.Github className="w-5 h-5" /></a>
                  <a href="#" className="text-gray-500 hover:text-white transition-colors"><Icons.Instagram className="w-5 h-5" /></a>
               </div>
            </div>
            <div>
               <h4 className="font-bold text-white mb-6">Product</h4>
               <ul className="space-y-3 text-sm text-gray-500">
                  <li><button onClick={() => setPage('FEATURES')} className="hover:text-neon-cyan transition-colors">Features</button></li>
                  <li><button onClick={() => setPage('PRICING')} className="hover:text-neon-cyan transition-colors">Pricing</button></li>
                  <li><button onClick={() => setPage('ROADMAP')} className="hover:text-neon-cyan transition-colors">Roadmap</button></li>
                  <li><button onClick={() => setPage('API')} className="hover:text-neon-cyan transition-colors">API</button></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold text-white mb-6">Resources</h4>
               <ul className="space-y-3 text-sm text-gray-500">
                  <li><button onClick={() => setPage('DOCS')} className="hover:text-neon-cyan transition-colors">Documentation</button></li>
                  <li><button onClick={() => setPage('COMMUNITY')} className="hover:text-neon-cyan transition-colors">Community</button></li>
                  <li><button onClick={() => setPage('SUPPORT')} className="hover:text-neon-cyan transition-colors">Help Center</button></li>
                  <li><button onClick={() => setPage('TERMS')} className="hover:text-neon-cyan transition-colors">Terms of Service</button></li>
                  <li><button onClick={() => setPage('PRIVACY')} className="hover:text-neon-cyan transition-colors">Privacy Policy</button></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold text-white mb-6">Company</h4>
               <ul className="space-y-3 text-sm text-gray-500">
                  <li><button onClick={() => setPage('ABOUT')} className="hover:text-neon-cyan transition-colors">About Us</button></li>
                  <li><button onClick={() => setPage('CAREERS')} className="hover:text-neon-cyan transition-colors">Careers</button></li>
                  <li><button onClick={() => setPage('CONTACT')} className="hover:text-neon-cyan transition-colors">Contact</button></li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
            <p>© 2025 Olly AI Inc. All rights reserved.</p>
            <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> All Systems Operational</p>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
