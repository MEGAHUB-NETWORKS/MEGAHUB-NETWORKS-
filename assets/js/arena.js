const Arena = {
  rooms: [],
  currentRoom: null,

  init() {
    this.refreshRooms();
    const urlParams = new URLSearchParams(window.location.search);
    const joinCode = urlParams.get('join');
    if (joinCode) this.joinRoom(joinCode);
  },

  refreshRooms() {
    // Simulated active rooms
    this.rooms = [
      { id: 'MH-402', name: 'Neural Typers', players: 4, mode: 'Public' },
      { id: 'MH-109', name: 'Grid Battles', players: 8, mode: 'Public' },
      { id: 'MH-882', name: 'Logic Loop', players: 1, mode: 'Quick' }
    ];
  },

  quickPlay() {
    MegaHub.notify("Searching network nodes...");
    setTimeout(() => {
      const room = this.rooms[Math.floor(Math.random() * this.rooms.length)];
      this.joinRoom(room.id);
    }, 1200);
  },

  createRoom() {
    const code = 'MH-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    this.joinRoom(code, true);
  },

  joinRoom(code, isHost = false) {
    this.currentRoom = { id: code, isHost };
    document.getElementById('arena-lobby').style.display = 'none';
    const roomView = document.getElementById('room-view');
    roomView.style.display = 'block';
    document.getElementById('room-title').textContent = `ARENA NODE: ${code}`;
    
    this.renderPlayers(["You", "Stranger_42", "NetBot_Beta"]);
    this.addSystemMsg(`Connected to Node ${code}`);
    
    if (isHost) {
      this.addSystemMsg("You are the host. Share code to invite.");
    }
  },

  renderPlayers(names) {
    const list = document.getElementById('player-list');
    if (!list) return;
    list.innerHTML = names.map(n => `
      <div class="glass" style="padding:10px; margin-bottom:8px; display:flex; items-center gap:10px">
        <div class="avatar-mini" style="width:24px; height:24px"></div>
        <span style="font-weight:bold; font-size:0.8rem">${n}</span>
      </div>
    `).join('');
  },

  addSystemMsg(txt) {
    const box = document.getElementById('chat-messages');
    if (!box) return;
    const d = document.createElement('div');
    d.style.cssText = 'font-size:0.75rem; color:#64748b; text-align:center; margin:15px 0; font-family:monospace;';
    d.textContent = `[SYSTEM] > ${txt}`;
    box.appendChild(d);
  },

  sendMsg() {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim()) return;
    
    const box = document.getElementById('chat-messages');
    const m = document.createElement('div');
    m.className = 'chat-bubble self';
    m.textContent = input.value;
    box.appendChild(m);
    
    const val = input.value;
    input.value = '';
    box.scrollTop = box.scrollHeight;
    
    // Bot response simulation
    setTimeout(() => {
      const r = document.createElement('div');
      r.className = 'chat-bubble other';
      r.textContent = val.length > 5 ? "Data packet received." : "ACK.";
      box.appendChild(r);
      box.scrollTop = box.scrollHeight;
      if (window.Sound) window.Sound.playLightClick();
    }, 1000);
  },

  startPrivateChat() {
    MegaHub.notify("Establishing secure 1-on-1 link...");
    setTimeout(() => {
      this.joinRoom("PRIVATE_NODE_X");
    }, 1500);
  }
};

window.Arena = Arena;
Arena.init();