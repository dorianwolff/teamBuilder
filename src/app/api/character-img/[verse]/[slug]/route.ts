import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

const EXTENSIONS = ['.webp', '.jpg', '.jpeg', '.png'] as const

const MIME: Record<string, string> = {
  '.webp':  'image/webp',
  '.jpg':   'image/jpeg',
  '.jpeg':  'image/jpeg',
  '.png':   'image/png',
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ verse: string; slug: string }> },
) {
  const { verse, slug } = await params

  // Sanitize: only allow alphanumeric + underscore (no path traversal)
  if (!/^[a-z0-9_]+$/.test(verse) || !/^[a-z0-9_]+$/.test(slug)) {
    return new NextResponse(null, { status: 400 })
  }

  const base = path.join(process.cwd(), 'public', 'assets', 'characters', verse, slug)

  for (const ext of EXTENSIONS) {
    try {
      const data = await readFile(base + ext)
      return new NextResponse(data, {
        headers: {
          'Content-Type': MIME[ext],
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        },
      })
    } catch {
      // file not found — try next extension
    }
  }

  // Fall back to placeholder — served with a short TTL so missing images auto-resolve once added
  try {
    const placeholder = await readFile(
      path.join(process.cwd(), 'public', 'assets', 'placeholder_character.png'),
    )
    return new NextResponse(placeholder, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch {
    return new NextResponse(null, { status: 404 })
  }
}
