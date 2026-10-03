// ===== LES ROUTES DE L'OR — Combat des Caravanes =====

let battleRunning = false;
let pendingEnemies = null;
let battleReward = 0;

function enemyTier(w) {
  let tier = DATA.enemies[0];
  DATA.enemies.forEach(e => { if (w >= e.minWave) tier = e; });
  return tier;
}

function makeFighter(lvl, isEnemy, emoji, img, name, isBoss) {
  const boss = isBoss || false;
  return {
    lvl, isEnemy, emoji, img, name, boss,
    maxHp: Math.round(12 * lvl * (boss ? 2.2 : 1)),
    hp: Math.round(12 * lvl * (boss ? 2.2 : 1)),
    atk: Math.round(3 * lvl * (boss ? 1.3 : 1))
  };
}

function getPlayerTeam() {
  const boost = getUtilityBoost();
  const am = atkMult();
  return state.grid
    .filter(item => item && item.chain === 'creatures')
    .map(item => {
      const data = DATA.chains.creatures.items[item.level - 1];
      const f = makeFighter(item.level, false, data.emoji, data.img, dl(data), false);
      f.atk = Math.round(f.atk * (1 + boost / 100) * am);
      return f;
    });
}

function getEnemyTeam(w) {
  const boss = w % 5 === 0;
  const tier = enemyTier(w);
  const tierIdx = DATA.enemies.indexOf(tier);
  const team = [];
  if (boss) {
    const lvl = Math.max(1, Math.min(MAX_LEVEL, Math.ceil(w / 2) + 1));
    const f = makeFighter(lvl, true, tier.emoji, null, dl(tier), true);
    f.sheetCol = tierIdx;
    team.push(f);
  } else {
    const count = Math.min(1 + Math.floor(w / 2), 4);
    for (let i = 0; i < count; i++) {
      const lvl = Math.max(1, Math.min(MAX_LEVEL, Math.round(w / 2) + (i === 0 ? 1 : 0)));
      const f = makeFighter(lvl, true, tier.emoji, null, dl(tier), false);
      f.sheetCol = tierIdx;
      team.push(f);
    }
  }
  return team;
}

function setupBattle() {
  if (battleRunning) return;
  const w = state.wave;
  const boss = w % 5 === 0;
  battleReward = 15 * w * (boss ? 3 : 1);

  document.getElementById("wave-label").textContent =
    t('wave_label') + " " + w + (boss ? " 👑" : "");
  document.getElementById("reward-label").textContent =
    t('reward_label') + " : " + Math.round(battleReward * goldMult()) + " 🪙";

  pendingEnemies = getEnemyTeam(w);
  drawSide("player-side", getPlayerTeam());
  drawSide("enemy-side", pendingEnemies);

  const team = getPlayerTeam();
  const btn = document.getElementById("fight-btn");
  btn.disabled = team.length === 0;
  btn.textContent = team.length === 0 ? t('btn_no_creatures') : t('btn_fight');

  const boost = getUtilityBoost();
  document.getElementById("battle-log").innerHTML = "";
  log(t('log_army') + team.length + t('log_ready') + boost + t('log_boost_end'));
  if (boss) log(t('log_boss'));
}

function drawSide(id, team) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = "";
  team.forEach((f, i) => {
    const d = document.createElement("div");
    d.className = "fighter" + (f.isEnemy ? " enemy" : "") + (f.boss ? " boss" : "");
    d.id = id + "-" + i;
    d.title = f.name;

    const em = document.createElement("span");
    em.className = "emoji";
    em.textContent = f.emoji;

    if (f.isEnemy && SPR.enemies && f.sheetCol !== undefined) {
      const s = DATA.sprites;
      em.style.backgroundImage = "url('" + s.enemiesSheet + "')";
      em.style.backgroundSize = (s.cols * 100) + "% 100%";
      em.style.backgroundPosition = (f.sheetCol / (s.cols - 1) * 100) + "% 0%";
      em.style.backgroundRepeat = "no-repeat";
      em.style.width = "44px";
      em.style.height = "44px";
      em.style.margin = "0 auto";
      em.style.display = "block";
      if (f.boss) { em.style.width = "58px"; em.style.height = "58px"; }
      em.textContent = "";
    }

    if (!f.isEnemy && SPR.items && f.img) {
      const s = DATA.sprites;
      const row = s.rowOrder.indexOf("creatures");
      const col = f.lvl - 1;
      em.style.backgroundImage = "url('" + s.itemsSheet + "')";
      em.style.backgroundSize = (s.cols * 100) + "% " + (s.rows * 100) + "%";
      em.style.backgroundPosition = (col / (s.cols - 1) * 100) + "% " + (row / (s.rows - 1) * 100) + "%";
      em.style.backgroundRepeat = "no-repeat";
      em.style.width = "44px";
      em.style.height = "44px";
      em.style.margin = "0 auto";
      em.style.display = "block";
      em.textContent = "";
    }

    d.appendChild(em);

    const bar = document.createElement("div");
    bar.className = "hp-bar";
    bar.innerHTML = '<div class="hp-fill" style="width:100%"></div>';
    d.appendChild(bar);

    const badge = document.createElement("span");
    badge.className = "lvl-badge";
    badge.textContent = t('lvl') + f.lvl;
    d.appendChild(badge);

    el.appendChild(d);
  });
}

function log(msg) {
  const l = document.getElementById("battle-log");
  if (!l) return;
  l.innerHTML += msg + "<br>";
  l.scrollTop = l.scrollHeight;
}

document.getElementById("fight-btn").addEventListener("click", () => {
  if (battleRunning) return;
  battleRunning = true;
  document.getElementById("fight-btn").disabled = true;

  let players = getPlayerTeam();
  let enemies = pendingEnemies || getEnemyTeam(state.wave);
  drawSide("player-side", players);
  drawSide("enemy-side", enemies);
  document.getElementById("battle-log").innerHTML = "";
  log(t('log_battle_start'));

  const timer = setInterval(() => {
    attackRound(players, enemies, "player-side", "enemy-side");
    if (!checkEnd(players, enemies, timer)) {
      setTimeout(() => {
        attackRound(enemies, players, "enemy-side", "player-side");
        checkEnd(players, enemies, timer);
      }, 300);
    }
  }, 700);
});

function attackRound(attackers, defenders, atkSide, defSide) {
  attackers.forEach((a, i) => {
    if (a.hp <= 0) return;
    const alive = defenders.map((d, j) => d.hp > 0 ? j : -1).filter(j => j >= 0);
    if (!alive.length) return;
    const j = alive[Math.floor(Math.random() * alive.length)];
    const d = defenders[j];
    d.hp = Math.max(0, d.hp - a.atk);

    const atkEl = document.getElementById(atkSide + "-" + i);
    const defEl = document.getElementById(defSide + "-" + j);
    if (atkEl) { atkEl.classList.remove("attacking"); void atkEl.offsetWidth; atkEl.classList.add("attacking"); }
    if (defEl) {
      defEl.classList.remove("hit"); void defEl.offsetWidth; defEl.classList.add("hit");
      const fill = defEl.querySelector(".hp-fill");
      if (fill) fill.style.width = (d.hp / d.maxHp * 100) + "%";
      if (d.hp <= 0) defEl.classList.add("dead");
    }
  });
}

function checkEnd(players, enemies, timer) {
  const pAlive = players.some(p => p.hp > 0);
  const eAlive = enemies.some(e => e.hp > 0);
  if (pAlive && eAlive) return false;

  clearInterval(timer);
  battleRunning = false;

  if (pAlive) {
    const boss = state.wave % 5 === 0;
    const gained = Math.round(battleReward * goldMult());
    state.coins += gained;
    const xpGain = (3 + Math.floor(state.wave / 2)) * (boss ? 3 : 1);
    addXp(xpGain);
    log(t('log_victory') + gained + " 🪙");
    log(t('log_xp') + " (+" + xpGain + ")");

    if (boss) {
      if (!spawnItem("utility", 2)) { state.coins += 20; log(t('log_grid_full')); }
      else log(t('log_fragment_util'));
    } else if (Math.random() < 0.6) {
      const lvl = Math.random() < 0.75 ? 1 : 2;
      if (!spawnItem("creatures", lvl)) { state.coins += 20; log(t('log_grid_full')); }
      else log(t('log_fragment_crea'));
    }

    state.wave += 1;
    const ready = DATA.regions.find(r =>
      state.unlockedRegions.includes(r.id) && !pur(r.id) && hasBeatenWave(r.freeWave));
    if (ready) {
      showToast("🗺️ " + t('btn_purify') + " : " + r0(ready));
    }
  } else {
    state.coins += 5;
    log(t('log_defeat'));
  }
  save();
  render();
  setTimeout(setupBattle, 1500);
  return true;
}

function r0(r) { return currentLang === 'fr' ? r.fr : r.en; }

function spawnItem(chain, level) {
  const empty = emptyCells();
  if (!empty.length) return false;
  state.grid[empty[Math.floor(Math.random() * empty.length)]] = { chain, level };
  return true;
}
