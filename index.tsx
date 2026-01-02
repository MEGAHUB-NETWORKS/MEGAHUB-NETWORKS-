import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, BookOpen, MessageSquare, BookText, Trophy, User, Settings, 
  Menu, Bell, Play, Zap, Brain, Monitor, Share2, 
  ChevronLeft, ArrowRight, Stars as StarsIcon, Target, Keyboard, LayoutGrid
} from 'lucide-react';

// --- DATA ---
const SOLO_GAMES = [
  { id: 'typing', name: 'Typing Race', icon: Keyboard, color: 'blue', desc: 'Fastest fingers on the network.' },
  { id: 'memory', name: 'Neural Link', icon: Brain, color: 'purple', desc: 'Symmetric pattern matching.' },
  { id: 'aim', name: 'Kinetic Aim', icon: Target, color: 'red', desc: 'Precision pixel tracking.' },
  { id: 'snake', name: 'Data Snake', icon: Gamepad2, color: 'emerald', desc: 'Legacy grid traversal.' }
];

const MULTIPLAYER_ROOMS = [
  { id: 'R-402', name: 'Typing Blitz', players: 4, max: 10, mode: 'Public' },
  { id: 'R-109', name: 'Snake Duel', players: 2, max: 2, mode: 'Match' },
  { id: 'R-772', name: 'Logic Arena', players: 8, max: 10, mode: 'Public' }
];

// --- COMPONENTS ---
const DashboardHero = () => {
  const [slide, setSlide] = useState(0);
  const slides = [
    { title: "MEGAHUB NETWORKS", sub: "THE NEXT GENERATION", desc: "Experience low-latency gaming and unified social interaction in one portal.", color: "var(--neon-blue)" },
    { title: "ACADEMY PRO", sub: "LEVEL UP YOUR MIND", desc: "Unlock over 50 deep-dive modules in coding, history, and quantum physics.", color: "var(--neon-purple)" }
  ];

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="dashboard-hero">
      <div className="glass featured-carousel relative">
        <div className="carousel-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
          {slides.map((s, i) => (
            <div key={i} className="carousel-item">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-transparent z-0" />
              <div className="relative z-10">
                <motion.h1 
                  key={`t-${slide}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="megahub-branding text-5xl md:text-7xl mb-2"
                >
                  {s.title}
                </motion.h1>
                <p className="subtext-animate mb-6">{s.sub}</p>
                <p className="text-slate-400 max-w-md mb-8">{s.desc}</p>
                <button className="btn btn-primary px-10 py-4 text-lg">ENTER PORTAL</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-6 flex flex-col justify-between">
        <div>
          <h3 className="font-bold flex items-center gap-2 mb-4 text-slate-300">
            <Zap size={18} className="text-red-500" /> LIVE ARENA
          </h3>
          <div className="space-y-3">
            {MULTIPLAYER_ROOMS.map(room => (
              <div key={room.id} className="glass p-3 flex items-center justify-between border-slate-700/50 hover:border-red-500/30 cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-slate-500">{room.id}</p>
                  <p className="font-bold text-sm">{room.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">{room.players}/{room.max}</p>
                  <p className="text-[10px] uppercase font-black text-red-500">Join</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="btn btn-secondary w-full mt-6">QUICK PLAY</button>
      </div>
    </section>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState({ name: 'Guest', coins: 500, level: 1 });

  useEffect(() => {
    // Sync with global MegaHub state
    const sync = () => {
      const state = (window as any).MegaHub?.state;
      if (state) {
        setUser({ name: state.nickname, coins: state.coins, level: Math.floor(state.xp / 1000) + 1 });
      }
    };
    sync();
    const interval = setInterval(sync, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <DashboardHero />

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <LayoutGrid className="text-blue-500" /> TOP GAMES
            </h2>
            <button className="text-blue-500 text-sm font-bold hover:underline" onClick={() => window.location.href='games.html'}>View Arcade</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SOLO_GAMES.map(game => (
              <div key={game.id} className="card glass flex items-center gap-6 group cursor-pointer" onClick={() => window.location.href=`games.html?game=${game.id}`}>
                <div className={`w-16 h-16 bg-${game.color}-500/10 rounded-2xl flex items-center justify-center text-${game.color}-500 group-hover:scale-110`}>
                  <game.icon size={32} />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-lg">{game.name}</h4>
                  <p className="text-sm text-slate-500">{game.desc}</p>
                </div>
                <ArrowRight className="text-slate-700 group-hover:text-white transition-all" />
              </div>
            ))}
          </div>

          <div className="my-10 bg-slate-900/40 rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <span className="bg-yellow-500/20 text-yellow-500 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Daily Challenge</span>
              <h2 className="text-3xl font-black mb-2">NEURAL NETWORK CRACKER</h2>
              <p id="daily-fact" className="text-slate-400 italic">"The first bug was a literal moth found in a computer relay."</p>
              <button className="btn btn-accent mt-6 px-8">START CHALLENGE</button>
            </div>
            <div className="w-full md:w-64">
               {/* AD PLACEHOLDER */}
               <div className="glass p-2 flex flex-col items-center">
                 <span className="text-[9px] text-slate-600 mb-1">SPONSORED</span>
                 <div className="bg-slate-800 w-full h-[150px] rounded-xl animate-pulse flex items-center justify-center">
                   <Monitor className="text-slate-700" size={48} />
                 </div>
               </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="glass p-6 text-center">
             <div className="avatar-mini w-24 h-24 mx-auto mb-4 border-4 border-blue-500 relative">
               <div className="absolute inset-0 bg-blue-500/10" />
               <User className="w-full h-full p-4 text-slate-600" />
             </div>
             <h4 className="user-nickname font-black text-xl">{user.name}</h4>
             <p className="text-xs text-slate-500 uppercase tracking-widest mb-6">Level {user.level} Operator</p>
             <div className="flex items-center justify-center gap-2 mb-8 bg-yellow-500/10 py-2 rounded-xl text-yellow-500">
               <span className="font-black text-lg">🪙 {user.coins}</span>
             </div>
             <button className="btn btn-secondary w-full" onClick={() => window.location.href='shop.html'}>VIRTUAL SHOP</button>
          </div>

          <div className="glass p-6">
             <h3 className="font-bold flex items-center gap-2 mb-4 text-slate-300">
               <Trophy size={18} className="text-yellow-500" /> HALL OF FAME
             </h3>
             <div className="space-y-3">
               {[1, 2, 3].map(i => (
                 <div key={i} className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-3">
                     <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${i===1 ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-slate-500'}`}>{i}</span>
                     <span className="text-slate-300">Operator_{i}</span>
                   </div>
                   <span className="font-mono text-blue-500">{(5-i)*5000} XP</span>
                 </div>
               ))}
             </div>
          </div>
        </aside>
      </section>

      <footer className="mt-20 py-10 glass border-t border-slate-800/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Gamepad2 className="text-blue-500" />
            <span className="font-black tracking-tighter">MEGAHUB <span className="text-blue-500">NETWORKS</span></span>
          </div>
          <p className="text-xs text-slate-600">© 2025 ALL NETWORK NODES SECURED.</p>
          <div className="flex gap-4">
            <Share2 className="text-slate-600 hover:text-white cursor-pointer" size={18} />
          </div>
        </div>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);