import type { CharacterAnimProfile } from '@/types/animation'

/**
 * Hand-crafted animation profiles for key characters.
 * Characters not listed here get auto-generated profiles via pickTechniqueFromTags.
 */
export const CHARACTER_PROFILES: Record<string, CharacterAnimProfile> = {
  // ── One Piece ──────────────────────────────────────────────────────────────

  // Gear 5 awakening — Luffy's devil fruit reveals its true form: Joy Boy / the Sun God Nika.
  // Reality becomes rubber, the user fights with the "ridiculous power" of pure freedom.
  luffy_gear5: {
    slug: 'luffy_gear5', auraColor: '#fef9c3',
    techniques: [{ name: 'Gear 5 — Joy Boy Awakens!!!', type: 'gear5', color: '#f8fafc', secondaryColor: '#fef9c3', duration: 3800, flavour: 'The most ridiculous power in the world — I am Joy Boy!' }],
  },

  // Gear 4 Snakeman — compressed Haki, endless redirecting Python strikes
  luffy_snakeman: {
    slug: 'luffy_snakeman', auraColor: '#f97316',
    techniques: [{ name: 'Gear 4 — Snakeman: King Cobra!!!', type: 'ki_aura', color: '#f97316', secondaryColor: '#fbbf24', duration: 2800, flavour: 'Python — my fists chase you to the ends of the earth' }],
  },

  // Luffy early arc — pure rubber, pure heart, Gum-Gum Pistol
  luffy_skypiea: {
    slug: 'luffy_skypiea', auraColor: '#fbbf24',
    techniques: [{ name: 'Gum-Gum Pistol!!!', type: 'physical', color: '#fbbf24', duration: 2000, flavour: 'I\'m going to be King of the Pirates!' }],
  },

  // Gol D. Roger — The Pirate King's Conqueror's Haki imbued into a single slash.
  // Divine Departure: the same technique Shanks used to stop Kaido
  gold_d_roger: {
    slug: 'gold_d_roger', auraColor: '#fbbf24',
    techniques: [{ name: "Conqueror's Haki — Divine Departure!!!", type: 'conquerors_haki', color: '#1e1b1f', secondaryColor: '#fbbf24', duration: 3600, flavour: 'I\'m not going to die, partner — laugh!' }],
  },

  // Shanks — the benchmark of Conqueror's Haki. His Haki alone caused a tsunami
  // and knocked out Vice Admirals. Matched Roger's at age 13.
  shanks: {
    slug: 'shanks', auraColor: '#dc2626',
    techniques: [{ name: "Conqueror's Haki — Heaven-Split!!!", type: 'conquerors_haki', color: '#0a0a0f', secondaryColor: '#dc2626', duration: 3600, flavour: 'Mountains carved by pure will — the sky parts for me' }],
  },

  // Whitebeard's Gura Gura no Mi — his fists crack the air itself.
  // He split the Marineford plaza in two and tilted the world's axis.
  whitebeard_peak: {
    slug: 'whitebeard_peak', auraColor: '#e0f2fe',
    techniques: [{ name: 'Gura Gura no Mi — World-Shaker!!!', type: 'gura_gura', color: '#e0f2fe', secondaryColor: '#ffffff', duration: 3600, flavour: 'One fist cracks the sky — the strongest man who ever lived' }],
  },

  // Kaido — Conqueror's Haki-imbued Thunder Bagua; a single swing split Onigashima.
  // The CoC coating on his club makes even contact lethal.
  kaido_hybrid: {
    slug: 'kaido_hybrid', auraColor: '#6d28d9',
    techniques: [{ name: "Conqueror's Haki — Thunder Bagua!!!", type: 'conquerors_haki', color: '#0a0614', secondaryColor: '#6d28d9', duration: 3600, flavour: 'One swing — one island. Even samurai cannot touch me.' }],
  },

  // Big Mom — Prometheus + Zeus + Napoleon in a unified soul-powered attack
  big_mom: {
    slug: 'big_mom', auraColor: '#f9a8d4',
    techniques: [{ name: 'Heavenly Fire — Prometheus: Stolen Soul!!!', type: 'elemental_fire', color: '#f97316', secondaryColor: '#fbbf24', duration: 2800, flavour: 'Give me your soul — NOW!' }],
  },

  // Akainu — Ryusei Kazan: volcanic fists that melt everything, even ice
  akainu: {
    slug: 'akainu', auraColor: '#dc2626',
    techniques: [{ name: 'Ryusei Kazan — Great Eruption!!!', type: 'logia', color: '#dc2626', secondaryColor: '#f97316', duration: 3000, flavour: 'Absolute Justice will cleanse this world in magma' }],
  },

  // Blackbeard — Kurouzu draws everything into the void before unleashing it
  blackbeard: {
    slug: 'blackbeard', auraColor: '#1e293b',
    techniques: [{ name: 'Kurouzu — Darkness: Liberation!!!', type: 'darkness', color: '#030303', secondaryColor: '#1e293b', duration: 3400, flavour: 'Darkness has no limits — it devours even the light' }],
  },

  // Mihawk — Kokuto Yoru slices even the ocean itself; Black Blade
  mihawk: {
    slug: 'mihawk', auraColor: '#1e293b',
    techniques: [{ name: 'Kokuto Yoru — Cross of Doom!!!', type: 'sword', color: '#1e1b4b', secondaryColor: '#e0e7ff', duration: 2800, flavour: 'The world\'s greatest swordsman cuts what cannot be cut' }],
  },

  // Zoro post-Wano — Asura: King of Hell. Three demon heads, nine swords, nine slashes.
  // His black blade coating rivals a Conqueror's Haki user's aura.
  zoro_post_wano: {
    slug: 'zoro_post_wano', auraColor: '#4ade80',
    techniques: [{ name: 'Asura — King of Hell: Nine Sword Style!!!', type: 'asura', color: '#4ade80', secondaryColor: '#052e16', duration: 3400, flavour: 'Demon king\'s nine blades — all at once, in the same instant' }],
  },

  // Rayleigh — the Dark King's Conqueror's Haki teaching Luffy while stopping 100,000 fishmen
  rayleigh: {
    slug: 'rayleigh', auraColor: '#fbbf24',
    techniques: [{ name: "Conqueror's Haki — Dark King's Might!!!", type: 'conquerors_haki', color: '#0a0a0a', secondaryColor: '#fbbf24', duration: 3400, flavour: 'Roger\'s first mate — not one step back' }],
  },

  // Enel — El Thor: 200 million volts called down from the sky as divine judgment
  enel: {
    slug: 'enel', auraColor: '#fef08a',
    techniques: [{ name: 'El Thor — 200 Million Volt Divine Punishment!!!', type: 'elemental_lightning', color: '#fef08a', secondaryColor: '#fffde7', duration: 3000, flavour: 'I am God — thou art unworthy of this sky' }],
  },

  // Doflamingo — Birdcage: strings wrap the entire island; no one escapes
  doflamingo: {
    slug: 'doflamingo', auraColor: '#f472b6',
    techniques: [{ name: 'Birdcage — Parasyte: Off with their Heads!!!', type: 'string', color: '#f472b6', secondaryColor: '#fbcfe8', duration: 3200, flavour: 'The cage shrinks — there is no escape from Doflamingo\'s strings' }],
  },

  // Boa Hancock — Mero Mero no Mi: petrification through beauty and love
  boa_hancock: {
    slug: 'boa_hancock', auraColor: '#f9a8d4',
    techniques: [{ name: 'Perfume Femur — Pistol Kiss!!!', type: 'physical', color: '#f9a8d4', secondaryColor: '#fce7f3', duration: 2600, flavour: 'Even your admiration will turn to stone' }],
  },

  // Magellan — Venom Demon: his most powerful form, covering himself in poison
  magellan: {
    slug: 'magellan', auraColor: '#4ade80',
    techniques: [{ name: 'Venom Demon — Hell Judge!!!', type: 'poison', color: '#14532d', secondaryColor: '#4ade80', duration: 3000, flavour: 'Impel Down\'s most powerful jailer — every touch is lethal' }],
  },

  // Sanji — Ifrit Jambe: post-Raid Suit, leg so hot it burns blue-white with hell fire
  sanji: {
    slug: 'sanji', auraColor: '#3b82f6',
    techniques: [{ name: 'Ifrit Jambe — Hell Memory!!!', type: 'diable_jambe', color: '#3b82f6', secondaryColor: '#ffffff', duration: 3400, flavour: 'The flames of Ifrit — hotter than any fire in this world' }],
  },
  sanji_raid_suit: {
    slug: 'sanji_raid_suit', auraColor: '#3b82f6',
    techniques: [{ name: 'Ifrit Jambe — Rotisserie!!!', type: 'diable_jambe', color: '#3b82f6', secondaryColor: '#e0f2fe', duration: 3200, flavour: 'Germa\'s exoskeleton + Ifrit flames — unstoppable kick' }],
  },
  vinsmoke_sanji: {
    slug: 'vinsmoke_sanji', auraColor: '#f97316',
    techniques: [{ name: 'Diable Jambe — Poêle à Frire!!!', type: 'diable_jambe', color: '#f97316', secondaryColor: '#fbbf24', duration: 3000, flavour: 'The flames of hell, spinning into a frying pan' }],
  },

  // Portgas D. Ace — Fire Fist: the great flame fist that made fleets scatter
  portgas_d_ace: {
    slug: 'portgas_d_ace', auraColor: '#f97316',
    techniques: [{ name: 'Fire Fist — Great Flame Commandment!!!', type: 'elemental_fire', color: '#f97316', secondaryColor: '#fbbf24', duration: 3000, flavour: 'My fire — it burns away even the darkness' }],
  },
  ace: {
    slug: 'ace', auraColor: '#f97316',
    techniques: [{ name: 'Hiken — Fire Fist!!!', type: 'elemental_fire', color: '#f97316', secondaryColor: '#fbbf24', duration: 2800, flavour: 'Ace\'s flame — it cannot be extinguished' }],
  },

  // Marco the Phoenix — blue regenerating phoenix flames; near-immortal in combat
  marco_phoenix: {
    slug: 'marco_phoenix', auraColor: '#3b82f6',
    techniques: [{ name: 'Tori Tori no Mi — Phoenix: Blazing Wings!!!', type: 'elemental_fire', color: '#3b82f6', secondaryColor: '#60a5fa', duration: 3000, flavour: 'Blue phoenix flames — I do not fall' }],
  },
  marco: {
    slug: 'marco', auraColor: '#3b82f6',
    techniques: [{ name: 'Phoenix — Regenerating Talons!!!', type: 'elemental_fire', color: '#3b82f6', secondaryColor: '#93c5fd', duration: 2800, flavour: 'Whitebeard\'s first division commander — eternal as flame' }],
  },

  // Trafalgar Law — Mes + Room: surgically removes hearts from bodies
  trafalgar_law: {
    slug: 'trafalgar_law', auraColor: '#22d3ee',
    techniques: [{ name: 'Room — K-Room: Shock Wille!!!', type: 'kamui', color: '#22d3ee', secondaryColor: '#0891b2', duration: 3200, flavour: 'My Room — nothing inside it escapes the Surgeon of Death' }],
  },
  law: {
    slug: 'law', auraColor: '#22d3ee',
    techniques: [{ name: 'Room — Mes!!!', type: 'kamui', color: '#22d3ee', secondaryColor: '#67e8f9', duration: 2800, flavour: 'Your heart belongs to me now' }],
  },

  // Jinbe — Fish-Man Karate: water itself is a weapon at this level
  jinbe: {
    slug: 'jinbe', auraColor: '#38bdf8',
    techniques: [{ name: 'Fish-Man Karate — Vagabond Drill!!!', type: 'elemental_water', color: '#0369a1', secondaryColor: '#38bdf8', duration: 3000, flavour: 'Water, blood, and iron — I shall smash you through the deep' }],
  },

  // Brook — Soul Solid: sub-zero ice blade infused with the soul king's music
  brook: {
    slug: 'brook', auraColor: '#e2e8f0',
    techniques: [{ name: 'Soul Solid — Phrase d\'Armes!!!', type: 'sword', color: '#e2e8f0', secondaryColor: '#94a3b8', duration: 2800, flavour: 'Yohohoho — shall I cut your soul?' }],
  },

  // Franky — General Franky / Radical Beam at full cyborg power
  franky: {
    slug: 'franky', auraColor: '#3b82f6',
    techniques: [{ name: 'General Franky — Radical Beam!!!', type: 'ki_beam', color: '#3b82f6', secondaryColor: '#93c5fd', duration: 2800, flavour: 'SUPER! — Cola-powered full-power beam attack' }],
  },

  // Nico Robin — Mil Fleur: Gigantesco Mano Stomp
  nico_robin: {
    slug: 'nico_robin', auraColor: '#f472b6',
    techniques: [{ name: 'Mil Fleur — Gigantesco Mano: Stomp!!!', type: 'physical', color: '#f472b6', secondaryColor: '#fbcfe8', duration: 2800, flavour: 'A giant hand from every shadow — bloom!' }],
  },
  robin: {
    slug: 'robin', auraColor: '#f472b6',
    techniques: [{ name: 'Gigantesco Mano — Storm!!!', type: 'physical', color: '#f472b6', secondaryColor: '#fce7f3', duration: 2600, flavour: 'Infinite arms, infinite bloom' }],
  },

  // Nami — Zeus Thunderbolt Tempo: Luffy\'s storm attacks with Big Mom\'s cloud
  nami: {
    slug: 'nami', auraColor: '#fef08a',
    techniques: [{ name: 'Zeus Thunderbolt Tempo!!!', type: 'elemental_lightning', color: '#fef08a', secondaryColor: '#fbbf24', duration: 2800, flavour: 'Lightning that answers only to me — strike!' }],
  },

  // Usopp — God Usopp with Pop Green and Haki awakening at Dressrosa
  usopp: {
    slug: 'usopp', auraColor: '#84cc16',
    techniques: [{ name: 'God Usopp — 5 Ton Hammer!!!', type: 'physical', color: '#84cc16', secondaryColor: '#d9f99d', duration: 2400, flavour: 'The warrior of the sea — 8000 followers cannot be wrong' }],
  },

  // Yamato — Ice Beast transformation with Namuaji Glacier
  yamato: {
    slug: 'yamato', auraColor: '#bfdbfe',
    techniques: [{ name: 'Namuaji — Glacier Pace!!!', type: 'elemental_ice', color: '#bfdbfe', secondaryColor: '#eff6ff', duration: 3000, flavour: 'The guardian of Wano — Oden would do the same' }],
  },

  // Sabo — Mera Mera fire inherited from Ace
  sabo: {
    slug: 'sabo', auraColor: '#f97316',
    techniques: [{ name: 'Hiken — Dragon\'s Breath!!!', type: 'elemental_fire', color: '#f97316', secondaryColor: '#fbbf24', duration: 2800, flavour: 'Ace\'s fire lives on in me — I will not let it be extinguished' }],
  },

  // Katakuri — Mochi awakening: his Observation Haki sees the future
  katakuri: {
    slug: 'katakuri', auraColor: '#e2e8f0',
    techniques: [{ name: 'Mochi Mochi — Zan Giri Mochi!!!', type: 'logia', color: '#e2e8f0', secondaryColor: '#f1f5f9', duration: 3000, flavour: 'I can see the future — and you cannot win' }],
  },

  // ── One Piece DB characters (exact slugs) ─────────────────────────────────

  // Sanji Ifrit Jambe — post-Wano awakening of Diable Jambe pushed beyond all limits.
  // Spinning at near-subsonic speed, his legs generate blue-white "hellfire" hotter
  // than any fire in One Piece. The Ifrit's name references a fire-jinn of Islamic lore.
  sanji_ifrit_jambe: {
    slug: 'sanji_ifrit_jambe', auraColor: '#3b82f6',
    techniques: [{ name: 'Ifrit Jambe — Hell Memory!!!', type: 'diable_jambe', color: '#3b82f6', secondaryColor: '#ffffff', duration: 3400, flavour: 'Ifrit burns hotter than any fire — my leg is the devil\'s itself' }],
  },

  // Ace Marineford — Portgas D. Ace, Fire Fist, Whitebeard's second commander.
  // At Marineford he bought the fleet precious seconds before Akainu's magma
  // pierced the fire that cannot be extinguished — his final act of love.
  ace_marineford: {
    slug: 'ace_marineford', auraColor: '#f97316',
    techniques: [{ name: 'Fire Fist — Great Flame Commandment!!!', type: 'elemental_fire', color: '#f97316', secondaryColor: '#fbbf24', duration: 3000, flavour: 'I am grateful for the love — thank you, Luffy' }],
  },

  // Law Awakened — Trafalgar D. Water Law, the Surgeon of Death.
  // His Ope Ope no Mi awakening expands Room to city scale; K-Room allows
  // him to infuse his sword and burst from inside targets at full scale.
  law_awakened: {
    slug: 'law_awakened', auraColor: '#22d3ee',
    techniques: [{ name: 'K-Room — Anesthesia: Shock Wille!!!', type: 'kamui', color: '#22d3ee', secondaryColor: '#0891b2', duration: 3400, flavour: 'Inside my Room, I am God — even hearts are mine to take' }],
  },

  // Aokiji — Kuzan, Admiral of Ice. His Hie Hie no Mi froze the ocean around Punk Hazard
  // for a week after battling Akainu. One touch creates a glacier; one breath freezes the sea.
  aokiji: {
    slug: 'aokiji', auraColor: '#bfdbfe',
    techniques: [{ name: 'Ice Age — Frozen World!!!', type: 'elemental_ice', color: '#bfdbfe', secondaryColor: '#e0f2fe', duration: 3200, flavour: 'Justice without cruelty — one touch and the ocean sleeps forever' }],
  },

  // Kizaru — Borsalino, Admiral of Light. The Pika Pika no Mi makes him light itself.
  // Yasakani no Magatama fires an endless volley of laser beams from his fingertips,
  // each one travelling at the speed of light. Casually the most powerful admiral in range.
  kizaru: {
    slug: 'kizaru', auraColor: '#fef9c3',
    techniques: [{ name: 'Yasakani no Magatama — Speed of Light Volley!!!', type: 'light_speed', color: '#fef9c3', secondaryColor: '#ffffff', duration: 3200, flavour: 'Travelling at the speed of light... oh dear, that\'s quite fast' }],
  },

  // Garp Marineford — Vice Admiral Garp, the Hero of the Marines.
  // His Haki-clad fist crushed pirate fleets bare-handed; known to have cornered
  // Roger multiple times and matched him blow for blow without a devil fruit.
  garp_marineford: {
    slug: 'garp_marineford', auraColor: '#94a3b8',
    techniques: [{ name: 'Fist of Love — Galaxy Impact!!!', type: 'physical', color: '#94a3b8', secondaryColor: '#e2e8f0', duration: 2800, flavour: 'A grandfather\'s love — harder than any cannonball' }],
  },

  // Bartolomeo Barrier — the Barrier-Barrier Fruit; his Bari Bari no Mi
  // generates indestructible barrier fields. Luffy's greatest fanboy fights
  // with conviction: a barrier that has never once been broken.
  bartolomeo_barrier: {
    slug: 'bartolomeo_barrier', auraColor: '#a78bfa',
    techniques: [{ name: 'Bari Bari no Mi — Barrier Crash!!!', type: 'barrier', color: '#a78bfa', secondaryColor: '#ede9fe', duration: 2800, flavour: 'Senpai\'s power inspires me — this barrier will NEVER break' }],
  },

  // Bellamy the Hyena — Spring-Spring Fruit; his legs compress like metal coils
  // and he launches himself as a human wrecking-ball at immense speed.
  bellamy_spring: {
    slug: 'bellamy_spring', auraColor: '#fbbf24',
    techniques: [{ name: 'Spring Hopper — Boing Boing Crush!!!', type: 'physical', color: '#fbbf24', secondaryColor: '#fef08a', duration: 2400, flavour: 'Spring legs — no floor, no ceiling, no escape' }],
  },

  // Shiryu of the Rain — former Head Jailer of Impel Down, wields the
  // invisible-blade cursed sword Raiu. His Suke Suke no Mi makes him
  // completely invisible, striking from nowhere.
  shiryu_rain: {
    slug: 'shiryu_rain', auraColor: '#475569',
    techniques: [{ name: 'Raiu — Invisible Blade: Rain of Death!!!', type: 'sword', color: '#475569', secondaryColor: '#94a3b8', duration: 3000, flavour: 'The blade you cannot see is the one that ends your life' }],
  },

  // Monkey D. Dragon — the world's most wanted man, Revolutionary Army leader.
  // His apparent mastery of wind (likely a Mythical Zoan or wind Logia) manifests
  // as world-scale storms answering his will.
  monkey_d_dragon: {
    slug: 'monkey_d_dragon', auraColor: '#4ade80',
    techniques: [{ name: 'Dragon\'s Storm — World Revolution!!!', type: 'elemental_wind', color: '#4ade80', secondaryColor: '#86efac', duration: 3400, flavour: 'The wind of revolution — it cannot be stopped' }],
  },

  // Kid Awakened — Eustass Captain Kid, Repel & Attract.
  // His Jiki Jiki awakening projects his ability into the ground itself,
  // pulling all metal across the battlefield into a giant magnetized fist.
  kid_awakened: {
    slug: 'kid_awakened', auraColor: '#ef4444',
    techniques: [{ name: 'Damned Punk — Electromagnetic Cannon!!!', type: 'ki_aura', color: '#ef4444', secondaryColor: '#fca5a5', duration: 3200, flavour: 'The Yonko learned what lightning feels like today' }],
  },

  // Bonney Distorted Future — Jewelry Bonney's awakened Toshi Toshi no Mi
  // can age or de-age anything and project distorted futures onto targets,
  // briefly manifesting what they fear — or transforming the environment itself.
  bonney_distorted_future: {
    slug: 'bonney_distorted_future', auraColor: '#f0abfc',
    techniques: [{ name: 'Distorted Future — Age Liberation!!!', type: 'physical', color: '#f0abfc', secondaryColor: '#e879f9', duration: 2800, flavour: 'I will rewrite your future — and erase Vegapunk\'s cruelty' }],
  },

  // Vegapunk — Dr. Vegapunk, the world's greatest scientist.
  // His satellite system and Seraphim creations represent science beyond
  // imagination. In combat he deploys energy barriers, laser weaponry, and
  // the accumulated power of a lifetime of research.
  vegapunk: {
    slug: 'vegapunk', auraColor: '#38bdf8',
    techniques: [{ name: 'Satellite System — Frontier Dome!!!', type: 'barrier', color: '#38bdf8', secondaryColor: '#7dd3fc', duration: 3000, flavour: 'The future of humanity, compressed into a single mind' }],
  },

  // Vinsmoke Reiju — the eldest Vinsmoke child, Poison Pink.
  // Her genetically engineered body secretes all-dissolving poison and
  // her lips administer a toxin no antidote can counter.
  vinsmoke_reiju: {
    slug: 'vinsmoke_reiju', auraColor: '#f0abfc',
    techniques: [{ name: 'Poison Pink — All-Blue Venom Kiss!!!', type: 'poison', color: '#c026d3', secondaryColor: '#f0abfc', duration: 2800, flavour: 'A Vinsmoke without feelings — but not without precision' }],
  },

  // Vinsmoke Ichiji — eldest son, Sparking Red. Photovoltaic ray attacks
  // channelled through a Germa exoskeleton that makes him functionally invulnerable.
  vinsmoke_ichiji: {
    slug: 'vinsmoke_ichiji', auraColor: '#f87171',
    techniques: [{ name: 'Sparking Red — Photon Staff!!!', type: 'elemental_lightning', color: '#ef4444', secondaryColor: '#fca5a5', duration: 2800, flavour: 'Germa 66 — science turned the Vinsmoke children into gods' }],
  },

  // Vinsmoke Niji — second son, Electric Blue. Controls lightning at will
  // through his Dengeki Blue exoskeleton; fastest of the Vinsmoke siblings.
  vinsmoke_niji: {
    slug: 'vinsmoke_niji', auraColor: '#38bdf8',
    techniques: [{ name: 'Dengeki Blue — Lightning Speed Strike!!!', type: 'elemental_lightning', color: '#38bdf8', secondaryColor: '#bfdbfe', duration: 2800, flavour: 'Blue lightning, moving too fast to perceive — you\'re already hit' }],
  },

  // Vinsmoke Yonji — fourth son, Winch Green. Raw physical power amplified
  // by the exoskeleton; the most straightforward bruiser of the quartet.
  vinsmoke_yonji: {
    slug: 'vinsmoke_yonji', auraColor: '#4ade80',
    techniques: [{ name: 'Winch Green — Iron Drill Smash!!!', type: 'physical', color: '#4ade80', secondaryColor: '#86efac', duration: 2600, flavour: 'The power of science — I don\'t need cleverness, just strength' }],
  },

  // Arlong — the Saw-Shark Fish-Man who enslaved Nami's village for years.
  // His saw-like nose and physical Fish-Man strength dwarf most humans;
  // he regenerates teeth indefinitely in water.
  arlong: {
    slug: 'arlong', auraColor: '#0ea5e9',
    techniques: [{ name: 'Shark on Tooth — Saw-Nose Crusher!!!', type: 'physical', color: '#0ea5e9', secondaryColor: '#38bdf8', duration: 2400, flavour: 'Fish-Men are a superior race — I will prove it with every tooth' }],
  },

  // Buggy the Star Clown — Bara Bara no Mi divides his body into flying pieces,
  // making him completely immune to bladed attacks. Through sheer luck and
  // charisma he ascended to Yonko rank. His Muggy Ball pierces steel.
  buggy: {
    slug: 'buggy', auraColor: '#ef4444',
    techniques: [{ name: 'Bara Bara Cannon — Muggy Ball!!!', type: 'physical', color: '#ef4444', secondaryColor: '#fbbf24', duration: 2200, flavour: 'Buggy the Star Clown — the most fortunate pirate in the world!' }],
  },

  // Coby Post-Timeskip — two years of SWORD training awakened a budding
  // Conqueror's Haki. His Color of Observation reached an extreme that
  // lets him hear the "voice of all things" in combat.
  coby_post_timeskip: {
    slug: 'coby_post_timeskip', auraColor: '#f9a8d4',
    techniques: [{ name: 'Haki Burst — Color of the Supreme King!!!', type: 'haki_burst', color: '#f9a8d4', secondaryColor: '#fce7f3', duration: 2800, flavour: 'I hear the voice of every person on this battlefield' }],
  },

  // Smoker the White Hunter — Moku Moku no Mi, smoke Logia.
  // His Jutte is laced with Seastone, neutralising devil fruit users on contact.
  smoker: {
    slug: 'smoker', auraColor: '#94a3b8',
    techniques: [{ name: 'Smoke White Out — White Launcher!!!', type: 'logia', color: '#94a3b8', secondaryColor: '#e2e8f0', duration: 2800, flavour: 'Smoke that cannot be cut — and Seastone that strips your power' }],
  },

  // Chopper Monster Point — Tony Tony Chopper's most powerful Rumble Ball form.
  // Monster Point dwarfs buildings; his strength and durability become inhuman.
  // Awakened Monster Point triples the size again.
  chopper_monster_point: {
    slug: 'chopper_monster_point', auraColor: '#f97316',
    techniques: [{ name: 'Monster Point — Arm Point Cannon!!!', type: 'physical', color: '#f97316', secondaryColor: '#fbbf24', duration: 2800, flavour: 'A monster created by medicine — and love for his crew' }],
  },

  // Crocodile Desert — Sir Crocodile, Warlord of the Sand.
  // His Suna Suna no Mi makes him the desert itself; Gold Venom dessication
  // sucks the water from anything he touches into dust.
  crocodile_desert: {
    slug: 'crocodile_desert', auraColor: '#d97706',
    techniques: [{ name: 'Desert Spada — Gold Venom Dessication!!!', type: 'sand', color: '#d97706', secondaryColor: '#fbbf24', duration: 3000, flavour: 'The desert cannot be defeated — I am the sand itself' }],
  },

  // Robin Post-Timeskip — Nico Robin, the Devil Child, flower of the Ohara library.
  // Hana Hana no Mi fully awakened: Gigantesco Mano manifests colossal arms
  // from any surface; her body blooms everywhere at once.
  robin_post_timeskip: {
    slug: 'robin_post_timeskip', auraColor: '#f472b6',
    techniques: [{ name: 'Mil Fleur — Gigantesco Mano: Stomp!!!', type: 'physical', color: '#f472b6', secondaryColor: '#fbcfe8', duration: 3000, flavour: 'I want to live — and I will bloom wherever I please' }],
  },

  // Nami Clima-Tact — with Zeus the thundercloud as her weapon, Nami commands
  // atmospheric electricity and temperature. Zeus Thunderbolt Tempo was strong
  // enough to shock a Yonko-level opponent.
  nami_clima_tact: {
    slug: 'nami_clima_tact', auraColor: '#fef08a',
    techniques: [{ name: 'Zeus Thunderbolt Tempo — 20 Billion Volt Lightning!!!', type: 'elemental_lightning', color: '#fef08a', secondaryColor: '#fbbf24', duration: 3000, flavour: 'A woman\'s wrath, electrified — even Big Mom\'s cloud obeys me' }],
  },

  // Usopp God — at Dressrosa, Usopp awakened Observation Haki by accident
  // and became "God Usopp" to 8000 freed slaves. His Pop Green sniping
  // from 8 km with haki-enhanced aim made him a legitimate threat.
  usopp_god: {
    slug: 'usopp_god', auraColor: '#84cc16',
    techniques: [{ name: 'Sacred Pop Green — Hissatsu: Midori Boshi!!!', type: 'physical', color: '#84cc16', secondaryColor: '#d9f99d', duration: 2600, flavour: '8000 followers call me God — so I suppose I\'d better act like one' }],
  },

  // Franky Cyborg — post-timeskip General Franky: a giant mech powered by cola.
  // Radical Beam fires concentrated energy from his chest; Coup de Boo
  // propels him as a living rocket. He built the Thousand Sunny.
  franky_cyborg: {
    slug: 'franky_cyborg', auraColor: '#3b82f6',
    techniques: [{ name: 'General Franky — Radical Beam!!!', type: 'ki_beam', color: '#3b82f6', secondaryColor: '#93c5fd', duration: 2800, flavour: 'SUPER! — Cola-powered justice, straight from my chest' }],
  },

  // Brook Soul King — 50 years of isolation on the Thriller Bark ghost ship
  // produced sub-zero Soul Solid sword attacks. His music can freeze souls;
  // his body is already dead, immune to poison and pain.
  brook_soul_king: {
    slug: 'brook_soul_king', auraColor: '#e2e8f0',
    techniques: [{ name: 'Soul Solid — Absolute Zero Curtain!!!', type: 'sword', color: '#e2e8f0', secondaryColor: '#bfdbfe', duration: 2800, flavour: 'Yohohoho — shall I cut your soul? I already lost mine years ago' }],
  },

  // ── Naruto ──────────────────────────────────────────────────────────────────

  // Six Paths Sage Art — a rasengan grown to planetary scale,
  // thrown with the truth-seeking balls as a rasenshuriken array
  naruto_six_paths: {
    slug: 'naruto_six_paths', auraColor: '#f97316',
    techniques: [{ name: 'Six Paths Sage Art — Ultra-Big Ball Rasenshuriken!!!', type: 'rasengan', color: '#f97316', secondaryColor: '#fbbf24', duration: 3500, flavour: 'The child of prophecy' }],
  },

  // Indra's Arrow — charged with all of Susanoo's lightning,
  // fired as a single all-destroying bolt
  sasuke_rinnegan: {
    slug: 'sasuke_rinnegan', auraColor: '#6d28d9',
    techniques: [{ name: "Indra's Arrow — Perfect Susanoo!!!", type: 'chidori', color: '#6d28d9', secondaryColor: '#38bdf8', duration: 3500, flavour: 'The destined rival — his final arrow' }],
  },

  // Infinite Tsukuyomi — casts the moon's reflection through the
  // Rinne Sharingan to trap all life in an eternal dream
  madara_six_paths: {
    slug: 'madara_six_paths', auraColor: '#6d28d9',
    techniques: [{ name: 'Infinite Tsukuyomi!!!', type: 'genjutsu', color: '#6d28d9', secondaryColor: '#1e1b4b', duration: 3800, flavour: 'An eternal dream for all of mankind' }],
  },

  // Expansive Truth-Seeking Ball — primordial chakra refined by the
  // rabbit goddess herself, the origin of all ninjutsu
  kaguya: {
    slug: 'kaguya', auraColor: '#ffffff',
    techniques: [{ name: 'Expansive Truth-Seeking Ball!!!', type: 'divine', color: '#ffffff', secondaryColor: '#e0f2fe', duration: 4000, flavour: 'The mother of all chakra — begin anew' }],
  },

  // Sage Art: Wood Style — draws on senjutsu to produce a Buddha
  // statue of several thousand hands, each capable of crushing mountains
  hashirama_sage_mode: {
    slug: 'hashirama_sage_mode', auraColor: '#4ade80',
    techniques: [{ name: 'Sage Art — Wood Style: True Several Thousand Hands!!!', type: 'divine', color: '#4ade80', secondaryColor: '#86efac', duration: 3400, flavour: 'The God of Shinobi — none have surpassed him' }],
  },

  // Tsukuyomi — Itachi traps the victim in his Sharingan eye for what
  // feels like three days of torture, all in a fraction of a second
  itachi: {
    slug: 'itachi', auraColor: '#6d28d9',
    techniques: [{ name: "Tsukuyomi — Three Days of Hell", type: 'genjutsu', color: '#6d28d9', secondaryColor: '#1e1b4b', duration: 3200, flavour: "A world of three days — lived in a single second" }],
  },

  // Night Guy — Gate of Death removes every limit; the leg strike
  // moves faster than light and leaves only the bones intact
  guy_eight_gates: {
    slug: 'guy_eight_gates', auraColor: '#ef4444',
    techniques: [{ name: 'Night Guy — Gate of Death!!!', type: 'eight_gates', color: '#ef4444', secondaryColor: '#fca5a5', duration: 3200, flavour: 'The 8th Gate — even his bones will turn to ash' }],
  },

  // Reverse Lotus — Fifth Gate unlocks explosive speed; Lee wraps
  // the opponent in bandages and drives them into the earth
  rock_lee_fifth_gate: {
    slug: 'rock_lee_fifth_gate', auraColor: '#4ade80',
    techniques: [{ name: 'Reverse Lotus — Fifth Inner Gate!!!', type: 'eight_gates', color: '#4ade80', secondaryColor: '#86efac', duration: 2800, flavour: 'A genius of hard work — the springtime of youth' }],
  },

  // Kamui Raikiri — Kakashi merges his Chidori with Kamui warp,
  // creating a lightning blade that phases through and destroys on contact
  kakashi_dual_sharingan: {
    slug: 'kakashi_dual_sharingan', auraColor: '#6d28d9',
    techniques: [{ name: 'Kamui Raikiri — Lightning Blade God!!!', type: 'chidori', color: '#6d28d9', secondaryColor: '#38bdf8', duration: 3000, flavour: 'One thousand jutsu — one thousand lightning birds' }],
  },

  // Flying Raijin — Minato's space-time kunai marks allow him to
  // teleport instantaneously to any location; he solves entire wars alone
  minato_kcm2: {
    slug: 'minato_kcm2', auraColor: '#fbbf24',
    techniques: [{ name: 'Flying Raijin — God Technique!!!', type: 'chidori', color: '#fbbf24', secondaryColor: '#f97316', duration: 3200, flavour: 'Faster than the eye — the Yellow Flash of Konoha' }],
  },

  // Kamui — Obito can absorb anything, anyone, into his right eye's
  // personal dimension, making him untouchable
  obito_ten_tails: {
    slug: 'obito_ten_tails', auraColor: '#6d28d9',
    techniques: [{ name: 'Kamui — Dimensional Absorption!!!', type: 'kamui', color: '#6d28d9', secondaryColor: '#1e1b4b', duration: 3000, flavour: "Nothing in this world can touch me" }],
  },

  // Shadow Possession — Shikamaru's ninjutsu forces the target to
  // mirror his every movement; your shadow becomes your prison
  shikamaru_shadow: {
    slug: 'shikamaru_shadow', auraColor: '#1e293b',
    techniques: [{ name: 'Shadow Possession!!!', type: 'shadow', color: '#1e293b', secondaryColor: '#334155', duration: 2800, flavour: 'Your shadow… is mine' }],
  },

  // 600 Billion Paper Bombs — Konan converts her body into 600 billion
  // bombs that detonate for 10 continuous minutes; even Madara struggled
  konan_akatsuki: {
    slug: 'konan_akatsuki', auraColor: '#e0f2fe',
    techniques: [{ name: '600 Billion Paper Bombs!!!', type: 'paper', color: '#e0f2fe', secondaryColor: '#bfdbfe', duration: 3500, flavour: '10 minutes of non-stop detonation — an angel of death' }],
  },

  // Jashin Ritual — Hidan draws a curse circle with his own blood;
  // any damage he receives is mirrored onto the victim
  hidan_akatsuki: {
    slug: 'hidan_akatsuki', auraColor: '#dc2626',
    techniques: [{ name: 'Jashin Ritual — Curse Technique!', type: 'shadow', color: '#7f1d1d', secondaryColor: '#dc2626', duration: 2800, flavour: 'Your pain is my delight — Jashin-sama commands' }],
  },

  // Samehada Fusion — Kisame merges with his sword Samehada to become
  // a shark-man hybrid that devours all chakra
  kisame_hoshigaki: {
    slug: 'kisame_hoshigaki', auraColor: '#38bdf8',
    techniques: [{ name: 'Samehada Fusion — Great Shark Bomb!!!', type: 'elemental_water', color: '#0369a1', secondaryColor: '#38bdf8', duration: 3000, flavour: 'Samehada drinks your chakra — then swallows you whole' }],
  },

  // Flying Raijin Level 2 — Tobirama invented the technique Minato
  // later mastered; his version trades perfection for raw speed
  tobirama_senju: {
    slug: 'tobirama_senju', auraColor: '#38bdf8',
    techniques: [{ name: 'Flying Raijin — Level 2!!!', type: 'chidori', color: '#38bdf8', secondaryColor: '#bfdbfe', duration: 3000, flavour: 'The inventor of Flying Raijin — and the Reaper Death Seal' }],
  },

  // Lightning Armor — Double Lariat — A wraps his whole body in lightning
  // chakra to reach a speed that even Sharingan users cannot follow;
  // the double lariat with Killer B decapitates anyone in range
  raikage_a: {
    slug: 'raikage_a', auraColor: '#facc15',
    techniques: [{ name: 'Lightning Armor — Double Lariat!!!', type: 'chidori', color: '#facc15', secondaryColor: '#fef08a', duration: 2800, flavour: 'The fastest man alive — without the Sharingan' }],
  },

  // Chibaku Tensei — Nagato uses the Rinnegan's Deva Path to compress
  // matter into a miniature moon that crushes everything underneath
  nagato_pain: {
    slug: 'nagato_pain', auraColor: '#6d28d9',
    techniques: [{ name: 'Chibaku Tensei — Planetary Devastation!!!', type: 'divine', color: '#6d28d9', secondaryColor: '#a855f7', duration: 3400, flavour: 'I am God — Pain is the only path to peace' }],
  },

  // Sand Burial — Gaara's absolute defence; he can crush an enemy inside
  // a sphere of sand, aided by Shukaku's iron sand for extra density
  gaara_kazekage: {
    slug: 'gaara_kazekage', auraColor: '#d97706',
    techniques: [{ name: 'Sand Burial — Shukaku Iron Sand!!!', type: 'sand', color: '#d97706', secondaryColor: '#f59e0b', duration: 2800, flavour: 'The sand loves me alone — no one escapes it' }],
  },

  // Jiraiya Sage Mode — drawing in natural energy, Jiraiya summons boss
  // toads and fires a multi-sphere Rasengan array at the target
  jiraiya_sage_mode: {
    slug: 'jiraiya_sage_mode', auraColor: '#f97316',
    techniques: [{ name: 'Sage Mode — Spiraling Serial Spheres!!!', type: 'rasengan', color: '#f97316', secondaryColor: '#fbbf24', duration: 3200, flavour: "The Toad Sage — father of the Rasengan itself" }],
  },

  // Creation Rebirth — Tsunade's Strength of a Hundred Seal releases
  // a lifetime of stored chakra; she becomes essentially unkillable
  tsunade: {
    slug: 'tsunade', auraColor: '#ec4899',
    techniques: [{ name: 'Strength of a Hundred — Creation Rebirth!!!', type: 'physical', color: '#ec4899', secondaryColor: '#f0abfc', duration: 2800, flavour: 'The Fifth Hokage — the world\'s greatest medical ninja' }],
  },

  // Snake Sage Mode — Kabuto merges with Orochimaru's cells and masters
  // white snake sage mode, granting him flawless regeneration
  kabuto_snake_sage: {
    slug: 'kabuto_snake_sage', auraColor: '#84cc16',
    techniques: [{ name: 'Snake Sage Mode — White Snake Rebirth!!!', type: 'poison', color: '#84cc16', secondaryColor: '#d9f99d', duration: 3000, flavour: "He became something greater than Orochimaru himself" }],
  },

  // Yin Seal Release — Sakura stores chakra her entire life in the
  // diamond-shaped seal on her forehead; when released, she becomes
  // near-immortal and can reduce mountains with a single punch
  sakura_post_war: {
    slug: 'sakura_post_war', auraColor: '#f0abfc',
    techniques: [{ name: 'Yin Seal Release — Hundred Healings!!!', type: 'physical', color: '#ec4899', secondaryColor: '#f0abfc', duration: 2800, flavour: 'A seal that stores a lifetime of chakra — she never runs out' }],
  },

  // Killer B & Gyuki — B can partially manifest his Eight-Tails bijuu,
  // or go full Bijuu Mode; his lariat with the Raikage ended wars
  killer_b: {
    slug: 'killer_b', auraColor: '#7c3aed',
    techniques: [{ name: 'Eight-Tails Bijuu Mode — Lariat!!!', type: 'bijuu', color: '#7c3aed', secondaryColor: '#a78bfa', duration: 3200, flavour: 'Gyuki speaks — the Eight-Tails agrees' }],
  },

  // Summoning: Impure World Reincarnation — Orochimaru sacrifices
  // living bodies to drag the dead back from the afterlife; he craves
  // every jutsu ever created
  orochimaru: {
    slug: 'orochimaru', auraColor: '#15803d',
    techniques: [{ name: 'Summoning — Eight Branches Giant Serpent!!!', type: 'poison', color: '#15803d', secondaryColor: '#4ade80', duration: 3000, flavour: 'I desire every jutsu ever created — starting with immortality' }],
  },

  // Twin Rising Dragons — Tenten summons every weapon in her arsenal
  // from twin scrolls; a storm of ten thousand blades
  tenten: {
    slug: 'tenten', auraColor: '#dc2626',
    techniques: [{ name: 'Twin Rising Dragons — Ten Thousand Weapons!!!', type: 'sword', color: '#dc2626', secondaryColor: '#fca5a5', duration: 2800, flavour: 'Every weapon ever forged — falling at once' }],
  },

  // C4 Karura — Deidara's masterpiece: a giant clay clone that
  // detonates into nano-scale bombs entering through the pores,
  // destroying at a cellular level — "art is an explosion"
  deidara_akatsuki: {
    slug: 'deidara_akatsuki', auraColor: '#fbbf24',
    techniques: [{ name: 'C4 Karura — Cellular Destruction!!!', type: 'explosion', color: '#fbbf24', secondaryColor: '#f59e0b', duration: 3200, flavour: "Art is an explosion — and I am the greatest artist" }],
  },

  // Iron Sand: World Order — Sasori's Third Kazekage puppet floods
  // the battlefield with Iron Sand magnetically shaped into lances
  sasori_akatsuki: {
    slug: 'sasori_akatsuki', auraColor: '#7f1d1d',
    techniques: [{ name: 'Iron Sand — World Order!!!', type: 'puppet', color: '#7f1d1d', secondaryColor: '#dc2626', duration: 3200, flavour: 'I am the world\'s greatest puppeteer — my art is eternal' }],
  },

  // Earth Grudge Fear — Kakuzu's black threads tear out hearts and
  // incorporate them; he wields five elemental affinities at once
  kakuzu_akatsuki: {
    slug: 'kakuzu_akatsuki', auraColor: '#1e293b',
    techniques: [{ name: 'Earth Grudge Fear — Five Heart Assault!!!', type: 'chain_jail', color: '#1e293b', secondaryColor: '#475569', duration: 3000, flavour: 'Five stolen hearts — five elemental natures at once' }],
  },

  // Butterfly Mode — Akimichi clan's final technique; caloric energy
  // converts fat to chakra, manifesting gigantic wings of pure power
  choji_butterfly_mode: {
    slug: 'choji_butterfly_mode', auraColor: '#c026d3',
    techniques: [{ name: 'Butterfly Mode — Caloric Blitz!!!', type: 'ki_aura', color: '#c026d3', secondaryColor: '#e879f9', duration: 2800, flavour: 'The wings of the Akimichi — pure conversion of life into power' }],
  },

  // Gentle Step Twin Lion Fists — Hinata shapes her chakra into two
  // lion heads; one touch annihilates the enemy's chakra network entirely
  hinata_twin_lion_fists: {
    slug: 'hinata_twin_lion_fists', auraColor: '#93c5fd',
    techniques: [{ name: 'Gentle Step — Twin Lion Fists!!!', type: 'gentle_fist', color: '#93c5fd', secondaryColor: '#dbeafe', duration: 2800, flavour: 'The Byakugan sees all — every tenketsu laid bare' }],
  },

  // Eight Trigrams 128 Palms — Neji's mastery of Gentle Fist: striking
  // every major tenketsu point in a precise sequential burst
  neji_byakugan: {
    slug: 'neji_byakugan', auraColor: '#dbeafe',
    techniques: [{ name: 'Eight Trigrams — 128 Palms!!!', type: 'gentle_fist', color: '#dbeafe', secondaryColor: '#e0f2fe', duration: 2800, flavour: 'Fate is absolute — and your chakra has run out' }],
  },

  // Wind Style: Vacuum Great Explosion — Temari's giant war fan
  // channels chakra into vacuum blades that scythe entire battlefields
  temari: {
    slug: 'temari', auraColor: '#a3e635',
    techniques: [{ name: 'Wind Style — Vacuum Great Explosion!!!', type: 'elemental_wind', color: '#a3e635', secondaryColor: '#d9f99d', duration: 2800, flavour: 'One swing destroys the battlefield — Suna\'s deadliest fan' }],
  },

  // Black Secret Technique: Salamander — Kankuro deploys his three
  // puppets to cage and poison the target with puppet-master precision
  kankuro_puppet: {
    slug: 'kankuro_puppet', auraColor: '#78716c',
    techniques: [{ name: 'Black Secret Technique — Salamander!!!', type: 'puppet', color: '#78716c', secondaryColor: '#a8a29e', duration: 2800, flavour: 'The puppeteer\'s strings are invisible until it is too late' }],
  },

  // Reaper Death Seal — Hiruzen summons the Death God itself;
  // the Shinigami tears out both souls — the user pays with their life
  hiruzen_sarutobi: {
    slug: 'hiruzen_sarutobi', auraColor: '#f8fafc',
    techniques: [{ name: 'Reaper Death Seal — Dead Demon Consuming!!!', type: 'divine', color: '#f8fafc', secondaryColor: '#e2e8f0', duration: 3600, flavour: 'The Professor — the God of Shinobi does not hesitate to die' }],
  },

  // ── Dragon Ball ─────────────────────────────────────────────────────────────

  // Mastered Ultra Instinct — silver hair, silver aura that VANISHES at mastery;
  // the most powerful form is visually the most understated.
  goku_mui: {
    slug: 'goku_mui', auraColor: '#f8fafc',
    techniques: [{ name: 'Mastered Ultra Instinct — Autonomous Movement!!!', type: 'ultra_instinct', color: '#f8fafc', secondaryColor: '#e0f2fe', duration: 3800, flavour: 'Empty mind — the aura disappears, yet nothing can touch him' }],
  },

  // Ultra Ego — dark tyrian purple, destroyer energy, SWELLS after absorbing damage
  vegeta_ultra_ego: {
    slug: 'vegeta_ultra_ego', auraColor: '#7c3aed',
    techniques: [{ name: 'Ultra Ego — Destroyer\'s Pride!!!', type: 'ultra_ego', color: '#7c3aed', secondaryColor: '#e879f9', duration: 3800, flavour: 'The more I\'m hurt, the more powerful I become — this is the pride of a Saiyan!' }],
  },

  // Beerus Hakai — atom-shaped violet orb, slow and inexorable erasure
  beerus: {
    slug: 'beerus', auraColor: '#7c3aed',
    techniques: [{ name: 'Hakai — Destruction!!!', type: 'hakai', color: '#7c3aed', secondaryColor: '#c084fc', duration: 3800, flavour: 'You are already gone — you simply haven\'t realised it yet' }],
  },

  // Whis — Angels transcend all mortal concepts; perfect autonomous combat
  whis: {
    slug: 'whis', auraColor: '#e0f2fe',
    techniques: [{ name: 'Autonomous Ultra Instinct — Angel\'s Path!!!', type: 'ultra_instinct', color: '#e0f2fe', secondaryColor: '#ffffff', duration: 4200, flavour: 'Angels do not fight — they simply are, and you are not' }],
  },

  // Broly LSSJ — chaotic green aura erupting asymmetrically; blank eyes; most violent
  broly_dbs: {
    slug: 'broly_dbs', auraColor: '#4ade80',
    techniques: [{ name: 'Legendary Super Saiyan — Primal Destruction!!!', type: 'legendary_saiyan', color: '#4ade80', secondaryColor: '#fbbf24', duration: 4000, flavour: 'There is nothing left inside — only the aura of a god of destruction' }],
  },

  // Gohan Beast — upward magenta geyser, layered aura, crimson eyes, barely-contained fury
  gohan_beast: {
    slug: 'gohan_beast', auraColor: '#c026d3',
    techniques: [{ name: 'Beast Mode — Soaring Dragon Strike!!!', type: 'beast_mode', color: '#c026d3', secondaryColor: '#bfdbfe', duration: 3800, flavour: 'The power that was always there — I just refused to use it' }],
  },

  // Jiren — pure compressed will; the most powerful mortal in Universe 11
  jiren: {
    slug: 'jiren', auraColor: '#ef4444',
    techniques: [{ name: 'Power Impact — Will Made Physical!!!', type: 'power_impact', color: '#ef4444', secondaryColor: '#fbbf24', duration: 3600, flavour: 'Power that surpasses the limits of the gods themselves — my will IS the ki' }],
  },

  // Cell Perfect — Solar Kamehameha; the perfect organism's ultimate beam
  cell_perfect: {
    slug: 'cell_perfect', auraColor: '#4ade80',
    techniques: [{ name: 'Solar Kamehameha — Planetary Erasure!!!', type: 'solar_kamehameha', color: '#4ade80', secondaryColor: '#fbbf24', duration: 3600, flavour: 'I am perfect — and this beam is the proof. It would destroy the Earth itself.' }],
  },

  // Black Frieza — 10 years in hyperbolic time chamber; surpasses both MUI and UE
  frieza_black: {
    slug: 'frieza_black', auraColor: '#1e1b4b',
    techniques: [{ name: 'Black Frieza — Death Beam of the Emperor!!!', type: 'black_frieza', color: '#1e1b4b', secondaryColor: '#6d28d9', duration: 3800, flavour: 'Ten years of silence. One second to end them both. I needed no more.' }],
  },

  // Golden Frieza — gilded tyrant, Death Beam empowered by golden ki
  frieza_golden: {
    slug: 'frieza_golden', auraColor: '#fbbf24',
    techniques: [{ name: 'Golden Frieza — Emperor\'s Death Beam!!!', type: 'ki_beam', color: '#fbbf24', secondaryColor: '#fef08a', duration: 3200, flavour: 'The gilded emperor — more beautiful and more deadly than ever' }],
  },

  // Future Trunks — hope energy from all survivors, Spirit Sword of light
  future_trunks_rage: {
    slug: 'future_trunks_rage', auraColor: '#3b82f6',
    techniques: [{ name: 'Sword of Hope — Final Hope Slash!!!', type: 'spirit_sword', color: '#3b82f6', secondaryColor: '#fbbf24', duration: 3800, flavour: 'Everyone\'s hope becomes this blade — I will not let their future die' }],
  },

  // Hit — Time Skip; the world freezes, he moves in the gap
  hit_universe6: {
    slug: 'hit_universe6', auraColor: '#94a3b8',
    techniques: [{ name: 'Time Skip — Ruthless Blow!!!', type: 'time_stop', color: '#94a3b8', secondaryColor: '#cbd5e1', duration: 3200, flavour: 'Half a second — enough to end your life a thousand times over' }],
  },

  // Android 18 — infinite energy, rapid-fire ki volley, mechanical precision
  android_18_super: {
    slug: 'android_18_super', auraColor: '#60a5fa',
    techniques: [{ name: 'Infinity Bullet — Endless Volley!!!', type: 'ki_beam', color: '#60a5fa', secondaryColor: '#e0f2fe', duration: 2800, flavour: 'I will never run out of energy — can you say the same?' }],
  },

  // Krillin — Destructo Disc cuts through any power level
  krillin_super: {
    slug: 'krillin_super', auraColor: '#fbbf24',
    techniques: [{ name: 'Destructo Disc — Earth Splitter!!!', type: 'ki_beam', color: '#facc15', secondaryColor: '#fef9c3', duration: 2600, flavour: 'This disc doesn\'t care about power levels — it cuts regardless' }],
  },

  // Master Roshi — the original Kamehameha at MAX POWER
  master_roshi: {
    slug: 'master_roshi', auraColor: '#fbbf24',
    techniques: [{ name: 'MAX Power Kamehameha!!!', type: 'ki_beam', color: '#fbbf24', secondaryColor: '#ffffff', duration: 3000, flavour: 'The Turtle Hermit — the man who created the technique that changed everything' }],
  },

  // Piccolo Orange — Special Beam Cannon drilling through existence
  piccolo_orange: {
    slug: 'piccolo_orange', auraColor: '#4ade80',
    techniques: [{ name: 'Special Beam Cannon — Drill of Light!!!', type: 'ki_beam', color: '#4ade80', secondaryColor: '#86efac', duration: 3000, flavour: 'Four minutes of absolute concentration — one hole through the universe' }],
  },

  // Majin Buu Pure — candy beam extinction, innocent pink chaos
  majin_buu_pure: {
    slug: 'majin_buu_pure', auraColor: '#f9a8d4',
    techniques: [{ name: 'Candy Beam — Extinction Amusement!!!', type: 'candy_beam', color: '#f9a8d4', secondaryColor: '#fbbf24', duration: 3200, flavour: 'You become candy now. Buu happy.' }],
  },

  // ── HxH ─────────────────────────────────────────────────────────────────────

  // Gon Adult — forbidden all-in; ink-black aura, white ghost eyes, single palm detonation
  gon_adult: {
    slug: 'gon_adult', auraColor: '#052e16',
    techniques: [{ name: 'Jajanken — Forbidden Rock: All In!!!', type: 'adult_gon', color: '#4ade80', secondaryColor: '#d1fae5', duration: 3800, flavour: 'I give up everything — every possibility, every future — for this one hit' }],
  },

  // Killua Godspeed — lightning body, six dodge-afterimages, Narukami thunderbolt
  killua_godspeed: {
    slug: 'killua_godspeed', auraColor: '#38bdf8',
    techniques: [{ name: 'Godspeed — Narukami: Thunderbolt!!!', type: 'godspeed', color: '#38bdf8', secondaryColor: '#ffffff', duration: 3400, flavour: 'I convert my aura to electricity and become the bolt itself' }],
  },

  // Meruem post-Rose — absorbed nen, directional blast, gold photon motes
  meruem_post_rose: {
    slug: 'meruem_post_rose', auraColor: '#fbbf24',
    techniques: [{ name: 'Royal Photon — Absorbed Nen: Full Release!!!', type: 'royal_photon', color: '#fbbf24', secondaryColor: '#4c1d95', duration: 4000, flavour: 'I have become everything — your power merely extends my dominion' }],
  },

  // Neferpitou — cat ears, marionette strings, mechanical corpse-puppet strikes
  neferpitou: {
    slug: 'neferpitou', auraColor: '#f9a8d4',
    techniques: [{ name: 'Terpsichora — Combat Puppet: Absolute Speed!!!', type: 'terpsichora', color: '#f9a8d4', secondaryColor: '#dc2626', duration: 3200, flavour: 'Even in death the strings move — the dance never ends' }],
  },

  // Netero Zero Hand — prayer orbs, Kannon mandala, spectrum beam, white nova, emptiness
  netero: {
    slug: 'netero', auraColor: '#fbbf24',
    techniques: [{ name: 'Zero Hand — Every Last Drop!!!', type: 'zero_hand', color: '#fbbf24', secondaryColor: '#f8fafc', duration: 4200, flavour: 'Nothing remains — I have given everything that I am' }],
  },

  // Hisoka — pink elastic, flying cards, theatrical snap
  hisoka: {
    slug: 'hisoka', auraColor: '#f9a8d4',
    techniques: [{ name: 'Bungee Gum — Love & Terror!!!', type: 'bungee_gum', color: '#f9a8d4', secondaryColor: '#fbbf24', duration: 3000, flavour: 'Bungee Gum has the properties of both rubber and gum — you were attached before you noticed' }],
  },

  // Chrollo Full Prep — grimoire opens, six stolen auras layer simultaneously
  chrollo_full_prep: {
    slug: 'chrollo_full_prep', auraColor: '#334155',
    techniques: [{ name: 'Skill Hunter — Full Repertoire: All Pages!!!', type: 'skill_hunter', color: '#334155', secondaryColor: '#64748b', duration: 3600, flavour: 'Every power stolen from every person I have killed — all of them, at once' }],
  },

  // Kurapika Emperor Time — crimson eyes flood screen, metallic chains, Chain Jail prison
  kurapika_emperor_time: {
    slug: 'kurapika_emperor_time', auraColor: '#dc2626',
    techniques: [{ name: 'Emperor Time — Chain Jail: Absolute Imprisonment!!!', type: 'emperor_time', color: '#dc2626', secondaryColor: '#fbbf24', duration: 3600, flavour: 'My eyes go red, and every category of Nen becomes mine — there is no escape from these chains' }],
  },

  // Feitan Rising Sun — darkness, ascending ball, solar corona burns everything
  feitan_rising_sun: {
    slug: 'feitan_rising_sun', auraColor: '#f97316',
    techniques: [{ name: 'Rising Sun — Pain Packer: Miniature Star!!!', type: 'rising_sun', color: '#f97316', secondaryColor: '#fef08a', duration: 3600, flavour: 'All the pain you gave me — I compress it into a sun and burn the world with it' }],
  },

  // Ging — perfectly neutral Nen mirror; copies and returns with total understanding
  ging_freecss: {
    slug: 'ging_freecss', auraColor: '#f8fafc',
    techniques: [{ name: 'Nen Copy — Returned with Interest!!!', type: 'nen_copy', color: '#f8fafc', secondaryColor: '#e2e8f0', duration: 3200, flavour: 'Whatever you give me — I give it back. Observe, understand, return. That is all.' }],
  },

  // Illumi — silver needle rain, cold puppet threads, alien control
  illumi: {
    slug: 'illumi', auraColor: '#e2e8f0',
    techniques: [{ name: 'Needlemen — Cold Insertion: Total Control!!!', type: 'needle_control', color: '#e2e8f0', secondaryColor: '#94a3b8', duration: 3000, flavour: 'A single needle, and your free will is gone forever — there is no pain, only obedience' }],
  },

  // Uvogin — pure Enhancement, the mightiest body in the Troupe
  uvogin: {
    slug: 'uvogin', auraColor: '#ea580c',
    techniques: [{ name: 'Big Bang Impact — One Fist: All Enhancement!!!', type: 'big_bang_impact', color: '#ea580c', secondaryColor: '#fbbf24', duration: 3000, flavour: 'No tricks. No ability. The strongest body in the Phantom Troupe — one punch splits the ground.' }],
  },

  // Franklin — Double Machine Gun, nen bullets fired from finger-cannons
  franklin: {
    slug: 'franklin', auraColor: '#f97316',
    techniques: [{ name: 'Double Machine Gun — Ten Thousand Shots!!!', type: 'nen_aura', color: '#dc2626', secondaryColor: '#f97316', duration: 2800, flavour: 'Every finger fires — each bullet a cannonball of compressed Nen' }],
  },

  // Phinks — Ripper Cyclotron; arm rotation compounds multiplicatively
  phinks: {
    slug: 'phinks', auraColor: '#ef4444',
    techniques: [{ name: 'Ripper Cyclotron — 15 Rotations!!!', type: 'physical', color: '#ef4444', secondaryColor: '#dc2626', duration: 2800, flavour: 'Each spin multiplies the power — fifteen rotations ends everything' }],
  },

  // Shalnark — Black Voice antenna, autopilot control of living weapons
  shalnark: {
    slug: 'shalnark', auraColor: '#7c3aed',
    techniques: [{ name: 'Black Voice — Remote Control!!!', type: 'nen_aura', color: '#7c3aed', secondaryColor: '#a855f7', duration: 2800, flavour: 'Insert the antenna — from that moment you fight for me' }],
  },
}

/** Get the profile for a character, returning null if not hand-crafted */
export function getCharacterProfile(slug: string): CharacterAnimProfile | null {
  return CHARACTER_PROFILES[slug] ?? null
}
