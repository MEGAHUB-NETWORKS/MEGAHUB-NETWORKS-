// MegaHub Networks Core
var RandomContent = {
  facts: [
    "The first computer mouse was made of wood.",
    "90% of the world's currency is digital.",
    "A computer's speed is measured in Hertz.",
    "Python was named after Monty Python, not the snake.",
    "The first bug in history was a literal moth.",
    "Email was invented before the World Wide Web.",
    "The average gamer is 35 years old."
  ],
  getFact() { return this.facts[Math.floor(Math.random() * this.facts.length)]; }
};
window.RandomContent = RandomContent;

const MegaHub = {
  state: {
    nickname: localStorage.getItem('mh_nick') || 'Guest_Player',
    xp: parseInt(localStorage.getItem('mh_xp')) || 0,
    coins: parseInt(localStorage.getItem('mh_coins')) || 1000,
    inventory: JSON.parse(localStorage.getItem('mh_inv')) || [],
    equipped: JSON.parse(localStorage.getItem('mh_eq')) || { frame: null, glow: null, chat: 'default' },
    settings: JSON.parse(localStorage.getItem('mh_settings')) || {
      sound: true, volume: 50, theme: 'dark', effects: true, season: 'stars'
    }
  },

  init() {
    this.applySettings();
    this.updateUI();
    this.bindGlobalEvents();
    this.checkDaily();
    console.log("MegaHub Networks Online");
  },

  updateUI() {
    document.querySelectorAll('.user-nickname').forEach(el => {
      el.textContent = this.state.nickname;
      if (this.state.equipped.glow === 'glow-blue') el.style.color = 'var(--neon-blue)';
      if (this.state.equipped.glow === 'glow-red') el.style.color = '#ef4444';
    });
    document.querySelectorAll('.user-coins').forEach(el => el.textContent = this.state.coins);
    document.querySelectorAll('.user-level').forEach(el => el.textContent = Math.floor(this.state.xp / 500) + 1);
    
    // Apply Frames
    const frameClass = this.state.equipped.frame ? `equipped-${this.state.equipped.frame}` : '';
    document.querySelectorAll('.avatar-mini').forEach(el => {
      el.className = `avatar-mini ${frameClass}`;
    });
  },

  addCoins(amt) {
    this.state.coins += amt;
    localStorage.setItem('mh_coins', this.state.coins);
    this.updateUI();
    this.notify(`+${amt} Coins!`);
  },

  addXP(amt) {
    this.state.xp += amt;
    localStorage.setItem('mh_xp', this.state.xp);
    this.updateUI();
    this.notify(`+${amt} XP!`);
  },

  notify(txt) {
    const n = document.createElement('div');
    n.className = 'glass';
    n.style.cssText = 'position:fixed; bottom:80px; left:50%; transform:translateX(-50%); padding:12px 24px; z-index:9999; border-left:4px solid var(--primary); pointer-events:none; font-weight:bold; animation: slide-up-fade 0.5s forwards;';
    n.textContent = txt;
    document.body.appendChild(n);
    setTimeout(() => { n.style.opacity = '0'; setTimeout(() => n.remove(), 500); }, 3000);
  },

  checkDaily() {
    const last = localStorage.getItem('mh_last_daily');
    const today = new Date().toDateString();
    if (last !== today) {
      localStorage.setItem('mh_last_daily', today);
      this.addCoins(200);
      this.notify("Daily Bonus: 200 Coins!");
    }
  },

  applySettings() {
    document.body.classList.toggle('light-mode', this.state.settings.theme === 'light');
    if (window.Effects) window.Effects.update();
  },

  bindGlobalEvents() {
    const mt = document.getElementById('menu-toggle');
    const sb = document.getElementById('sidebar');
    const ol = document.getElementById('sidebar-overlay');
    if (mt && sb && ol) {
      mt.onclick = () => { sb.classList.add('open'); ol.classList.add('open'); };
      ol.onclick = () => { sb.classList.remove('open'); ol.classList.remove('open'); };
    }
  }
};

window.MegaHub = MegaHub;
MegaHub.init();