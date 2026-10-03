// ===== MERGE KINGDOM — Prototype M1/M2 =====
// Grille de fusion tactile + sauvegarde locale

const SIZE = 16;               // grille 4x4
const SPAWN_COST = 10;
const MERGE_REWARD = 5;        // pièces gagnées par fusion
const MAX_LEVEL = 6;

// Créatures par niveau (émojis = placeholders, remplacés par des sprites en Phase 2)
const CREATURES = ["🐣", "🐥", "🐔", "🦃", "🦅", "🐉"];

// ----- État du jeu -----
let state = load() || {
  coins: 50,
  grid: Array(SIZE).fill(0)  // 0 = vide, sinon niveau 1..6
};

function save() {
  localStorage.setItem("mergeKingdom", JSON.stringify(state));
}
function load() {
  try { return JSON.parse(localStorage.getItem("mergeKingdom")); }
  catch { return null; }
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
  const empty = state.grid
    .map((v, i) => v === 0 ? i : -1)
    .filter(i => i >= 0);
  if (!empty.length || state.coins < SPAWN_COST) return;

  state.coins -= SPAWN_COST;
  const idx = empty[Math.floor(Math.random() * empty.length)];
  state.grid[idx] = 1;
  save();
  render();
  board.children[idx].classList.add("pop");
});

// ----- Drag & Drop tactile (Pointer Events : marche doigt + souris) -----
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
  const target = document.elementFromPoint(e.clientX, e.clientY)
    ?.closest(".cell");
  if (target) tryMerge(dragFrom, +target.dataset.index);
  endDrag();
});

function moveGhost(e) {
  ghost.style.left = e.clientX + "px";
  ghost.style.top = (e.clientY - 60) + "px"; // au-dessus du doigt
}

function endDrag() {
  dragFrom = -1;
  ghost.style.display = "none";
  document.querySelectorAll(".highlight").forEach(c => c.classList.remove("highlight"));
  render();
}

// Surbrillance des cibles valides pendant le drag
function highlightTargets() {
  const lvl = state.grid[dragFrom];
  document.querySelectorAll(".cell").forEach(cell => {
    const i = +cell.dataset.index;
    if (i !== dragFrom && (state.grid[i] === 0 || state.grid[i] === lvl))
      cell.classList.add("highlight");
  });
}

// ----- Logique de fusion -----
function tryMerge(from, to) {
  if (from === to) return;
  const a = state.grid[from];
  const b = state.grid[to];

  if (b === 0) {
    // Déplacement simple vers case vide
    state.grid[to] = a;
    state.grid[from] = 0;
  } else if (a === b && a < MAX_LEVEL) {
    // FUSION !
    state.grid[to] = a + 1;
    state.grid[from] = 0;
    state.coins += MERGE_REWARD * a;  // récompense progressive
    save();
    render();
    board.children[to].classList.add("pop");
    return;
  }
  save();
}

// ----- Démarrage -----
render();

