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
  goku_mui: {
    slug: 'goku_mui', auraColor: '#f8fafc',
    techniques: [{ name: 'Mastered Ultra Instinct!!!', type: 'ki_aura', color: '#f8fafc', secondaryColor: '#e0f2fe', duration: 4000, flavour: 'Empty mind — the body moves on its own' }],
  },
  vegeta_ultra_ego: {
    slug: 'vegeta_ultra_ego', auraColor: '#a855f7',
    techniques: [{ name: 'Ultra Ego — Final Explosion!!!', type: 'ki_aura', color: '#a855f7', secondaryColor: '#e9d5ff', duration: 3600, flavour: 'Stronger with every hit taken' }],
  },
  beerus: {
    slug: 'beerus', auraColor: '#a855f7',
    techniques: [{ name: 'Hakai!!!', type: 'divine', color: '#a855f7', secondaryColor: '#ede9fe', duration: 3800, flavour: 'Destruction — the beginning of creation' }],
  },
  whis: {
    slug: 'whis', auraColor: '#e0f2fe',
    techniques: [{ name: 'Autonomous Ultra Instinct!!!', type: 'divine', color: '#bfdbfe', secondaryColor: '#ffffff', duration: 4200, flavour: 'Angels transcend all concepts of combat' }],
  },
  broly_dbs: {
    slug: 'broly_dbs', auraColor: '#4ade80',
    techniques: [{ name: 'Gigantic Explosion!!!', type: 'ki_aura', color: '#4ade80', secondaryColor: '#86efac', duration: 3600, flavour: 'Primal Saiyan force unchained' }],
  },
  gohan_beast: {
    slug: 'gohan_beast', auraColor: '#ef4444',
    techniques: [{ name: 'Beast Mode — Special Beam Cannon!!!', type: 'ki_beam', color: '#ef4444', secondaryColor: '#fbbf24', duration: 3400, flavour: 'The power of a father\'s love' }],
  },
  jiren: {
    slug: 'jiren', auraColor: '#ef4444',
    techniques: [{ name: 'Power Impact!!!', type: 'ki_aura', color: '#ef4444', secondaryColor: '#fca5a5', duration: 3600, flavour: 'Power surpassing limits itself' }],
  },
  cell_perfect: {
    slug: 'cell_perfect', auraColor: '#4ade80',
    techniques: [{ name: 'Solar Kamehameha!!!', type: 'ki_beam', color: '#4ade80', secondaryColor: '#86efac', duration: 3400, flavour: 'Perfection, achieved' }],
  },
  frieza_black: {
    slug: 'frieza_black', auraColor: '#1e293b',
    techniques: [{ name: 'Black Frieza — Emperor of the Universe!!!', type: 'ki_aura', color: '#1e1b4b', secondaryColor: '#6d28d9', duration: 3800, flavour: '10 years of training in the hyperbolic time chamber' }],
  },
  frieza_golden: {
    slug: 'frieza_golden', auraColor: '#fbbf24',
    techniques: [{ name: 'Golden Frieza — Death Beam!!!', type: 'ki_beam', color: '#fbbf24', secondaryColor: '#fef08a', duration: 3000, flavour: 'The gilded emperor\'s wrath' }],
  },
  future_trunks_rage: {
    slug: 'future_trunks_rage', auraColor: '#3b82f6',
    techniques: [{ name: 'Sword of Hope — Rage Mode!!!', type: 'ki_aura', color: '#3b82f6', secondaryColor: '#bfdbfe', duration: 3400, flavour: 'The hope of the future' }],
  },
  hit_universe6: {
    slug: 'hit_universe6', auraColor: '#94a3b8',
    techniques: [{ name: 'Time Skip — Ruthless Blow!', type: 'time_stop', color: '#94a3b8', secondaryColor: '#cbd5e1', duration: 3200, flavour: 'Half a second — that\'s all' }],
  },
  android_18_super: {
    slug: 'android_18_super', auraColor: '#60a5fa',
    techniques: [{ name: 'Infinity Bullet!!!', type: 'ki_beam', color: '#60a5fa', secondaryColor: '#bfdbfe', duration: 2600, flavour: 'Infinite energy — infinite firepower' }],
  },
  krillin_super: {
    slug: 'krillin_super', auraColor: '#fbbf24',
    techniques: [{ name: 'Destructo Disc!!!', type: 'ki_beam', color: '#facc15', secondaryColor: '#fef08a', duration: 2400, flavour: 'The disc ignores power levels' }],
  },
  master_roshi: {
    slug: 'master_roshi', auraColor: '#fbbf24',
    techniques: [{ name: 'MAX Power Kamehameha!!!', type: 'ki_beam', color: '#fbbf24', secondaryColor: '#fef9c3', duration: 2800, flavour: 'The technique that started it all' }],
  },
  piccolo_orange: {
    slug: 'piccolo_orange', auraColor: '#4ade80',
    techniques: [{ name: 'Special Beam Cannon!!!', type: 'ki_beam', color: '#4ade80', secondaryColor: '#86efac', duration: 2800, flavour: 'Four minutes of concentration, one shot' }],
  },
  majin_buu_pure: {
    slug: 'majin_buu_pure', auraColor: '#f9a8d4',
    techniques: [{ name: 'Extinction Attack!!!', type: 'ki_aura', color: '#f9a8d4', secondaryColor: '#fce7f3', duration: 3200, flavour: 'Pure instinct — pure destruction' }],
  },

  // ── HxH ─────────────────────────────────────────────────────────────────────
  gon_adult: {
    slug: 'gon_adult', auraColor: '#4ade80',
    techniques: [{ name: 'Jajanken — Rock!!!', type: 'nen_aura', color: '#4ade80', secondaryColor: '#86efac', duration: 3600, flavour: 'All potential released in one moment' }],
  },
  killua_godspeed: {
    slug: 'killua_godspeed', auraColor: '#38bdf8',
    techniques: [{ name: 'Godspeed — Lightning Palm!!!', type: 'nen_aura', color: '#38bdf8', secondaryColor: '#7dd3fc', duration: 3200, flavour: 'Speed so great he leaves afterimages' }],
  },
  meruem_post_rose: {
    slug: 'meruem_post_rose', auraColor: '#facc15',
    techniques: [{ name: 'Royal Flush — Nen Absorption!!!', type: 'nen_aura', color: '#facc15', secondaryColor: '#fef08a', duration: 4000, flavour: 'All Nen becomes his own' }],
  },
  neferpitou: {
    slug: 'neferpitou', auraColor: '#f9a8d4',
    techniques: [{ name: 'Terpsichora — Doctor Blythe!', type: 'nen_aura', color: '#f9a8d4', secondaryColor: '#fce7f3', duration: 3000, flavour: 'The strongest Royal Guard' }],
  },
  netero: {
    slug: 'netero', auraColor: '#f8fafc',
    techniques: [{ name: 'Zero Hand — Empty!!!', type: 'nen_aura', color: '#f8fafc', secondaryColor: '#e0f2fe', duration: 4000, flavour: 'Every last drop of Nen' }],
  },
  hisoka: {
    slug: 'hisoka', auraColor: '#f9a8d4',
    techniques: [{ name: 'Bungee Gum — Elastic Love!!!', type: 'nen_aura', color: '#f9a8d4', secondaryColor: '#fbbf24', duration: 2800, flavour: 'Bungee Gum has the properties of both rubber and gum' }],
  },
  chrollo_full_prep: {
    slug: 'chrollo_full_prep', auraColor: '#334155',
    techniques: [{ name: 'Skill Hunter — Full Prep!!!', type: 'nen_aura', color: '#334155', secondaryColor: '#64748b', duration: 3400, flavour: 'Every stolen ability ready at once' }],
  },
  kurapika_emperor_time: {
    slug: 'kurapika_emperor_time', auraColor: '#dc2626',
    techniques: [{ name: 'Emperor Time — Chain Jail!!!', type: 'chain_jail', color: '#dc2626', secondaryColor: '#fbbf24', duration: 3400, flavour: 'These chains were made for Phantom Troupe alone' }],
  },
  feitan_rising_sun: {
    slug: 'feitan_rising_sun', auraColor: '#fbbf24',
    techniques: [{ name: 'Rising Sun — Pain Packer!!!', type: 'ki_aura', color: '#fbbf24', secondaryColor: '#dc2626', duration: 3400, flavour: 'Anger turns to absolute temperature' }],
  },
  ging_freecss: {
    slug: 'ging_freecss', auraColor: '#a3e635',
    techniques: [{ name: 'Nen Copy & Return!!!', type: 'nen_aura', color: '#a3e635', secondaryColor: '#d9f99d', duration: 3000, flavour: 'Every technique used against him becomes his own' }],
  },
  illumi: {
    slug: 'illumi', auraColor: '#e2e8f0',
    techniques: [{ name: 'Needle People — Mass Manipulation!!!', type: 'nen_aura', color: '#e2e8f0', secondaryColor: '#f1f5f9', duration: 2800, flavour: 'Everyone becomes his puppet' }],
  },
  uvogin: {
    slug: 'uvogin', auraColor: '#f97316',
    techniques: [{ name: 'Big Bang Impact!!!', type: 'nen_aura', color: '#f97316', secondaryColor: '#fbbf24', duration: 3000, flavour: 'Pure Enhancement — the mightiest body' }],
  },
  franklin: {
    slug: 'franklin', auraColor: '#f97316',
    techniques: [{ name: 'Double Machine Gun!!!', type: 'nen_aura', color: '#f97316', secondaryColor: '#fb923c', duration: 2800, flavour: 'Every bullet a Nen cannonball' }],
  },
  phinks: {
    slug: 'phinks', auraColor: '#ef4444',
    techniques: [{ name: 'Ripper Cyclotron — Max Rotation!!!', type: 'physical', color: '#ef4444', secondaryColor: '#dc2626', duration: 2800, flavour: 'Each rotation multiplies destruction' }],
  },
  shalnark: {
    slug: 'shalnark', auraColor: '#7c3aed',
    techniques: [{ name: 'Black Voice — Autopilot!!!', type: 'nen_aura', color: '#7c3aed', secondaryColor: '#a855f7', duration: 2800, flavour: 'You are now my puppet' }],
  },
}

/** Get the profile for a character, returning null if not hand-crafted */
export function getCharacterProfile(slug: string): CharacterAnimProfile | null {
  return CHARACTER_PROFILES[slug] ?? null
}
