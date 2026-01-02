// MegaHub Networks Core System - Global Definition
(function() {
  const getStorage = (key, fallback) => {
    try {
      const val = localStorage.getItem(key);
      if (val === null) return fallback;
      if (typeof fallback === 'object') return JSON.parse(val);
      return typeof fallback === 'number' ? parseInt(val) : val;
    } catch (e) {
      return fallback;
    }
  };

  window.MegaHub = {
    state: {
      nickname: getStorage('mh_nick', 'Operator_' + Math.floor(Math.random() * 9999)),
      xp: getStorage('mh_xp', 0),
      coins: getStorage('mh_coins', 1500),
      inventory: getStorage('mh_inv', []),
      equipped: getStorage('mh_eq', { frame: null, glow: null, badge: null }),
      settings: getStorage('mh_settings', {
        sound: true, volume: 50, effects: true, season: 'stars'
      })
    },

    init() {
      this.checkDaily();
      console.log("MegaHub Core Engine Online");
    },

    addXP(amt) {
      this.state.xp += amt;
      localStorage.setItem('mh_xp', this.state.xp);
      this.notify(`+${amt} XP NODE UPLOADED`);
    },

    addCoins(amt) {
      this.state.coins += amt;
      localStorage.setItem('mh_coins', this.state.coins);
      this.notify(`CREDITS SECURED: +${amt}`);
    },

    // Alias for learn.js compatibility
    showNotification(txt) {
      this.notify(txt);
    },

    notify(txt) {
      if (!document.body) return;
      const n = document.createElement('div');
      n.className = 'glass';
      n.style.cssText = 'position:fixed; bottom:100px; left:50%; transform:translateX(-50%); padding:12px 24px; z-index:9999; border-left:4px solid #3b82f6; pointer-events:none; font-weight:950; animation: slide-up-fade 0.5s forwards; letter-spacing: 2px; text-transform: uppercase; font-size: 0.75rem; color: white; background: rgba(15,23,42,0.9); border-radius: 8px;';
      n.textContent = txt;
      document.body.appendChild(n);
      setTimeout(() => { 
        n.style.opacity = '0'; 
        n.style.transition = 'opacity 0.5s ease';
        setTimeout(() => n.remove(), 500); 
      }, 3000);
    },

    checkDaily() {
      const last = localStorage.getItem('mh_last_login');
      const today = new Date().toDateString();
      if (last !== today) {
        localStorage.setItem('mh_last_login', today);
        this.addCoins(500);
        this.notify("Daily Node Connection Bonus: 500 Credits!");
      }
    },

    updateSetting(key, val) {
      this.state.settings[key] = val;
      localStorage.setItem('mh_settings', JSON.stringify(this.state.settings));
      this.notify(`Protocol ${key} updated`);
    }
  };

  window.Shop = {
    handleAction(id) {
      const items = [
        { id: 'frame-neon', price: 1000, type: 'frame' },
        { id: 'frame-gold', price: 2500, type: 'frame' },
        { id: 'glow-blue', price: 800, type: 'glow' },
        { id: 'badge-pro', price: 1500, type: 'badge' }
      ];
      const item = items.find(i => i.id === id);
      if (!item) return;

      if (window.MegaHub.state.inventory.includes(id)) {
        window.MegaHub.state.equipped[item.type] = window.MegaHub.state.equipped[item.type] === id ? null : id;
        localStorage.setItem('mh_eq', JSON.stringify(window.MegaHub.state.equipped));
        window.MegaHub.notify("Identity Config Updated");
      } else {
        if (window.MegaHub.state.coins >= item.price) {
          window.MegaHub.state.coins -= item.price;
          window.MegaHub.state.inventory.push(id);
          window.MegaHub.state.equipped[item.type] = id;
          localStorage.setItem('mh_coins', window.MegaHub.state.coins);
          localStorage.setItem('mh_inv', JSON.stringify(window.MegaHub.state.inventory));
          localStorage.setItem('mh_eq', JSON.stringify(window.MegaHub.state.equipped));
          window.MegaHub.notify("Asset Acquired Successfully");
        } else {
          window.MegaHub.notify("Error: Insufficient Credits");
        }
      }
    }
  };

  // Run initialization on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", () => window.MegaHub.init());
  } else {
    window.MegaHub.init();
  }
})();
