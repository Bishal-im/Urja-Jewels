'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV_ITEMS, SITE_NAME } from '@/lib/constants'

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Scroll listener — flip `scrolled` at scrollY > 80
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Run once on mount to set initial state
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                               */}
      {/* ------------------------------------------------------------------ */}
      <header
        className={[
          'fixed top-0 left-0 w-full z-50 transition-all duration-300',
          scrolled
            ? 'bg-obsidian/95 backdrop-blur-sm'
            : 'bg-transparent',
        ].join(' ')}
      >
        <div className="flex items-center justify-between px-8 py-4">
          {/* Left — brand name */}
          <Link
            href="/"
            className="font-display text-xl text-ivory tracking-widest uppercase hover:text-gold transition-colors duration-200"
            aria-label={`${SITE_NAME} — home`}
          >
            {SITE_NAME}
          </Link>

          {/* Centre — desktop nav links */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Primary navigation"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'font-body text-sm uppercase tracking-widest transition-colors duration-200',
                    isActive
                      ? 'text-gold underline underline-offset-4'
                      : 'text-fog hover:text-ivory',
                  ].join(' ')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right — cart icon + hamburger */}
          <div className="flex items-center gap-4">
            {/* Cart icon */}
            <button
              className="text-fog hover:text-ivory transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
              aria-label="Open cart"
            >
              <CartIcon />
            </button>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden text-fog hover:text-ivory transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile drawer                                                        */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-obsidian/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.nav
              id="mobile-drawer"
              key="drawer"
              className="fixed top-0 left-0 h-full w-72 bg-obsidian z-50 flex flex-col px-8 py-10 md:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Mobile navigation"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between mb-12">
                <Link
                  href="/"
                  className="font-display text-xl text-ivory tracking-widest uppercase"
                  onClick={() => setMobileOpen(false)}
                >
                  {SITE_NAME}
                </Link>

                {/* Close button */}
                <button
                  className="text-fog hover:text-ivory transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Stacked nav links */}
              <ul className="flex flex-col gap-6">
                {NAV_ITEMS.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.07, duration: 0.35, ease: 'easeOut' }}
                    >
                      <Link
                        href={item.href}
                        className={[
                          'font-body text-base uppercase tracking-widest transition-colors duration-200',
                          isActive
                            ? 'text-gold underline underline-offset-4'
                            : 'text-fog hover:text-ivory',
                        ].join(' ')}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ---------------------------------------------------------------------------
// Icon sub-components
// ---------------------------------------------------------------------------

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? (
        // X shape when open
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        // 3-line hamburger
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
