# TeamBuilder

A multiplayer anime character draft & battle game. Two players draft characters from a hidden pool in alternating rounds, then battle head-to-head using a power system built on levels, martial ratios, keyword/technique tags, trait interactions, and hard canonical overrides.

**Verses:** One Piece · Naruto · Dragon Ball Z/Super · Hunter x Hunter  
**138 characters** across 4 verses, each with precise float power levels, full tag/strength/weakness data, and trait metadata.

---

## How it works

### Draft phase (5 rounds)
- A pool of 10 cards is dealt — 5 revealed, 5 face-down (masked).
- Players alternate picks. Each pick is a **pair**: you choose one slot, your opponent automatically gets the other.
- Round 5 pick order goes to whoever has the lower current power sum — a catch-up mechanic.
- After 5 rounds each player holds exactly 5 characters.

### Battle phase (best-of-5)
- Both players **simultaneously** select one character per round — no take-backs.
- A 20-second timer forces a decision.
- Combat resolves through a multi-layer formula (see details below).

---

## Battle formula

### Layer 1 — Hard canonical overrides (checked first)

Before any maths, two override tables are consulted:

| Field | Effect | Example |
|---|---|---|
| `cannot_win_against` | Character always loses regardless of score | Enel loses to Luffy Skypiea (rubber = immune to lightning) |
| `draw_conditions` | Match always ends as draw | Meruem vs Komugi — he cannot bring himself to fight her |

If both characters list each other in `cannot_win_against`, the result is a draw.

---

### Layer 2 — Base score formula

```
effective_score = martial_component + power_component × power_modifier

  martial_component = power_level × martial_ratio
  power_component   = power_level × (1 − martial_ratio)
```

`martial_ratio` controls what fraction of a character's power is raw physical ability (speed, technique, endurance) vs supernatural/elemental/Nen/Ki output.

| `martial_ratio` | Meaning | Examples |
|---|---|---|
| 0.9–1.0 | Almost purely physical fighter | Rock Lee, Garp, Neji |
| 0.6–0.8 | Mixed martial + power | Luffy Gear 5, Goku SSB |
| 0.2–0.4 | Primarily ability-based | Deidara, Shikamaru, Enel |
| 0.05–0.15 | Nearly pure power/technique | Kaguya, Whis |

---

### Layer 3 — Keyword / technique tags

Every character has a `power_tags` array — their signature techniques and ability types. Every character also carries `strengths` (defences) and `weaknesses` (vulnerabilities) keyed to those same tags.

**`strengths`** — resistances. When your opponent's `power_tags` contain a tag you're strong against, their `power_component` is reduced by that `coefficient` (clamped to 0).

**`weaknesses`** — vulnerabilities. When your opponent's `power_tags` contain a tag you're weak to, their effective `power_modifier` gains a bonus equal to that `coefficient`.

```
power_modifier for B against A:
  starts at 1.0
  − sum of A's strength.coefficient  for each of B's matching power_tags
  + sum of A's weakness.coefficient  for each of B's matching power_tags
  (clamped to 0 — cannot go negative)
```

**Common tag categories:**

| Category | Tags in use |
|---|---|
| **Elements / release** | `fire_release`, `lightning_release`, `water`, `wind`, `ice`, `light_manipulation` |
| **Attack types** | `physical_attacks`, `slashing`, `taijutsu`, `long_range`, `close_range` |
| **Special damage** | `poison`, `chakra`, `ki`, `haki_armament`, `conqueror_haki` |
| **Logia / intangibility** | `logia_intangibility` — physical strikes pass through |
| **Detection / vision** | `detection`, `byakugan`, `byakugan_360`, `observation_haki` |
| **Mobility** | `speed`, `teleportation`, `flight` |
| **Signature techniques** | `shadow_possession`, `gentle_fist`, `gear_5`, `rasenshuriken`, `time_skip`, … |
| **Resistances** | `stamina_drain`, `single_heart_damage`, `multiple_targets` |

> **Design principle:** tags are match-ups, not stats. A 200K Shikamaru with `shadow_possession` can still lock down a 3M character who has `reckless_combatant` weakness — the formula reflects this.

---

### Layer 4 — Trait modifiers (applied last)

After the keyword formula, a multiplicative trait modifier is applied to each character's effective score.

```
final_score_A = effective_score_A × trait_modifier_A
trait_modifier_A = 1.0
  − Σ trait_weakness.coefficient  for each trait of B that A lists as a weakness
  + Σ trait_strength.coefficient  for each trait of B that A lists as a strength
  (clamped to 0)
```

**Traits** are persistent identity markers on a character — species, faction, state, code of honour:

| Trait | Who has it | How it's used |
|---|---|---|
| `phantom_troupe` | Chrollo, Feitan, Kalluto, Uvogin, Machi, Nobunaga, Phinks, Bonolenov, Kortopi, Shalnark, Franklin, Pakunoda | Kurapika +60% offense vs all 12 Troupe members |
| `akatsuki` | Deidara, Sasori, Konan, Kakuzu, Hidan, Kisame | Group identity — potential future interactions |
| `logia` | Akainu, Aokiji, Kizaru, Ace, Crocodile, Enel, Smoker | Blackbeard +50% offense (darkness nullifies intangibility) |
| `devil_fruit_user` | All DF users (One Piece) | Blackbeard +20% additional offense; Magellan's poison immunity fully countered |
| `undead_edo_tensei` | Madara, Hashirama, Minato, Itachi, Tobirama | Tenten −50% offense (weapons useless against regenerating undead) |
| `female` | Female characters | Sanji −70% offense (code of honour — cannot attack women) |
| `immortal_jashin` | Hidan | Physical attacks, slashing, blunt force largely ineffective |
| `non_combatant` | Komugi, Bulma, Vegapunk, Shenron | Meruem +50% offense vs Komugi; universal predator advantage |
| `puppet_body` | Sasori | Fire-based opponents get +35% trait offensive bonus |
| `beautiful` | Konan, Hinata, Android 18, Boa Hancock, Vinsmoke Reiju, Pakunoda | Boa Hancock +25% offense vs `male` trait |
| `no_ki_signature` | Android 17, Android 18 | Ki-sensing characters cannot read their power level |
| `male` | Most male characters | Boa Hancock +25% offense; Sanji −70% offense absent |
| `warlord` | Boa Hancock, Doflamingo, Crocodile, Magellan (ally) | Identity trait — former Marine-allied pirates |
| `genetically_enhanced` | Vinsmoke Ichiji/Niji/Reiju/Yonji | Exoskeleton resists physical damage; `armament_haki` weakness |

> **Difference from keywords:** keywords describe *techniques* — what a character does in a fight. Traits describe *what a character is* — which is why Sanji's Ifrit Jambe is among his most powerful techniques, but his `code_of_honor` trait still halves his offense against female opponents regardless.

---

### Power scale reference

| Score | Tier |
|---|---|
| 500 | Helpless non-combatant (Komugi) |
| 1,000 | Average fit adult |
| 5,000 | World's peak normal human, no supernatural ability (Mr. Satan) |
| 5,000 + | Superhuman — measurably beyond human limits |
| 100,000 | Strong ninja/pirate mid-tier (Tenten, Rock Lee base) |
| 1,000,000 | Kage / Yonko commander / Royal Guard class |
| 5,000,000 + | Kage/Yonko level, Netero, full-prep Chrollo |
| 8,000,000 + | Absolute top tier — Roger, Shanks, Beerus, Meruem |
| 9,000,000 + | Transcendent — Whis, Kaguya, Goku MUI |

> Power levels use intentional floats (e.g. `3,147,293.664`) to eliminate ties in most matchups, making the keyword layer the primary differentiator rather than raw score alone.

---

### Reading a modifier list

Each resolved battle returns a `modifiers` array for the UI to display. Each entry has:

```ts
{
  source: 'strength' | 'weakness' | 'cannot_win' | 'draw'
  tag?: string          // the power_tag or trait involved
  description: string   // human-readable explanation
  score_delta_a: number // how this modifier shifted A's effective score
  score_delta_b: number // how this modifier shifted B's effective score
}
```

Example — **Kurapika vs Nobunaga (Phantom Troupe swordsman)**:
1. `strength: phantom_troupe` → Kurapika +60% offense (trait_strength)
2. `weakness: long_range` → Nobunaga loses 50% of his power_modifier (can't close range)
3. Kurapika wins by a wide margin despite lower raw power_level

Example — **Sanji Ifrit Jambe vs Konan**:
1. `weakness: female` → Sanji trait_modifier −70% (cannot attack women)
2. Konan wins despite lower power_level — Sanji's offense is basically nullified

### Solo mode
Play a full draft + battle against the AI — no opponent needed. Three difficulty levels:
- **Easy** — random picks
- **Normal** — highest power level drafting, greedy battle picks
- **Hard** — evaluates all possible matchups to choose the best character each round

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Database + Auth | Supabase (PostgreSQL + Realtime) |
| State | Zustand |
| Animations | Framer Motion |
| Icons | Lucide React |
| Toasts | react-hot-toast |
| Room codes | nanoid |

---

## Local setup

### 1. Clone and install

```bash
git clone https://github.com/your-username/teambuilder.git
cd teambuilder
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Copy your **Project URL** and **anon key** from **Settings → API**
3. Copy the **service_role key** (used only for the seed script — never expose this client-side)

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run database migrations

In your Supabase dashboard → **SQL Editor**, run these files **in order**:

1. `supabase/migrations/000_bootstrap.sql`
2. `supabase/migrations/001_initial_schema.sql`
3. `supabase/migrations/002_game_tables.sql`
4. `supabase/migrations/006_traits.sql`

Copy-paste each file into the editor and click **Run**.

> **Note:** `000_bootstrap.sql` must run first. It contains the `SET search_path = public` fix required on newer Supabase projects — without it the auth trigger silently fails and signup returns HTTP 500.

> **Note:** `006_traits.sql` adds the `traits`, `trait_weaknesses`, and `trait_strengths` JSONB columns. The seed script will still run without it (stripping trait data automatically), but trait interactions won't work until this migration is applied.

### 5. Seed character data

```bash
npm run seed
```

Upserts all 138 characters and 49 power tags into the database.

> The seed script automatically detects whether migration `006_traits.sql` has been applied. If not, it seeds characters without trait data and prints the SQL you need to run. Re-run `npm run seed` after applying the migration.

### 6. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Supabase URL configuration

**Supabase → Authentication → URL Configuration:**

| Field | Value |
|---|---|
| Site URL | `http://localhost:3000` |
| Redirect URLs | `http://localhost:3000/**` |

Add your production URL to Redirect URLs once deployed (e.g. `https://your-app.vercel.app/**`).

---

## OAuth (Google / Microsoft)

Login and register support social sign-in. After OAuth the user lands on `/auth/username` to set a display name.

### Google
1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
2. Authorized redirect URI: `https://YOUR_REF.supabase.co/auth/v1/callback`
3. Paste the Client ID and Secret into **Supabase → Authentication → Providers → Google**

### Microsoft (Azure)
1. [Azure Portal](https://portal.azure.com) → **App registrations → New registration**
2. Redirect URI: `https://YOUR_REF.supabase.co/auth/v1/callback`
3. Create a client secret under **Certificates & secrets**
4. Paste the Application (client) ID and secret into **Supabase → Authentication → Providers → Azure**
5. Leave the **Azure Tenant URL** field blank (supports all Microsoft accounts)

---

## Deployment

> GitHub Pages cannot host this app — it requires a Node.js server for API routes, middleware, and server components. Use **Vercel** instead (free for personal projects, deploys automatically from GitHub).

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Add the same environment variables from `.env.local` in Vercel's project settings
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel URL
5. In **Supabase → Authentication → URL Configuration**:
   - Update Site URL to your Vercel URL
   - Add `https://your-app.vercel.app/**` to Redirect URLs

---

## Adding character images

Images go in `public/assets/characters/<verse>/<slug>.jpg`.  
A placeholder is shown automatically for any missing image.

### Full image file list

**`public/assets/characters/one_piece/`** (47 files)
```
ace_marineford.jpg         akainu.jpg                 aokiji.jpg
arlong.jpg                 bartolomeo_barrier.jpg     bellamy_spring.jpg
big_mom.jpg                blackbeard.jpg             boa_hancock.jpg
bonney_distorted_future.jpg brook_soul_king.jpg       buggy.jpg
chopper_monster_point.jpg  coby_post_timeskip.jpg     crocodile_desert.jpg
doflamingo.jpg             enel.jpg                   franky_cyborg.jpg
garp_marineford.jpg        gold_d_roger.jpg           jinbe.jpg
kaido_hybrid.jpg           kid_awakened.jpg           kizaru.jpg
law_awakened.jpg           luffy_gear5.jpg            luffy_skypiea.jpg
luffy_snakeman.jpg         magellan.jpg               marco.jpg
mihawk.jpg                 monkey_d_dragon.jpg        nami_clima_tact.jpg
rayleigh.jpg               robin_post_timeskip.jpg    sanji_ifrit_jambe.jpg
shanks.jpg                 shiryu_rain.jpg            smoker.jpg
usopp_god.jpg              vegapunk.jpg               vinsmoke_ichiji.jpg
vinsmoke_niji.jpg          vinsmoke_reiju.jpg         vinsmoke_yonji.jpg
whitebeard_peak.jpg        zoro_post_wano.jpg
```

**`public/assets/characters/naruto/`** (35 files)
```
choji_butterfly_mode.jpg   deidara_akatsuki.jpg       gaara_kazekage.jpg
guy_eight_gates.jpg        hashirama_sage_mode.jpg    hidan_akatsuki.jpg
hinata_twin_lion_fists.jpg hiruzen_sarutobi.jpg       itachi.jpg
jiraiya_sage_mode.jpg      kabuto_snake_sage.jpg      kaguya.jpg
kakashi_dual_sharingan.jpg kakuzu_akatsuki.jpg        kankuro_puppet.jpg
killer_b.jpg               kisame_hoshigaki.jpg       konan_akatsuki.jpg
madara_six_paths.jpg       minato_kcm2.jpg            nagato_pain.jpg
naruto_six_paths.jpg       neji_byakugan.jpg          obito_ten_tails.jpg
orochimaru.jpg             raikage_a.jpg              rock_lee_fifth_gate.jpg
sakura_post_war.jpg        sasori_akatsuki.jpg        sasuke_rinnegan.jpg
shikamaru_shadow.jpg       temari.jpg                 tenten.jpg
tobirama_senju.jpg         tsunade.jpg
```

**`public/assets/characters/dbz/`** (27 files)
```
android_17_top.jpg         android_18_super.jpg       beerus.jpg
broly_dbs.jpg              bulma.jpg                  cell_perfect.jpg
frieza_black.jpg           frieza_golden.jpg          future_trunks_rage.jpg
gohan_beast.jpg            goku_mui.jpg               goku_ssb.jpg
hit_universe6.jpg          jiren.jpg                  krillin_super.jpg
majin_buu_pure.jpg         master_roshi.jpg           mr_satan.jpg
piccolo_orange.jpg         shenron.jpg                tao_pai_pai.jpg
tien_shinhan.jpg           vegeta_ssb_evolved.jpg     vegeta_ultra_ego.jpg
videl.jpg                  whis.jpg                   yamcha.jpg
```

**`public/assets/characters/hxh/`** (28 files)
```
bonolenov.jpg              chrollo_full_prep.jpg      feitan_rising_sun.jpg
franklin.jpg               ging_freecss.jpg           gon_adult.jpg
hisoka.jpg                 illumi.jpg                 kalluto_zoldyck.jpg
killua_godspeed.jpg        kite_crazy_slots.jpg       knov.jpg
komugi.jpg                 kortopi.jpg                kurapika_emperor_time.jpg
leorio.jpg                 machi_komacine.jpg         meruem_post_rose.jpg
morel.jpg                  neferpitou.jpg             netero.jpg
nobunaga_hazama.jpg        pakunoda.jpg               phinks.jpg
shalnark.jpg               silva_zoldyck.jpg          uvogin.jpg
zeno_zoldyck.jpg
```

---

## ELO system

Starting ELO: **1000**

| ELO | Unlocks |
|---|---|
| 0 (default) | One Piece + Naruto |
| 1200 | Dragon Ball |
| 1400 | Hunter x Hunter |
| 1600 | All Verses (cross-verse drafts) |

K-factors: **40** for first 30 games · **20** standard · **10** at ≥ 1800 ELO

---

## Project structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/           # Email/password + Google + Microsoft
│   │   └── register/        # Create account
│   ├── auth/
│   │   ├── callback/        # OAuth redirect handler (route.ts)
│   │   └── username/        # Username selection after OAuth
│   ├── (game)/
│   │   ├── lobby/           # Mode selection, verse picker, matchmaking
│   │   ├── solo/            # Full draft + battle vs AI (client-side only)
│   │   ├── draft/[roomId]/  # 5-round draft (multiplayer, Realtime)
│   │   └── battle/[roomId]/ # Best-of-5 battle (multiplayer, Realtime)
│   ├── encyclopedia/        # All 138 characters — locked until discovered in-game
│   └── page.tsx             # Landing page
├── components/
│   ├── game/
│   │   ├── PlayingCard.tsx      # Poker-format card (sm / md / lg)
│   │   ├── CardHand.tsx         # Fan/arc layout for a player's hand
│   │   ├── CharacterCard.tsx    # Legacy card used in draft + battle views
│   │   ├── MaskedCharacterCard.tsx
│   │   └── PowerTag.tsx         # Colour-coded ability type badges
│   ├── layout/
│   │   └── Navbar.tsx
│   ├── providers/
│   │   └── AuthProvider.tsx     # Single global auth init — session persists across pages
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Timer.tsx
├── hooks/
│   ├── useAuth.ts           # Zustand auth store selector
│   ├── useGameRoom.ts       # Room fetch + Realtime subscription
│   └── useTimer.ts          # Countdown with 250 ms tick
├── lib/
│   ├── game/
│   │   ├── battle.ts        # Full combat resolution formula
│   │   ├── draft.ts         # Draft order, pair picking, masked visibility
│   │   ├── elo.ts           # K-factor ELO (provisional / standard / high)
│   │   └── ai.ts            # AI draft + battle strategy (easy / normal / hard)
│   ├── supabase/
│   │   ├── client.ts        # Browser Supabase client
│   │   └── server.ts        # Server Supabase client (RSC / route handlers)
│   └── utils/
│       ├── cn.ts            # Tailwind class merge
│       └── format.ts        # Power level, ELO, delta formatters
├── store/
│   ├── authStore.ts         # Zustand: user, profile, loading
│   └── gameStore.ts         # Zustand: room, draftState, battleState
└── types/
    ├── character.ts         # Verse, PowerTag, StrengthEntry, Character …
    ├── database.ts          # Supabase table interface
    ├── game.ts              # DraftState, BattleState, GameRoom, VERSE_UNLOCK_ELO
    └── user.ts              # UserProfile, EloTier helpers

data/
├── characters/
│   ├── one_piece.json       # 47 characters
│   ├── naruto.json          # 35 characters
│   ├── dbz.json             # 27 characters
│   └── hxh.json             # 28 characters  (12 Phantom Troupe members)
└── tags.json                # 49 power tag definitions

scripts/
└── seed.ts                  # Upserts all characters + tags via service_role key
                             # Auto-detects missing trait columns, seeds gracefully

supabase/
└── migrations/
    ├── 000_bootstrap.sql    # Profiles table, auth trigger, RLS policies, grants
    ├── 001_initial_schema.sql
    ├── 002_game_tables.sql  # game_rooms, matchmaking_queue, Realtime publication
    └── 006_traits.sql       # Adds traits / trait_weaknesses / trait_strengths JSONB columns
```

---

## Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build locally |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript check (no emit) |
| `npm run seed` | Seed characters and tags into Supabase |
