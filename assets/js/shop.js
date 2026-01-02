const Shop = {
  items: [
    { id: 'frame-neon', name: 'Neon Pulsar Frame', price: 1000, type: 'frame', color: '#22d3ee' },
    { id: 'frame-gold', name: 'Golden Zenith Frame', price: 2500, type: 'frame', color: '#fbbf24' },
    { id: 'frame-silver', name: 'Reflective Frame', price: 500, type: 'frame', color: '#cbd5e1' },
    { id: 'glow-blue', name: 'Blue Cyber Glow', price: 800, type: 'glow', color: '#3b82f6' },
    { id: 'glow-red', name: 'Red Alert Glow', price: 800, type: 'glow', color: '#ef4444' },
    { id: 'glow-gold', name: 'Midas Touch', price: 2000, type: 'glow', color: '#fbbf24' },
    { id: 'badge-pro', name: 'Pro Operator Badge', price: 1500, type: 'badge', color: '#a855f7' }
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
        <div class="item-preview-box" style="border: ${item.type==='frame' ? '3px solid '+item.color : 'none'}; box-shadow: ${item.type==='glow' ? '0 0 15px '+item.color : 'none'}">
          <span style="color:${item.color}; font-weight:900; font-size:1.2rem; text-shadow:0 0 10px rgba(0,0,0,0.5)">${item.name.split(' ')[0]}</span>
        </div>
        <div style="text-align:center">
          <h4 style="font-weight:900; margin-bottom:4px">${item.name}</h4>
          <p style="font-size:0.7rem; color:var(--primary); font-weight:bold; letter-spacing:1px">${item.type.toUpperCase()}</p>
        </div>
        <button class="btn w-full justify-center ${owned ? (eq ? 'btn-secondary' : 'btn-accent') : 'btn-primary'}" 
                onclick="Shop.handleAction('${item.id}')">
          ${owned ? (eq ? 'EQUIPPED' : 'EQUIP ITEM') : '🪙 ' + item.price}
        </button>
      `;
      container.appendChild(card);
    });
  },

  handleAction(id) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;

    if (MegaHub.state.inventory.includes(id)) {
      // Toggle Equip
      if (MegaHub.state.equipped[item.type] === id) {
        MegaHub.state.equipped[item.type] = null;
      } else {
        MegaHub.state.equipped[item.type] = id;
      }
      localStorage.setItem('mh_eq', JSON.stringify(MegaHub.state.equipped));
      MegaHub.notify(MegaHub.state.equipped[item.type] ? `${item.name} Equipped` : `${item.name} Unequipped`);
      MegaHub.updateUI();
      this.render();
    } else {
      // Purchase with Confirmation
      this.showModal(item);
    }
  },

  showModal(item) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="glass modal-content animate-in zoom-in duration-300">
        <h2 style="font-size:2rem; font-weight:950; margin-bottom:10px">CONFIRM ACCESS</h2>
        <p style="color:#94a3b8; margin-bottom:24px">Do you want to authorize the transaction of 🪙 ${item.price} for the ${item.name}?</p>
        <div style="display:flex; gap:12px">
          <button class="btn glass flex-1" onclick="this.closest('.modal-overlay').remove()">ABORT</button>
          <button class="btn btn-primary flex-1" id="confirm-buy">AUTHORIZE</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#confirm-buy').onclick = () => {
      if (MegaHub.state.coins >= item.price) {
        MegaHub.state.coins -= item.price;
        MegaHub.state.inventory.push(item.id);
        // Auto-equip new item
        MegaHub.state.equipped[item.type] = item.id;
        
        localStorage.setItem('mh_coins', MegaHub.state.coins);
        localStorage.setItem('mh_inv', JSON.stringify(MegaHub.state.inventory));
        localStorage.setItem('mh_eq', JSON.stringify(MegaHub.state.equipped));
        
        MegaHub.notify("Transaction Secure. Item Added.");
        MegaHub.updateUI();
        modal.remove();
        this.render();
      } else {
        MegaHub.notify("Insufficient Credits.");
        modal.remove();
      }
    };
  }
};

Shop.init();