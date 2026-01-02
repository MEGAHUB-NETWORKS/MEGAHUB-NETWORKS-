import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, Zap, Brain, Target, Keyboard, Trophy, User, ArrowRight, 
  Settings, ShoppingCart, MessageSquare, PlusCircle, Globe, Layout, 
  Search, Shield, Crown, PlayCircle, Coins, Flame, Info, ChevronRight,
  Palette, Eraser, Undo, Send, Clock, Layers, Star, Sun, CloudRain, Snowflake, 
  Zap as Thunder, Share2, LogOut, CheckCircle, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- TYPES ---
interface Player {
  id: string;
  name: string;
  coins: number;
  frame?: string;
  badge?: string;
}

interface Room {
  id: string;
  name: string;
  gameType: string;
  players: Player[];
  status: 'lobby' | 'playing' | 'ended';
  maxPlayers: number;
  turnIndex: number;
}

// --- CONSTANTS ---
const GAMES = [
  { id: 'skribbl', name: 'MegaDraw', icon: Palette, color: 'text-pink-400', desc: 'Drawing & Guessing' },
  { id: 'callbreak', name: 'Call Break', icon: Layers, color: 'text-emerald-400', desc: 'Strategic Card Game' },
  { id: 'typing', name: 'Type Battle', icon: Keyboard, color: 'text-blue-400', desc: 'Multiplayer WPM Race' },
  { id: 'snake', name: 'Snake Pit', icon: Gamepad2, color: 'text-cyan-400', desc: 'Competitive Survival' }
];

const SHOP_ITEMS = [
  { id: 'frame-neon', name: 'Neon Pulsar Frame', price: 1000, type: 'frame', color: '#22d3ee' },
  { id: 'frame-gold', name: 'Golden Zenith Frame', price: 2500, type: 'frame', color: '#fbbf24' },
  { id: 'glow-blue', name: 'Blue Cyber Glow', price: 800, type: 'glow', color: '#3b82f6' },
  { id: 'badge-pro', name: 'Pro Operator', price: 1500, type: 'badge', color: '#a855f7' }
];

// --- COMPONENTS ---

const WeatherCanvas = ({ type }: { type: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || type === 'off') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId: number;
    const particles: any[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();
    const create = () => {
      if (type === 'stars') return { x: Math.random() * canvas.width, y: Math.random() * canvas.height, s: Math.random() * 2, o: Math.random(), v: Math.random() * 0.02 };
      if (type === 'rain') return { x: Math.random() * canvas.width, y: -20, l: Math.random() * 20 + 10, v: Math.random() * 5 + 10 };
      return {};
    };
    for (let i = 0; i < 100; i++) particles.push(create());
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        if (type === 'stars') { p.o += p.v; ctx.globalAlpha = Math.abs(Math.sin(p.o)); ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fill(); }
        if (type === 'rain') { ctx.strokeStyle = 'rgba(174, 194, 224, 0.3)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y + p.l); ctx.stroke(); p.y += p.v; if (p.y > canvas.height) particles[i] = create(); }
      });
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, [type]);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[-1]" />;
};

const SkribblGame = ({ room, onWin }: { room: Room, onWin: (c: number) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [size, setSize] = useState(5);
  const [guess, setGuess] = useState('');
  const [timer, setTimer] = useState(60);
  const isDrawer = room.players[room.turnIndex].id === 'local';

  useEffect(() => {
    const t = setInterval(() => setTimer(v => v > 0 ? v - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  const draw = (e: React.MouseEvent) => {
    if (!drawing || !isDrawer) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = size; ctx.lineCap = 'round'; ctx.strokeStyle = color;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke(); ctx.beginPath(); ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const submitGuess = () => {
    if (guess.toLowerCase() === 'robot') {
      confetti(); (window as any).MegaHub.addCoins(250); onWin(250); setGuess('');
    } else { (window as any).Sound?.playWrong(); }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="glass p-4 flex justify-between items-center bg-slate-900/80">
        <div className="flex items-center gap-4">
          <Clock className="text-yellow-500" /> <span className="font-mono text-2xl font-black">{timer}s</span>
        </div>
        <div className="font-black text-xl uppercase tracking-widest">
          {isDrawer ? 'DRAW THE WORD: ROBOT' : 'GUESS THE DRAWING!'}
        </div>
        <div className="flex gap-2">
          {['#ffffff', '#ef4444', '#3b82f6', '#10b981'].map(c => (
            <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`} style={{background: c}} />
          ))}
          <button onClick={() => { const ctx = canvasRef.current?.getContext('2d'); if(ctx) { ctx.fillStyle='#020617'; ctx.fillRect(0,0,800,500); }}} className="p-2 glass"><Eraser size={18} /></button>
        </div>
      </div>
      <canvas ref={canvasRef} width={800} height={400} onMouseDown={() => { if(isDrawer) setDrawing(true); }} onMouseUp={() => { setDrawing(false); canvasRef.current?.getContext('2d')?.beginPath(); }} onMouseMove={draw} className="w-full aspect-video bg-slate-950 rounded-2xl cursor-crosshair border-4 border-slate-800" />
      {!isDrawer && (
        <div className="flex gap-2">
          <input type="text" value={guess} onChange={e => setGuess(e.target.value)} className="flex-1 glass p-4 outline-none text-xl" placeholder="Type your guess..." onKeyDown={e => e.key === 'Enter' && submitGuess()} />
          <button onClick={submitGuess} className="btn btn-primary px-10">GUESS</button>
        </div>
      )}
    </div>
  );
};

const CallBreakGame = ({ onWin }: { onWin: (c: number) => void }) => {
  const [hand, setHand] = useState(['A♠', 'K♠', 'Q♠', 'J♠', '10♠', 'A♥', 'K♥', 'Q♥']);
  const [table, setTable] = useState<string[]>([]);
  const play = (c: string) => {
    setTable([...table, c]); setHand(h => h.filter(x => x !== c));
    (window as any).Sound?.playLightClick();
    if (hand.length === 1) { confetti(); onWin(300); }
  };
  return (
    <div className="flex flex-col gap-8 py-10">
      <div className="h-64 flex items-center justify-center bg-emerald-900/10 rounded-full border-4 border-emerald-500/20 relative">
        <div className="flex gap-4">
          {table.map((c, i) => (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} key={i} className="w-24 h-32 bg-white text-black rounded-xl flex items-center justify-center font-black text-2xl shadow-2xl">
              {c}
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {hand.map(c => (
          <button key={c} onClick={() => play(c)} className="w-20 h-28 bg-white text-black rounded-lg flex items-center justify-center font-black text-xl hover:-translate-y-6 transition-transform shadow-xl">
            {c}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [view, setView] = useState('dashboard');
  const [user, setUser] = useState({ name: 'Guest', coins: 0, xp: 0, level: 1, equipped: {} as any });
  const [room, setRoom] = useState<Room | null>(null);
  const [weather, setWeather] = useState('stars');
  const [diagnostics, setDiagnostics] = useState<{ name: string; status: 'ok' | 'fail' | 'testing' }[]>([]);

  useEffect(() => {
    const sync = () => {
      const s = (window as any).MegaHub?.state;
      if (s) {
        setUser({ name: s.nickname, coins: s.coins, xp: s.xp, level: Math.floor(s.xp / 1000) + 1, equipped: s.equipped });
        setWeather(s.settings.season);
      }
    };
    const i = setInterval(sync, 1000);
    return () => clearInterval(i);
  }, []);

  const runTests = () => {
    const tests = ['UI Engine', 'Sound Node', 'Ads Network', 'Room Matcher', 'Currency Sync'];
    setDiagnostics(tests.map(t => ({ name: t, status: 'testing' })));
    tests.forEach((t, i) => {
      setTimeout(() => {
        setDiagnostics(prev => prev.map(p => p.name === t ? { ...p, status: 'ok' } : p));
        if (i === tests.length - 1) (window as any).MegaHub.notify("Diagnostics Complete!");
      }, 500 * (i + 1));
    });
  };

  const quickPlay = () => {
    (window as any).MegaHub.notify("Finding optimal node...");
    setTimeout(() => {
      setRoom({ id: 'MH-' + Math.random().toString(36).substring(2,6).toUpperCase(), name: 'Global Arena', gameType: 'skribbl', status: 'playing', maxPlayers: 10, players: [{ id: 'local', name: user.name, coins: user.coins }, { id: 'bot1', name: 'Nero_Bot', coins: 1200 }], turnIndex: 0 });
      setView('arena');
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      <WeatherCanvas type={weather} />
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-[1000] glass px-8 py-4 flex justify-between items-center h-[72px]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dashboard')}>
          <Zap className="text-blue-500 fill-blue-500" />
          <h1 className="megahub-branding text-2xl font-black">MEGAHUB</h1>
        </div>
        <nav className="hidden md:flex gap-8">
          {['dashboard', 'arena', 'arcade', 'shop', 'profile'].map(v => (
            <button key={v} onClick={() => setView(v)} className={`uppercase text-xs font-black tracking-widest transition-colors ${view === v ? 'text-blue-400' : 'text-slate-500 hover:text-white'}`}>{v}</button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="glass px-4 py-1.5 rounded-full flex items-center gap-2 border-yellow-500/30">
            <Coins className="text-yellow-500" size={16} /> <span className="font-black text-yellow-500">{user.coins}</span>
          </div>
          <div className="profile-chip glass p-1 flex items-center gap-3 pr-4 cursor-pointer" onClick={() => setView('profile')}>
            <div className={`w-8 h-8 rounded-full bg-slate-800 avatar-mini ${user.equipped.frame ? 'equipped-' + user.equipped.frame : ''}`} />
            <span className="text-sm font-black hidden sm:block">{user.name}</span>
          </div>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-[1400px] mx-auto pb-32">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="dash">
              <div className="text-center py-20">
                <motion.h1 
                  animate={{ filter: ["drop-shadow(0 0 10px #3b82f6)", "drop-shadow(0 0 30px #a855f7)", "drop-shadow(0 0 10px #3b82f6)"] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-7xl md:text-9xl font-black megahub-branding tracking-tighter"
                >
                  MEGAHUB NETWORKS
                </motion.h1>
                <p className="text-slate-500 tracking-[0.8em] font-black uppercase text-lg mt-4 subtext-animate">Play • Learn • Connect</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="glass p-10 bg-gradient-to-br from-blue-600/20 to-transparent relative group overflow-hidden">
                    <Flame className="absolute -right-10 -bottom-10 w-64 h-64 text-blue-500/10 group-hover:scale-125 transition-transform" />
                    <h2 className="text-5xl font-black mb-4">ARENA ACCESS: <span className="text-emerald-400">READY</span></h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-lg">Enter the global neural grid. Compete against the best operators in real-time drawing, strategy, and typing battles.</p>
                    <div className="flex gap-4">
                      <button onClick={quickPlay} className="btn btn-primary px-12 py-4 text-lg">QUICK PLAY</button>
                      <button onClick={() => setView('shop')} className="btn glass px-12 py-4 text-lg">BROWSE MARKET</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {GAMES.map(g => (
                      <div key={g.id} onClick={() => setView('arcade')} className="glass p-6 text-center hover:border-blue-500 cursor-pointer group">
                        <g.icon className={`${g.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} size={40} />
                        <h4 className="font-black text-sm uppercase">{g.name}</h4>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="glass p-6 border-l-4 border-blue-500">
                    <h3 className="font-black mb-4 flex items-center gap-2"><Settings size={18} /> DIAGNOSTICS</h3>
                    <div className="space-y-3 mb-6">
                      {diagnostics.length > 0 ? diagnostics.map(d => (
                        <div key={d.name} className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 uppercase font-bold">{d.name}</span>
                          {d.status === 'testing' ? <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /> : <CheckCircle size={14} className="text-emerald-500" />}
                        </div>
                      )) : <p className="text-xs text-slate-600 italic">No diagnostics run yet.</p>}
                    </div>
                    <button onClick={runTests} className="btn btn-accent w-full text-xs">RUN SELF-TEST</button>
                  </div>
                  <div className="glass p-6">
                    <h3 className="font-black mb-4 flex items-center gap-2"><Trophy size={18} className="text-yellow-500" /> TOP OPERATORS</h3>
                    {[1,2,3].map(i => (
                      <div key={i} className="flex justify-between mb-3 text-sm">
                        <span className="font-bold text-slate-400">#0{i} Nero_X_{i}</span>
                        <span className="font-mono text-blue-400 font-bold">{5000 - i*250} XP</span>
                      </div>
                    ))}
                  </div>
                  {/* AD SECTION */}
                  <div className="glass p-4 text-center ad-placeholder" data-type="300x250">
                    <span className="text-[10px] text-slate-700 font-black tracking-widest mb-2 block">SPONSORED NODE</span>
                    <div className="bg-slate-900 rounded-xl aspect-square flex items-center justify-center">
                       <script type="text/javascript">
                         atOptions = { 'key' : '4f52a4b1f5dba3d1b6bf80d44634631d', 'format' : 'iframe', 'height' : 250, 'width' : 300, 'params' : {} };
                       </script>
                       <script type="text/javascript" src="https://www.highperformanceformat.com/4f52a4b1f5dba3d1b6bf80d44634631d/invoke.js"></script>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'arena' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="arena">
              {!room ? (
                <div className="space-y-10">
                  <div className="flex justify-between items-end">
                    <div>
                      <h1 className="text-5xl font-black mb-2">ARENA PORTAL</h1>
                      <p className="text-slate-500 font-black uppercase tracking-widest">Connect to global game nodes</p>
                    </div>
                    <button onClick={quickPlay} className="btn btn-primary px-8 py-3">QUICK JOIN</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1,2,3].map(i => (
                      <div key={i} className="glass p-8 hover:border-emerald-500/50 cursor-pointer group" onClick={quickPlay}>
                        <div className="flex justify-between items-start mb-6">
                          <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Active</div>
                          <Globe className="text-slate-700" size={20} />
                        </div>
                        <h3 className="text-2xl font-black mb-2">Network Hub 0{i}</h3>
                        <p className="text-slate-500 text-sm mb-8">Mixed Modes • Ranked Arena</p>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-400 font-black">4/10 USERS</span>
                          <span className="text-xs font-black uppercase group-hover:text-emerald-400 transition-colors">Join →</span>
                        </div>
                      </div>
                    ))}
                    <div className="glass p-8 border-dashed border-slate-700 flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 transition-opacity">
                      <PlusCircle className="text-slate-600 mb-4" size={48} />
                      <p className="font-black text-slate-500">Wait for Node signal...</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3 space-y-6">
                    <div className="glass p-6 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <button onClick={() => setRoom(null)} className="p-2 glass"><LogOut className="rotate-180" size={20} /></button>
                        <h2 className="text-2xl font-black tracking-tighter uppercase">{room.name}</h2>
                      </div>
                      <div className="flex gap-4">
                        <div className="glass px-4 py-2 font-mono text-sm text-blue-400">NODE: {room.id}</div>
                        <button onClick={() => { navigator.clipboard.writeText(room.id); (window as any).MegaHub.notify("Link Copied!"); }} className="btn btn-secondary px-6"><Share2 size={16} /></button>
                      </div>
                    </div>
                    <div className="glass p-4 min-h-[500px] flex flex-col justify-center bg-slate-950/50">
                      {room.gameType === 'skribbl' ? <SkribblGame room={room} onWin={() => {}} /> : <CallBreakGame onWin={() => {}} />}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="glass p-6 h-[400px] flex flex-col">
                      <h3 className="font-black text-xs uppercase text-slate-500 mb-4">Network Comms</h3>
                      <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-2 custom-scrollbar">
                        <div className="chat-msg other bg-slate-800/50">Node connection established.</div>
                        <div className="chat-msg other bg-slate-800/50">Nero_Bot: GLHF.</div>
                        <div className="chat-msg self">Ready.</div>
                      </div>
                      <div className="flex gap-2">
                        <input type="text" className="flex-1 glass p-2 text-sm outline-none" placeholder="Message..." />
                        <button className="btn btn-primary p-2"><Send size={16} /></button>
                      </div>
                    </div>
                    <div className="glass p-6">
                      <h3 className="font-black text-xs uppercase text-slate-500 mb-4">In Node ({room.players.length}/10)</h3>
                      <div className="space-y-3">
                        {room.players.map(p => (
                          <div key={p.id} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 avatar-mini" />
                            <span className="font-bold text-sm">{p.name} {p.id === 'local' && '(You)'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === 'arcade' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="arcade">
              <h1 className="text-5xl font-black mb-2">ARCADE HUB</h1>
              <p className="text-slate-500 font-black uppercase tracking-widest mb-10">Single Player Training Protocols</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {GAMES.map(g => (
                  <div key={g.id} className="card glass p-10 text-center hover:scale-105 transition-all group cursor-pointer" onClick={() => { setRoom({ id: 'SOLO', name: g.name, gameType: g.id === 'callbreak' ? 'callbreak' : 'skribbl', status: 'playing', maxPlayers: 1, players: [{id:'local', name:user.name, coins:user.coins}], turnIndex: 0 }); setView('arena'); }}>
                    <div className={`w-20 h-20 mx-auto rounded-3xl bg-slate-900 flex items-center justify-center ${g.color} mb-6 group-hover:bg-slate-800 transition-all`}>
                      <g.icon size={48} />
                    </div>
                    <h3 className="text-2xl font-black mb-2">{g.name}</h3>
                    <p className="text-slate-500 text-sm mb-8">{g.desc}</p>
                    <button className="btn btn-primary w-full">INITIATE SEQUENCE</button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'shop' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="shop">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h1 className="text-5xl font-black mb-2">VIRTUAL MARKET</h1>
                  <p className="text-slate-500 font-black uppercase tracking-widest">Augment your presence</p>
                </div>
                <div className="glass px-6 py-3 flex items-center gap-3 text-2xl font-black text-yellow-500">
                  <Coins /> {user.coins}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {SHOP_ITEMS.map(item => (
                  <div key={item.id} className="glass p-6 text-center flex flex-col gap-4 group">
                    <div className="aspect-square bg-slate-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                      <div className={`w-24 h-24 rounded-full border-4 relative z-10 flex items-center justify-center`} style={{borderColor: item.color, boxShadow: `0 0 20px ${item.color}40`}}>
                        <User size={48} className="text-slate-700" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-black text-lg">{item.name}</h4>
                      <p className="text-xs font-black text-blue-400 uppercase tracking-widest">{item.type}</p>
                    </div>
                    <button onClick={() => (window as any).Shop.handleAction(item.id)} className="btn btn-primary w-full py-3">🪙 {item.price}</button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="profile" className="max-w-4xl mx-auto space-y-8">
              <div className="glass p-10 flex flex-col md:flex-row items-center gap-10">
                <div className={`w-48 h-48 rounded-full bg-slate-800 border-4 border-blue-500 relative flex items-center justify-center ${user.equipped.frame ? 'equipped-' + user.equipped.frame : ''}`}>
                  <User size={80} className="text-slate-600" />
                  <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black px-4 py-1 rounded-full font-black text-sm shadow-xl">LVL {user.level}</div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-5xl font-black mb-2 megahub-branding uppercase">{user.name}</h1>
                  <p className="text-slate-500 font-black uppercase tracking-[0.4em] mb-8">Operator Identified</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass p-6 bg-slate-900/50">
                      <p className="text-xs text-slate-500 font-black mb-1 uppercase">Total Credits</p>
                      <p className="text-3xl font-black text-yellow-500">🪙 {user.coins}</p>
                    </div>
                    <div className="glass p-6 bg-slate-900/50">
                      <p className="text-xs text-slate-500 font-black mb-1 uppercase">XP Quotient</p>
                      <p className="text-3xl font-black text-blue-500">{user.xp}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-8 space-y-6">
                  <h3 className="text-xl font-black uppercase flex items-center gap-2"><Settings size={20} /> Interface</h3>
                  <div className="flex justify-between items-center">
                    <label className="font-bold">Season FX</label>
                    <select value={weather} onChange={e => (window as any).MegaHub.updateSetting('season', e.target.value)} className="glass p-2 bg-transparent outline-none border-slate-700">
                      <option value="stars">Stars</option><option value="rain">Rain</option><option value="off">Off</option>
                    </select>
                  </div>
                  <button onClick={runTests} className="btn btn-accent w-full font-black tracking-widest">RE-RUN DIAGNOSTICS</button>
                  <button onClick={() => { localStorage.clear(); location.reload(); }} className="w-full text-red-500 text-[10px] font-black uppercase tracking-widest hover:underline">Full System Wipe</button>
                </div>
                <div className="glass p-8">
                  <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2"><Crown size={20} /> Assets</h3>
                  <div className="flex flex-wrap gap-4">
                    {SHOP_ITEMS.slice(0, 3).map(i => (
                      <div key={i.id} className="w-16 h-16 glass flex items-center justify-center text-blue-500 opacity-20 border-dashed"><PlusCircle /></div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-6">Vault empty. Visit market to acquire gear.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER NAV */}
      <nav className="fixed bottom-0 w-full glass z-[1001] border-t border-white/10 px-6 py-4 flex justify-around items-center h-[80px]">
        {[
          { id: 'dashboard', icon: Layout, label: 'Dash' },
          { id: 'arena', icon: Globe, label: 'Arena' },
          { id: 'arcade', icon: Gamepad2, label: 'Arcade' },
          { id: 'shop', icon: ShoppingCart, label: 'Market' },
          { id: 'profile', icon: User, label: 'User' }
        ].map(link => (
          <button key={link.id} onClick={() => { setView(link.id); setRoom(null); }} className={`flex flex-col items-center gap-1 transition-all ${view === link.id ? 'text-blue-500 scale-110' : 'text-slate-500 hover:text-white'}`}>
            <link.icon size={24} strokeWidth={view === link.id ? 3 : 2} />
            <span className="text-[10px] font-black uppercase tracking-tighter">{link.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

window.addEventListener('DOMContentLoaded', () => {
  const root = createRoot(document.getElementById('root')!);
  root.render(<App />);
  console.log("%cMEGAHUB NETWORKS %cONLINE", "color: #3b82f6; font-weight: 900; font-size: 20px;", "color: #10b981; font-weight: 900; font-size: 20px;");
});
