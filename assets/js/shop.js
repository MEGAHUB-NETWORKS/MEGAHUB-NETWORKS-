const Shop = {
  items: [
    { id: 'frame-neon', name: 'Neon Frame', price: 500, type: 'frame', color: '#22d3ee' },
    { id: 'frame-gold', name: 'Gold Frame', price: 1500, type: 'frame', color: '#fbbf24' },
    { id: 'glow-blue', name: 'Azure Glow', price: 800, type: 'glow', color: '#3b82f6' },
    { id: 'glow-red', name: 'Crimson Glow', price: 800, type: 'glow', color: '#ef4444' }
  ],

  init() {
    this.render();
  },

  render() {
    const container = document.getElementById('shop-items');
    if (!container) return;
    container.innerHTML = '';
    this.items.forEach(item => {
      const owned = MegaHub.state.inventory.includes(item.id);
      const eq = MegaHub.state.equipped[item.type] === item.id;
      const card = document.createElement('div');
      card.className = 'glass shop-item';
      card.innerHTML = `
        <div class="item-preview-box" style="border: ${item.type==='frame' ? '3px solid '+item.color : 'none'}; box-shadow: ${item.type==='glow' ? '0 0 10px '+item.color : 'none'}">
          <span style="color:${item.color}; font-weight:800">${item.name}</span>
        </div>
        <div style="text-align:center">
          <p style="font-weight:700">${item.name}</p>
          <p style="font-size:0.7rem; opacity:0.5">${item.type.toUpperCase()}</p>
        </div>
        <button class="btn w-full justify-center ${owned ? (eq ? 'btn-secondary' : 'btn-accent') : 'btn-primary'}" 
                onclick="Shop.handleAction('${item.id}')">
          ${owned ? (eq ? 'EQUIPPED' : 'EQUIP') : '🪙 ' + item.price}
        </button>`;
      container.appendChild(card);
    });
  },

  handleAction(id) {
    const item = this.items.find(i => i.id === id);
    if (MegaHub.state.inventory.includes(id)) {
      MegaHub.state.equipped[item.type] = MegaHub.state.equipped[item.type] === id ? null : id;
      localStorage.setItem('mh_eq', JSON.stringify(MegaHub.state.equipped));
      MegaHub.notify(MegaHub.state.equipped[item.type] ? `${item.name} Equipped` : "Unequipped");
      MegaHub.updateUI();
      this.render();
    } else {
      if (confirm(`Buy ${item.name} for ${item.price} Coins?`)) {
        if (MegaHub.state.coins >= item.price) {
          MegaHub.state.coins -= item.price;
          MegaHub.state.inventory.push(id);
          localStorage.setItem('mh_coins', MegaHub.state.coins);
          localStorage.setItem('mh_inv', JSON.stringify(MegaHub.state.inventory));
          MegaHub.notify("Purchase Successful!");
          MegaHub.updateUI();
          this.render();
        } else {
          MegaHub.notify("Insufficient Coins");
        }
      }
    }
  }
};
Shop.init();