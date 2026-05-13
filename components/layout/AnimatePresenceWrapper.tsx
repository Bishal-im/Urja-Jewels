'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'

interface AnimatePresenceWrapperProps {
  children: React.ReactNode
}

/**
 * Client wrapper that provides AnimatePresence keyed by the current pathname,
 * enabling page-exit animations when navigating between routes.
 *
 * Must be a separate 'use client' component because app/layout.tsx is a
 * Server Component and AnimatePresence requires client-side rendering.
 */
export default function AnimatePresenceWrapper({ children }: AnimatePresenceWrapperProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" key={pathname}>
      {children}
    </AnimatePresence>
  )
}
