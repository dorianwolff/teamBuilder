import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey   = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

async function seedTags() {
  const tags = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'tags.json'), 'utf-8')
  )
  const { error } = await supabase.from('power_tags').upsert(tags, { onConflict: 'slug' })
  if (error) throw error
  console.log(`✅ Seeded ${tags.length} power tags`)
}

/** Strip trait columns from character objects (used when migration 006 hasn't run yet) */
function stripTraits(characters: Record<string, unknown>[]): Record<string, unknown>[] {
  return characters.map(({ traits, trait_weaknesses, trait_strengths, ...rest }) => rest)
}

let traitsMigrationMissing = false

async function seedCharacters(verse: string) {
  const filePath = path.join(__dirname, '..', 'data', 'characters', `${verse}.json`)
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  No data file for verse: ${verse}`)
    return
  }
  const characters = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

  // First try: upsert with full data (traits columns)
  const { error } = await supabase.from('characters').upsert(characters, { onConflict: 'slug' })

  if (!error) {
    console.log(`✅ Seeded ${characters.length} characters for ${verse} (with traits)`)
    return
  }

  // If the error is about missing trait columns, seed without them
  const isTraitColumnMissing = error.message?.includes('trait_')
  if (isTraitColumnMissing) {
    traitsMigrationMissing = true
    const { error: e2 } = await supabase
      .from('characters')
      .upsert(stripTraits(characters), { onConflict: 'slug' })
    if (e2) throw e2
    console.log(`✅ Seeded ${characters.length} characters for ${verse} (⚠️  without traits — run migration 006)`)
    return
  }

  throw error
}

async function main() {
  console.log('🌱 Starting database seed...\n')
  try {
    await seedTags()
    for (const verse of ['one_piece', 'naruto', 'dbz', 'hxh']) {
      await seedCharacters(verse)
    }

    if (traitsMigrationMissing) {
      console.log('\n⚠️  Migration 006 (traits columns) has not been applied.')
      console.log('   Run this SQL in the Supabase dashboard to unlock the traits system:')
      console.log('   👉 https://supabase.com/dashboard/project/gsbzrkxxbvpcforbstbb/sql/new\n')
      console.log("   ALTER TABLE characters")
      console.log("     ADD COLUMN IF NOT EXISTS traits           JSONB NOT NULL DEFAULT '[]'::JSONB,")
      console.log("     ADD COLUMN IF NOT EXISTS trait_weaknesses JSONB NOT NULL DEFAULT '[]'::JSONB,")
      console.log("     ADD COLUMN IF NOT EXISTS trait_strengths  JSONB NOT NULL DEFAULT '[]'::JSONB;\n")
      console.log('   Then re-run: npx tsx scripts/seed.ts')
    }

    console.log('\n🎉 Seed complete!')
  } catch (err) {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  }
}

main()
