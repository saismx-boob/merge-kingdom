// ===== LES ROUTES DE L'OR — Moteur de Récit (dialogues & cinématiques) =====
// Les scènes vivent dans DATA.scenes (data.js).
// Portraits dessinés (optionnels) : assets/portraits/<who>.png → fallback emoji.

const CAST = {
  narr:     { emoji: "✨",   fr: "Le Griot",            en: "The Griot" },
  lumo:     { emoji: "🌟",   fr: "Lumo",                en: "Lumo" },
  baba:     { emoji: "👴",   fr: "Baba Kader",          en: "Baba Kader" },
  massiva:  { emoji: "👑",   fr: "Prince Massiva",      en: "Prince Massiva" },
  tanit:    { emoji: "🏺",   fr: "Marchande Tanit",     en: "Tanit the Merchant" },
  yennenga: { emoji: "🏹",   fr: "Éclaireuse Yennenga", en: "Scout Yennenga" },
  anansi:   { emoji: "🕷️",  fr: "Chroniqueur Anansi",  en: "Chronicler Anansi" },
  kofi:     { emoji: "⚒️",   fr: "Forgeron Kofi",       en: "Blacksmith Kofi" },
  dihya:    { emoji: "🐪",   fr: "Dihya",               en: "Dihya" },
  azizi:    { emoji: "🧞",   fr: "Azizi",               en: "Azizi" },
  bida:     { emoji: "🐍",   fr: "Bida",                en: "Bida" },
  mami:     { emoji: "🧜‍♀️", fr: "Mami Wata",           en: "Mami Wata" },
  kossa:    { emoji: "🥁",   fr: "Kossa",               en: "Kossa" },
  aube:     { emoji: "🌅",   fr: "L'Aube",              en: "The Dawn" },
  eclipse:  { emoji: "🌑",   fr: "L'Éclipse",           en: "The Eclipse" }
};

const STORY_UI = {
  fr:  { skip: "Passer ➜", hint: "Touche pour continuer ▼" },
  en:  { skip: "Skip ➜",   hint: "Tap to continue ▼" }
};

const Story = (function () {
  let overlay, bgEl, caravan, skipBtn, portraitBox, nameEl, textEl, hintEl;
  let lines = [], idx = 0, typeTimer = null, lineDone = false;
  let sceneId = null, onFinish = null;

  function seen(id) {
    if (!Array.isArray(state.seenScenes)) state.seenScenes = [];
    return state.seenScenes.includes(id);
  }
  function markSeen(id) {
    if (!Array.isArray(state.seenScenes)) state.seenScenes = [];
    if (!state.seenScenes.includes(id)) state.seenScenes.push(id);
  }

  function injectDOM() {
    overlay = document.createElement("div");
    overlay.id = "story-overlay";
    overlay.className = "hidden";

    bgEl = document.createElement("div");
    bgEl.className = "story-bg";
    overlay.appendChild(bgEl);

    caravan = document.createElement("div");
    caravan.className = "story-caravan";
    caravan.textContent = "🐪\u2003🐪\u2003🐪\u2003🐪";
    overlay.appendChild(caravan);

    skipBtn = document.createElement("button");
    skipBtn.className = "story-skip";
    skipBtn.addEventListener("click", e => { e.stopPropagation(); finish(); });
    overlay.appendChild(skipBtn);

    const box = document.createElement("div");
    box.className = "story-box";
    box.addEventListener("click", e => { e.stopPropagation(); advance(); });

    portraitBox = document.createElement("div");
    portraitBox.className = "story-portrait";
    box.appendChild(portraitBox);

    nameEl = document.createElement("div");
    nameEl.className = "story-name";
    box.appendChild(nameEl);

    textEl = document.createElement("div");
    textEl.className = "story-text";
    box.appendChild(textEl);

    hintEl = document.createElement("div");
    hintEl.className = "story-hint";
    box.appendChild(hintEl);

    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  function play(id, cb) {
    const scene = DATA.scenes && DATA.scenes[id];
    if (!scene || seen(id)) { if (cb) cb(); return; }
    sceneId = id; onFinish = cb || null;
    lines = scene.lines.slice(); idx = 0;

    // Fond : image si disponible, sinon dégradé de secours
    bgEl.style.backgroundImage = "none";
    bgEl.style.background = scene.gradient || "linear-gradient(170deg,#141b3d,#3b2140,#5c2e14)";
    if (scene.bg) {
      const im = new Image();
      im.onload = () => { bgEl.style.background = "none"; bgEl.style.backgroundImage = "url('" + scene.bg + "')"; };
      im.src = scene.bg;
    }
    caravan.style.display = scene.caravan ? "block" : "none";

    skipBtn.textContent = STORY_UI[currentLang].skip;
    overlay.classList.remove("hidden");
    showLine();
  }

  function showLine() {
    const line = lines[idx];
    const who = CAST[line.who] || CAST.narr;
    const isChap = line.style === "chap";

    nameEl.textContent = dl(who);
    portraitBox.className = "story-portrait" + (who.narr ? " narr" : "");

    // Portrait dessiné sinon emoji
    portraitBox.innerHTML = "";
    const em = document.createElement("span");
    em.className = "story-emoji";
    em.textContent = who.emoji;
    portraitBox.appendChild(em);
    if (!who.narr) {
      const im = new Image();
      im.src = "assets/portraits/" + line.who + ".png";
      im.onload = function () {
        if (lines[idx] === line) {
          portraitBox.innerHTML = "";
          im.className = "story-emoji";
          portraitBox.appendChild(im);
        }
      };
    }

    textEl.className = "story-text" + (line.who === "narr" ? " narr" : "") + (isChap ? " chap" : "");
    const full = currentLang === "fr" ? line.fr : line.en;
    textEl.textContent = "";
    hintEl.style.opacity = "0";
    lineDone = false;

    clearInterval(typeTimer);
    let i = 0;
    typeTimer = setInterval(() => {
      i += 2; // 2 chars/tick = plus fluide sur mobile
      textEl.textContent = full.slice(0, i);
      if (i >= full.length) { clearInterval(typeTimer); typeTimer = null; lineDone = true; hintEl.textContent = STORY_UI[currentLang].hint; hintEl.style.opacity = "1"; }
    }, 14);
  }

  function advance() {
    if (!overlay.classList.contains("hidden") === false) return;
    if (typeTimer) { // compléter la ligne instantanément
      clearInterval(typeTimer); typeTimer = null;
      const line = lines[idx];
      textEl.textContent = currentLang === "fr" ? line.fr : line.en;
      lineDone = true;
      hintEl.textContent = STORY_UI[currentLang].hint;
      hintEl.style.opacity = "1";
      return;
    }
    idx++;
    if (idx < lines.length) showLine();
    else finish();
  }

  function finish() {
    if (typeTimer) clearInterval(typeTimer);
    markSeen(sceneId);
    const scene = DATA.scenes[sceneId];
    if (scene && scene.reward) {
      if (scene.reward.coins) state.coins += scene.reward.coins;
      if (scene.reward.xp) addXp(scene.reward.xp);
    }
    overlay.classList.add("hidden");
    save(); render();
    const cb = onFinish; sceneId = null; onFinish = null;
    if (cb) cb();
  }

  // Déclencheurs automatiques (vérifié toutes les 4 s)
  function watch() {
    if (!DATA.scenes || !overlay || !overlay.classList.contains("hidden")) return;
    if (state.wave >= 10 && !seen("boss_10")) play("boss_10");
  }
  setInterval(watch, 4000);

  // Boot
  setTimeout(() => {
    if (!state.seenIntro) {
      if (typeof closeStory === "function") closeStory(); // ferme l'ancienne modale statique
      play("intro");
      state.seenIntro = true; save();
    }
  }, 700);

  return { play, advance };
})();

// Tap n'importe où sur l'overlay = avancer
document.addEventListener("pointerup", e => {
  const ov = document.getElementById("story-overlay");
  if (ov && !ov.classList.contains("hidden") && !e.target.closest(".story-skip")) Story.advance();
});
    
