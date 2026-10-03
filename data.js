// ===== DONNÉES DU JEU — Les Routes de l'Or =====
// Tout le contenu est ICI. Équilibrer = modifier ce fichier, pas le code.

const DATA = {

  sprites: {
    itemsSheet: "assets/sprites/items.png",
    cols: 10, rows: 3,
    rowOrder: ["eco", "creatures", "utility"],
    enemiesSheet: "assets/sprites/enemies.png"
  },

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
        { fr: "Perle de Tanit",          en: "Pearl of Tanit",       emoji: "🔮", img: "assets/util_1.png",  boost: 2 },
        { fr: "Lanterne de l'Oasis",     en: "Oasis Lantern",        emoji: "🏮", img: "assets/util_2.png",  boost: 4 },
        { fr: "Tambour Parlant",         en: "Talking Drum",         emoji: "🪘", img: "assets/util_3.png",  boost: 6 },
        { fr: "Tapis des Contes",        en: "Tale Carpet",          emoji: "🧶", img: "assets/util_4.png",  boost: 8 },
        { fr: "Boussole des Sables",     en: "Sand Compass",         emoji: "🧭", img: "assets/util_5.png",  boost: 10 },
        { fr: "Sceau de Jugurtha",       en: "Seal of Jugurtha",     emoji: "📜", img: "assets/util_6.png",  boost: 13 },
        { fr: "Awalé des Ancêtres",      en: "Ancestors' Awalé",     emoji: "🎲", img: "assets/util_7.png",  boost: 16 },
        { fr: "Balance de Tanit",        en: "Scales of Tanit",      emoji: "⚖️", img: "assets/util_8.png",  boost: 20 },
        { fr: "Astrolabe de Tombouctou", en: "Timbuktu Astrolabe",   emoji: "🔭", img: "assets/util_9.png",  boost: 25 },
        { fr: "Trône des Deux Rives",    en: "Throne of Two Shores", emoji: "👑", img: "assets/util_10.png", boost: 30 }
      ]
    }
  },

  generators: [
    { id: "gen_eco",  chain: "eco",       icon: "🌾", fr: "Semeuse d'Ambre", en: "Amber Sower" },
    { id: "gen_crea", chain: "creatures", icon: "🥚", fr: "Nid d'Esprits",   en: "Spirit Nest" },
    { id: "gen_util", chain: "utility",   icon: "⚒️", fr: "Forge de Kofi",   en: "Kofi's Forge" }
  ],

  dropTable: [
    { level: 1, chance: 0.85 },
    { level: 2, chance: 0.12 },
    { level: 3, chance: 0.03 }
  ],

  bonusSpawnChance: 0.20,

  lockMap: [
    [0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 2, 1],
    [0, 0, 0, 0, 2, 2, 2],
    [1, 2, 2, 3, 3, 3, 3],
    [3, 3, 4, 4, 4, 5, 4],
    [4, 5, 5, 6, 5, 6, 6]
  ],
  lockBaseCost: 20,

  regions: [
    {
      id: "timgad", icon: "🏛️",
      fr: "Timgad, la Porte du Nord", en: "Timgad, Gate of the North",
      priest_fr: "Prêtre des Cendres", priest_en: "Ash Priest",
      freed_fr: "Dihya, Reine des Aurès", freed_en: "Dihya, Queen of the Aurès",
      freedEmoji: "🐪",
      unlock: { coins: 0, level: 1 }, freeWave: 5,
      gradient: "linear-gradient(170deg,#1a1430 0%,#4a2418 60%,#7a3d1a 100%)",
      bg: "assets/bg_timgad.png",
      bonus_fr: "+10% d'or (commandes & combats)", bonus_en: "+10% gold (orders & battles)",
      lore_fr: "Le Prêtre des Cendres étouffait les greniers de Timgad de suie. Dihya, libérée, rallume les fourriers de la cité.",
      lore_en: "The Ash Priest choked Timgad's granaries with soot. Freed, Dihya relights the city's beacon fires."
    },
    {
      id: "oasis", icon: "🏝️",
      fr: "L'Oasis de Sel", en: "The Salt Oasis",
      priest_fr: "Prêtre du Mirage", priest_en: "Mirage Priest",
      freed_fr: "Azizi, Djinn des Sables", freed_en: "Azizi, Djinn of Sands",
      freedEmoji: "🧞",
      unlock: { coins: 500, level: 3 }, freeWave: 8,
      gradient: "linear-gradient(170deg,#0d1f2d 0%,#14504d 60%,#1a6b52 100%)",
      bg: "assets/bg_oasis.png",
      bonus_fr: "Énergie 25% plus rapide", bonus_en: "Energy 25% faster",
      lore_fr: "Le Mirage faisait tourner les puits en rond. Azizi, libéré, souffle à nouveau sur les caravanes assoiffées.",
      lore_en: "The Mirage spun the wells in circles. Freed, Azizi breathes cool winds upon thirsty caravans again."
    },
    {
      id: "wagadu", icon: "🏜️",
      fr: "Ruines de Wagadu", en: "Ruins of Wagadu",
      priest_fr: "Prêtre du Silence", priest_en: "Silence Priest",
      freed_fr: "Bida, Serpent Arc-en-Ciel", freed_en: "Bida, Rainbow Serpent",
      freedEmoji: "🐍",
      unlock: { coins: 2000, level: 5 }, freeWave: 12,
      gradient: "linear-gradient(170deg,#241a10 0%,#5c4416 55%,#8a6a1e 100%)",
      bg: "assets/bg_wagadu.png",
      bonus_fr: "+15% XP", bonus_en: "+15% XP",
      lore_fr: "Le Silence avait arrêté les tambours d'or de Wagadu. Bida, libéré, recoud le fleuve du récit.",
      lore_en: "Silence had stopped Wagadu's golden drums. Freed, Bida sews the river of story back together."
    },
    {
      id: "fleuve", icon: "🦛",
      fr: "La Boucle du Fleuve", en: "The River Bend",
      priest_fr: "Prêtre des Crues", priest_en: "Flood Priest",
      freed_fr: "Mami Wata, Esprit des Eaux", freed_en: "Mami Wata, Water Spirit",
      freedEmoji: "🧜‍♀️",
      unlock: { coins: 6000, level: 7 }, freeWave: 16,
      gradient: "linear-gradient(170deg,#0a1f24 0%,#114b46 55%,#17705b 100%)",
      bg: "assets/bg_fleuve.png",
      bonus_fr: "+15% ATK des Esprits", bonus_en: "+15% Spirit ATK",
      lore_fr: "Les Crues noyaient les ports de Tombouctou. Mami Wata, libérée, apaise le fleuve et double son or.",
      lore_en: "The Floods drowned Timbuktu's ports. Freed, Mami Wata soothes the river and doubles its gold."
    },
    {
      id: "foret", icon: "🌳",
      fr: "La Forêt des Tambours", en: "The Drum Forest",
      priest_fr: "Prêtre des Racines", priest_en: "Root Priest",
      freed_fr: "Kossa, Tambour Vivant", freed_en: "Kossa, Living Drum",
      freedEmoji: "🥁",
      unlock: { coins: 15000, level: 9 }, freeWave: 20,
      gradient: "linear-gradient(170deg,#0c1e0f 0%,#14401c 55%,#1d5c2a 100%)",
      bg: "assets/bg_foret.png",
      bonus_fr: "20% de taps de générateur gratuits", bonus_en: "20% free generator taps",
      lore_fr: "Les Racines volaient le rythme de la forêt. Kossa, libéré, rend aux tambours leur battement libre.",
      lore_en: "The Roots stole the forest's rhythm. Freed, Kossa returns its free heartbeat to the drums."
    },
    {
      id: "trone", icon: "🌑",
      fr: "Le Trône de l'Éclipse", en: "The Eclipse Throne",
      priest_fr: "Avatar de l'Éclipse", priest_en: "Eclipse Avatar",
      freed_fr: "L'Aube Nouvelle", freed_en: "The New Dawn",
      freedEmoji: "🌅",
      unlock: { coins: 40000, level: 12 }, freeWave: 25,
      gradient: "linear-gradient(170deg,#0a0614 0%,#2a1140 55%,#451a55 100%)",
      bg: "assets/bg_trone.png",
      bonus_fr: "+20% or & XP", bonus_en: "+20% gold & XP",
      lore_fr: "Sur le Trône, l'Éclipse elle-même attendait. Brise-la : les deux rives ne feront plus qu'un dans l'Aube.",
      lore_en: "Upon the Throne, the Eclipse itself waited. Shatter it: both shores will become one in the Dawn."
    }
  ],

  scenes: {
    intro: {
      gradient: "linear-gradient(170deg,#1a1430 0%,#4a2418 60%,#7a3d1a 100%)",
      bg: "assets/bg_timgad.png",
      caravan: true,
      reward: { coins: 25, xp: 5 },
      lines: [
        { who: "narr", fr: "Il y a mille ans, les deux rives ne faisaient qu'un : au Nord, les pierres blanches de Numidie ; au Sud, les tambours d'or du Sahel.",
          en: "A thousand years ago, both shores were one: in the North, the white stones of Numidia; in the South, the golden drums of the Sahel." },
        { who: "narr", fr: "Puis vint l'Éclipse — celle qui dévore les histoires. Car ce qui n'est plus raconté finit par disparaître.",
          en: "Then came the Eclipse — she who devours stories. For what is no longer told eventually fades away." },
        { who: "baba", fr: "Petite... ce tambour portait toutes les routes du monde. L'Éclipse l'a brisé. Il n'en reste que des fragments.",
          en: "Little one... this drum carried all the roads of the world. The Eclipse broke it. Only fragments remain." },
        { who: "baba", fr: "Fusionne ces fragments : deux morceaux d'histoire réunis font un récit plus grand. Recouds la Route, et l'Aube reviendra.",
          en: "Merge those fragments: two pieces of history joined make a greater tale. Sew the Route back, and the Dawn will return." },
        { who: "lumo", fr: "Deux fragments... une seule histoire. J'ai compris, grand-père. Je ramènerai l'Aube.",
          en: "Two fragments... one story. I understand, grandfather. I will bring back the Dawn." },
        { who: "narr", style: "chap", fr: "CHAPITRE I — La Porte du Nord",
          en: "CHAPTER I — The Gate of the North" }
      ]
    },
    region_timgad: {
      gradient: "linear-gradient(170deg,#1a1430 0%,#4a2418 60%,#7a3d1a 100%)",
      lines: [
        { who: "dihya", fr: "Merci, guide des caravanes. Le Prêtre des Cendres gardait mes fourriers prisonniers de la suie...",
          en: "Thank you, caravan guide. The Ash Priest kept my beacon fires prisoner in soot..." },
        { who: "dihya", fr: "Désormais : +10% d'or sur toute la Route. Timgad redevient la porte du Nord !",
          en: "From now on: +10% gold along the whole Route. Timgad is the gate of the North again!" },
        { who: "lumo", fr: "Cinq terres encore sous l'Éclipse. En route !",
          en: "Five lands still under the Eclipse. Onward!" }
      ]
    },
    region_oasis: {
      gradient: "linear-gradient(170deg,#0d1f2d 0%,#14504d 60%,#1a6b52 100%)",
      lines: [
        { who: "azizi", fr: "Ahhh ! Libre après mille dunes ! Le Mirage m'avait enroulé dans un mensonge de brume...",
          en: "Ahhh! Free after a thousand dunes! The Mirage had wrapped me in a lie of mist..." },
        { who: "azizi", fr: "Ton énergie coulera désormais 25% plus vite. Les vents sont à ton service, petite tisseuse !",
          en: "Your energy will now flow 25% faster. The winds are at your service, little weaver!" }
      ]
    },
    region_wagadu: {
      gradient: "linear-gradient(170deg,#241a10 0%,#5c4416 55%,#8a6a1e 100%)",
      lines: [
        { who: "bida", fr: "Sssss... Le Silence avait figé les tambours d'or de Wagadu. Écoute : ça bat à nouveau !",
          en: "Sssss... Silence had frozen Wagadu's golden drums. Listen: they beat again!" },
        { who: "bida", fr: "+15% d'XP sur toute la Route. Que chaque pas devienne une histoire.",
          en: "+15% XP along the whole Route. May every step become a story." }
      ]
    },
    region_fleuve: {
      gradient: "linear-gradient(170deg,#0a1f24 0%,#114b46 55%,#17705b 100%)",
      lines: [
        { who: "mami", fr: "Les Crues n'avaient plus de cœur, petit guide. Tu viens d'en rendre un au fleuve.",
          en: "The Floods had lost their heart, little guide. You have just given one back to the river." },
        { who: "mami", fr: "Tes Esprits frapperont 15% plus fort. Les eaux se souviennent de ton nom.",
          en: "Your Spirits will strike 15% harder. The waters remember your name." }
      ]
    },
    region_foret: {
      gradient: "linear-gradient(170deg,#0c1e0f 0%,#14401c 55%,#1d5c2a 100%)",
      lines: [
        { who: "kossa", fr: "BOUM-boum-BOUM ! Tu m'as rendu mon rythme ! Mille saisons sans tambour... mais c'est fini !",
          en: "BOOM-boom-BOOM! You gave me back my rhythm! A thousand seasons without a drum... but no more!" },
        { who: "kossa", fr: "Un tap sur cinq est gratuit, à présent. La forêt forge avec toi !",
          en: "One tap in five is free, from now on. The forest forges with you!" }
      ]
    },
    region_trone: {
      gradient: "linear-gradient(170deg,#0a0614 0%,#2a1140 55%,#451a55 100%)",
      reward: { coins: 500, xp: 50 },
      lines: [
        { who: "eclipse", fr: "Non... Tu recouds ? Les histoires que je dévore... reviennent ?!",
          en: "No... You are sewing? The stories I devoured... are coming back?!" },
        { who: "lumo", fr: "Ce que tu avales revient toujours. Deux fragments font un récit. Deux rives font un monde.",
          en: "What you swallow always returns. Two fragments make a tale. Two shores make a world." },
        { who: "aube", fr: "Debout, Route de l'Or. L'Aube est là.",
          en: "Rise, Gold Route. The Dawn is here." },
        { who: "narr", style: "chap", fr: "FIN DU CHAPITRE I — Mais les caravanes ont mille autres contes à raviver...",
          en: "END OF CHAPTER I — But the caravans hold a thousand more tales to relight..." }
      ]
    },
    boss_10: {
      gradient: "linear-gradient(170deg,#0a0614 0%,#2a1140 60%,#451a55 100%)",
      lines: [
        { who: "anansi", fr: "Héhéhé... Une Éclipse de la taille d'un serpent ! Tu grandis, petite tisseuse.",
          en: "Hehehe... An Eclipse the size of a serpent! You are growing, little weaver." },
        { who: "anansi", fr: "Les Prêtres vont te haïr. Continue : chaque histoire rendue à la lumière les affaiblit.",
          en: "The Priests will hate you. Keep going: every story returned to the light weakens them." }
      ]
    }
  },

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
      requires: [ { chain: "eco", level: 5, qty: 1 
