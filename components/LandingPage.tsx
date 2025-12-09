
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';
import { Logo } from './Logo';
import { Button } from './UIShared';
import { TermsOfService, PrivacyPolicy } from './LegalDocs';

// --- Types ---
type PageType = 
  | 'HOME' 
  | 'FEATURES' 
  | 'PRICING' 
  | 'ROADMAP' 
  | 'SHOWCASE' 
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
  onStart: () => void;
}

// --- Shared Components ---

const PageHeader: React.FC<{ title: string; subtitle: string; badge?: string }> = ({ title, subtitle, badge }) => (
  <div className="pt-32 pb-16 px-6 text-center relative overflow-hidden">
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

// --- Sub-Pages ---

const FeaturesView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 pb-24">
    <PageHeader title="Powerful Features" subtitle="Everything you need to create, manage, and scale your NFT collections using state-of-the-art AI." badge="Version 2.0 Live" />
    
    <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
      <div>
         <div className="p-4 bg-neon-cyan/10 rounded-2xl w-fit mb-6 text-neon-cyan"><Icons.Zap className="w-8 h-8" /></div>
         <h2 className="text-3xl font-bold mb-4">Gemini 2.5 Flash Engine</h2>
         <p className="text-gray-400 leading-relaxed mb-6">Our core generation engine is powered by Google's latest Gemini 2.5 Flash model, optimized specifically for vector-style geometric art. It understands complex spatial relationships and abstract concepts better than any other model on the market.</p>
         <ul className="space-y-3">
           {["Sub-second generation times", "Perfect geometric consistency", "Advanced color theory application", "Zero-hallucination vector paths"].map(item => (
             <li key={item} className="flex items-center gap-2 text-sm text-gray-300"><Icons.Check className="w-4 h-4 text-neon-cyan" /> {item}</li>
           ))}
         </ul>
      </div>
      <div className="aspect-square bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
         <div className="absolute inset-0 bg-neon-cyan/5 group-hover:bg-neon-cyan/10 transition-colors"></div>
         <Icons.Cpu className="w-32 h-32 text-gray-800 group-hover:text-neon-cyan transition-colors duration-500" />
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-16 items-center mb-24 md:flex-row-reverse">
      <div className="md:order-2">
         <div className="p-4 bg-neon-purple/10 rounded-2xl w-fit mb-6 text-neon-purple"><Icons.Video className="w-8 h-8" /></div>
         <h2 className="text-3xl font-bold mb-4">Smart Video Prompts</h2>
         <p className="text-gray-400 leading-relaxed mb-6">Don't just create static images. Olly automatically analyzes your generated artwork and crafts perfect text-to-video prompts compatible with Meta AI and Runway Gen-2, giving life to your creations.</p>
         <ul className="space-y-3">
           {["Context-aware motion descriptions", "Loop-perfect timing syntax", "Style-consistent animation rules", "One-click copy workflow"].map(item => (
             <li key={item} className="flex items-center gap-2 text-sm text-gray-300"><Icons.Check className="w-4 h-4 text-neon-purple" /> {item}</li>
           ))}
         </ul>
      </div>
      <div className="aspect-square bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden group md:order-1">
          <div className="absolute inset-0 bg-neon-purple/5 group-hover:bg-neon-purple/10 transition-colors"></div>
          <Icons.PlayCircle className="w-32 h-32 text-gray-800 group-hover:text-neon-purple transition-colors duration-500" />
      </div>
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
         <div key={i} className="p-6 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-all">
            <feat.icon className="w-8 h-8 text-gray-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">{feat.title}</h3>
            <p className="text-sm text-gray-400">{feat.desc}</p>
         </div>
       ))}
    </div>
  </motion.div>
);

const PricingView = ({ onStart }: { onStart: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 pb-24">
    <PageHeader title="Simple Pricing" subtitle="Start for free, upgrade as you scale. No hidden fees or gas costs." />
    
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Free Tier */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 flex flex-col relative group hover:border-white/30 transition-all">
        <h3 className="text-xl font-bold text-gray-300 mb-2">Explorer</h3>
        <div className="text-4xl font-black text-white mb-6">$0<span className="text-sm font-normal text-gray-500">/mo</span></div>
        <p className="text-sm text-gray-400 mb-8">Perfect for hobbyists and first-time creators.</p>
        <ul className="space-y-4 mb-8 flex-1">
          {["50 Generations / day", "Standard Resolution", "Personal License", "Community Support"].map(f => (
             <li key={f} className="flex items-center gap-3 text-sm text-gray-300"><Icons.Check className="w-4 h-4 text-gray-500" /> {f}</li>
          ))}
        </ul>
        <Button onClick={onStart} variant="outline" className="w-full">Get Started</Button>
      </div>

      {/* Pro Tier */}
      <div className="bg-black border border-neon-cyan rounded-2xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
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
        <Button onClick={onStart} className="w-full bg-neon-cyan text-black hover:bg-white font-bold">Start Free Trial</Button>
      </div>

      {/* Enterprise Tier */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 flex flex-col relative group hover:border-white/30 transition-all">
        <h3 className="text-xl font-bold text-gray-300 mb-2">Agency</h3>
        <div className="text-4xl font-black text-white mb-6">$99<span className="text-sm font-normal text-gray-500">/mo</span></div>
        <p className="text-sm text-gray-400 mb-8">For large teams and high-volume API access.</p>
        <ul className="space-y-4 mb-8 flex-1">
          {["API Access", "Custom Model Fine-tuning", "Dedicated Account Manager", "SSO & Team Management", "White-label Options"].map(f => (
             <li key={f} className="flex items-center gap-3 text-sm text-gray-300"><Icons.Check className="w-4 h-4 text-gray-500" /> {f}</li>
          ))}
        </ul>
        <Button onClick={onStart} variant="outline" className="w-full">Contact Sales</Button>
      </div>
    </div>
  </motion.div>
);

const RoadmapView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto px-6 pb-24">
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
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#111] p-6 rounded-xl border border-white/10 hover:border-white/30 transition-all">
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

const ShowcaseView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 pb-24">
    <PageHeader title="Community Showcase" subtitle="Discover trending collections created by Olly artists." />
    
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-pointer">
          <img 
            src={`https://picsum.photos/seed/${i * 123}/400/${300 + (i % 3) * 100}`} 
            alt="Showcase item" 
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
            <p className="text-white font-bold text-sm">Cosmic Drifter #{i + 100}</p>
            <p className="text-gray-400 text-xs">by @artist{i}</p>
          </div>
        </div>
      ))}
    </div>
    
    <div className="mt-12 text-center">
      <Button variant="outline" className="border-white/20 hover:bg-white/10">Load More</Button>
    </div>
  </motion.div>
);

const DocumentationView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 pb-24 grid md:grid-cols-4 gap-12 pt-24">
    <div className="hidden md:block space-y-2 border-r border-white/5 pr-8">
      <h3 className="font-bold text-white mb-4">Getting Started</h3>
      {["Introduction", "Quick Start", "Prompt Guide", "Exporting", "Video Generation"].map(item => (
        <button key={item} className="block w-full text-left text-sm text-gray-400 hover:text-neon-cyan py-1 transition-colors">{item}</button>
      ))}
      <h3 className="font-bold text-white mt-8 mb-4">Advanced</h3>
      {["API Reference", "Batch Tools", "Metadata Standards", "Integration"].map(item => (
        <button key={item} className="block w-full text-left text-sm text-gray-400 hover:text-neon-cyan py-1 transition-colors">{item}</button>
      ))}
    </div>
    <div className="md:col-span-3 prose prose-invert max-w-none">
      <h1>Introduction to Olly</h1>
      <p className="lead text-xl text-gray-400">Olly is the first AI-powered NFT generation platform designed specifically for vector-style geometric art.</p>
      
      <div className="p-6 bg-[#111] border-l-4 border-neon-cyan rounded-r-xl my-8">
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

      <h3>Your First Generation</h3>
      <p>Navigate to the Generator tab. You can either use the "Surprise Me" button for a random combination or manually select:</p>
      <ol>
        <li><strong>Character:</strong> The main subject of your NFT.</li>
        <li><strong>Action:</strong> What the subject is doing.</li>
        <li><strong>Theme:</strong> The color palette and background style.</li>
      </ol>
      
      <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto border border-white/10">
        <code>
{`// Example Prompt Structure
{
  "subject": "Cyberpunk Samurai",
  "action": "Wielding Katana",
  "style": "Neon Noir",
  "rarity": "Legendary"
}`}
        </code>
      </pre>
    </div>
  </motion.div>
);

const ApiView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto px-6 pb-24 pt-24">
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
        
        <div className="bg-[#111] rounded-xl border border-white/10 overflow-hidden">
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
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 pb-24">
    <PageHeader title="Join the Community" subtitle="Connect with 50,000+ creators, developers, and collectors." />
    
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
       <a href="#" className="p-8 bg-[#5865F2]/10 border border-[#5865F2]/20 hover:bg-[#5865F2]/20 hover:border-[#5865F2] rounded-2xl group transition-all text-center">
          <div className="w-16 h-16 bg-[#5865F2] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
             <Icons.MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Discord</h2>
          <p className="text-[#5865F2] mb-6 font-bold">15,400+ Members</p>
          <p className="text-gray-400 text-sm">Live workshops, feedback channels, and community challenges.</p>
       </a>

       <a href="#" className="p-8 bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 hover:bg-[#1DA1F2]/20 hover:border-[#1DA1F2] rounded-2xl group transition-all text-center">
          <div className="w-16 h-16 bg-[#1DA1F2] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
             <Icons.Twitter className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Twitter / X</h2>
          <p className="text-[#1DA1F2] mb-6 font-bold">42,000+ Followers</p>
          <p className="text-gray-400 text-sm">Latest updates, artist spotlights, and daily inspiration.</p>
       </a>
    </div>

    <div className="bg-[#111] border border-white/10 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
       <h3 className="text-2xl font-bold text-white mb-4">Become an Olly Ambassador</h3>
       <p className="text-gray-400 mb-8 max-w-xl mx-auto">Earn rewards, get early access to features, and help shape the future of the platform.</p>
       <Button variant="outline" className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black">Apply Now</Button>
    </div>
  </motion.div>
);

const SupportView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto px-6 pb-24 pt-24">
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
        <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-6">
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
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 pb-24">
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

const CareersView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto px-6 pb-24 pt-24">
    <div className="text-center mb-16">
      <h1 className="text-4xl font-bold mb-4">Join the Team</h1>
      <p className="text-gray-400">Help us build the future of creative tools.</p>
    </div>

    <div className="space-y-4">
      {[
        { role: "Senior React Engineer", dept: "Engineering", loc: "Remote" },
        { role: "AI Research Scientist", dept: "R&D", loc: "San Francisco / Remote" },
        { role: "Product Designer", dept: "Design", loc: "London / Remote" },
        { role: "Community Manager", dept: "Marketing", loc: "Remote" },
      ].map((job, i) => (
        <div key={i} className="flex items-center justify-between p-6 bg-[#111] border border-white/10 rounded-xl hover:border-neon-cyan/50 transition-colors group cursor-pointer">
           <div>
             <h3 className="font-bold text-white group-hover:text-neon-cyan transition-colors">{job.role}</h3>
             <p className="text-sm text-gray-500">{job.dept} • {job.loc}</p>
           </div>
           <Icons.ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all" />
        </div>
      ))}
    </div>
  </motion.div>
);

const ContactView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto px-6 pb-24 pt-24">
    <div className="bg-[#111] border border-white/10 rounded-2xl p-8 md:p-12">
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

// --- Main Home View (Original Content) ---

const HomeView: React.FC<{ onStart: () => void, onNav: (p: PageType) => void }> = ({ onStart, onNav }) => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };
  const floatVariants = {
    animate: { y: [0, -15, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* HERO SECTION */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-neon-purple/20 rounded-full blur-[120px] -z-10 opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-neon-cyan/10 rounded-full blur-[120px] -z-10 opacity-20"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center lg:text-left">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neon-cyan mb-6">
              <Icons.Sparkles className="w-3 h-3" />
              <span>v2.0 Now Live with Gemini 2.5 Flash</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-6">
              Generate <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple">NFT Art</span> with AI in Seconds
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Transform your creative vision into unique, blockchain-ready artwork using advanced Gemini AI. From concept to collection in under 60 seconds.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button onClick={onStart} className="w-full sm:w-auto px-8 py-6 text-lg bg-neon-cyan text-black hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] font-black">
                Start Creating Free
              </Button>
              <Button onClick={() => onNav('SHOWCASE')} variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg border-white/20 hover:bg-white/10 gap-2">
                <Icons.PlayCircle className="w-5 h-5" /> View Gallery
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-mono">
              <span className="flex items-center gap-2"><Icons.Check className="w-3 h-3 text-neon-cyan" /> No credit card required</span>
              <span className="flex items-center gap-2"><Icons.Check className="w-3 h-3 text-neon-cyan" /> 1M+ Generated</span>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8, rotate: 5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative hidden lg:block">
            <motion.div variants={floatVariants} animate="animate" className="relative z-10 grid grid-cols-2 gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm rotate-[-5deg] hover:rotate-0 transition-all duration-500">
              {[
                { color: "from-purple-500 to-indigo-600", badge: "LEGENDARY", tierColor: "bg-yellow-500" },
                { color: "from-neon-cyan to-blue-600", badge: "EPIC", tierColor: "bg-purple-500" },
                { color: "from-neon-pink to-red-600", badge: "RARE", tierColor: "bg-blue-500" },
                { color: "from-green-400 to-emerald-600", badge: "COMMON", tierColor: "bg-gray-500" }
              ].map((item, i) => (
                <div key={i} className={`aspect-square rounded-xl bg-gradient-to-br ${item.color} p-1 ${i === 1 ? 'translate-y-8' : i === 2 ? '-translate-y-8' : ''}`}>
                  <div className="w-full h-full bg-black/40 rounded-lg flex items-center justify-center relative overflow-hidden group">
                    <img src={`https://picsum.photos/seed/${i + 50}/400/400`} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" alt={`NFT ${i}`} />
                    <div className={`absolute top-2 right-2 ${item.tierColor} text-black text-[10px] font-bold px-2 py-0.5 rounded-full`}>{item.badge}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* FEATURES PREVIEW */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Everything You Need to <span className="text-neon-pink">Dominate</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Comprehensive tools built for the next generation of digital artists.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Icons.Zap, title: "AI-Powered Generation", desc: "Leverage Google Gemini 2.5 Flash for photorealistic NFT creation.", color: "text-neon-cyan" },
              { icon: Icons.Video, title: "Instant Video Prompts", desc: "Get optimized Meta AI-ready animation prompts automatically.", color: "text-neon-purple" },
              { icon: Icons.Sparkles, title: "Rarity System", desc: "Built-in legendary-to-common tier system with ETH valuations.", color: "text-yellow-400" }
            ].map((feature, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#111] border border-[#222] p-8 rounded-2xl group hover:border-white/20 transition-all">
                <div className={`p-3 rounded-lg bg-white/5 w-fit mb-6 ${feature.color}`}><feature.icon className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button onClick={() => onNav('FEATURES')} variant="outline">View All Features</Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Ready to Create Your First <br/><span className="text-neon-cyan">AI NFT?</span></h2>
          <Button onClick={onStart} className="px-10 py-6 text-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:scale-105 transition-transform font-black shadow-2xl shadow-neon-purple/20 border-none">
            Launch Olly Studio
          </Button>
        </div>
      </section>
    </motion.div>
  );
};

// --- Main Landing Page Controller ---

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('HOME');

  const handleNav = (page: PageType) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  const renderContent = () => {
    switch(currentPage) {
      case 'HOME': return <HomeView onStart={onStart} onNav={handleNav} />;
      case 'FEATURES': return <FeaturesView />;
      case 'PRICING': return <PricingView onStart={onStart} />;
      case 'ROADMAP': return <RoadmapView />;
      case 'SHOWCASE': return <ShowcaseView />;
      case 'DOCS': return <DocumentationView />;
      case 'API': return <ApiView />;
      case 'COMMUNITY': return <CommunityView />;
      case 'SUPPORT': return <SupportView />;
      case 'ABOUT': return <AboutView />;
      case 'CAREERS': return <CareersView />;
      case 'CONTACT': return <ContactView />;
      case 'TERMS': return <TermsOfService onBack={() => handleNav('HOME')} />;
      case 'PRIVACY': return <PrivacyPolicy onBack={() => handleNav('HOME')} />;
      default: return <HomeView onStart={onStart} onNav={handleNav} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-neon-cyan selection:text-black overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => handleNav('HOME')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Logo className="w-12 h-8" />
            <span className="font-black text-xl tracking-tighter">OLLY</span>
          </button>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <button onClick={() => handleNav('FEATURES')} className={`hover:text-neon-cyan transition-colors ${currentPage === 'FEATURES' ? 'text-white' : ''}`}>Features</button>
            <button onClick={() => handleNav('PRICING')} className={`hover:text-neon-cyan transition-colors ${currentPage === 'PRICING' ? 'text-white' : ''}`}>Pricing</button>
            <button onClick={() => handleNav('SHOWCASE')} className={`hover:text-neon-cyan transition-colors ${currentPage === 'SHOWCASE' ? 'text-white' : ''}`}>Gallery</button>
            <button onClick={() => handleNav('ROADMAP')} className={`hover:text-neon-cyan transition-colors ${currentPage === 'ROADMAP' ? 'text-white' : ''}`}>Roadmap</button>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={onStart} className="hidden sm:block text-sm font-bold text-gray-300 hover:text-white transition-colors">Login</button>
            <Button onClick={onStart} className="bg-neon-cyan text-black hover:bg-white border-none font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              Start Creating
            </Button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <AnimatePresence mode='wait'>
         {renderContent()}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="bg-[#020202] border-t border-white/5 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => handleNav('HOME')}>
                <Logo className="w-8 h-6" />
                <span className="font-bold text-lg">OLLY</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                The premier AI-powered platform for generating unique, high-quality NFT assets and animation prompts.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><button onClick={() => handleNav('FEATURES')} className="hover:text-neon-cyan transition-colors">Features</button></li>
                <li><button onClick={() => handleNav('PRICING')} className="hover:text-neon-cyan transition-colors">Pricing</button></li>
                <li><button onClick={() => handleNav('ROADMAP')} className="hover:text-neon-cyan transition-colors">Roadmap</button></li>
                <li><button onClick={() => handleNav('SHOWCASE')} className="hover:text-neon-cyan transition-colors">Showcase</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><button onClick={() => handleNav('DOCS')} className="hover:text-neon-cyan transition-colors">Documentation</button></li>
                <li><button onClick={() => handleNav('API')} className="hover:text-neon-cyan transition-colors">API</button></li>
                <li><button onClick={() => handleNav('COMMUNITY')} className="hover:text-neon-cyan transition-colors">Community</button></li>
                <li><button onClick={() => handleNav('SUPPORT')} className="hover:text-neon-cyan transition-colors">Support</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><button onClick={() => handleNav('ABOUT')} className="hover:text-neon-cyan transition-colors">About</button></li>
                <li><button onClick={() => handleNav('CAREERS')} className="hover:text-neon-cyan transition-colors">Careers</button></li>
                <li><button onClick={() => handleNav('CONTACT')} className="hover:text-neon-cyan transition-colors">Contact</button></li>
                <li><button onClick={() => handleNav('TERMS')} className="hover:text-neon-cyan transition-colors">Legal</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600">© 2025 Olly. All rights reserved.</p>
            <div className="flex items-center gap-6">
               <Icons.Github className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer transition-colors" />
               <Icons.Twitter className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer transition-colors" />
               <Icons.Instagram className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer transition-colors" />
               <Icons.Youtube className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer transition-colors" />
            </div>
            <div className="text-xs text-gray-600 font-mono">
              Built with Gemini AI + Supabase
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
