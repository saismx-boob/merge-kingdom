// ===== SYSTÈME DE LANGUE (FR / EN) =====

const TRANSLATIONS = {
  fr: {
    title: "Les Chroniques de Lumo",
    nav_merge: "🏰 Royaume",
    nav_battle: "⚔️ Combat",
    btn_spawn: "✨ Invoquer (10 🪙)",
    hint_mine: "⛏️ Mine : +2 🪙 / 15s",
    hint_merge: "Fusionne 2 objets identiques !",
    wave_label: "Vague",
    reward_label: "Récompense",
    btn_fight: "⚔️ LANCER LE COMBAT",
    btn_no_creatures: "❌ Invoque d'abord des créatures !",
    log_battle_start: "⚔️ Le combat commence !",
    log_victory: "🏆 VICTOIRE ! +",
    log_defeat: "💀 Défaite... +5 🪙 de consolation. Fusionne pour devenir plus fort !",
    log_chest: "🎁 Coffre : une créature rejoint ton royaume !",
    log_army: "Ton armée : ",
    log_ready: " créature(s). Prêt ?",
    lvl: "Nv"
  },
  en: {
    title: "Lumo's Chronicles",
    nav_merge: "🏰 Kingdom",
    nav_battle: "⚔️ Battle",
    btn_spawn: "✨ Summon (10 🪙)",
    hint_mine: "⛏️ Mine: +2 🪙 / 15s",
    hint_merge: "Merge 2 identical items!",
    wave_label: "Wave",
    reward_label: "Reward",
    btn_fight: "⚔️ START BATTLE",
    btn_no_creatures: "❌ Summon creatures first!",
    log_battle_start: "⚔️ The battle begins!",
    log_victory: "🏆 VICTORY! +",
    log_defeat: "💀 Defeat... +5 🪙 consolation. Merge to get stronger!",
    log_chest: "🎁 Chest: a creature joins your kingdom!",
    log_army: "Your army: ",
    log_ready: " creature(s). Ready?",
    lvl: "Lv"
  }
};

let currentLang = localStorage.getItem("lumoLang") || "fr";

function t(key) {
  return TRANSLATIONS[currentLang][key] || key;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lumoLang", lang);
  document.getElementById("lang-label").textContent = lang.toUpperCase();
  // Mettre à jour les textes statiques de l'interface
  document.title = t('title');
  document.getElementById("nav-merge").textContent = t('nav_merge');
  document.getElementById("nav-battle").textContent = t('nav_battle');
  document.getElementById("spawn-btn").textContent = t('btn_spawn');
  document.getElementById("hint").innerHTML = t('hint_mine') + " &nbsp;•&nbsp; " + t('hint_merge');
  document.getElementById("fight-btn").textContent = t('btn_fight');
  // Relancer le rendu du jeu pour les textes dynamiques
  if (typeof render === 'function') render();
  if (typeof setupBattle === 'function') setupBattle();
}
