import type { CharacterAnimProfile } from '@/types/animation'

/**
 * Hand-crafted animation profiles for key characters.
 * Characters not listed here get auto-generated profiles via pickTechniqueFromTags.
 */
export const CHARACTER_PROFILES: Record<string, CharacterAnimProfile> = {
  // ── One Piece ──────────────────────────────────────────────────────────────
  luffy_gear5: {
    slug: 'luffy_gear5', auraColor: '#fef9c3',
    techniques: [{ name: 'Gear 5 — Joy Boy Awakens!!!', type: 'gear5', color: '#f8fafc', secondaryColor: '#fef9c3', duration: 3800, flavour: 'The most ridiculous power in the world' }],
  },
  luffy_snakeman: {
    slug: 'luffy_snakeman', auraColor: '#f97316',
    techniques: [{ name: 'Gear 4 — Snakeman!', type: 'ki_aura', color: '#f97316', secondaryColor: '#fbbf24', duration: 2800, flavour: 'Python — unending pursuit' }],
  },
  luffy_skypiea: {
    slug: 'luffy_skypiea', auraColor: '#fbbf24',
    techniques: [{ name: 'Gum-Gum Pistol!', type: 'physical', color: '#fbbf24', duration: 2000 }],
  },
  gold_d_roger: {
    slug: 'gold_d_roger', auraColor: '#fbbf24',
    techniques: [{ name: "Conqueror's Haki — Divine Departure!", type: 'haki_burst', color: '#fbbf24', secondaryColor: '#f59e0b', duration: 3200, flavour: 'The King of Pirates' }],
  },
  shanks: {
    slug: 'shanks', auraColor: '#dc2626',
    techniques: [{ name: "Conqueror's Haki — World Destroyer!", type: 'haki_burst', color: '#1e293b', secondaryColor: '#dc2626', duration: 3200, flavour: 'Mountains carved by Haki' }],
  },
  whitebeard_peak: {
    slug: 'whitebeard_peak', auraColor: '#e0f2fe',
    techniques: [{ name: 'Gura Gura no Mi — World-Shaker!!!', type: 'haki_burst', color: '#ffffff', secondaryColor: '#bfdbfe', duration: 3400, flavour: 'One fist cracks the sky' }],
  },
  kaido_hybrid: {
    slug: 'kaido_hybrid', auraColor: '#6d28d9',
    techniques: [{ name: 'Raimei Hakke!!!', type: 'elemental_lightning', color: '#6d28d9', secondaryColor: '#a855f7', duration: 3000, flavour: 'Thunder Bagua — the mightiest blow' }],
  },
  big_mom: {
    slug: 'big_mom', auraColor: '#f9a8d4',
    techniques: [{ name: 'Heavenly Fire — Prometheus!!!', type: 'elemental_fire', color: '#f97316', secondaryColor: '#fbbf24', duration: 2800 }],
  },
  akainu: {
    slug: 'akainu', auraColor: '#dc2626',
    techniques: [{ name: 'Mag-Fist Gushing!!!', type: 'logia', color: '#dc2626', secondaryColor: '#f97316', duration: 2800, flavour: 'Absolute Justice' }],
  },
  blackbeard: {
    slug: 'blackbeard', auraColor: '#1e293b',
    techniques: [{ name: 'Darkness — Liberation!!!', type: 'darkness', color: '#0f0f0f', secondaryColor: '#1e293b', duration: 3200, flavour: 'My darkness has no limits' }],
  },
  mihawk: {
    slug: 'mihawk', auraColor: '#1e293b',
    techniques: [{ name: 'Black Blade — Yoru!', type: 'sword', color: '#1e1b4b', secondaryColor: '#e0e7ff', duration: 2600, flavour: 'The world\'s greatest swordsman' }],
  },
  zoro_post_wano: {
    slug: 'zoro_post_wano', auraColor: '#4ade80',
    techniques: [{ name: 'Asura — Three-Sword Style!!!', type: 'sword', color: '#4ade80', secondaryColor: '#86efac', duration: 2800, flavour: 'Nine blades of the demon king' }],
  },
  rayleigh: {
    slug: 'rayleigh', auraColor: '#fbbf24',
    techniques: [{ name: "Conqueror's Haki — Dark King's Might!", type: 'haki_burst', color: '#fbbf24', secondaryColor: '#f59e0b', duration: 3000, flavour: 'Roger\'s first mate holds nothing back' }],
  },
  enel: {
    slug: 'enel', auraColor: '#fef08a',
    techniques: [{ name: 'El Thor!!!', type: 'elemental_lightning', color: '#fef08a', secondaryColor: '#fefce8', duration: 2800, flavour: 'God\'s divine judgement' }],
  },
  doflamingo: {
    slug: 'doflamingo', auraColor: '#f472b6',
    techniques: [{ name: 'Birdcage — Parasite!!!', type: 'string', color: '#f472b6', secondaryColor: '#fbcfe8', duration: 3000, flavour: 'There is no escape from the cage' }],
  },
  boa_hancock: {
    slug: 'boa_hancock', auraColor: '#f9a8d4',
    techniques: [{ name: 'Slave Arrow!!!', type: 'physical', color: '#f9a8d4', secondaryColor: '#fce7f3', duration: 2400, flavour: 'Petrified by beauty' }],
  },
  magellan: {
    slug: 'magellan', auraColor: '#4ade80',
    techniques: [{ name: 'Venom Demon — Hell Judge!!!', type: 'poison', color: '#16a34a', secondaryColor: '#4ade80', duration: 3000, flavour: 'No antidote has ever been found' }],
  },

  // ── Naruto ──────────────────────────────────────────────────────────────────
  naruto_six_paths: {
    slug: 'naruto_six_paths', auraColor: '#f97316',
    techniques: [{ name: 'Six Paths Sage Mode — Truth-Seeking Ball!!!', type: 'bijuu', color: '#f97316', secondaryColor: '#fbbf24', duration: 3500, flavour: 'The child of prophecy' }],
  },
  sasuke_rinnegan: {
    slug: 'sasuke_rinnegan', auraColor: '#6d28d9',
    techniques: [{ name: 'Rinnegan — Indra\'s Arrow!!!', type: 'sharingan', color: '#6d28d9', secondaryColor: '#a855f7', duration: 3500, flavour: 'The final technique' }],
  },
  madara_six_paths: {
    slug: 'madara_six_paths', auraColor: '#6d28d9',
    techniques: [{ name: 'Infinite Tsukuyomi!!!', type: 'sharingan', color: '#6d28d9', secondaryColor: '#1e1b4b', duration: 3800, flavour: 'An eternal dream for all mankind' }],
  },
  kaguya: {
    slug: 'kaguya', auraColor: '#ffffff',
    techniques: [{ name: 'Expansive Truth-Seeking Ball!!!', type: 'divine', color: '#ffffff', secondaryColor: '#e0f2fe', duration: 4000, flavour: 'The mother of all chakra' }],
  },
  hashirama_sage_mode: {
    slug: 'hashirama_sage_mode', auraColor: '#4ade80',
    techniques: [{ name: 'Wood Style — Thousand-Hand Buddha!!!', type: 'elemental_wind', color: '#4ade80', secondaryColor: '#86efac', duration: 3400, flavour: 'The first and greatest Hokage' }],
  },
  itachi: {
    slug: 'itachi', auraColor: '#6d28d9',
    techniques: [{ name: 'Izanami — Eternal Tsukuyomi Loop', type: 'sharingan', color: '#6d28d9', secondaryColor: '#1e1b4b', duration: 3200, flavour: 'Accept yourself and it ends' }],
  },
  guy_eight_gates: {
    slug: 'guy_eight_gates', auraColor: '#4ade80',
    techniques: [{ name: 'Evening Elephant — Night Guy!!!', type: 'physical', color: '#4ade80', secondaryColor: '#86efac', duration: 3200, flavour: 'The 8th gate — sunset of youth' }],
  },
  rock_lee_fifth_gate: {
    slug: 'rock_lee_fifth_gate', auraColor: '#4ade80',
    techniques: [{ name: 'Fifth Gate — Reverse Lotus!!!', type: 'physical', color: '#4ade80', secondaryColor: '#a3e635', duration: 2800, flavour: 'A genius of hard work' }],
  },
  kakashi_dual_sharingan: {
    slug: 'kakashi_dual_sharingan', auraColor: '#6d28d9',
    techniques: [{ name: 'Kamui Raikiri — Lightning God!!!', type: 'elemental_lightning', color: '#6d28d9', secondaryColor: '#38bdf8', duration: 3000, flavour: 'One thousand jutsu' }],
  },
  minato_kcm2: {
    slug: 'minato_kcm2', auraColor: '#fbbf24',
    techniques: [{ name: 'Flying Raijin — God Technique!!!', type: 'elemental_lightning', color: '#fbbf24', secondaryColor: '#f97316', duration: 3200, flavour: 'Faster than any eye can follow' }],
  },
  obito_ten_tails: {
    slug: 'obito_ten_tails', auraColor: '#1e293b',
    techniques: [{ name: 'Kamui — Dimensional Rift!!!', type: 'shadow', color: '#1e293b', secondaryColor: '#334155', duration: 3000, flavour: 'Nothing exists in this world anymore' }],
  },
  shikamaru_shadow: {
    slug: 'shikamaru_shadow', auraColor: '#1e293b',
    techniques: [{ name: 'Shadow Possession!!!', type: 'shadow', color: '#1e293b', secondaryColor: '#334155', duration: 2800, flavour: 'Your shadow... is mine' }],
  },
  konan_akatsuki: {
    slug: 'konan_akatsuki', auraColor: '#f0f9ff',
    techniques: [{ name: '600 Billion Paper Bombs!!!', type: 'paper', color: '#f0f9ff', secondaryColor: '#e0f2fe', duration: 3500, flavour: '10 minutes of non-stop detonation' }],
  },
  hidan_akatsuki: {
    slug: 'hidan_akatsuki', auraColor: '#dc2626',
    techniques: [{ name: 'Jashin Ritual — Curse!', type: 'shadow', color: '#7f1d1d', secondaryColor: '#dc2626', duration: 2800, flavour: 'Your pain is my delight' }],
  },
  kisame_hoshigaki: {
    slug: 'kisame_hoshigaki', auraColor: '#38bdf8',
    techniques: [{ name: 'Samehada Fusion — Shark Bomb!!!', type: 'elemental_water', color: '#0369a1', secondaryColor: '#38bdf8', duration: 3000, flavour: 'Samehada drinks your chakra' }],
  },
  tobirama_senju: {
    slug: 'tobirama_senju', auraColor: '#38bdf8',
    techniques: [{ name: 'Flying Raijin Level 2!!!', type: 'elemental_lightning', color: '#38bdf8', secondaryColor: '#bfdbfe', duration: 3000, flavour: 'The inventor of teleportation' }],
  },
  raikage_a: {
    slug: 'raikage_a', auraColor: '#facc15',
    techniques: [{ name: 'Lightning Armor — Lariat!!!', type: 'elemental_lightning', color: '#facc15', secondaryColor: '#fef08a', duration: 2800, flavour: 'The fastest man without the Sharingan' }],
  },
  nagato_pain: {
    slug: 'nagato_pain', auraColor: '#6d28d9',
    techniques: [{ name: 'Almighty Push!!!', type: 'nen_aura', color: '#6d28d9', secondaryColor: '#a855f7', duration: 3200, flavour: 'The Six Paths of Pain' }],
  },
  gaara_kazekage: {
    slug: 'gaara_kazekage', auraColor: '#d97706',
    techniques: [{ name: 'Sand Burial — Absolute Defence!!!', type: 'elemental_sand', color: '#d97706', secondaryColor: '#f59e0b', duration: 2800, flavour: 'The sand loves me alone' }],
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
