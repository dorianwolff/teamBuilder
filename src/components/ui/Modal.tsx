'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ModalProps {
  open: boolean
  onClose?: () => void
  title?: string
  children: React.ReactNode
  className?: string
  closeable?: boolean
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  closeable = true,
}: ModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeable && onClose) onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, closeable, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeable ? onClose : undefined}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={cn(
              'relative w-full max-w-md bg-void-800 border border-white/10',
              'rounded-2xl shadow-card p-6',
              className,
            )}
          >
            {(title || closeable) && (
              <div className="flex items-center justify-between mb-4">
                {title && (
                  <h2 className="text-lg font-semibold text-white">{title}</h2>
                )}
                {closeable && onClose && (
                  <button
                    onClick={onClose}
                    className="ml-auto p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
