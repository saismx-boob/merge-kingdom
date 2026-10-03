// ===== LUMO'S CHRONICLES — M1/M2 + Économie =====

const SIZE = 36; // 6x6
const SPAWN_COST = 10;
const MINE_RATE = 15000;
const MINE_GAIN = 2;
const MAX_LEVEL = 10;

// --- Configuration des 3 Chaînes de Fusion ---
const ITEMS = {
  eco: [
    { name: "Graine de Lumière", emoji: "🌱", reward: 1 },
    { name: "Fleur de Lune", emoji: "🌸", reward: 3 },
    { name: "Arbre à Étoiles", emoji: "🌳", reward: 8 },
    { name: "Fontaine de Rêves", emoji: "⛲", reward: 15 },
    { name: "Cristal de l'Aube", emoji: "💎", reward: 30 },
    { name: "Sanctuaire de Lumière", emoji: "🏛️", reward: 60 },
    { name: "Cœur d'Aetheria", emoji: "❤️", reward: 120 },
    { name: "Étoile Mère", emoji: "⭐", reward: 250 },
    { name: "Galaxie en Bouteille", emoji: "🌌", reward: 500 },
    { name: "Source de l'Univers", emoji: "🌠", reward: 1000 }
  ],
  creatures: [
    { name: "Éclat Stellaire", emoji: "✨", damage: 1 },
    { name: "Poussin Lunaire", emoji: "🐣", damage: 3 },
    { name: "Petit Renard Céleste", emoji: "🦊", damage: 8 },
    { name: "Lapin des Nuages", emoji: "🐰", damage: 15 },
    { name: "Dragon de Poche", emoji: "🐉", damage: 30 },
    { name: "Licorne Stellaire", emoji: "🦄", damage: 60 },
    { name: "Phénix Doux", emoji: "🦅", damage: 120 },
    { name: "Baleine Céleste", emoji: "🐋", damage: 250 },
    { name: "Gardien d'Aetheria", emoji: "🛡️", damage: 500 },
    { name: "Avatar de Lumo", emoji: "🌟", damage: 1000 }
  ],
  utility: [
    { name: "Éclat de Cristal", emoji: "🔮", boost: 1 },
    { name: "Lanterne Flottante", emoji: "🏮", boost: 2 },
    { name: "Autel Magique", emoji: "🕯️", boost: 5 },
    { name: "Portail Céleste", emoji: "🌀", boost: 10 },
    { name: "Forge Astrale", emoji: "⚒️", boost: 20 },
    { name: "Bibliothèque des Rêves", emoji: "📚", boost: 40 },
    { name: "Observatoire", emoji: "🔭", boost: 80 },
    { name: "Forteresse de Nuages", emoji: "☁️", boost: 150 },
    { name: "Citadelle Céleste", emoji: "🏰", boost: 300 },
    { name: "Palais de Lumo", emoji: "👑", boost: 600 }
  ]
};

let state = load() || {
  coins: 50,
  wave: 1,
  grid: Array(SIZE).fill(null)
};

function save() {
  localStorage.setItem("lumoChronicles", JSON.stringify(state));
}
function load() {
  try {
    const s = JSON.parse(localStorage.getItem("lumoChronicles"));
    if (s && !s.wave) s.wave = 1;
    return s;
  } catch { return null; }
}

// ----- Rendu -----
const board = document.getElementById("board");
const coinEl = document.getElementById("coin-count");
const spawnBtn = document.getElementById("spawn-btn");

function render() {
  coinEl.textContent = state.coins;
  spawnBtn.disabled = state.coins < SPAWN_COST || !state.grid.includes(null);
  board.innerHTML = "";

  state.grid.forEach((item, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;

    if (item) {
      const data = ITEMS[item.chain][item.level - 1];
      
      const c = document.createElement("div");
      c.className = "creature";
      c.textContent = data.emoji;
      c.dataset.index = i;

      const badge = document.createElement("span");
      badge.className = "lvl-badge";
      badge.textContent = t('lvl') + item.level;
      
      cell.appendChild(badge);
      cell.appendChild(c);
      attachDrag(c);
    }
    board.appendChild(cell);
  });
}

// ----- Invocation -----
spawnBtn.addEventListener("click", () => {
  const empty = state.grid.map((v, i) => v === null ? i : -1).filter(i => i >= 0);
  if (!empty.length || state.coins < SPAWN_COST) return;

  state.coins -= SPAWN_COST;
  const idx = empty[Math.floor(Math.random() * empty.length)];
  
  const chains = ['eco', 'creatures', 'utility'];
  const randomChain = chains[Math.floor(Math.random() * chains.length)];
  
  state.grid[idx] = { chain: randomChain, level: 1 };
  save();
  render();
  board.children[idx].classList.add("pop");
});

// ----- Mine passive -----
setInterval(() => {
  state.coins += MINE_GAIN;
  save();
  coinEl.textContent = state.coins;
  spawnBtn.disabled = state.coins < SPAWN_COST || !state.grid.includes(null);
}, MINE_RATE);

// ----- Drag & Drop tactile -----
const ghost = document.createElement("div");
ghost.id = "ghost";
document.body.appendChild(ghost);

let dragFrom = -1;

function attachDrag(el) {
  el.addEventListener("pointerdown", e => {
    dragFrom = +el.dataset.index;
    el.classList.add("dragging");
    ghost.textContent = el.textContent;
    ghost.style.display = "block";
    moveGhost(e);
    highlightTargets();
  });
}

document.addEventListener("pointermove", e => {
  if (dragFrom < 0) return;
  moveGhost(e);
});
document.addEventListener("pointerup", e => {
  if (dragFrom < 0) return;
  const target = document.elementFromPoint(e.clientX, e.clientY)?.closest(".cell");
  if (target) tryMerge(dragFrom, +target.dataset.index);
  endDrag();
});

function moveGhost(e) {
  ghost.style.left = e.clientX + "px";
  ghost.style.top = (e.clientY - 60) + "px";
}

function endDrag() {
  dragFrom = -1;
  ghost.style.display = "none";
  document.querySelectorAll(".highlight").forEach(c => c.classList.remove("highlight"));
  render();
}

function highlightTargets() {
  const item = state.grid[dragFrom];
  if (!item) return;
  
  document.querySelectorAll(".cell").forEach(cell => {
    const i = +cell.dataset.index;
    const targetItem = state.grid[i];
    
    if (i !== dragFrom && (targetItem === null || (targetItem.chain === item.chain && targetItem.level === item.level)))
      cell.classList.add("highlight");
  });
}

function tryMerge(from, to) {
  if (from === to) return;
  const itemA = state.grid[from];
  const itemB = state.grid[to];

  if (!itemA) return;

  if (itemB === null) {
    state.grid[to] = itemA;
    state.grid[from] = null;
  } else if (itemA.chain === itemB.chain && itemA.level === itemB.level && itemA.level < MAX_LEVEL) {
    state.grid[to] = { chain: itemA.chain, level: itemA.level + 1 };
    state.grid[from] = null;
    
    if (itemA.chain === 'eco') {
      state.coins += ITEMS.eco[itemA.level].reward;
    } else {
      state.coins += 5 * itemA.level;
    }
    
    save();
    render();
    board.children[to].classList.add("pop");
    return;
  }
  save();
}

// ----- Navigation entre écrans -----
const navMerge = document.getElementById("nav-merge");
const navBattle = document.getElementById("nav-battle");

navMerge.addEventListener("click", () => switchScreen("merge"));
navBattle.addEventListener("click", () => switchScreen("battle"));

function switchScreen(name) {
  document.getElementById("screen-merge").classList.toggle("active", name === "merge");
  document.getElementById("screen-battle").classList.toggle("active", name === "battle");
  navMerge.classList.toggle("active", name === "merge");
  navBattle.classList.toggle("active", name === "battle");
  if (name === "battle") setupBattle(); 
}

// ----- Démarrage -----
render();
