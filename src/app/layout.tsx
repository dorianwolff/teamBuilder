import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Navbar } from '@/components/layout/Navbar'
import { AuthProvider } from '@/components/providers/AuthProvider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'TeamBuilder — Anime Draft & Battle',
  description: 'Draft anime characters, outwit your opponent, and prove who reigns supreme.',
  openGraph: {
    title: 'TeamBuilder',
    description: 'Anime character draft & battle game',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-void-950 text-white`}>
        <AuthProvider>
          <Navbar />
          <main className="pt-14 min-h-screen">
            {children}
          </main>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#0d1220',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.08)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
