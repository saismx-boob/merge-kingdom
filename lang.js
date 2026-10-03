// ===== SYSTÈME DE LANGUE (FR / EN) =====

const TRANSLATIONS = {
  fr: {
    title: "Lumo : Les Routes de l'Or",
    nav_merge: "🏰 Royaume",
    nav_battle: "⚔️ Combat",
    orders_title: "📜 Commandes de la Caravane",
    claim: "Livrer",
    hint: "Touche une Richesse 🏺 pour récolter • Fusionne 2 objets identiques • Les Trésors 🔮 boostent tes Esprits au combat",
    wave_label: "Vague",
    reward_label: "Récompense",
    btn_fight: "⚔️ LANCER LE COMBAT",
    btn_no_creatures: "❌ Invoque d'abord des Esprits !",
    log_battle_start: "⚔️ Le combat commence !",
    log_boss: "⚠️ VAGUE DE BOSS — La caravane est assiégée !",
    log_victory: "🏆 VICTOIRE ! +",
    log_xp: "⭐ Expérience gagnée !",
    log_defeat: "💀 Défaite... +5 🪙 de consolation. Fusionne pour devenir plus fort !",
    log_fragment_crea: "🥚 Un Esprit-Gardien sauvage rejoint ta grille !",
    log_fragment_util: "🔮 Un Trésor des Ancêtres émerge des ruines !",
    log_grid_full: "📦 Grille pleine ! +20 🪙 à la place.",
    log_army: "Ton armée : ",
    log_ready: " Esprit(s) prêt(s). Boost Trésors : +",
    log_boost_end: "% ATK",
    lvl: "Nv",
    story_title: "📖 L'Histoire des Deux Rives",
    story_close: "Prendre la route ➜",
    story: "<p>Il y a mille ans, les rois de <b>Numidie</b> — Massinissa, puis Jugurtha — unirent les tribus du Nord, et leur cavalerie fut célèbre jusqu'à Rome.</p><p>Au Sud, au-delà du sable, les empires du Sahel — <b>Wagadu</b>, le pays de Sunjata — gardaient les routes de l'or et du sel.</p><p>Entre les deux rives, des caravanes tissèrent un réseau d'oasis, de lanternes et de tambours : <b>les Routes de l'Or</b>.</p><p>Mais l'Éclipse est venue. Les Ombres dévorent les puits, coupent les pistes, éteignent les lanternes.</p><p>Toi, <b>Lumo</b>, guide des caravanes, descendante des deux rives, restaure le Réseau : fusionne les dons des Ancêtres, réponds aux commandes des Grands Noms, et chasse l'Éclipse de la piste du sel.</p>"
  },
  en: {
    title: "Lumo: The Gold Routes",
    nav_merge: "🏰 Kingdom",
    nav_battle: "⚔️ Battle",
    orders_title: "📜 Caravan Orders",
    claim: "Deliver",
    hint: "Tap a Rich 🏺 to harvest • Merge 2 identical items • Treasures 🔮 boost your Spirits in battle",
    wave_label: "Wave",
    reward_label: "Reward",
    btn_fight: "⚔️ START BATTLE",
    btn_no_creatures: "❌ Summon Spirits first!",
    log_battle_start: "⚔️ The battle begins!",
    log_boss: "⚠️ BOSS WAVE — The caravan is under siege!",
    log_victory: "🏆 VICTORY! +",
    log_xp: "⭐ Experience gained!",
    log_defeat: "💀 Defeat... +5 🪙 consolation. Merge to get stronger!",
    log_fragment_crea: "🥚 A wild Guardian Spirit joins your grid!",
    log_fragment_util: "🔮 An Ancestors' Treasure emerges from the ruins!",
    log_grid_full: "📦 Grid full! +20 🪙 instead.",
    log_army: "Your army: ",
    log_ready: " Spirit(s) ready. Treasure boost: +",
    log_boost_end: "% ATK",
    lvl: "Lv",
    story_title: "📖 The Tale of Two Shores",
    story_close: "Hit the road ➜",
    story: "<p>A thousand years ago, the kings of <b>Numidia</b> — Massinissa, then Jugurtha — united the northern tribes, and their cavalry was famed as far as Rome.</p><p>To the South, beyond the sand, the Sahel empires — <b>Wagadu</b>, land of Sunjata — guarded the routes of gold and salt.</p><p>Between both shores, caravans wove a network of oases, lanterns and drums: <b>the Gold Routes</b>.</p><p>But the Eclipse has come. Shadows devour the wells, cut the tracks, put out the lanterns.</p><p>You, <b>Lumo</b>, caravan guide, child of both shores, must restore the Network: merge the gifts of the Ancestors, answer the orders of the Great Names, and chase the Eclipse off the salt road.</p>"
  }
};

let currentLang = localStorage.getItem("lumoLang") || "fr";

function t(key) {
  return TRANSLATIONS[currentLang][key] || TRANSLATIONS.fr[key] || key;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lumoLang", lang);
  document.getElementById("lang-label").textContent = lang.toUpperCase();
  document.title = t('title');
  document.getElementById("nav-merge").textContent = t('nav_merge');
  document.getElementById("nav-battle").textContent = t('nav_battle');
  document.getElementById("orders-title").textContent = t('orders_title');
  document.getElementById("hint").textContent = t('hint');
  document.getElementById("fight-btn").textContent = t('btn_fight');
  document.getElementById("story-title").textContent = t('story_title');
  document.getElementById("story-text").innerHTML = t('story');
  document.getElementById("story-close").textContent = t('story_close');
  // Relancer les rendus dynamiques si déjà chargés
  if (typeof render === 'function') render();
  if (typeof renderGenerators === 'function') renderGenerators();
  if (typeof setupBattle === 'function') setupBattle();
}
