'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'

const GAME_PATHS = ['/solo', '/battle', '/draft']

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isGame = GAME_PATHS.some(p => pathname.startsWith(p))
  return (
    <>
      {!isGame && <Navbar />}
      <main className={isGame ? 'min-h-screen' : 'pt-14 min-h-screen'}>
        {children}
      </main>
    </>
  )
}
