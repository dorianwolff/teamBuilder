# TeamBuilder

A multiplayer anime character draft & battle game. Two players draft characters from a hidden pool in alternating rounds, then battle head-to-head using a power system built on levels, martial ratios, elemental strengths, weaknesses, and hard overrides.

**Verses:** One Piece · Naruto · Dragon Ball Z/Super · Hunter x Hunter  
**75 characters** across 4 verses, each with precise float power levels and full tag/strength/weakness data.

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
- Combat resolves using:

```
effective_score = martial_component + power_component × power_modifier

where:
  martial_component = power_level × martial_ratio
  power_component   = power_level × (1 − martial_ratio)
  power_modifier    = reduced by opponent's strengths against your tags
                    + increased by opponent's weaknesses against your tags
```

Special hard overrides fire before the formula:
- **cannot_win_against** — always loses regardless of scores (e.g. Enel vs Luffy Skypiea)
- **draw_conditions** — always ends in a draw (e.g. Meruem + Komugi)

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

Copy-paste each file into the editor and click **Run**.

> **Note:** `000_bootstrap.sql` must run first. It contains the `SET search_path = public` fix required on newer Supabase projects — without it the auth trigger silently fails and signup returns HTTP 500.

### 5. Seed character data

```bash
npm run seed
```

Inserts all 75 characters and 50 power tags into the database.

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

Images go in `public/assets/characters/<verse>/<slug>.png`.
A placeholder is shown automatically for any missing image.

```
public/assets/characters/
├── one_piece/   luffy_gear5.png, gol_d_roger.png, shanks.png … (26 chars)
├── naruto/      naruto_six_paths.png, kaguya.png, madara_six_paths.png … (19 chars)
├── dbz/         whis.png, goku_mui.png, beerus.png … (15 chars)
└── hxh/         meruem_post_rose.png, gon_adult.png, killua_godspeed.png … (15 chars)
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
│   ├── encyclopedia/        # All 75 characters — locked until discovered in-game
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
│   ├── one_piece.json       # 26 characters
│   ├── naruto.json          # 19 characters
│   ├── dbz.json             # 15 characters
│   └── hxh.json             # 15 characters
└── tags.json                # 50 power tag definitions

scripts/
└── seed.ts                  # Upserts all characters + tags via service_role key

supabase/
└── migrations/
    ├── 000_bootstrap.sql    # Profiles table, auth trigger, RLS policies, grants
    ├── 001_initial_schema.sql
    └── 002_game_tables.sql  # game_rooms, matchmaking_queue, Realtime publication
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
