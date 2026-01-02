const Games = {
  list: [
    { id: 'typing', name: 'Typing Speed', desc: 'Test your WPM in technical paragraphs.', icon: '⌨️', color: 'var(--primary)' },
    { id: 'snake', name: 'Snake Arcade', desc: 'WASD or Arrows. Eat to grow!', icon: '🐍', color: 'var(--accent)' },
    { id: 'memory', name: 'Memory Match', desc: 'Match icons quickly.', icon: '🧩', color: 'var(--secondary)' },
    { id: 'aim', name: 'Aim Trainer', desc: 'Click targets as fast as you can.', icon: '🎯', color: '#ff4444' },
    { id: 'math', name: 'Math Sprint', desc: 'Rapid mental arithmetic.', icon: '🧮', color: 'var(--primary)' }
  ],

  current: null,
  canvas: null,
  ctx: null,
  gameInterval: null,

  init() {
    this.renderGrid();
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('game');
    if (gameId) this.launch(gameId);
    this.renderHOF();
  },

  renderGrid() {
    const grid = document.getElementById('games-grid');
    if (!grid) return;
    grid.innerHTML = '';
    this.list.forEach(g => {
      const card = document.createElement('div');
      card.className = 'card glass';
      card.innerHTML = `
        <div style="font-size:3rem; margin-bottom:15px">${g.icon}</div>
        <h3 style="color:${g.color}">${g.name}</h3>
        <p style="font-size:0.9rem; color:#94a3b8; margin:8px 0">${g.desc}</p>
      `;
      card.onclick = () => this.launch(g.id);
      grid.appendChild(card);
    });
  },

  launch(id) {
    this.current = this.list.find(g => g.id === id);
    if (!this.current) return;
    document.getElementById('game-selection').style.display = 'none';
    document.getElementById('game-player').style.display = 'block';
    document.getElementById('game-title').textContent = this.current.name;
    this.canvas = document.getElementById('main-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.start();
  },

  exit() {
    this.stop();
    document.getElementById('game-selection').style.display = 'block';
    document.getElementById('game-player').style.display = 'none';
  },

  start() {
    this.stop();
    document.getElementById('game-overlay').style.display = 'none';
    const htmlContent = document.getElementById('html-game-content');
    htmlContent.style.display = 'none';
    this.canvas.style.display = 'none';

    if (this.current.id === 'typing') this.runTyping();
    if (this.current.id === 'snake') this.runSnake();
    if (this.current.id === 'memory') this.runMemory();
    if (this.current.id === 'aim') this.runAim();
    if (this.current.id === 'math') this.runMath();
  },

  stop() {
    if (this.gameInterval) clearInterval(this.gameInterval);
    window.onkeydown = null;
  },

  runTyping() {
    const container = document.getElementById('html-game-content');
    container.style.display = 'block';
    const text = "MegaHub Networks provides a decentralized ecosystem for gaming and learning. Every node in the network contributes to low-latency experiences. Performance is our primary directive. Code efficiently or face the void.";
    container.innerHTML = `<div class="typing-target">${text}</div><input type="text" id="type-input" class="typing-input" placeholder="Type precisely..."><div id="type-result" style="margin-top:15px"></div>`;
    const input = document.getElementById('type-input');
    const start = Date.now();
    input.focus();
    input.oninput = () => {
      if (input.value === text) {
        const wpm = Math.round((text.length / 5) / ((Date.now() - start) / 60000));
        MegaHub.addCoins(Math.floor(wpm / 2));
        MegaHub.addXP(wpm * 10);
        this.showGameOver(wpm, "WPM");
      }
    };
  },

  runSnake() {
    this.canvas.style.display = 'block';
    this.canvas.width = 400; this.canvas.height = 400;
    let s = [{x:10, y:10}], f = {x:5,y:5}, dx=1, dy=0, score=0;
    
    window.onkeydown = e => {
      if ((e.key==='w'||e.key==='ArrowUp') && dy===0) { dx=0; dy=-1; }
      if ((e.key==='s'||e.key==='ArrowDown') && dy===0) { dx=0; dy=1; }
      if ((e.key==='a'||e.key==='ArrowLeft') && dx===0) { dx=-1; dy=0; }
      if ((e.key==='d'||e.key==='ArrowRight') && dx===0) { dx=1; dy=0; }
    };

    this.gameInterval = setInterval(() => {
      const h = {x: s[0].x+dx, y: s[0].y+dy};
      if (h.x<0||h.x>=20||h.y<0||h.y>=20||s.some(p=>p.x===h.x&&p.y===h.y)) {
        this.stop(); this.showGameOver(score, "SCORE"); return;
      }
      s.unshift(h);
      if (h.x===f.x && h.y===f.y) {
        score+=10; f={x:Math.floor(Math.random()*20), y:Math.floor(Math.random()*20)};
        if(window.Sound) Sound.playCorrect();
      } else s.pop();

      this.ctx.fillStyle='#000'; this.ctx.fillRect(0,0,400,400);
      this.ctx.fillStyle='#3b82f6'; s.forEach(p=>this.ctx.fillRect(p.x*20,p.y*20,18,18));
      this.ctx.fillStyle='#ef4444'; this.ctx.fillRect(f.x*20,f.y*20,18,18);
      document.getElementById('game-stats').textContent = `SCORE: ${score}`;
    }, 100);
  },

  runAim() {
    this.canvas.style.display = 'block';
    this.canvas.width = 400; this.canvas.height = 400;
    let score = 0, target = {x:200,y:200}, timeLeft = 30;
    
    this.canvas.onclick = e => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const dist = Math.hypot(mx-target.x, my-target.y);
      if (dist < 20) {
        score++; target = {x: Math.random()*360+20, y: Math.random()*360+20};
        if(window.Sound) Sound.playCorrect();
      }
    };

    this.gameInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        this.stop(); this.showGameOver(score, "HITS"); return;
      }
      this.ctx.fillStyle='#000'; this.ctx.fillRect(0,0,400,400);
      this.ctx.fillStyle='#22d3ee'; this.ctx.beginPath();
      this.ctx.arc(target.x, target.y, 20, 0, Math.PI*2); this.ctx.fill();
      document.getElementById('game-stats').textContent = `TIME: ${timeLeft}s | SCORE: ${score}`;
    }, 1000);
  },

  showGameOver(val, label) {
    const ov = document.getElementById('game-overlay');
    ov.style.display = 'flex';
    ov.innerHTML = `<h2>GAME FINISHED</h2><p>${label}: ${val}</p><button class="btn btn-primary" style="margin-top:20px" onclick="Games.start()">REPLAY</button>`;
    MegaHub.addCoins(Math.floor(val/2));
    MegaHub.addXP(100);
  },

  renderHOF() {
    const list = document.getElementById('hof-list');
    if(!list) return;
    list.innerHTML = `<div class="hof-row"><span>PixelMaster</span><span style="color:var(--primary)">2,500</span></div><div class="hof-row"><span>MegaBot</span><span style="color:var(--primary)">1,800</span></div>`;
  }
};
Games.init();