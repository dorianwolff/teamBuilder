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

async function seedCharacters(verse: string) {
  const filePath = path.join(__dirname, '..', 'data', 'characters', `${verse}.json`)
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  No data file for verse: ${verse}`)
    return
  }
  const characters = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  const { error } = await supabase.from('characters').upsert(characters, { onConflict: 'slug' })
  if (error) throw error
  console.log(`✅ Seeded ${characters.length} characters for ${verse}`)
}

async function main() {
  console.log('🌱 Starting database seed...\n')
  try {
    await seedTags()
    for (const verse of ['one_piece', 'naruto', 'dbz', 'hxh']) {
      await seedCharacters(verse)
    }
    console.log('\n🎉 Seed complete!')
  } catch (err) {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  }
}

main()
