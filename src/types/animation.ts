// ─────────────────────────────────────────────────────────────────────────────
// Animation system types
// Each battle plays a pre-result animation sequence derived from the two
// characters' power_tags and verse identity.
// ─────────────────────────────────────────────────────────────────────────────

/** Visual category — drives which component renders */
export type AnimationType =
  | 'ki_aura'        // DBZ energy explosions (SSJ gold, SSB blue, UI white)
  | 'ki_beam'        // Kamehameha / Galick Gun directional beam
  | 'sharingan'      // Spinning Sharingan + genjutsu distortion
  | 'genjutsu'       // Generic genjutsu / illusion trap (Itachi, Kurenai…)
  | 'byakugan'       // Byakugan veins + chakra network scan
  | 'rasengan'       // Spiraling chakra sphere → rasenshuriken
  | 'bijuu'          // Tailed-beast chakra cloak / Bijuu Bomb
  | 'shadow'         // Shadow possession spreading across the ground
  | 'nen_aura'       // HxH Nen aura explosion
  | 'chain_jail'     // Kurapika's nen chains
  | 'haki_burst'     // Conqueror's Haki black-lightning shockwave
  | 'logia'          // Body transforms into element (magma / ice / light)
  | 'gear5'          // Luffy's Gear 5 rubber awakening
  | 'elemental_fire'
  | 'elemental_lightning'
  | 'elemental_wind'
  | 'elemental_water'
  | 'elemental_ice'
  | 'elemental_sand'
  | 'darkness'       // Blackbeard / Yami Yami void
  | 'paper'          // Konan's paper wings + bomb detonation
  | 'explosion'      // Deidara clay explosion
  | 'string'         // Doflamingo string web
  | 'time_stop'      // Hit's Time Skip (world freezes briefly)
  | 'puppet'         // Sasori / Kankuro puppet deploy
  | 'barrier'        // Bartolomeo barrier shell
  | 'physical'       // Generic high-speed physical strike
  | 'sword'          // Slash effect (Mihawk, Zoro, Trunks)
  | 'poison'         // Magellan / Sasori venom cloud
  | 'sand'           // Gaara's sand manipulation
  | 'divine'         // Kaguya, Shenron, divine-tier power
  | 'chidori'        // Lightning palm — 1000 birds (Kakashi / Sasuke / Raikage)
  | 'kamui'          // Dimensional vortex — Obito / Kakashi Mangekyo
  | 'eight_gates'    // Gate of Death / inner-gate aura burst (Guy / Rock Lee)
  | 'gentle_fist'    // Byakugan chakra network + 64-palm strikes (Hyuga clan)
  // ── One Piece-specific ─────────────────────────────────────────────────────
  | 'conquerors_haki'  // CoC — black lightning shatters the sky (Shanks, Roger, Kaido…)
  | 'asura'            // Zoro's demon-king manifestation — three heads, nine blades
  | 'diable_jambe'     // Sanji's infernal spinning fire kick (Ifrit Jambe blue-white)
  | 'gura_gura'        // Whitebeard's reality-cracking earthquake shockwave
  | 'light_speed'      // Kizaru's Pika Pika no Mi — blinding laser orbs at the speed of light
  // ── HxH-specific ──────────────────────────────────────────────────────────
  | 'adult_gon'        // Forbidden all-in: ink-black aura, ghost eyes, ground-shattering palm
  | 'godspeed'         // Killua's Narukami — lightning body, six dodge-afterimages, bolt from sky
  | 'zero_hand'        // Netero's final prayer — spectrum beam cycling red→white, then void
  | 'bungee_gum'       // Hisoka's elastic trap — pink strands, flying cards, theatrical snap
  | 'skill_hunter'     // Chrollo's grimoire — six stolen auras layer simultaneously
  | 'emperor_time'     // Kurapika: crimson eyes flood the screen, chains everywhere, Chain Jail
  | 'rising_sun'       // Feitan's Pain Packer — darkness → ascending ball → solar corona ignites
  | 'terpsichora'      // Neferpitou puppet mode — cat ears, marionette strings, impossible angles
  | 'royal_photon'     // Meruem post-Rose — dark pressure + directional blast + gold photon motes
  // ── DBZ-specific ──────────────────────────────────────────────────────────
  | 'ultra_instinct'   // MUI Goku — silver aura vanishes, perfect calm, afterimage dodges
  | 'ultra_ego'        // Vegeta destroyer — dark purple, cracks → swells stronger, demonic
  | 'hakai'            // Beerus — violet atom-orb slow erasure, target dissolves to purple dust
  | 'legendary_saiyan' // Broly LSSJ — chaotic green → gold, blank eyes, atmospheric violence
  | 'beast_mode'       // Gohan Beast — upward magenta geyser, blue-white outer, crimson eyes
  | 'spirit_sword'     // Trunks Rage — dual gold+blue aura, hope gathered, enormous white blade
  // ── Additional character-specific ─────────────────────────────────────────
  | 'power_impact'     // Jiren — compressed will-sphere, oval shockwave rings, gold will-arcs
  | 'solar_kamehameha' // Cell Perfect — wide green-gold planetary-scale beam, solar flares
  | 'black_frieza'     // Frieza Black — contracting dark void aura, instant Death Beam erasure
  | 'candy_beam'       // Majin Buu Pure — bubbly pink innocence, wavy beam, cheerful dissolution
  | 'needle_control'   // Illumi — silver needle rain, cold threads, puppet-jerk manipulation
  | 'big_bang_impact'  // Uvogin — pure Enhancement: copper-red fist crater, shockwave
  | 'nen_copy'         // Ging — neutral white mirror: receives technique, amplifies and returns
  // ── One Piece-specific (additional) ───────────────────────────────────────
  | 'mero_mero'        // Hancock — drawn SVG hearts fly, pink beam, stone-grey petrification wave

/** A single technique that can be shown in the pre-battle animation */
export interface TechniqueAnim {
  /** Display name shown on screen e.g. "Kamehameha!!!" */
  name: string
  /** Visual category */
  type: AnimationType
  /** CSS color (hex / tailwind arbitrary) for glow / particles */
  color: string
  /** Optional second color for bi-color effects */
  secondaryColor?: string
  /** How long this technique's animation plays (ms) */
  duration: number
  /** Flavour text that appears below the technique name */
  flavour?: string
}

/** Per-character animation profile */
export interface CharacterAnimProfile {
  slug: string
  /** Aura color shown during entrance */
  auraColor: string
  /** 1-3 techniques; the system picks the first one for the pre-battle sequence */
  techniques: TechniqueAnim[]
}

/** State managed by the BattleAnimationSequence component */
export type AnimationPhase =
  | 'idle'
  | 'entrance_a'
  | 'technique_a'
  | 'entrance_b'
  | 'technique_b'
  | 'clash'
  | 'done'
