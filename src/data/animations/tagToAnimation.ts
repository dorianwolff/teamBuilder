import type { AnimationType, TechniqueAnim } from '@/types/animation'

/**
 * Maps a power_tag slug → a default TechniqueAnim.
 * Used as a fallback when a character doesn't have a hand-crafted entry.
 */
export const TAG_TO_TECHNIQUE: Record<string, TechniqueAnim> = {
  // ── DBZ / Ki ────────────────────────────────────────────────────────────────
  kamehameha:          { name: 'Kamehameha!!!',         type: 'ki_beam',     color: '#60a5fa', secondaryColor: '#bfdbfe', duration: 2800, flavour: 'The ultimate Ki technique' },
  spirit_bomb:         { name: 'Spirit Bomb',            type: 'ki_aura',     color: '#7dd3fc', secondaryColor: '#ffffff', duration: 3000, flavour: 'The energy of all life' },
  ultra_instinct:      { name: 'Ultra Instinct',         type: 'ki_aura',     color: '#e0f2fe', secondaryColor: '#ffffff', duration: 2500, flavour: 'Empty mind, perfect body' },
  super_saiyan_aura:   { name: 'Super Saiyan!!!',        type: 'ki_aura',     color: '#fbbf24', secondaryColor: '#fef08a', duration: 2800, flavour: 'Beyond all limits' },
  super_saiyan_blue:   { name: 'Super Saiyan Blue',      type: 'ki_aura',     color: '#3b82f6', secondaryColor: '#bfdbfe', duration: 2800, flavour: 'Divine Ki perfected' },
  ultra_ego:           { name: 'Ultra Ego',              type: 'ki_aura',     color: '#a855f7', secondaryColor: '#e9d5ff', duration: 2600, flavour: 'Destruction incarnate' },
  final_flash:         { name: 'Final Flash!',           type: 'ki_beam',     color: '#fbbf24', secondaryColor: '#fef08a', duration: 2600, flavour: 'Vegeta\'s ultimate beam' },
  galick_gun:          { name: 'Galick Gun!',            type: 'ki_beam',     color: '#a855f7', secondaryColor: '#e9d5ff', duration: 2400 },
  destructo_disc:      { name: 'Destructo Disc!',        type: 'ki_beam',     color: '#facc15', secondaryColor: '#fef08a', duration: 2200, flavour: 'The unkillable disc' },
  neo_tri_beam:        { name: 'Neo Tri-Beam!!!',        type: 'ki_beam',     color: '#a3e635', secondaryColor: '#d9f99d', duration: 2800, flavour: 'Sacrifice everything' },
  ki:                  { name: 'Ki Blast',               type: 'ki_beam',     color: '#fbbf24', duration: 2000 },
  ki_blast:            { name: 'Ki Blast',               type: 'ki_beam',     color: '#fbbf24', duration: 2000 },
  time_skip:           { name: 'Time Skip',              type: 'time_stop',   color: '#94a3b8', secondaryColor: '#cbd5e1', duration: 3000, flavour: 'Half a second — an eternity' },

  // ── Naruto / Chakra ─────────────────────────────────────────────────────────
  rasengan:            { name: 'Rasengan!',              type: 'rasengan',    color: '#60a5fa', secondaryColor: '#bfdbfe', duration: 2400 },
  rasenshuriken:       { name: 'Wind Release: Rasenshuriken!!!', type: 'rasengan', color: '#86efac', secondaryColor: '#bbf7d0', duration: 2800, flavour: 'Cuts at the cellular level' },
  sharingan:           { name: 'Sharingan...',            type: 'sharingan',   color: '#ef4444', secondaryColor: '#fee2e2', duration: 2800, flavour: 'Every move is read' },
  mangekyou_sharingan: { name: 'Mangekyō Sharingan',     type: 'sharingan',   color: '#7c3aed', secondaryColor: '#ede9fe', duration: 3000, flavour: 'The eyes of the cursed' },
  amaterasu:           { name: 'Amaterasu',              type: 'elemental_fire', color: '#0f0f0f', secondaryColor: '#ef4444', duration: 3000, flavour: 'Black flames that never die' },
  tsukuyomi:           { name: 'Tsukuyomi',              type: 'sharingan',   color: '#1e1b4b', secondaryColor: '#6d28d9', duration: 3200, flavour: '72 hours in an instant' },
  byakugan:            { name: 'Byakugan!',              type: 'byakugan',    color: '#e2e8f0', secondaryColor: '#f8fafc', duration: 2400, flavour: 'The all-seeing eye' },
  byakugan_360:        { name: 'Byakugan — 360°',        type: 'byakugan',    color: '#e2e8f0', secondaryColor: '#bfdbfe', duration: 2600 },
  gentle_fist:         { name: 'Eight Trigrams 128 Palms', type: 'byakugan',  color: '#bfdbfe', secondaryColor: '#e0f2fe', duration: 2600, flavour: 'Every chakra point sealed' },
  shadow_possession:   { name: 'Shadow Possession Jutsu!', type: 'shadow',    color: '#1e293b', secondaryColor: '#334155', duration: 2800, flavour: 'Your shadow is mine' },
  shadow_stitching:    { name: 'Shadow Stitching!',       type: 'shadow',     color: '#0f172a', secondaryColor: '#1e293b', duration: 2600 },
  bijuu_bomb:          { name: 'Tailed Beast Bomb!!!',   type: 'bijuu',       color: '#f97316', secondaryColor: '#fbbf24', duration: 3000, flavour: 'The chakra of the tailed beast' },
  eight_trigrams_128_palms: { name: '8 Trigrams: 128 Palms', type: 'byakugan', color: '#bfdbfe', duration: 2600 },
  wind_release:        { name: 'Wind Release Jutsu',     type: 'elemental_wind', color: '#d1fae5', secondaryColor: '#a7f3d0', duration: 2200 },
  fire_release:        { name: 'Fire Release Jutsu',     type: 'elemental_fire', color: '#f97316', secondaryColor: '#fbbf24', duration: 2200 },
  lightning_release:   { name: 'Lightning Release',      type: 'elemental_lightning', color: '#facc15', secondaryColor: '#fef08a', duration: 2200 },
  earth_release:       { name: 'Earth Release',          type: 'elemental_wind', color: '#92400e', secondaryColor: '#d97706', duration: 2200 },
  water_release:       { name: 'Water Release Jutsu',    type: 'elemental_water', color: '#38bdf8', secondaryColor: '#7dd3fc', duration: 2200 },
  paper_ninjutsu:      { name: '600 Billion Paper Bombs', type: 'paper',      color: '#f0f9ff', secondaryColor: '#e0f2fe', duration: 3000, flavour: '10 minutes of detonation' },
  explosion_release:   { name: 'C4 — Karura!',           type: 'explosion',   color: '#f97316', secondaryColor: '#ef4444', duration: 2800, flavour: 'Art is a bang!' },
  s2_final_art:        { name: 'S2 — Ultimate Art!!!',   type: 'explosion',   color: '#ef4444', secondaryColor: '#fbbf24', duration: 3200, flavour: 'Deidara\'s final masterpiece' },
  reaper_death_seal:   { name: 'Reaper Death Seal',      type: 'shadow',      color: '#1e293b', secondaryColor: '#7f1d1d', duration: 3000, flavour: 'The God of Death takes both souls' },
  lightning_armor:     { name: 'Lightning Armor!',       type: 'elemental_lightning', color: '#facc15', secondaryColor: '#fef3c7', duration: 2400, flavour: 'Speed beyond sight' },
  genjutsu:            { name: 'Genjutsu!',              type: 'sharingan',   color: '#ef4444', secondaryColor: '#fee2e2', duration: 2600 },
  tailed_beast_mode:   { name: 'Tailed Beast Mode',      type: 'bijuu',       color: '#f97316', secondaryColor: '#fbbf24', duration: 2800 },

  // ── One Piece / Haki & DF ───────────────────────────────────────────────────
  conqueror_haki:      { name: "Conqueror's Haki!!!",    type: 'haki_burst',  color: '#1e293b', secondaryColor: '#475569', duration: 3000, flavour: 'The Haki of kings' },
  haki_conqueror:      { name: "Conqueror's Haki!!!",    type: 'haki_burst',  color: '#1e293b', secondaryColor: '#475569', duration: 3000 },
  haki_mastery:        { name: 'Advanced Haki',          type: 'haki_burst',  color: '#334155', secondaryColor: '#64748b', duration: 2600 },
  armament_haki:       { name: 'Armament Haki',          type: 'physical',    color: '#1e293b', secondaryColor: '#475569', duration: 2000 },
  haki_armament:       { name: 'Armament Haki',          type: 'physical',    color: '#1e293b', duration: 2000 },
  logia_intangibility: { name: 'Logia Form!',            type: 'logia',       color: '#f97316', duration: 2200 },
  gear_5:              { name: 'Gear 5!!!',              type: 'gear5',       color: '#f8fafc', secondaryColor: '#fef9c3', duration: 3500, flavour: 'The peak of human imagination' },
  gear5:               { name: 'Gear 5!!!',              type: 'gear5',       color: '#f8fafc', secondaryColor: '#fef9c3', duration: 3500 },
  magma_fist:          { name: 'Mag-Fist!!!',            type: 'logia',       color: '#dc2626', secondaryColor: '#f97316', duration: 2600, flavour: 'Admiral of Absolute Justice' },
  ice_age:             { name: 'Ice Age',                type: 'elemental_ice', color: '#bae6fd', secondaryColor: '#e0f2fe', duration: 2600 },
  pika_pika_light:     { name: 'Speed of Light!!',       type: 'logia',       color: '#fef08a', secondaryColor: '#fefce8', duration: 2400 },
  string_string_fruit: { name: 'Birdcage!!!',            type: 'string',      color: '#f472b6', secondaryColor: '#fbcfe8', duration: 2800, flavour: 'No one escapes' },
  birdcage:            { name: 'Birdcage!!!',            type: 'string',      color: '#f472b6', secondaryColor: '#fbcfe8', duration: 2800 },
  love_love_fruit:     { name: 'Mero Mero Mellow!!!',    type: 'physical',    color: '#f9a8d4', secondaryColor: '#fce7f3', duration: 2400, flavour: 'Petrified by beauty' },
  venom_venom_fruit:   { name: 'Venom Demon — Hell Judge', type: 'poison',    color: '#4ade80', secondaryColor: '#86efac', duration: 2800, flavour: 'No antidote exists' },
  chop_chop_fruit:     { name: 'Chop-Chop Cannon!',      type: 'physical',    color: '#f97316', duration: 2200 },
  yami_yami:           { name: 'Darkness — Liberation!', type: 'darkness',    color: '#0f0f0f', secondaryColor: '#1e293b', duration: 3000, flavour: 'My darkness devours all' },
  darkness:            { name: 'Darkness!',              type: 'darkness',    color: '#0f0f0f', secondaryColor: '#1e293b', duration: 2800 },
  fishman_karate:      { name: 'Fishman Karate!',        type: 'elemental_water', color: '#38bdf8', duration: 2200 },
  rumble_ball_monster_point: { name: 'Monster Point!!!', type: 'physical',    color: '#f97316', secondaryColor: '#dc2626', duration: 2600, flavour: 'The most powerful form' },
  perfume_femur:       { name: 'Perfume Femur!!!',       type: 'physical',    color: '#f9a8d4', duration: 2200 },

  // ── HxH / Nen ────────────────────────────────────────────────────────────────
  nen_aura:            { name: 'Nen Aura!',              type: 'nen_aura',    color: '#a3e635', secondaryColor: '#d9f99d', duration: 2400 },
  nen_user:            { name: 'Nen Aura!',              type: 'nen_aura',    color: '#a3e635', duration: 2200 },
  godspeed:            { name: 'Godspeed!!!',            type: 'nen_aura',    color: '#38bdf8', secondaryColor: '#7dd3fc', duration: 2800, flavour: 'Speed beyond thought' },
  god_hand:            { name: 'God of Lightning — God Speed!', type: 'nen_aura', color: '#38bdf8', secondaryColor: '#bfdbfe', duration: 3000 },
  chain_jail:          { name: 'Chain Jail!!!',          type: 'chain_jail',  color: '#fbbf24', secondaryColor: '#f59e0b', duration: 2800, flavour: 'A chain only for the Phantom Troupe' },
  emperor_time:        { name: 'Emperor Time!!!',        type: 'chain_jail',  color: '#dc2626', secondaryColor: '#fbbf24', duration: 3000, flavour: '100% of all Nen categories' },
  zero_hand:           { name: 'Zero Hand!!!',           type: 'nen_aura',    color: '#f8fafc', secondaryColor: '#e2e8f0', duration: 3200, flavour: 'All Nen poured into a single shot' },
  enhancement_nen:     { name: 'Enhancement Nen!',       type: 'nen_aura',    color: '#fbbf24', duration: 2200 },
  emission_nen:        { name: 'Double Machine Gun!!!',  type: 'nen_aura',    color: '#f97316', secondaryColor: '#fb923c', duration: 2600 },
  manipulation_nen:    { name: 'Black Voice!',           type: 'nen_aura',    color: '#7c3aed', secondaryColor: '#ede9fe', duration: 2400 },
  rising_sun:          { name: 'Rising Sun!!!',          type: 'ki_aura',     color: '#fbbf24', secondaryColor: '#f59e0b', duration: 3000, flavour: 'Pain Packer — absolute temperature' },
  ripper_cyclotron:    { name: 'Ripper Cyclotron!!!',    type: 'physical',    color: '#ef4444', secondaryColor: '#dc2626', duration: 2600, flavour: 'Each rotation multiplies power' },
  memory_bullet:       { name: 'Memory Bullet',          type: 'nen_aura',    color: '#cbd5e1', secondaryColor: '#94a3b8', duration: 2400 },

  // ── Generic ──────────────────────────────────────────────────────────────────
  physical_attacks:    { name: 'Physical Strike!',       type: 'physical',    color: '#f97316', duration: 1800 },
  taijutsu:            { name: 'Taijutsu!!!',            type: 'physical',    color: '#f97316', duration: 1800 },
  speed:               { name: 'Blinding Speed!',        type: 'physical',    color: '#e2e8f0', duration: 1800 },
  slashing:            { name: 'Slash!',                 type: 'sword',       color: '#e2e8f0', secondaryColor: '#f1f5f9', duration: 2000 },
  sword:               { name: 'Supreme Slash!',         type: 'sword',       color: '#e2e8f0', secondaryColor: '#bfdbfe', duration: 2200 },
  poison:              { name: 'Venom Cloud!',           type: 'poison',      color: '#4ade80', secondaryColor: '#86efac', duration: 2400 },
  sand:                { name: 'Sand Burial!',           type: 'elemental_sand', color: '#d97706', secondaryColor: '#f59e0b', duration: 2400, flavour: 'Absolute defence' },
  iron_sand:           { name: 'Iron Sand World Method!', type: 'elemental_sand', color: '#6b7280', secondaryColor: '#9ca3af', duration: 2600 },
  puppet_master:       { name: 'Puppet Army Deploy!',    type: 'puppet',      color: '#f97316', secondaryColor: '#dc2626', duration: 2600 },
  barrier_barrier_fruit: { name: 'Barrier!!',            type: 'barrier',     color: '#6ee7b7', secondaryColor: '#a7f3d0', duration: 2200, flavour: 'Absolute physical barrier' },
  flight:              { name: 'Flight!',                type: 'physical',    color: '#7dd3fc', duration: 1600 },
}

/** Fallback for completely unknown tags */
export const FALLBACK_TECHNIQUE: TechniqueAnim = {
  name: 'Full Power!!!',
  type: 'physical',
  color: '#f97316',
  duration: 2000,
}

/**
 * Pick the best technique animation for a character based on its power_tags.
 * Returns the first matching entry, preferring more iconic / visually rich ones.
 */
export function pickTechniqueFromTags(powerTags: string[]): import('@/types/animation').TechniqueAnim {
  // Priority order — check more iconic tags first
  const priority = [
    'ultra_instinct','gear_5','gear5','zero_hand','emperor_time','chain_jail','reaper_death_seal',
    'godspeed','bijuu_bomb','tailed_beast_mode','s2_final_art','rasenshuriken','mangekyou_sharingan',
    'amaterasu','tsukuyomi','paper_ninjutsu','explosion_release','shadow_possession','yami_yami',
    'spirit_bomb','kamehameha','final_flash','ultra_ego','super_saiyan_blue','super_saiyan_aura',
    'rising_sun','ripper_cyclotron','time_skip','neo_tri_beam','conqueror_haki','haki_conqueror',
    'lightning_armor','birdcage','string_string_fruit','venom_venom_fruit','love_love_fruit',
    'rumble_ball_monster_point','gear5','genjutsu','sharingan','byakugan','byakugan_360',
    'rasengan','magma_fist','ice_age','pika_pika_light','logia_intangibility',
    'gentle_fist','eight_trigrams_128_palms','shadow_stitching',
    'enhancement_nen','emission_nen','manipulation_nen','nen_aura','nen_user',
    'lightning_release','fire_release','wind_release','water_release','earth_release',
    'sand','iron_sand','puppet_master','barrier_barrier_fruit','memory_bullet',
    'kamehameha','ki','ki_blast','slashing','sword','poison','physical_attacks','taijutsu','speed',
  ]
  const tagSet = new Set(powerTags)
  for (const p of priority) {
    if (tagSet.has(p) && TAG_TO_TECHNIQUE[p]) return TAG_TO_TECHNIQUE[p]
  }
  // Last resort: iterate in order
  for (const t of powerTags) {
    if (TAG_TO_TECHNIQUE[t]) return TAG_TO_TECHNIQUE[t]
  }
  return FALLBACK_TECHNIQUE
}
