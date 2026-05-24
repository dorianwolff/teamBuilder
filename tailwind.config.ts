import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core dark palette
        void: {
          950: '#04050a',
          900: '#080c14',
          800: '#0d1220',
          700: '#121828',
        },
        // Gold accent
        gold: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        // Crimson accent
        crimson: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        // Verse colors
        verse: {
          'one-piece': '#f97316',  // orange
          naruto:      '#f59e0b',  // amber
          dbz:         '#a78bfa',  // purple
          hxh:         '#34d399',  // emerald
        },
        // Tag colors
        tag: {
          fire:       '#ef4444',
          water:      '#3b82f6',
          lightning:  '#eab308',
          wind:       '#22c55e',
          earth:      '#a16207',
          ice:        '#67e8f9',
          dark:       '#7c3aed',
          light:      '#fef08a',
          love:       '#ec4899',
          default:    '#6b7280',
        },
      },
      fontFamily: {
        sans:    ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'pulse-gold':    'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'float':         'float 3s ease-in-out infinite',
        'slide-up':      'slideUp 0.4s ease-out',
        'fade-in':       'fadeIn 0.3s ease-out',
        'glow-pulse':    'glowPulse 2s ease-in-out infinite',
        'card-reveal':   'cardReveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'battle-flash':  'battleFlash 0.5s ease-in-out',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(251, 191, 36, 0.4)' },
          '50%':       { boxShadow: '0 0 0 8px rgba(251, 191, 36, 0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%':      { filter: 'brightness(1.15)' },
        },
        cardReveal: {
          from: { opacity: '0', transform: 'scale(0.85) rotateY(-10deg)' },
          to:   { opacity: '1', transform: 'scale(1) rotateY(0deg)' },
        },
        battleFlash: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.3' },
        },
      },
      backgroundImage: {
        'gradient-radial':      'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':       'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shimmer-gradient':     'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
        'gold-shimmer':         'linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.15) 50%, transparent 100%)',
        'void-gradient':        'linear-gradient(135deg, #04050a 0%, #0d1220 100%)',
        'card-gradient':        'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
      },
      boxShadow: {
        'gold-glow':    '0 0 20px rgba(251, 191, 36, 0.3), 0 0 60px rgba(251, 191, 36, 0.1)',
        'crimson-glow': '0 0 20px rgba(239, 68, 68, 0.3), 0 0 60px rgba(239, 68, 68, 0.1)',
        'card':         '0 4px 24px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.3)',
        'card-hover':   '0 8px 40px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.4)',
        'inner-glow':   'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      },
    },
  },
  plugins: [],
}

export default config
