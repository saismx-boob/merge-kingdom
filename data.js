// ===== DONNÉES DU JEU — Les Routes de l'Or =====
// Tout le contenu (objets, PNJ, commandes, ennemis) est ICI.
// Équilibrer le jeu = modifier ce fichier, pas le code.

const DATA = {

  chains: {
    eco: {
      name_fr: "Richesses", name_en: "Riches", icon: "🏺",
      items: [
        { fr: "Graine d'Ambre",       en: "Amber Seed",         emoji: "🌱", img: "assets/eco_1.png",  value: 1 },
        { fr: "Fleur de Sel",         en: "Salt Flower",        emoji: "🌸", img: "assets/eco_2.png",  value: 3 },
        { fr: "Palmier Doré",         en: "Golden Palm",        emoji: "🌴", img: "assets/eco_3.png",  value: 8 },
        { fr: "Puits de l'Oasis",     en: "Oasis Well",         emoji: "⛲", img: "assets/eco_4.png",  value: 18 },
        { fr: "Amphore d'Or",         en: "Golden Amphora",     emoji: "🏺", img: "assets/eco_5.png",  value: 40 },
        { fr: "Grenier de Timgad",    en: "Timgad Granary",     emoji: "🏛️", img: "assets/eco_6.png",  value: 90 },
        { fr: "Coffre de Tanit",      en: "Tanit's Chest",      emoji: "💰", img: "assets/eco_7.png",  value: 200 },
        { fr: "Trésor de Massinissa", en: "Massinissa's Hoard", emoji: "👑", img: "assets/eco_8.png",  value: 450 },
        { fr: "Caravane d'Or",        en: "Golden Caravan",     emoji: "🐪", img: "assets/eco_9.png",  value: 1000 },
        { fr: "Étoile des Deux Rives",en: "Star of Two Shores", emoji: "🌠", img: "assets/eco_10.png", value: 2500 }
      ]
    },
    creatures: {
      name_fr: "Esprits-Gardiens", name_en: "Guardian Spirits", icon: "🐾",
      items: [
        { fr: "Fennec Étoilé",        en: "Star Fennec",        emoji: "🦊", img: "assets/crea_1.png",  atk: 1 },
        { fr: "Scorpion d'Ifri",      en: "Ifri's Scorpion",    emoji: "🦂", img: "assets/crea_2.png",  atk: 3 },
        { fr: "Cheval Numide",        en: "Numidian Horse",     emoji: "🐎", img: "assets/crea_3.png",  atk: 8 },
        { fr: "Crocodile du Fleuve",  en: "River Crocodile",    emoji: "🐊", img: "assets/crea_4.png",  atk: 15 },
        { fr: "Anansi le Malin",      en: "Clever Anansi",      emoji: "🕷️", img: "assets/crea_5.png",  atk: 30 },
        { fr: "Éléphant de Guerre",   en: "War Elephant",       emoji: "🐘", img: "assets/crea_6.png",  atk: 60 },
        { fr: "Bida l'Arc-en-Ciel",   en: "Bida the Rainbow",   emoji: "🐍", img: "assets/crea_7.png",  atk: 120 },
        { fr: "Gurzil le Taureau",    en: "Gurzil the Bull",    emoji: "🐂", img: "assets/crea_8.png",  atk: 250 },
        { fr: "Ogun le Forgeron",     en: "Ogun the Smith",     emoji: "⚒️", img: "assets/crea_9.png",  atk: 500 },
        { fr: "Lion de Sunjata",      en: "Sunjata's Lion",     emoji: "🦁", img: "assets/crea_10.png", atk: 1000 }
      ]
    },
    utility: {
      name_fr: "Trésors des Ancêtres", name_en: "Ancestors' Treasures", icon: "🔮",
      items: [
        { fr: "Perle de Tanit",           en: "Pearl of Tanit",        emoji: "🔮", img: "assets/util_1.png",  boost: 2 },
        { fr: "Lanterne de l'Oasis",      en: "Oasis Lantern",         emoji: "🏮", img: "assets/util_2.png",  boost: 4 },
        { fr: "Tambour Parlant",          en: "Talking Drum",          emoji: "🪘", img: "assets/util_3.png",  boost: 6 },
        { fr: "Tapis des Contes",         en: "Tale Carpet",           emoji: "🧶", img: "assets/util_4.png",  boost: 8 },
        { fr: "Boussole des Sables",      en: "Sand Compass",          emoji: "🧭", img: "assets/util_5.png",  boost: 10 },
        { fr: "Sceau de Jugurtha",        en: "Seal of Jugurtha",      emoji: "📜", img: "assets/util_6.png",  boost: 13 },
        { fr: "Awalé des Ancêtres",       en: "Ancestors' Awalé",      emoji: "🎲", img: "assets/util_7.png",  boost: 16 },
        { fr: "Balance de Tanit",         en: "Scales of Tanit",       emoji: "⚖️", img: "assets/util_8.png",  boost: 20 },
        { fr: "Astrolabe de Tombouctou",  en: "Timbuktu Astrolabe",    emoji: "🔭", img: "assets/util_9.png",  boost: 25 },
        { fr: "Trône des Deux Rives",     en: "Throne of Two Shores",  emoji: "👑", img: "assets/util_10.png", boost: 30 }
      ]
    }
  },

  generators: [
    { id: "gen_eco",  chain: "eco",       icon: "🌾", fr: "Semeuse d'Ambre", en: "Amber Sower" },
    { id: "gen_crea", chain: "creatures", icon: "🥚", fr: "Nid d'Esprits",   en: "Spirit Nest" },
    { id: "gen_util", chain: "utility",   icon: "⚒️", fr: "Forge de Kofi",   en: "Kofi's Forge" }
  ],

  // Table de drop commune aux 3 générateurs (par tap)
  dropTable: [
    { level: 1, chance: 0.85 },
    { level: 2, chance: 0.12 },
    { level: 3, chance: 0.03 }
  ],

  npcs: {
    massiva:  { emoji: "👑", fr: "Prince Massiva",       en: "Prince Massiva" },
    tanit:    { emoji: "🏺", fr: "Marchande Tanit",      en: "Tanit the Merchant" },
    yennenga: { emoji: "🏹", fr: "Éclaireuse Yennenga",  en: "Scout Yennenga" },
    anansi:   { emoji: "🕷️", fr: "Chroniqueur Anansi",   en: "Chronicler Anansi" },
    kofi:     { emoji: "⚒️", fr: "Forgeron Kofi",        en: "Blacksmith Kofi" }
  },

  orders: [
    { npc: "massiva", minLevel: 1,
      fr: "Les greniers de Timgad sont vides et la caravane impériale arrive. Apporte-moi des Graines d'Ambre pour nourrir mon peuple !",
      en: "Timgad's granaries are empty and the imperial caravan is coming. Bring me Amber Seeds to feed my people!",
      requires: [ { chain: "eco", level: 1, qty: 3 } ],
      reward: { coins: 60, xp: 8 } },

    { npc: "yennenga", minLevel: 1,
      fr: "Les Ombres rôdent sur la piste du sel. Un Fennec Étoilé guiderait ma patrouille la nuit.",
      en: "Shadows prowl the salt road. A Star Fennec would guide my night patrol.",
      requires: [ { chain: "creatures", level: 2, qty: 1 } ],
      reward: { coins: 80, xp: 10 } },

    { npc: "tanit", minLevel: 1,
      fr: "Je façonne des amulettes pour protéger les caravanes. Il me faut des Perles de Tanit.",
      en: "I craft amulets to protect the caravans. I need Pearls of Tanit.",
      requires: [ { chain: "utility", level: 1, qty: 2 } ],
      reward: { coins: 70, xp: 9 } },

    { npc: "massiva", minLevel: 2,
      fr: "Les jardins du palais se font maigres. Un Palmier Doré ferait honneur à Numidie.",
      en: "The palace gardens grow thin. A Golden Palm would honour Numidia.",
      requires: [ { chain: "eco", level: 3, qty: 1 } ],
      reward: { coins: 150, xp: 15 } },

    { npc: "anansi", minLevel: 2,
      fr: "Je tisse l'histoire des deux rives, mais il me faut des témoins ! Apporte-moi deux Fennecs : ils voient tout.",
      en: "I weave the story of both shores, but I need witnesses! Bring me two Fennecs: they see everything.",
      requires: [ { chain: "creatures", level: 2, qty: 2 } ],
      reward: { coins: 140, xp: 14 } },

    { npc: "kofi", minLevel: 2,
      fr: "Ma forge a soif de métal et mes apprentis de nourriture. Une Lanterne et des Graines, vite !",
      en: "My forge thirsts for metal and my apprentices for food. A Lantern and some Seeds, quickly!",
      requires: [ { chain: "utility", level: 2, qty: 1 }, { chain: "eco", level: 1, qty: 2 } ],
      reward: { coins: 160, xp: 16 } },

    { npc: "tanit", minLevel: 3,
      fr: "À Tombouctou, on paie l'or au poids du Puits. Apporte-moi un Puits de l'Oasis, je te rendrai l'or au double.",
      en: "In Timbuktu, gold is paid by the weight of the Well. Bring me an Oasis Well and I'll return double gold.",
      requires: [ { chain: "eco", level: 4, qty: 1 } ],
      reward: { coins: 260, xp: 22 } },

    { npc: "yennenga", minLevel: 3,
      fr: "Ma cavalerie exige un Cheval Numide digne de Massinissa. Rien de moins.",
      en: "My cavalry demands a Numidian Horse worthy of Massinissa. Nothing less.",
      requires: [ { chain: "creatures", level: 3, qty: 1 } ],
      reward: { coins: 280, xp: 24 } },

    { npc: "anansi", minLevel: 4,
      fr: "Une Boussole des Sables oubliée dort dans les ruines... ou plutôt dans TES mains. Donne.",
      en: "A lost Sand Compass sleeps in the ruins... or rather in YOUR hands. Hand it over.",
      requires: [ { chain: "utility", level: 4, qty: 1 } ],
      reward: { coins: 320, xp: 28 } },

    { npc: "massiva", minLevel: 4,
      fr: "L'ambassade de Wagadu arrive ! J'exposerai un Crocodile du Fleuve et un Puits de l'Oasis pour honorer Bida.",
      en: "The embassy of Wagadu arrives! I shall display a River Crocodile and an Oasis Well to honour Bida.",
      requires: [ { chain: "creatures", level: 4, qty: 1 }, { chain: "eco", level: 4, qty: 1 } ],
      reward: { coins: 500, xp: 40 } },

    { npc: "kofi", minLevel: 5,
      fr: "Pour briser les Racines d'Ombre, il me faut forger des Tambours Parleurs. Deux, pas un !",
      en: "To shatter the Shadow Roots, I must forge Talking Drums. Two, not one!",
      requires: [ { chain: "utility", level: 3, qty: 2 } ],
      reward: { coins: 420, xp: 35 } },

    { npc: "tanit", minLevel: 5,
      fr: "La Caravane de l'Éclipse part à l'aube. Une Amphore d'Or scellera notre pacte avec les empires du Sud.",
      en: "The Eclipse Caravan leaves at dawn. A Golden Amphora will seal our pact with the empires of the South.",
      requires: [ { chain: "eco", level: 5, qty: 1 } ],
      reward: { coins: 600, xp: 45 } }
  ],

  enemies: [
    { minWave: 1,  emoji: "👤", fr: "Ombre Errante",     en: "Wandering Shadow" },
    { minWave: 5,  emoji: "🦂", fr: "Scorpion d'Ombre",  en: "Shadow Scorpion" },
    { minWave: 10, emoji: "🐍", fr: "Serpent du Néant",   en: "Void Serpent" },
    { minWave: 15, emoji: "💀", fr: "Spectre de Sel",     en: "Salt Spectre" },
    { minWave: 20, emoji: "👹", fr: "Dévorant des Dunes", en: "Dune Devourer" },
    { minWave: 25, emoji: "🌑", fr: "Avatar de l'Éclipse",en: "Eclipse Avatar" }
  ]
};
