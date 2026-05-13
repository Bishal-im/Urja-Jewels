'use client'

// ---------------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------------
// Manages loading state (loadProgress, loadComplete) and composes all home
// sections in order. Wrapped in PageTransition for Framer Motion page
// transitions.
//
// Requirements: 3.1, 3.6, 4.6
// ---------------------------------------------------------------------------

import { useState, useCallback } from 'react'
import PageTransition from '@/components/layout/PageTransition'
import LoadingScreen from '@/components/ui/LoadingScreen'
import HeroCanvas from '@/components/home/HeroCanvas'
import MarqueeTicker from '@/components/home/MarqueeTicker'
import FeaturedCollection from '@/components/home/FeaturedCollection'
import ProductShowcaseAnimation from '@/components/home/ProductShowcaseAnimation'
import DiamondRingAnimation from '@/components/home/DiamondRingAnimation'
import ParallaxQuote from '@/components/home/ParallaxQuote'
import BrandStory from '@/components/home/BrandStory'
import Newsletter from '@/components/home/Newsletter'
import { MARQUEE_TAGS } from '@/lib/constants'

export default function HomePage() {
  // loadProgress: 0–1, mirrors HeroCanvas frame preload progress
  const [loadProgress, setLoadProgress] = useState(0)
  // loadComplete: true once LoadingScreen exit animation finishes
  const [loadComplete, setLoadComplete] = useState(false)

  // Called by HeroCanvas as each frame resolves — Requirements 3.2, 4.6
  const handleLoadProgress = useCallback((p: number) => {
    setLoadProgress(p)
  }, [])

  // Called by HeroCanvas when all frames are loaded — Requirements 3.3
  const handleLoadComplete = useCallback(() => {
    setLoadProgress(1)
  }, [])

  // Called by LoadingScreen after its exit animation finishes — Requirements 3.6
  const handleScreenComplete = useCallback(() => {
    setLoadComplete(true)
  }, [])

  return (
    <>
      {/* Overlay rendered until progress reaches 1; calls onComplete when
          the exit animation finishes so the rest of the page can take over */}
      <LoadingScreen progress={loadProgress} onComplete={handleScreenComplete} />

      <PageTransition>
        {/* Scroll-pinned canvas — drives loadProgress via callbacks */}
        <HeroCanvas
          onLoadProgress={handleLoadProgress}
          onLoadComplete={handleLoadComplete}
        />

        {/* Seamless marquee ticker */}
        <MarqueeTicker items={MARQUEE_TAGS} />

        {/* Asymmetric featured product grid */}
        <FeaturedCollection />

        {/* Gold Dome Ring scroll animation */}
        <ProductShowcaseAnimation />

        {/* Parallax editorial quote section */}
        <ParallaxQuote
          quote="Crafted for those who understand that true luxury is measured in moments, not possessions."
          author="Urja Jewels"
          imageSrc="/frames/Gold_dome_ring/Gold_dome_ring_on_stone_202605130855_050.webp"
          imageAlt="Luxury jewelry atelier"
        />

        {/* Two-column brand story editorial */}
        <BrandStory
          heading="The Urja Story"
          body="Founded with a passion for timeless beauty, Urja Jewels crafts each piece to celebrate life's most precious moments. Every creation is conceived by our master artisans and brought to life using techniques refined over generations."
          imageSrc="/frames/Yellow_gold_diamond/Yellow_gold_diamond_engagement_ring_202605130931_060.webp"
          imageAlt="Urja Jewels artisan at work"
          imagePosition="left"
        />

        {/* Diamond Ring scroll animation */}
        <DiamondRingAnimation />

        {/* Newsletter sign-up */}
        <Newsletter />
      </PageTransition>
    </>
  )
}
