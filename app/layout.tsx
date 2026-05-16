import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/layout/CustomCursor'
import SmoothScrollProvider from '@/components/layout/SmoothScrollProvider'
import AnimatePresenceWrapper from '@/components/layout/AnimatePresenceWrapper'
import { headers } from 'next/headers'

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isAdmin = pathname.startsWith('/admin')

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable}`}
    >
      <body>
        <SmoothScrollProvider>
          <CustomCursor />

          {/* Hide Navbar on admin routes */}
          {!isAdmin && <Navbar />}

          <main>
            <AnimatePresenceWrapper>
              {children}
            </AnimatePresenceWrapper>
          </main>

          {/* Hide Footer on admin routes */}
          {!isAdmin && <Footer />}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
