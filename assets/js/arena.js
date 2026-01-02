window.Arena = {
  rooms: JSON.parse(localStorage.getItem('mh_rooms')) || [],
  currentRoom: null,

  init() {
    this.refresh();
    setInterval(() => this.refresh(), 5000); // Live refresh simulation
  },

  refresh() {
    // Simulated active rooms if none exist
    if (this.rooms.length === 0) {
      this.rooms = [
        { id: 'MH-402', name: 'Elite Typers', players: 4, max: 10, mode: 'Public' },
        { id: 'MH-109', name: 'Snake Pit', players: 8, max: 10, mode: 'Public' }
      ];
    }
    const lobbyList = document.getElementById('arena-lobby-rooms');
    if (lobbyList) {
      lobbyList.innerHTML = this.rooms.map(room => `
        <div class="card glass p-4 flex justify-between items-center">
          <div>
            <h4 class="font-black">${room.name}</h4>
            <p class="text-xs text-slate-500">CODE: ${room.id}</p>
          </div>
          <div class="text-right">
            <span class="text-sm font-bold text-blue-400">${room.players}/${room.max}</span>
            <button class="btn btn-primary ml-4" onclick="Arena.joinRoom('${room.id}')">JOIN</button>
          </div>
        </div>
      `).join('');
    }
  },

  quickPlay() {
    const available = this.rooms.find(r => r.players < r.max);
    if (available) {
      this.joinRoom(available.id);
    } else {
      this.createRoom();
    }
  },

  createRoom() {
    const code = 'MH-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const newRoom = { id: code, name: MegaHub.state.nickname + "'s Room", players: 1, max: 10, mode: 'Private' };
    this.rooms.push(newRoom);
    this.joinRoom(code);
  },

  joinRoom(id) {
    const room = this.rooms.find(r => r.id === id);
    if (!room) return MegaHub.notify("Room not found!");
    if (room.players >= room.max) return MegaHub.notify("Room full!");

    this.currentRoom = room;
    document.getElementById('arena-lobby').classList.add('hidden');
    document.getElementById('room-view').classList.remove('hidden');
    document.getElementById('room-title').textContent = `NODE: ${id}`;
    
    this.renderChat();
    MegaHub.notify("Connected to Arena.");
  },

  renderChat() {
    const chat = document.getElementById('chat-messages');
    if (!chat) return;
    chat.innerHTML = `<div class="text-center text-xs text-slate-500 my-4">[SECURE CONNECTION ESTABLISHED]</div>`;
  },

  sendMsg() {
    const input = document.getElementById('chat-input');
    if (!input.value) return;
    const chat = document.getElementById('chat-messages');
    const msg = document.createElement('div');
    msg.className = 'chat-msg self';
    msg.textContent = input.value;
    chat.appendChild(msg);
    input.value = '';
    chat.scrollTop = chat.scrollHeight;

    // Simulated Bot Reply
    setTimeout(() => {
      const reply = document.createElement('div');
      reply.className = 'chat-msg other';
      reply.textContent = "Copy that. Ready for round 1?";
      chat.appendChild(reply);
      chat.scrollTop = chat.scrollHeight;
    }, 1000);
  },

  copyInvite() {
    const url = window.location.origin + window.location.pathname + '?join=' + this.currentRoom.id;
    navigator.clipboard.writeText(url);
    MegaHub.notify("Invite Link Copied!");
  }
};
Arena.init();
