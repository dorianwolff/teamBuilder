'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-white/70">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl text-sm text-white',
          'bg-void-800 border transition-colors',
          'placeholder:text-white/30',
          'focus:outline-none focus:ring-2 focus:ring-gold-500/40',
          error
            ? 'border-crimson-500/60 focus:border-crimson-400'
            : 'border-white/10 focus:border-gold-500/40',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-crimson-400">{error}</p>}
      {hint && !error && <p className="text-xs text-white/40">{hint}</p>}
    </div>
  )
})

Input.displayName = 'Input'
