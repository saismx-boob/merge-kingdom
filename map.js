// ===== LA ROUTE DE L'OR — Carte des Régions =====

function renderMap() {
  const list = document.getElementById("map-list");
  list.innerHTML = "";
  const lvl = playerLevel();

  document.getElementById("map-progress").textContent =
    t('map_progress') + " : " + state.purifiedRegions.length + " / " + DATA.regions.length;

  DATA.regions.forEach(r => {
    const locked = !state.unlockedRegions.includes(r.id);
    const purified = pur(r.id);

    const card = document.createElement("div");
    card.className = "region-card " + (purified ? "pure" : (locked ? "locked" : "corrupt"));

    // En-tête : icône + nom
    const head = document.createElement("div");
    head.className = "region-head";
    head.innerHTML = '<span class="region-icon">' + r.icon + '</span><span class="region-name">' + dl(r) + '</span>';
    card.appendChild(head);

    // Statut
    const status = document.createElement("div");
    status.className = "region-status";
    if (purified) {
      status.innerHTML = '<span class="st-pure">' + t('region_pure') + '</span> ' +
        r.freedEmoji + ' ' + dl({ fr: r.freed_fr, en: r.freed_en });
    } else if (locked) {
      status.textContent = t('region_locked') + ' · ' + t('req_level') + ' ' + r.unlock.level;
    } else {
      status.innerHTML = '<span class="st-corrupt">🌑 ' + dl({ fr: r.priest_fr, en: r.priest_en }) + '</span>';
    }
    card.appendChild(status);

    // Bonus
    const bonus = document.createElement("div");
    bonus.className = "region-bonus";
    bonus.textContent = "🎁 " + dl({ fr: r.bonus_fr, en: r.bonus_en });
    card.appendChild(bonus);

    // Lore (visible si débloquée)
    if (!locked) {
      const lore = document.createElement("div");
      lore.className = "region-lore";
      lore.textContent = dl({ fr: r.lore_fr, en: r.lore_en });
      card.appendChild(lore);
    }

    // Action
    const action = document.createElement("div");
    action.className = "region-action";
    if (purified) {
      const done = document.createElement("span");
      done.className = "region-done";
      done.textContent = "✅";
      action.appendChild(done);
    } else if (locked) {
      const btn = document.createElement("button");
      btn.className = "map-btn";
      btn.textContent = t('btn_unlock') + " · " + r.unlock.coins + " 🪙";
      btn.disabled = state.coins < r.unlock.coins || lvl < r.unlock.level;
      btn.addEventListener("click", () => unlockRegion(r.id));
      action.appendChild(btn);
    } else {
      const btn = document.createElement("button");
      btn.className = "map-btn purify";
      if (hasBeatenWave(r.freeWave)) {
        btn.textContent = t('btn_purify');
        btn.disabled = false;
        btn.addEventListener("click", () => purifyRegion(r.id));
      } else {
        btn.textContent = t('btn_need_wave') + " " + r.freeWave;
        btn.disabled = true;
      }
      action.appendChild(btn);
    }
    card.appendChild(action);

    list.appendChild(card);
  });
}

function unlockRegion(id) {
  const r = DATA.regions.find(x => x.id === id);
  if (!r || state.coins < r.unlock.coins || playerLevel() < r.unlock.level) return;
  state.coins -= r.unlock.coins;
  state.unlockedRegions.push(id);
  save(); render(); renderMap();
  showToast("⛺ " + t('toast_unlocked'));
}

function purifyRegion(id) {
  const r = DATA.regions.find(x => x.id === id);
  if (!r || !hasBeatenWave(r.freeWave) || pur(id)) return;
  state.purifiedRegions.push(id);
  addXp(15);
  save(); render(); renderMap();
  showToast(r.freedEmoji + " " + dl({ fr: r.freed_fr, en: r.freed_en }) +
    t('toast_freed') + dl({ fr: r.bonus_fr, en: r.bonus_en }));
}
