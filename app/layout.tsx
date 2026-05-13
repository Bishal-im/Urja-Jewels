import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/layout/CustomCursor'
import SmoothScrollProvider from '@/components/layout/SmoothScrollProvider'
import AnimatePresenceWrapper from '@/components/layout/AnimatePresenceWrapper'

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------

/**
 * Cormorant Garamond — editorial display typeface.
 * Exposed as --font-cormorant, consumed by --font-display in globals.css.
 */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

/**
 * Jost — clean geometric sans-serif for body copy and UI labels.
 * Exposed as --font-jost, consumed by --font-body in globals.css.
 */
const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
})

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Urja Jewels — Luxury Jewelry',
  description: 'Crafted for Eternity. Timeless luxury jewelry by Urja Jewels.',
}

// ---------------------------------------------------------------------------
// Root layout
// ---------------------------------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable}`}
    >
      <body>
        <SmoothScrollProvider>
          {/* Custom cursor — renders null on touch/coarse-pointer devices */}
          <CustomCursor />

          {/* Persistent navigation */}
          <Navbar />

          {/*
           * AnimatePresenceWrapper is a 'use client' component that wraps
           * children in AnimatePresence keyed by pathname, enabling page-exit
           * animations when navigating between routes.
           */}
          <main>
            <AnimatePresenceWrapper>
              {children}
            </AnimatePresenceWrapper>
          </main>

          {/* Persistent footer */}
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
