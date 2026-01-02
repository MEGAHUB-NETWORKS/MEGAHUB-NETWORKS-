const Games = {
  list: [
    { id: 'typing', name: 'Typing Race', icon: '⌨️', color: '#3b82f6' },
    { id: 'snake', name: 'Legacy Snake', icon: '🐍', color: '#22d3ee' },
    { id: 'aim', name: 'Kinetic Aim', icon: '🎯', color: '#ef4444' },
    { id: 'memory', name: 'Neural Link', icon: '🧠', color: '#a855f7' }
  ],

  current: null,
  canvas: null,
  ctx: null,
  gameInterval: null,

  init() {
    this.canvas = document.getElementById('main-canvas');
    if (this.canvas) this.ctx = this.canvas.getContext('2d');
    
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('game');
    if (gameId) this.launch(gameId);
    
    this.renderGrid();
  },

  renderGrid() {
    const grid = document.getElementById('games-grid');
    if (!grid) return;
    this.list.forEach(g => {
      const card = document.createElement('div');
      card.className = 'card glass';
      card.innerHTML = `
        <div style="font-size:3rem; margin-bottom:12px">${g.icon}</div>
        <h3 style="font-weight:900">${g.name}</h3>
        <button class="btn btn-primary w-full mt-4">PLAY</button>
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
    
    this.start();
  },

  start() {
    this.stop();
    const overlay = document.getElementById('game-overlay');
    overlay.style.display = 'none';
    
    const htmlCont = document.getElementById('html-game-content');
    htmlCont.style.display = 'none';
    this.canvas.style.display = 'none';

    if (this.current.id === 'typing') this.runTyping();
    if (this.current.id === 'snake') this.runSnake();
    if (this.current.id === 'aim') this.runAim();
  },

  stop() {
    if (this.gameInterval) clearInterval(this.gameInterval);
    window.onkeydown = null;
    this.canvas.onclick = null;
  },

  runTyping() {
    const cont = document.getElementById('html-game-content');
    cont.style.display = 'block';
    const passage = "The megahub network operates on a protocol of extreme low latency and persistent state management. Operators are required to maintain a high WPM to successfully navigate the deeper layers of the grid.";
    cont.innerHTML = `
      <div class="typing-target">${passage}</div>
      <input type="text" id="type-input" class="typing-input" placeholder="Start typing...">
      <div id="type-stats" class="mt-4 font-bold text-blue-500"></div>
    `;
    const input = document.getElementById('type-input');
    const start = Date.now();
    input.focus();
    input.oninput = () => {
      if (input.value === passage) {
        const time = (Date.now() - start) / 1000;
        const wpm = Math.round((passage.length / 5) / (time / 60));
        this.gameOver(wpm, "WPM");
        MegaHub.addCoins(Math.floor(wpm / 2));
        MegaHub.addXP(200);
      }
    };
  },

  runSnake() {
    this.canvas.style.display = 'block';
    this.canvas.width = 400; this.canvas.height = 400;
    let snake = [{x:10, y:10}], food = {x:5, y:5}, dx = 1, dy = 0, score = 0;

    window.onkeydown = (e) => {
      if ((e.key==='w' || e.key==='ArrowUp') && dy===0) { dx=0; dy=-1; }
      if ((e.key==='s' || e.key==='ArrowDown') && dy===0) { dx=0; dy=1; }
      if ((e.key==='a' || e.key==='ArrowLeft') && dx===0) { dx=-1; dy=0; }
      if ((e.key==='d' || e.key==='ArrowRight') && dx===0) { dx=1; dy=0; }
    };

    this.gameInterval = setInterval(() => {
      const head = {x: snake[0].x + dx, y: snake[0].y + dy};
      if (head.x<0 || head.x>=20 || head.y<0 || head.y>=20 || snake.some(p=>p.x===head.x && p.y===head.y)) {
        this.gameOver(score, "SCORE");
        return;
      }
      snake.unshift(head);
      if (head.x===food.x && head.y===food.y) {
        score += 10;
        food = {x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20)};
        if (window.Sound) window.Sound.playCorrect();
      } else snake.pop();

      this.ctx.fillStyle = '#000'; this.ctx.fillRect(0,0,400,400);
      this.ctx.fillStyle = '#3b82f6'; snake.forEach(p=>this.ctx.fillRect(p.x*20, p.y*20, 18, 18));
      this.ctx.fillStyle = '#ef4444'; this.ctx.fillRect(food.x*20, food.y*20, 18, 18);
      document.getElementById('game-stats').textContent = `SCORE: ${score}`;
    }, 100);
  },

  runAim() {
    this.canvas.style.display = 'block';
    this.canvas.width = 400; this.canvas.height = 400;
    let hits = 0, target = {x: 200, y: 200}, time = 30;

    this.canvas.onclick = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const dist = Math.hypot(mx-target.x, my-target.y);
      if (dist < 20) {
        hits++;
        target = {x: Math.random()*360 + 20, y: Math.random()*360 + 20};
        if (window.Sound) window.Sound.playCorrect();
      }
    };

    this.gameInterval = setInterval(() => {
      time--;
      if (time <= 0) { this.gameOver(hits, "HITS"); return; }
      this.ctx.fillStyle = '#000'; this.ctx.fillRect(0,0,400,400);
      this.ctx.fillStyle = '#22d3ee'; this.ctx.beginPath();
      this.ctx.arc(target.x, target.y, 20, 0, Math.PI*2); this.ctx.fill();
      document.getElementById('game-stats').textContent = `TIME: ${time}s | HITS: ${hits}`;
    }, 1000);
  },

  gameOver(val, label) {
    this.stop();
    const ov = document.getElementById('game-overlay');
    ov.style.display = 'flex';
    ov.innerHTML = `
      <h2 style="font-size:3rem; font-weight:900">NODE SECURED</h2>
      <p style="font-size:1.5rem">${label}: ${val}</p>
      <button class="btn btn-primary mt-6" onclick="Games.start()">REBOOT GAME</button>
    `;
    MegaHub.addCoins(Math.floor(val/2));
    MegaHub.addXP(100);
  },

  exit() {
    this.stop();
    document.getElementById('game-selection').style.display = 'block';
    document.getElementById('game-player').style.display = 'none';
  }
};

window.Games = Games;
Games.init();