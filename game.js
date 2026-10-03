// ===== MERGE KINGDOM — M1/M2 + économie anti-blocage =====

const SIZE = 16;
const SPAWN_COST = 10;
const MERGE_REWARD = 5;
const MAX_LEVEL = 6;
const MINE_RATE = 15000;   // 15 secondes
const MINE_GAIN = 2;

const CREATURES = ["🐣", "🐥", "🐔", "🦃", "🦅", "🐉"];

let state = load() || {
  coins: 50,
  wave: 1,
  grid: Array(SIZE).fill(0)
};

function save() {
  localStorage.setItem("mergeKingdom", JSON.stringify(state));
}
function load() {
  try {
    const s = JSON.parse(localStorage.getItem("mergeKingdom"));
    if (s && !s.wave) s.wave = 1;   // compatibilité anciennes sauvegardes
    return s;
  } catch { return null; }
}

// ----- Rendu -----
const board = document.getElementById("board");
const coinEl = document.getElementById("coin-count");
const spawnBtn = document.getElementById("spawn-btn");

function render() {
  coinEl.textContent = state.coins;
  spawnBtn.disabled = state.coins < SPAWN_COST || !state.grid.includes(0);
  board.innerHTML = "";

  state.grid.forEach((lvl, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;

    if (lvl > 0) {
      const c = document.createElement("div");
      c.className = "creature";
      c.textContent = CREATURES[lvl - 1];
      c.dataset.index = i;

      const badge = document.createElement("span");
      badge.className = "lvl-badge";
      badge.textContent = "Nv" + lvl;
      cell.appendChild(badge);
      cell.appendChild(c);
      attachDrag(c);
    }
    board.appendChild(cell);
  });
}

// ----- Invocation -----
spawnBtn.addEventListener("click", () => {
  const empty = state.grid.map((v, i) => v === 0 ? i : -1).filter(i => i >= 0);
  if (!empty.length || state.coins < SPAWN_COST) return;

  state.coins -= SPAWN_COST;
  const idx = empty[Math.floor(Math.random() * empty.length)];
  state.grid[idx] = 1;
  save();
  render();
  board.children[idx].classList.add("pop");
});

// ----- Mine passive (anti-blocage + rétention) -----
setInterval(() => {
  state.coins += MINE_GAIN;
  save();
  coinEl.textContent = state.coins;
  spawnBtn.disabled = state.coins < SPAWN_COST || !state.grid.includes(0);
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
  const lvl = state.grid[dragFrom];
  document.querySelectorAll(".cell").forEach(cell => {
    const i = +cell.dataset.index;
    if (i !== dragFrom && (state.grid[i] === 0 || state.grid[i] === lvl))
      cell.classList.add("highlight");
  });
}

function tryMerge(from, to) {
  if (from === to) return;
  const a = state.grid[from];
  const b = state.grid[to];

  if (b === 0) {
    state.grid[to] = a;
    state.grid[from] = 0;
  } else if (a === b && a < MAX_LEVEL) {
    state.grid[to] = a + 1;
    state.grid[from] = 0;
    state.coins += MERGE_REWARD * a;
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
  if (name === "battle") setupBattle();  // défini dans battle.js
}

// ----- Démarrage -----
render();
