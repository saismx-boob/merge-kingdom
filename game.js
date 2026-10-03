// ===== LES ROUTES DE L'OR — Moteur =====

const SIZE_COLS = 7, SIZE_ROWS = 7, SIZE = SIZE_COLS * SIZE_ROWS;
const ENERGY = { max: 80, baseRegenMs: 45000, start: 40 };
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
    locks: (typeof DATA !== 'undefined' && DATA.lockMap) ? DATA.lockMap.flat() : Array(SIZE).fill(0),
    unlockedRegions: ["timgad"],
    purifiedRegions: [],
    seenScenes: [],
    orders: [0, 1, 2]
  };
}

let state = load() || defaultState();

function save() { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!s) return null;
    const d = defaultState();
    for (const k in d) if (s[k] === undefined) s[k] = d[k];
    if (!Array.isArray(s.grid) || s.grid.length !== SIZE) s.grid = startingGrid();
    if (!Array.isArray(s.locks) || s.locks.length !== SIZE) {
      s.locks = DATA.lockMap.flat();
      for (let i = 0; i < SIZE; i++) if (s.grid[i]) s.locks[i] = 0;
    }
    if (!Array.isArray(s.unlockedRegions)) s.unlockedRegions = ["timgad"];
    if (!Array.isArray(s.purifiedRegions)) s.purifiedRegions = [];
    if (!Array.isArray(s.seenScenes)) s.seenScenes = [];
    if (!Array.isArray(s.orders) || s.orders.length !== 3 ||
        s.orders.some(i => i < 0 || i >= DATA.orders.length)) s.orders = [0, 1, 2];
    return s;
  } catch (e) { return null; }
}

// ----- BONUS DES RÉGIONS PURIFIÉES -----
function pur(id) { return state.purifiedRegions.includes(id); }
function goldMult() { let m = 1; if (pur("timgad")) m *= 1.10; if (pur("trone")) m *= 1.20; return m; }
function xpMult()   { let m = 1; if (pur("wagadu")) m *= 1.15; if (pur("trone")) m *= 1.20; return m; }
function atkMult()  { return pur("fleuve") ? 1.15 : 1; }
function energyRegenMs() { return ENERGY.baseRegenMs * (pur("oasis") ? 0.75 : 1); }
function hasBeatenWave(n) { return state.wave > n; }

// ----- XP / Niveau joueur -----
function xpNeeded(level) { return 20 + (level - 1) * 25; }
function playerLevel() {
  let lvl = 1, rem = state.xp;
  while (rem >= xpNeeded(lvl) && lvl < 20) { rem -= xpNeeded(lvl); lvl++; }
  return lvl;
}
function addXp(n) { state.xp += Math.round(n * xpMult()); }

// ----- Énergie -----
function tickEnergy() {
  if (state.energy >= ENERGY.max) { state.energyTs = Date.now(); return; }
  const gained = Math.floor((Date.now() - state.energyTs) / energyRegenMs());
  if (gained > 0) {
    state.energy = Math.min(ENERGY.max, state.energy + gained);
    state.energyTs += gained * energyRegenMs();
    save(); renderHud(); updateGenButtons();
  }
}
setInterval(tickEnergy, 2000);

// ----- Helpers -----
function dl(o) { return currentLang === 'fr' ? o.fr : o.en; }

function rollDropLevel() {
  const r = Math.random(); let acc = 0;
  for (const d of DATA.dropTable) { acc += d.chance; if (r < acc) return d.level; }
  return 1;
}
function emptyCells() {
  const out = [];
  for (let i = 0; i < SIZE; i++) if (!state.grid[i] && !state.locks[i]) out.push(i);
  return out;
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

// ----- SPRITESHEETS (détection automatique) -----
const SPR = { items: false, enemies: false };
function initSprites() {
  try {
    const s = DATA.sprites;
    if (s && s.itemsSheet) {
      const im = new Image();
      im.onload = () => { SPR.items = true; render(); };
      im.src = s.itemsSheet;
    }
    if (s && s.enemiesSheet) {
      const im2 = new Image();
      im2.onload = () => { SPR.enemies = true; };
      im2.src = s.enemiesSheet;
    }
  } catch (e) {}
}
function applyItemSprite(el, chain, level) {
  const s = DATA.sprites;
  const row = s.rowOrder.indexOf(chain);
  const col = level - 1;
  el.style.backgroundImage = "url('" + s.itemsSheet + "')";
  el.style.backgroundSize = (s.cols * 100) + "% " + (s.rows * 100) + "%";
  el.style.backgroundPosition = (col / (s.cols - 1) * 100) + "% " + (row / (s.rows - 1) * 100) + "%";
  el.style.backgroundRepeat = "no-repeat";
}

// ----- Fond dynamique selon la région purifiée -----
function applyRegionBg() {
  const layer = document.getElementById("bg-layer");
  if (!layer) return;
  let r = DATA.regions[0];
  DATA.regions.forEach(rg => { if (pur(rg.id)) r = rg; });
  layer.style.backgroundImage = "none";
  layer.style.background = r.gradient;
  if (r.bg) {
    const im = new Image();
    im.onload = () => {
      layer.style.backgroundImage = "url('" + r.bg + "')";
      layer.style.backgroundSize = "cover";
      layer.style.backgroundPosition = "center";
    };
    im.src = r.bg;
  }
}

// ----- Racines de l'Éclipse -----
function lockCost(req) { return DATA.lockBaseCost * Math.pow(2, req - 1); }

let pendingUnlockPops = [];
let selectedLock = -1;
function checkAdjacentUnlocks(idx, level) {
  const col = idx % SIZE_COLS;
  const nbs = [];
  if (col > 0) nbs.push(idx - 1);
  if (col < SIZE_COLS - 1) nbs.push(idx + 1);
  if (idx - SIZE_COLS >= 0) nbs.push(idx - SIZE_COLS);
  if (idx + SIZE_COLS < SIZE) nbs.push(idx + SIZE_COLS);
  nbs.forEach(n => {
    if (state.locks[n] > 0 && state.locks[n] <= level) {
      state.locks[n] = 0;
      if (selectedLock === n) selectedLock = -1;
      pendingUnlockPops.push(n);
    }
  });
  if (pendingUnlockPops.length) addXp(2 * pendingUnlockPops.length);
}

function tapLock(i) {
  if (state.locks[i] <= 0) return;
  if (selectedLock === i) {
    const cost = lockCost(state.locks[i]);
    if (state.coins >= cost) {
      state.coins -= cost;
      state.locks[i] = 0;
      selectedLock = -1;
      addXp(2);
      save(); render();
      addPop(i, t('unlocked_pop'));
    }
  } else {
    selectedLock = i;
    renderBoard();
  }
}

// ----- Rendu -----
const board = document.getElementById("board");

function render() {
  renderHud();
  renderBoard();
  renderOrders();
  updateGenButtons();
  applyRegionBg();
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
  for (let i = 0; i < SIZE; i++) {
    const item = state.grid[i];
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;

    if (state.locks[i] > 0 && !item) {
      cell.classList.add("locked");
      const req = state.locks[i];
      const fog = document.createElement("div");
      fog.className = "lock-fog";
      if (selectedLock === i) {
        const cost = lockCost(req);
        fog.innerHTML = '🔓<span class="lock-pay' + (state.coins >= cost ? '' : ' cant') + '">' + cost + ' 🪙</span>';
      } else {
        fog.innerHTML = '🌑<span class="lock-req">' + t('lvl') + req + '</span>';
      }
      cell.appendChild(fog);
      cell.addEventListener("click", () => tapLock(i));
    }
    else if (item) {
      const data = DATA.chains[item.chain].items[item.level - 1];
      const c = document.createElement("div");
      c.className = "creature chain-" + item.chain;
      c.dataset.index = i;
      if (item.chain === 'creatures') c.classList.add('anim-creature');
      if (item.chain === 'eco') c.classList.add('anim-eco');
      if (item.chain === 'utility') c.classList.add('anim-util');

      if (SPR.items) {
        applyItemSprite(c, item.chain, item.level);
      } else {
        c.textContent = data.emoji;
        if (data.img) {
          const img = document.createElement("img");
          img.src = data.img;
          img.alt = "";
          img.onload = function () { c.textContent = ''; c.appendChild(img); };
          c.appendChild(img);
        }
      }

      const badge = document.createElement("span");
      badge.className = "lvl-badge";
      badge.textContent = t('lvl') + item.level;
      cell.appendChild(badge);
      cell.appendChild(c);
      attachDrag(c);
    }
    board.appendChild(cell);
  }
}

function addPop(i, text) {
  const cell = board.children[i];
  if (!cell) return;
  const pop = document.createElement("div");
  pop.className = "coin-pop";
  pop.textContent = text;
  cell.appendChild(pop);
  setTimeout(() => pop.remove(), 850);
}

// ----- Générateurs -----
function spawnFromGenerator(chain) {
  const empties = emptyCells();
  if (state.energy < 1 && !(pur("foret") && Math.random() < 0.20)) {
    if (state.energy < 1) return;
  }
  if (!empties.length) return;

  const freeTap = pur("foret") && Math.random() < 0.20;
  if (!freeTap) {
    if (state.energy < 1) return;
    state.energy -= 1;
  }

  let idx = empties[Math.floor(Math.random() * empties.length)];
  state.grid[idx] = { chain, level: rollDropLevel() };

  if (Math.random() < (DATA.bonusSpawnChance || 0)) {
    const rest = emptyCells();
    if (rest.length) {
      const idx2 = rest[Math.floor(Math.random() * rest.length)];
      state.grid[idx2] = { chain, level: 1 };
    }
  }

  save(); render();
  createSparkles(board.children[idx]);
  if (freeTap) addPop(idx, "🎁");
}

function renderGenerators() {
  const row = document.getElementById("gen-row");
  if (!row) return;
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
  const canSpawn = state.energy >= 1 && emptyCells().length > 0;
  DATA.generators.forEach(g => {
    const b = document.getElementById(g.id);
    if (b) b.disabled = !canSpawn;
  });
}

// ----- Récolte -----
function collectEco(i) {
  const item = state.grid[i];
  if (!item || item.chain !== "eco") return;
  const data = DATA.chains.eco.items[item.level - 1];
  state.coins += data.value;
  state.grid[i] = null;
  save(); render();
  addPop(i, "+" + data.value + " 🪙");
  createSparkles(board.children[i]);
}

// ----- Commandes -----
function renderOrders() {
  const wrap = document.getElementById("orders-cards");
  if (!wrap) return;
  wrap.innerHTML = "";
  const lvl = playerLevel();

  state.orders.forEach((oi, slot) => {
    const o = DATA.orders[oi];
    if (!o) return;
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
    reward.textContent = "+" + Math.round(o.reward.coins * goldMult()) + "🪙 +" + o.reward.xp + "⭐";
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
  state.coins += Math.round(o.reward.coins * goldMult());
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
let lastMergeCell = -1;

function attachDrag(el) {
  el.addEventListener("pointerdown", e => {
    dragFrom = +el.dataset.index;
    el.classList.add("dragging");
    if (SPR.items) {
      ghost.textContent = '';
      ghost.style.backgroundImage = "url('" + DATA.sprites.itemsSheet + "')";
      const s = DATA.sprites;
      const row = s.rowOrder.indexOf(state.grid[dragFrom].chain);
      const col = state.grid[dragFrom].level - 1;
      ghost.style.backgroundSize = (s.cols * 56) + "px " + (s.rows * 56) + "px";
      ghost.style.backgroundPosition = (-col * 56) + "px " + (-row * 56) + "px";
      ghost.style.width = '56px'; ghost.style.height = '56px';
    } else {
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
    if (idx === dragFrom) collectEco(idx);
    else tryMerge(dragFrom, idx);
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
  selectedLock = -1;
  render();
  if (pendingUnlockPops.length) {
    pendingUnlockPops.forEach(n => addPop(n, t('unlocked_pop')));
    pendingUnlockPops = [];
  }
  if (lastMergeCell >= 0) {
    createSparkles(board.children[lastMergeCell]);
    lastMergeCell = -1;
  }
}

function highlightTargets() {
  const item = state.grid[dragFrom];
  if (!item) return;
  document.querySelectorAll(".cell").forEach(cell => {
    const i = +cell.dataset.index;
    const targetItem = state.grid[i];
    const freeEmpty = !targetItem && !state.locks[i];
    const mergeable = targetItem &&
      targetItem.chain === item.chain && targetItem.level === item.level;
    if (i !== dragFrom && (freeEmpty || mergeable))
      cell.classList.add("highlight");
  });
}

function tryMerge(a, b) {
  const itemA = state.grid[a], itemB = state.grid[b];
  if (!itemA || a === b) return;
  if (state.locks[b] > 0) return;

  if (!itemB) {
    state.grid[b] = itemA;
    state.grid[a] = null;
    return;
  }

  if (itemA.chain === itemB.chain && itemA.level === itemB.level && itemA.level < MAX_LEVEL) {
    state.grid[b] = { chain: itemA.chain, level: itemA.level + 1 };
    state.grid[a] = null;
    lastMergeCell = b;
    checkAdjacentUnlocks(b, itemA.level + 1);
  } else {
    state.grid[a] = itemB;
    state.grid[b] = itemA;
  }
}

function createSparkles(container) {
  if (!container) return;
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

// ----- Toast -----
let toastTimer = null;
function showToast(msg) {
  const tEl = document.getElementById("toast");
  if (!tEl) return;
  tEl.textContent = msg;
  tEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => tEl.classList.remove("show"), 2800);
}

// ----- Navigation -----
function switchScreen(name) {
  ["merge", "map", "battle"].forEach(n => {
    const scr = document.getElementById("screen-" + n);
    const nav = document.getElementById("nav-" + n);
    if (scr) scr.classList.toggle("active", n === name);
    if (nav) nav.classList.toggle("active", n === name);
  });
  if (name === "map" && typeof renderMap === 'function') renderMap();
  if (name === "battle" && typeof setupBattle === 'function') setupBattle();
}

const navMerge = document.getElementById("nav-merge");
const navMap = document.getElementById("nav-map");
const navBattle = document.getElementById("nav-battle");
if (navMerge) navMerge.addEventListener("click", () => switchScreen("merge"));
if (navMap) navMap.addEventListener("click", () => switchScreen("map"));
if (navBattle) navBattle.addEventListener("click", () => switchScreen("battle"));
document.getElementById("lang-toggle").addEventListener("click",
  () => setLanguage(currentLang === "fr" ? "en" : "fr"));
document.getElementById("buy-energy-btn").addEventListener("click", () => {
  if (state.coins >= BUY_ENERGY.cost && state.energy < ENERGY.max) {
    state.coins -= BUY_ENERGY.cost;
    state.energy = Math.min(ENERGY.max, state.energy + BUY_ENERGY.amount);
    save(); renderHud(); updateGenButtons();
  }
});

// ----- Histoire (modale récap classique) -----
const storyModal = document.getElementById("story-modal");
function showStory() { if (storyModal) storyModal.classList.remove("hidden"); }
function closeStory() { if (storyModal) storyModal.classList.add("hidden"); }
docum
