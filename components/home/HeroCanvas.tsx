'use client'

import { useCallback } from 'react'
import ScrollCanvasAnimation from '@/components/ui/ScrollCanvasAnimation'
import HeroOverlay from './HeroOverlay'

interface HeroCanvasProps {
  onLoadProgress: (progress: number) => void
  onLoadComplete: () => void
}

export default function HeroCanvas({ onLoadProgress, onLoadComplete }: HeroCanvasProps) {
  const getFileName = useCallback((index: number) => {
    return `frame_${String(index).padStart(3, '0')}_delay-0.066s.png`
  }, [])

  return (
    <ScrollCanvasAnimation
      totalFrames={120}
      basePath="/frames/ezgif-split"
      getFileName={getFileName}
      scrollDistance={8}
      onLoadProgress={onLoadProgress}
      onLoadComplete={onLoadComplete}
      ariaLabel="Cinematic jewelry showcase animation"
    >
      <HeroOverlay />
    </ScrollCanvasAnimation>
  )
}
