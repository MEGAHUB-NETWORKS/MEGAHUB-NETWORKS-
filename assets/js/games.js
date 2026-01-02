window.Games = {
  current: null,
  canvas: null,
  ctx: null,
  interval: null,

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('game');
    if (gameId) this.launch(gameId);
    this.renderArcade();
  },

  renderArcade() {
    const grid = document.getElementById('games-grid');
    if (!grid) return;
    const list = [
      { id: 'typing', name: 'Typing Race', icon: '⌨️' },
      { id: 'snake', name: 'Snake Duel', icon: '🐍' },
      { id: 'skribbl', name: 'MegaDraw', icon: '🎨' },
      { id: 'aim', name: 'Aim Blitz', icon: '🎯' }
    ];
    grid.innerHTML = list.map(g => `
      <div class="card glass text-center cursor-pointer hover:border-blue-500" onclick="Games.launch('${g.id}')">
        <div class="text-5xl mb-4">${g.icon}</div>
        <h3 class="font-black text-xl">${g.name}</h3>
        <button class="btn btn-primary mt-4 w-full">PLAY</button>
      </div>
    `).join('');
  },

  launch(id) {
    this.current = id;
    const sel = document.getElementById('game-selection');
    const player = document.getElementById('game-player');
    if (sel) sel.classList.add('hidden');
    if (player) player.classList.remove('hidden');
    
    const title = document.getElementById('game-title');
    if (title) title.textContent = id.toUpperCase();
    
    this.canvas = document.getElementById('main-canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.start();
    }
  },

  start() {
    this.stop();
    if (!this.canvas) return;
    this.canvas.style.display = 'block';
    if (this.current === 'snake') this.runSnake();
    if (this.current === 'skribbl') this.runSkribbl();
    if (this.current === 'aim') this.runAim();
  },

  stop() {
    if (this.interval) clearInterval(this.interval);
    if (this.canvas) {
      this.canvas.onclick = null;
      this.canvas.onmousemove = null;
      this.canvas.onmousedown = null;
      this.canvas.onmouseup = null;
    }
  },

  runSnake() {
    this.canvas.width = 400; this.canvas.height = 400;
    let s = [{x:10, y:10}], f = {x:5, y:5}, dx=1, dy=0, score=0;
    window.onkeydown = e => {
      if (e.key === 'ArrowUp' && dy === 0) { dx=0; dy=-1; }
      if (e.key === 'ArrowDown' && dy === 0) { dx=0; dy=1; }
      if (e.key === 'ArrowLeft' && dx === 0) { dx=-1; dy=0; }
      if (e.key === 'ArrowRight' && dx === 0) { dx=1; dy=0; }
    };
    this.interval = setInterval(() => {
      const h = {x: s[0].x+dx, y: s[0].y+dy};
      if (h.x<0||h.x>=20||h.y<0||h.y>=20||s.some(p=>p.x===h.x&&p.y===h.y)) {
        this.gameOver(score); return;
      }
      s.unshift(h);
      if (h.x===f.x && h.y===f.y) {
        score+=10; f={x:Math.floor(Math.random()*20), y:Math.floor(Math.random()*20)};
        if(window.Sound) Sound.playCorrect();
      } else s.pop();
      this.ctx.fillStyle='#000'; this.ctx.fillRect(0,0,400,400);
      this.ctx.fillStyle='#3b82f6'; s.forEach(p=>this.ctx.fillRect(p.x*20, p.y*20, 18, 18));
      this.ctx.fillStyle='#ef4444'; this.ctx.fillRect(f.x*20, f.y*20, 18, 18);
      const stats = document.getElementById('game-stats');
      if (stats) stats.textContent = `SCORE: ${score}`;
    }, 100);
  },

  runSkribbl() {
    this.canvas.width = 600; this.canvas.height = 400;
    this.ctx.fillStyle = 'white'; this.ctx.fillRect(0,0,600,400);
    let drawing = false;
    this.canvas.onmousedown = () => drawing = true;
    this.canvas.onmouseup = () => { drawing = false; this.ctx.beginPath(); };
    this.canvas.onmousemove = e => {
      if (!drawing) return;
      const rect = this.canvas.getBoundingClientRect();
      this.ctx.lineWidth = 5; this.ctx.lineCap = 'round'; this.ctx.strokeStyle = '#000';
      this.ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      this.ctx.stroke(); this.ctx.beginPath();
      this.ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };
    if (window.MegaHub) window.MegaHub.notify("DRAW THE WORD: 'ROBOT'");
  },

  runAim() {
    this.canvas.width = 400; this.canvas.height = 400;
    let target = {x:200, y:200}, score = 0;
    this.canvas.onclick = e => {
      const rect = this.canvas.getBoundingClientRect();
      const dist = Math.hypot(e.clientX-rect.left-target.x, e.clientY-rect.top-target.y);
      if (dist < 20) {
        score++; target={x:Math.random()*360+20, y:Math.random()*360+20};
        if(window.Sound) Sound.playCorrect();
      }
    };
    this.interval = setInterval(() => {
      this.ctx.fillStyle='#000'; this.ctx.fillRect(0,0,400,400);
      this.ctx.fillStyle='#22d3ee'; this.ctx.beginPath();
      this.ctx.arc(target.x, target.y, 20, 0, Math.PI*2); this.ctx.fill();
      const stats = document.getElementById('game-stats');
      if (stats) stats.textContent = `HITS: ${score}`;
    }, 16);
  },

  gameOver(score) {
    this.stop();
    const ov = document.getElementById('game-overlay');
    if (ov) {
      ov.style.display = 'flex';
      ov.innerHTML = `<h2>GAME OVER</h2><p>SCORE: ${score}</p><button class="btn btn-primary" onclick="Games.start()">REPLAY</button>`;
    }
    if (window.MegaHub) {
      window.MegaHub.addCoins(Math.floor(score/2));
      window.MegaHub.addXP(100);
    }
  },

  exit() {
    this.stop();
    const sel = document.getElementById('game-selection');
    const player = document.getElementById('game-player');
    if (sel) sel.classList.remove('hidden');
    if (player) player.classList.add('hidden');
  }
};

if (document.readyState === 'complete') {
  window.Games.init();
} else {
  window.addEventListener('load', () => window.Games.init());
}
