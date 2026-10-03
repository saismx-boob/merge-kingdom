// ===== LES ROUTES DE L'OR — Moteur (grille, énergie, commandes, XP) =====

const SIZE_COLS = 7, SIZE_ROWS = 7, SIZE = SIZE_COLS * SIZE_ROWS; // 49 cases
const ENERGY = { max: 80, regenMs: 45000, start: 40 }; // 1 ⚡ / 45 s
const BUY_ENERGY = { amount: 10, cost: 40 };
const MAX_LEVEL = 10;
const SAVE_KEY = "routesDeLor_v1";

function startingGrid() {
  const g = Array(SIZE).fill(null);
  const put = (i, c, l) => { g[i] = { chain: c, level: l }; };
  put(0, "eco", 1); put(1, "eco", 1); put(2, "eco", 1); put(3, "eco", 1);
  put(7, "creatures", 1); put(8, "creatures", 1);
  put(14, "utility", 1); put(15, "utility", 1);
  return g;
}

function defaultState() {
  return {
    coins: 0, xp: 0,
    energy: ENERGY.start, energyTs: Date.now(),
    wave: 1, seenIntro: false,
    grid: startingGrid(),
    orders: [0, 1, 2]
  };
}

let state = load() || defaultState();

function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!s) return null;
    const d = defaultState();
    for (const k in d) if (s[k] === undefined) s[k] = d[k];
    if (!Array.isArray(s.grid) || s.grid.length !== SIZE) s.grid = startingGrid();
    if (!Array.isArray(s.orders) || s.orders.length !== 3 ||
        s.orders.some(i => i < 0 || i >= DATA.orders.length)) s.orders = [0, 1, 2];
    return s;
  } catch { return null; }
}

// ----- XP / Niveau joueur -----
function xpNeeded(level) { return 20 + (level - 1) * 25; }
function playerLevel() {
  let lvl = 1, rem = state.xp;
  while (rem >= xpNeeded(lvl) && lvl < 20) { rem -= xpNeeded(lvl); lvl++; }
  return lvl;
}
function addXp(n) { state.xp += n; }

// ----- Énergie (gère aussi le hors-ligne) -----
function tickEnergy() {
  if (state.energy >= ENERGY.max) { state.energyTs = Date.now(); return; }
  const gained = Math.floor((Date.now() - state.energyTs) / ENERGY.regenMs);
  if (gained > 0) {
    state.energy = Math.min(ENERGY.max, state.energy + gained);
    state.energyTs += gained * ENERGY.regenMs;
    save();
    renderHud();
    updateGenButtons();
  }
}
setInterval(tickEnergy, 2000);

// ----- Helpers -----
function dl(o) { return currentLang === 'fr' ? o.fr : o.en; } // texte bilingue des données

function rollDropLevel() {
  const r = Math.random();
  let acc = 0;
  for (const d of DATA.dropTable) { acc += d.chance; if (r < acc) return d.level; }
  return 1;
}

function countItems(chain, level) {
  return state.grid.filter(it => it && it.chain === chain && it.level === level).length;
}
function removeItems(chain, level, qty) {
  let left = qty;
  for (let i = 0; i < SIZE && left > 0; i++) {
    const it = state.grid[i];
    if (it && it.chain === chain && it.level === level) { state.grid[i] = null; left--; }
  }
}
function getUtilityBoost() {
  return state.grid.reduce((sum, it) =>
    it && it.chain === "utility" ? sum + DATA.chains.utility.items[it.level - 1].boost : sum, 0);
}
function emptyCells() {
  return state.grid.map((v, i) => v === null ? i : -1).filter(i => i >= 0);
}

// ----- Rendu -----
const board = document.getElementById("board");

function render() {
  renderHud();
  renderBoard();
  renderOrders();
  updateGenButtons();
}

function renderHud() {
  document.getElementById("coin-count").textContent = state.coins;
  document.getElementById("energy-count").textContent = state.energy;
  document.getElementById("energy-fill").style.width = (state.energy / ENERGY.max * 100) + "%";
  const lvl = playerLevel();
  const rem = state.xp - xpTotalBefore(lvl);
  document.getElementById("level-num").textContent = lvl;
  document.getElementById("xp-fill").style.width = Math.min(100, rem / xpNeeded(lvl) * 100) + "%";
  document.getElementById("buy-energy-btn").textContent = "+" + BUY_ENERGY.amount;
  document.getElementById("buy-energy-btn").disabled =
    state.coins < BUY_ENERGY.cost || state.energy >= ENERGY.max;
}
function xpTotalBefore(lvl) {
  let total = 0;
  for (let l = 1; l < lvl; l++) total += xpNeeded(l);
  return total;
}

function renderBoard() {
  board.innerHTML = "";
  state.grid.forEach((item, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;

    if (item) {
      const data = DATA.chains[item.chain].items[item.level - 1];
      const c = document.createElement("div");
      c.className = "creature chain-" + item.chain;
      c.dataset.index = i;
      if (item.chain === 'creatures') c.classList.add('anim-creature');
      if (item.chain === 'eco') c.classList.add('anim-eco');
      if (item.chain === 'utility') c.classList.add('anim-util');

      // L'emoji est la base ; si une image existe elle vient se superposer
      c.textContent = data.emoji;
      if (data.img) {
        const img = document.createElement("img");
        img.src = data.img;
        img.alt = "";
        img.onload = function () { c.textContent = ''; c.appendChild(img); };
        c.appendChild(img);
      }

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

// ----- Générateurs (3, un par chaîne) -----
function spawnFromGenerator(chain) {
  const empties = emptyCells();
  if (state.energy < 1 || !empties.length) return;

  state.energy -= 1;
  let idx = empties[Math.floor(Math.random() * empties.length)];
  state.grid[idx] = { chain, level: rollDropLevel() };
  createSparkles(board.children[idx]);

  // Item bonus occasionnel → la grille se remplit plus vite
  if (Math.random() < (DATA.bonusSpawnChance || 0)) {
    const rest = emptyCells();
    if (rest.length) {
      const idx2 = rest[Math.floor(Math.random() * rest.length)];
      state.grid[idx2] = { chain, level: 1 };
    }
  }

  save(); render();
}

function renderGenerators() {
  const row = document.getElementById("gen-row");
  row.innerHTML = "";
  DATA.generators.forEach(g => {
    const b = document.createElement("button");
    b.className = "gen-btn";
    b.id = g.id;
    b.innerHTML = g.icon + " " + dl(g) + "<small>⚡ 1</small>";
    b.addEventListener("click", () => spawnFromGenerator(g.chain));
    row.appendChild(b);
  });
  updateGenButtons();
}
function updateGenButtons() {
  const canSpawn = state.energy >= 1 && state.grid.includes(null);
  DATA.generators.forEach(g => {
    const b = document.getElementById(g.id);
    if (b) b.disabled = !canSpawn;
  });
}

// ----- Récolte (tap sur une Richesse) -----
function collectEco(i) {
  const item = state.grid[i];
  if (!item || item.chain !== "eco") return;
  const data = DATA.chains.eco.items[item.level - 1];
  state.coins += data.value;
  state.grid[i] = null;
  const pop = document.createElement("div");
  pop.className = "coin-pop";
  pop.textContent = "+" + data.value + " 🪙";
  board.children[i].appendChild(pop);
  createSparkles(board.children[i]);
  save(); render();
}

// ----- Commandes -----
function renderOrders() {
  const wrap = document.getElementById("orders-cards");
  wrap.innerHTML = "";
  const lvl = playerLevel();

  state.orders.forEach((oi, slot) => {
    const o = DATA.orders[oi];
    const npc = DATA.npcs[o.npc];
    const card = document.createElement("div");
    card.className = "order-card";

    const head = document.createElement("div");
    head.className = "order-npc";
    head.textContent = npc.emoji + " " + dl(npc);
    card.appendChild(head);

    const text = document.createElement("div");
    text.className = "order-text";
    text.textContent = dl(o);
    card.appendChild(text);

    const chips = document.createElement("div");
    chips.className = "order-chips";
    let canClaim = true;
    o.requires.forEach(r => {
      const have = countItems(r.chain, r.level);
      if (have < r.qty) canClaim = false;
      const chip = document.createElement("span");
      chip.className = "chip" + (have >= r.qty ? " ok" : "");
      chip.textContent = DATA.chains[r.chain].items[r.level - 1].emoji +
        " " + t('lvl') + r.level + " · " + Math.min(have, r.qty) + "/" + r.qty;
      chips.appendChild(chip);
    });
    card.appendChild(chips);

    const foot = document.createElement("div");
    foot.className = "order-foot";
    const reward = document.createElement("span");
    reward.className = "order-reward";
    reward.textContent = "+" + o.reward.coins + "🪙 +" + o.reward.xp + "⭐";
    const btn = document.createElement("button");
    btn.className = "claim-btn";
    btn.textContent = t('claim');
    btn.disabled = !canClaim;
    btn.addEventListener("click", () => claimOrder(slot));
    foot.appendChild(reward);
    foot.appendChild(btn);
    card.appendChild(foot);

    wrap.appendChild(card);
  });
}

function claimOrder(slot) {
  const o = DATA.orders[state.orders[slot]];
  const ok = o.requires.every(r => countItems(r.chain, r.level) >= r.qty);
  if (!ok) return;
  o.requires.forEach(r => removeItems(r.chain, r.level, r.qty));
  state.coins += o.reward.coins;
  addXp(o.reward.xp);
  state.orders[slot] = pickOrder();
  save(); render();
}

function pickOrder() {
  const lvl = playerLevel();
  let idxs = DATA.orders.map((o, i) => ({ o, i }))
    .filter(x => x.o.minLevel <= lvl && !state.orders.includes(x.i));
  if (!idxs.length) idxs = DATA.orders.map((o, i) => ({ o, i })).filter(x => x.o.minLevel <= lvl);
  if (!idxs.length) idxs = DATA.orders.map((o, i) => ({ o, i }));
  idxs.sort((a, b) => b.o.minLevel - a.o.minLevel);
  const top = idxs.slice(0, 5);
  return top[Math.floor(Math.random() * top.length)].i;
}

// ----- Drag & Drop tactile + tap -----
const ghost = document.createElement("div");
ghost.id = "ghost";
document.body.appendChild(ghost);

let dragFrom = -1;

function attachDrag(el) {
  el.addEventListener("pointerdown", e => {
    dragFrom = +el.dataset.index;
    el.classList.add("dragging");
    const img = el.querySelector('img');
    if (img) {
      ghost.textContent = '';
      ghost.style.backgroundImage = "url('" + img.src + "')";
      ghost.style.width = '56px'; ghost.style.height = '56px';
    } else {
      ghost.textContent = el.textContent;
      ghost.style.backgroundImage = 'none';
      ghost.style.width = 'auto'; ghost.style.height = 'auto';
    }
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
  if (target) {
    const idx = +target.dataset.index;
    if (idx === dragFrom) {
      collectEco(idx); // tap simple sur une Richesse = récolter
    } else {
      tryMerge(dragFrom, idx);
    }
  }
  endDrag();
});

function moveGhost(e) {
  ghost.style.left = e.clientX + "px";
  ghost.style.top = (e.clientY - 55) + "px";
}

function endDrag() {
  dragFrom = -1;
  ghost.style.display = "none";
  ghost.style.backgroundImage = 'none';
  document.querySelectorAll(".highlight").forEach(c => c.classList.remove("highlight"));
  render();
}

function highlightTargets() {
  const item = state.grid[dragFrom];
  if (!item) return;
  document.querySelectorAll(".cell").forEach(cell => {
    const i = +cell.dataset.index;
    const targetItem = state.grid[i];
    if (i !== dragFrom && (targetItem === null ||
        (targetItem.chain === item.chain && targetItem.level === item.level)))
      cell.classList.add("highlight");
  });
}

function tryMerge(a, b) {
  const itemA = state.grid[a], itemB = state.grid[b];
  if (!itemA || !itemB || a === b) return;
  if (itemA.chain === itemB.chain && itemA.level === itemB.level && itemA.level < MAX_LEVEL) {
    state.grid[b] = { chain: itemA.chain, level: itemA.level + 1 };
    state.grid[a] = null;
    createSparkles(board.children[b]);
  }
  // sinon : échange de place
  else if (itemA.chain !== itemB.chain || itemA.level !== itemB.level) {
    state.grid[a] = itemB;
    state.grid[b] = itemA;
  }
}

function createSparkles(container) {
  for (let i = 0; i < 6; i++) {
    const s = document.createElement("div");
    s.className = "sparkle";
    const angle = Math.random() * Math.PI * 2;
    const dist = 20 + Math.random() * 30;
    s.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    s.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    s.style.left = '50%';
    s.style.top = '50%';
    container.appendChild(s);
    setTimeout(() => s.remove(), 700);
  }
}

// ----- Navigation / boutons -----
function switchScreen(name) {
  document.getElementById("screen-merge").classList.toggle("active", name === "merge");
  document.getElementById("screen-battle").classList.toggle("active", name === "battle");
  document.getElementById("nav-merge").classList.toggle("active", name === "merge");
  document.getElementById("nav-battle").classList.toggle("active", name === "battle");
  if (name === "battle") setupBattle();
}

document.getElementById("nav-merge").addEventListener("click", () => switchScreen("merge"));
document.getElementById("nav-battle").addEventListener("click", () => switchScreen("battle"));
document.getElementById("lang-toggle").addEventListener("click",
  () => setLanguage(currentLang === "fr" ? "en" : "fr"));
document.getElementById("buy-energy-btn").addEventListener("click", () => {
  if (state.coins >= BUY_ENERGY.cost && state.energy < ENERGY.max) {
    state.coins -= BUY_ENERGY.cost;
    state.energy = Math.min(ENERGY.max, state.energy + BUY_ENERGY.amount);
    save(); renderHud(); updateGenButtons();
  }
});

// ----- Histoire -----
const storyModal = document.getElementById("story-modal");
function showStory() { storyModal.classList.remove("hidden"); }
function closeStory() { storyModal.classList.add("hidden"); }
document.getElementById("story-btn").addEventListener("click", showStory);
document.getElementById("story-close").addEventListener("click", closeStory);

// ----- Initialisation -----
renderGenerators();
setLanguage(currentLang);
render();
if (!state.seenIntro) {
  showStory();
  state.seenIntro = true;
  save();
}
  
