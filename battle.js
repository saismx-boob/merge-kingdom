// ===== LUMO'S CHRONICLES — M3 : Combat automatique =====

const ENEMIES = ["👺", "👹", "👿", "🧟", "🦹", "💀"];
let battleRunning = false;

function makeFighter(lvl, isEnemy, emoji) {
  return {
    lvl,
    isEnemy,
    maxHp: 12 * lvl,
    hp: 12 * lvl,
    atk: 3 * lvl,
    emoji: emoji
  };
}

function getPlayerTeam() {
  return state.grid
    .filter(item => item && item.chain === 'creatures')
    .map(item => {
      const data = ITEMS.creatures[item.level - 1];
      return makeFighter(item.level, false, data.emoji);
    });
}

function getEnemyTeam() {
  const w = state.wave;
  const count = Math.min(1 + Math.floor(w / 2), 4);
  const team = [];
  for (let i = 0; i < count; i++) {
    const lvl = Math.max(1, Math.min(MAX_LEVEL, Math.round(w / 2) + (i === 0 ? 1 : 0)));
    const emoji = ENEMIES[Math.min(lvl - 1, ENEMIES.length - 1)];
    team.push(makeFighter(lvl, true, emoji));
  }
  return team;
}

// ----- Affichage pré-combat -----
function setupBattle() {
  if (battleRunning) return;
  document.getElementById("wave-label").textContent = t('wave_label') + " " + state.wave;
  document.getElementById("reward-label").textContent =
    t('reward_label') + " : " + (15 * state.wave) + " 🪙";

  drawSide("player-side", getPlayerTeam());
  drawSide("enemy-side", getEnemyTeam());

  const team = getPlayerTeam();
  const btn = document.getElementById("fight-btn");
  btn.disabled = team.length === 0;
  btn.textContent = team.length === 0 ? t('btn_no_creatures') : t('btn_fight');
  log(t('log_army') + team.length + t('log_ready'));
}

function drawSide(id, team) {
  const el = document.getElementById(id);
  el.innerHTML = "";
  team.forEach((f, i) => {
    const d = document.createElement("div");
    d.className = "fighter" + (f.isEnemy ? " enemy" : "");
    d.id = id + "-" + i;
    d.innerHTML =
      '<span class="emoji">' + f.emoji + '</span>' +
      '<div class="hp-bar"><div class="hp-fill" style="width:100%"></div></div>' +
      '<small>' + t('lvl') + f.lvl + '</small>';
    el.appendChild(d);
  });
}

function log(msg) {
  const l = document.getElementById("battle-log");
  l.innerHTML += msg + "<br>";
  l.scrollTop = l.scrollHeight;
}

// ----- Déroulement du combat -----
document.getElementById("fight-btn").addEventListener("click", () => {
  if (battleRunning) return;
  battleRunning = true;
  document.getElementById("fight-btn").disabled = true;

  let players = getPlayerTeam();
  let enemies = getEnemyTeam();
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
      defEl.querySelector(".hp-fill").style.width = (d.hp / d.maxHp * 100) + "%";
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
    const reward = 15 * state.wave;
    state.coins += reward;
    state.wave += 1;
    log(t('log_victory') + reward + " 🪙");
    
    // Récompense : un objet de base aléatoire
    const empty = state.grid.findIndex(v => v === null);
    if (empty >= 0) {
      const chains = ['eco', 'creatures', 'utility'];
      const randomChain = chains[Math.floor(Math.random() * chains.length)];
      state.grid[empty] = { chain: randomChain, level: 1 };
      log(t('log_chest'));
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
