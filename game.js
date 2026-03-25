const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// GAME SETTINGS
const GRAVITY = 0.5;
const FPS = 30;
const FRAME_TIME = 1000 / FPS;

// PLAYER
const player = {
  x: 100,
  y: 300,
  width: 32,
  height: 32,
  dx: 0,
  dy: 0,
  speed: 4,
  jumping: false,
  hp: 100,
  xp: 0,
  level: 1,
  color: "red"
};

// ENEMY (Dragon Minion)
const enemy = {
  x: 600,
  y: 300,
  width: 40,
  height: 40,
  hp: 50,
  alive: true
};

// INPUT
const keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// GAME LOOP
let lastTime = 0;

function gameLoop(timestamp) {
  if (timestamp - lastTime > FRAME_TIME) {
    update();
    draw();
    lastTime = timestamp;
  }
  requestAnimationFrame(gameLoop);
}

// UPDATE
function update() {
  // Movement
  if (keys["ArrowRight"]) player.dx = player.speed;
  else if (keys["ArrowLeft"]) player.dx = -player.speed;
  else player.dx = 0;

  // Jump
  if (keys[" "] && !player.jumping) {
    player.dy = -10;
    player.jumping = true;
  }

  // Gravity
  player.dy += GRAVITY;

  player.x += player.dx;
  player.y += player.dy;

  // Ground collision
  if (player.y > 300) {
    player.y = 300;
    player.dy = 0;
    player.jumping = false;
  }

  // Combat (basic attack)
  if (keys["a"] && enemy.alive) {
    if (Math.abs(player.x - enemy.x) < 50) {
      enemy.hp -= 1;
      if (enemy.hp <= 0) {
        enemy.alive = false;
        gainXP(50);
      }
    }
  }

  // Magic attack
  if (keys["m"] && enemy.alive) {
    if (Math.abs(player.x - enemy.x) < 120) {
      enemy.hp -= 2;
      if (enemy.hp <= 0) {
        enemy.alive = false;
        gainXP(50);
      }
    }
  }

  updateUI();
}

// XP + LEVEL SYSTEM
function gainXP(amount) {
  player.xp += amount;

  if (player.xp >= player.level * 100) {
    player.xp = 0;
    player.level++;
    player.hp += 20;
  }
}

// DRAW
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Enemy
  if (enemy.alive) {
    ctx.fillStyle = "green";
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  }

  // Ground
  ctx.fillStyle = "#444";
  ctx.fillRect(0, 332, canvas.width, 68);
}

// UI
function updateUI() {
  document.getElementById("level").innerText = player.level;
  document.getElementById("xp").innerText = player.xp;
  document.getElementById("hp").innerText = player.hp;
}

// START
requestAnimationFrame(gameLoop);
