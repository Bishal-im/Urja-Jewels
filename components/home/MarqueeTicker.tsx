'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

// ---------------------------------------------------------------------------
// MarqueeTicker
// ---------------------------------------------------------------------------
// Renders a seamless horizontally-scrolling ticker using a GSAP fromTo tween.
// Two identical rows of items are placed side-by-side; the tween moves the
// track from x:0 to x:'-50%' with repeat:-1 so the loop is invisible.
//
// Requirements: 5.1, 5.2, 5.3, 5.4
// ---------------------------------------------------------------------------

interface MarqueeTickerProps {
  /** Tagline strings to display in the ticker. */
  items: string[]
  /** Scroll speed in pixels per second. Defaults to 80. */
  speed?: number
}

export default function MarqueeTicker({ items, speed = 80 }: MarqueeTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // scrollWidth covers both duplicate rows; divide by 2 to get one row width.
    // duration = distance / speed  →  one full cycle moves exactly one row width.
    const duration = track.scrollWidth / 2 / speed

    tweenRef.current = gsap.fromTo(
      track,
      { x: 0 },
      { x: '-50%', duration, ease: 'none', repeat: -1 },
    )

    return () => {
      tweenRef.current?.kill()
    }
  }, [items, speed])

  const handleMouseEnter = () => tweenRef.current?.pause()
  const handleMouseLeave = () => tweenRef.current?.resume()

  return (
    <div
      className="overflow-hidden bg-mink py-4 select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-hidden="true"
    >
      {/*
        The track holds two identical copies of the item list.
        The tween shifts the track left by 50% (= one copy width),
        then loops — creating a seamless infinite scroll.
      */}
      <div
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform"
      >
        {/* First copy */}
        {items.map((item, i) => (
          <span
            key={`a-${i}`}
            className="font-body text-sm uppercase tracking-widest text-fog px-8"
          >
            {item}
            <span className="text-gold mx-4" aria-hidden="true">✦</span>
          </span>
        ))}
        {/* Second copy — makes the loop seamless */}
        {items.map((item, i) => (
          <span
            key={`b-${i}`}
            className="font-body text-sm uppercase tracking-widest text-fog px-8"
          >
            {item}
            <span className="text-gold mx-4" aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
