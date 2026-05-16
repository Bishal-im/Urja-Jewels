'use client'

import { useState, useCallback } from 'react'
import PageTransition from '@/components/layout/PageTransition'
import LoadingScreen from '@/components/ui/LoadingScreen'
import HeroCanvas from '@/components/home/HeroCanvas'
import MarqueeTicker from '@/components/home/MarqueeTicker'
import FeaturedCollection from '@/components/home/FeaturedCollection'
import ProductShowcaseAnimation from '@/components/home/ProductShowcaseAnimation'
import DiamondRingAnimation from '@/components/home/DiamondRingAnimation'
import ParallaxQuote from '@/components/home/ParallaxQuote'
import Newsletter from '@/components/home/Newsletter'
import { MARQUEE_TAGS, Product } from '@/lib/constants'

interface HomeClientProps {
  heroQuote: {
    quote: string
    author: string
    imageSrc: string
  }
  featuredProducts: Product[]
}

export default function HomeClient({ heroQuote, featuredProducts }: HomeClientProps) {
  const [loadProgress, setLoadProgress] = useState(0)
  const [loadComplete, setLoadComplete] = useState(false)

  const handleLoadProgress = useCallback((p: number) => {
    setLoadProgress(p)
  }, [])

  const handleLoadComplete = useCallback(() => {
    setLoadProgress(1)
  }, [])

  const handleScreenComplete = useCallback(() => {
    setLoadComplete(true)
  }, [])

  return (
    <>
      <LoadingScreen progress={loadProgress} onComplete={handleScreenComplete} />

      <PageTransition>
        <HeroCanvas
          onLoadProgress={handleLoadProgress}
          onLoadComplete={handleLoadComplete}
        />

        <MarqueeTicker items={MARQUEE_TAGS} />

        <FeaturedCollection products={featuredProducts} />

        {/* ── Transition bridge: ivory → dark ── */}
        <div
          style={{
            background: 'linear-gradient(to bottom, #f9f5f0 0%, #1a1714 100%)',
            height: '220px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ width: '1px', height: '48px', background: 'linear-gradient(to bottom, rgba(180,150,80,0.3), rgba(212,175,55,0.7))' }} />
          <p style={{ fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(212,175,55,0.6)' }}>
            Explore the Craft
          </p>
        </div>

        <ProductShowcaseAnimation />


        <DiamondRingAnimation />

        <ParallaxQuote
          quote={heroQuote.quote}
          author={heroQuote.author}
          imageSrc={heroQuote.imageSrc}
          imageAlt="Luxury jewelry atelier"
        />


        <Newsletter />
      </PageTransition>
    </>
  )
}
