'use client'

import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFrameAnimation } from '@/hooks/useFrameAnimation'

gsap.registerPlugin(ScrollTrigger)

export default function DiamondRingAnimation() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const currentFrameRef = useRef(0)
  const TOTAL_FRAMES = 82

  const getFileName = useCallback((index: number) =>
    `Yellow_gold_diamond_engagement_ring_202605130931_${String(index).padStart(3, '0')}.webp`
  , [])

  const { frames, ready } = useFrameAnimation(
    TOTAL_FRAMES,
    '/frames/Yellow_gold_diamond',
    getFileName
  )

  /* ── Draw ──────────────────────────────────────────────────────────── */
  const drawFrame = useCallback((index: number) => {
    const img    = frames[index]
    const canvas = canvasRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { width: cw, height: ch } = canvas
    const { naturalWidth: iw, naturalHeight: ih } = img
    if (!iw || !ih) return
    const scale = Math.min(cw / iw, ch / ih) // contain
    const x = (cw - iw * scale) / 2
    const y = (ch - ih * scale) / 2
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, x, y, iw * scale, ih * scale)
  }, [frames])

  /* ── Canvas sizing ────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const setSize = () => {
      canvas.height = Math.round(window.innerHeight * 0.85)
      canvas.width  = Math.round(canvas.height * 0.70)
      drawFrame(currentFrameRef.current)
    }
    setSize()
    const ro = new ResizeObserver(setSize)
    ro.observe(document.documentElement)
    return () => ro.disconnect()
  }, [drawFrame])

  /* ── GSAP scroll trigger ──────────────────────────────────────────── */
  useEffect(() => {
    if (!ready || !sectionRef.current) return
    drawFrame(0)

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   'top top',
      end:     `+=${window.innerHeight * 3}`,
      pin:     true,
      scrub:   0.5,
      anticipatePin: 1,
      onUpdate: (self) => {
        const index = Math.round(self.progress * (TOTAL_FRAMES - 1))
        currentFrameRef.current = index
        drawFrame(index)
      },
    })

    return () => trigger.kill()
  }, [ready, drawFrame])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: '#e2ceb9' }} // Matches the image's dominant stone color
    >
      {/* Hairlines */}
      <div className="absolute inset-x-0 top-0 h-px bg-black/10" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/10" />

      {/* Two-column — image LEFT, text RIGHT (mirrored from Gold Dome) */}
      <div className="absolute inset-0 flex items-center">

        {/* LEFT — portrait canvas */}
        <div className="flex items-center justify-center flex-1 h-full">
          <div
            style={{
              position: 'relative',
              height: '85vh',
              width: 'calc(85vh * 0.70)',
              maxWidth: '55vw',
            }}
          >
            {/* Warm gold ambient glow */}
            <div
              style={{
                position: 'absolute',
                inset: '-4%',
                background: 'radial-gradient(ellipse at 50% 55%, rgba(212,175,55,0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <canvas
              ref={canvasRef}
              aria-label="Yellow gold diamond engagement ring — 360° scroll showcase"
              style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* RIGHT — text block */}
        <div
          className="flex flex-col justify-center gap-5 pr-12 md:pr-20 lg:pr-28"
          style={{ width: '38%', minWidth: 240 }}
        >
          {/* Label */}
          <p
            className="text-[10px] uppercase tracking-[0.35em]"
            style={{ color: 'rgba(160,120,40,0.8)' }}
          >
            Signature Collection
          </p>

          {/* Hairline */}
          <div className="w-8 h-px bg-black/15" />

          {/* Product name */}
          <h2
            className="text-[clamp(2rem,3.5vw,3.5rem)] font-extralight leading-[1.1] tracking-tight"
            style={{ color: '#1a1410', fontFamily: 'Georgia, serif' }}
          >
            Yellow Gold<br />Diamond<br />Engagement Ring
          </h2>

          {/* Description */}
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'rgba(26,20,16,0.45)', maxWidth: 280 }}
          >
            A brilliant-cut diamond set in warm 18k yellow gold.
            <br />
            Crafted to mark life's most precious moment —
            <br />
            forever yours.
          </p>

          {/* Hairline */}
          <div className="w-8 h-px bg-black/15" />

          {/* Scroll hint */}
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: 'rgba(160,120,40,0.55)' }}
            >
              Scroll to explore
            </span>
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              className="opacity-50 animate-bounce"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="#A07828"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div
        className="absolute bottom-8 left-10 text-[10px] tracking-[0.25em] tabular-nums"
        style={{ color: 'rgba(26,20,16,0.18)' }}
      >
        Yellow Gold Diamond — Urja Jewels
      </div>
    </section>
  )
}
