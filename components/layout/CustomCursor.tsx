'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const GOLD = '#B8973A'
const OBSIDIAN = '#1A1A1A'

const DOT_SIZE = 8
const RING_SIZE = 32
const LERP_FACTOR = 0.12

/**
 * Custom cursor: a small dot that snaps to the pointer and a larger ring
 * that trails behind using RAF-based lerp interpolation.
 *
 * - Returns null on touch/coarse-pointer devices.
 * - Scales the ring 2× and switches its border to gold when hovering any
 *   element marked with the `data-cursor-hover` attribute.
 *
 * Validates: Requirements 2.2, 2.3, 12.2
 */
export default function CustomCursor() {
  // Bail out on touch devices — checked once on mount via a ref so we can
  // conditionally return null without violating the Rules of Hooks.
  const isCoarseRef = useRef<boolean | null>(null)

  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [hovered, setHovered] = useState(false)

  // Ring position is tracked in a ref so the RAF loop can read/write it
  // without triggering re-renders on every frame.
  const ringPosRef = useRef({ x: -100, y: -100 })
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 })

  // Latest mouse position for the RAF loop to read.
  const mouseRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number | null>(null)

  const animate = useCallback(() => {
    const target = mouseRef.current
    const current = ringPosRef.current

    const nextX = current.x + (target.x - current.x) * LERP_FACTOR
    const nextY = current.y + (target.y - current.y) * LERP_FACTOR

    ringPosRef.current = { x: nextX, y: nextY }
    setRingPos({ x: nextX, y: nextY })

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    // Detect coarse pointer once in the browser.
    isCoarseRef.current = window.matchMedia('(pointer: coarse)').matches
    setMounted(true)

    if (isCoarseRef.current) return

    // Start the RAF lerp loop.
    rafRef.current = requestAnimationFrame(animate)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest('[data-cursor-hover]')) {
        setHovered(true)
      }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest('[data-cursor-hover]')) {
        setHovered(false)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
    }
  }, [animate])

  // Don't render until we've checked the pointer type in the browser.
  if (!mounted) return null

  // Hide on touch/coarse-pointer devices.
  if (isCoarseRef.current) return null

  const sharedStyle: React.CSSProperties = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 9999,
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    willChange: 'transform',
  }

  return (
    <>
      {/* Dot — snaps directly to the cursor */}
      <div
        aria-hidden="true"
        style={{
          ...sharedStyle,
          left: position.x,
          top: position.y,
          width: DOT_SIZE,
          height: DOT_SIZE,
          backgroundColor: OBSIDIAN,
          transition: 'background-color 0.2s ease',
        }}
      />

      {/* Ring — trails behind with lerp */}
      <div
        aria-hidden="true"
        style={{
          ...sharedStyle,
          left: ringPos.x,
          top: ringPos.y,
          width: RING_SIZE,
          height: RING_SIZE,
          backgroundColor: 'transparent',
          border: `2px solid ${hovered ? GOLD : OBSIDIAN}`,
          transform: `translate(-50%, -50%) scale(${hovered ? 2 : 1})`,
          transition: 'border-color 0.2s ease, transform 0.25s ease',
        }}
      />
    </>
  )
}
