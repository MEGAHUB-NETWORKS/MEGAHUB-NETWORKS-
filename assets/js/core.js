// MegaHub Networks Core System
window.RandomContent = {
  facts: [
    "The first computer mouse was made of wood.",
    "90% of the world's currency is digital.",
    "A computer's speed is measured in Hertz.",
    "Python was named after Monty Python, not the snake.",
    "The first bug in history was a literal moth.",
    "The domain symbolics.com was the first registered .com.",
    "The first ever website is still live today at CERN."
  ],
  getFact() {
    return this.facts[Math.floor(Math.random() * this.facts.length)];
  }
};

const MegaHub = {
  state: {
    nickname: localStorage.getItem('mh_nick') || 'Guest_Player',
    xp: parseInt(localStorage.getItem('mh_xp')) || 0,
    coins: parseInt(localStorage.getItem('mh_coins')) || 500,
    inventory: JSON.parse(localStorage.getItem('mh_inv')) || [],
    equipped: JSON.parse(localStorage.getItem('mh_eq')) || { frame: null, glow: null, chat: 'standard' },
    streak: parseInt(localStorage.getItem('mh_streak')) || 0,
    settings: JSON.parse(localStorage.getItem('mh_settings')) || {
      sound: true, volume: 50, theme: 'dark', season: 'stars', effects: true
    }
  },

  init() {
    this.applySettings();
    this.updateUI();
    this.checkDaily();
    this.bindGlobalEvents();
    console.log("MegaHub Core Online");
  },

  updateUI() {
    document.querySelectorAll('.user-nickname').forEach(el => {
      el.textContent = this.state.nickname;
      if (this.state.equipped.glow === 'glow-blue') el.style.color = '#3b82f6';
      if (this.state.equipped.glow === 'glow-red') el.style.color = '#ef4444';
      if (this.state.equipped.glow === 'glow-gold') el.style.color = '#fbbf24';
    });
    document.querySelectorAll('.user-coins').forEach(el => el.textContent = this.state.coins);
    document.querySelectorAll('.user-level').forEach(el => el.textContent = Math.floor(this.state.xp / 1000) + 1);
    
    // Apply frames
    const frameClass = this.state.equipped.frame ? `equipped-${this.state.equipped.frame}` : '';
    document.querySelectorAll('.avatar-mini').forEach(el => {
      el.className = `avatar-mini ${frameClass}`;
    });

    // Update daily fact
    const factEl = document.getElementById('daily-fact');
    if (factEl) factEl.textContent = window.RandomContent.getFact();
  },

  addXP(amt) {
    this.state.xp += amt;
    localStorage.setItem('mh_xp', this.state.xp);
    this.updateUI();
    this.notify(`+${amt} XP!`);
  },

  addCoins(amt) {
    this.state.coins += amt;
    localStorage.setItem('mh_coins', this.state.coins);
    this.updateUI();
    this.notify(`+${amt} Coins! Earned`);
  },

  notify(msg) {
    const toast = document.createElement('div');
    toast.className = 'glass';
    toast.style.cssText = 'position:fixed; bottom:80px; left:50%; transform:translateX(-50%); padding:12px 24px; z-index:9999; border-left:4px solid var(--primary); font-weight:bold; animation: slide-up-fade 0.5s forwards;';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  },

  checkDaily() {
    const last = localStorage.getItem('mh_last_login');
    const today = new Date().toDateString();
    if (last !== today) {
      this.state.streak++;
      localStorage.setItem('mh_streak', this.state.streak);
      localStorage.setItem('mh_last_login', today);
      const bonus = 100 + (this.state.streak * 10);
      this.addCoins(bonus);
      this.notify(`Streak Day ${this.state.streak}! Bonus: ${bonus} Coins`);
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