'use client'

import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFrameAnimation } from '@/hooks/useFrameAnimation'

gsap.registerPlugin(ScrollTrigger)

export default function ProductShowcaseAnimation() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentFrameRef = useRef(0)
  const TOTAL_FRAMES = 82

  const getFileName = useCallback((index: number) => {
    return `Gold_dome_ring_on_stone_202605130855_${String(index).padStart(3, '0')}.webp`
  }, [])

  const { frames, ready } = useFrameAnimation(TOTAL_FRAMES, '/frames/Gold_dome_ring', getFileName)

  /* ── Draw helpers ─────────────────────────────────────────────────── */
  const drawFrame = useCallback(
    (index: number) => {
      const img = frames[index]
      const canvas = canvasRef.current
      if (!canvas || !img) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const { width: cw, height: ch } = canvas
      const { naturalWidth: iw, naturalHeight: ih } = img
      if (!iw || !ih) return
      // object-fit: contain — no clipping
      const scale = Math.min(cw / iw, ch / ih)
      const x = (cw - iw * scale) / 2
      const y = (ch - ih * scale) / 2
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, x, y, iw * scale, ih * scale)
    },
    [frames],
  )

  /* ── Canvas sizing ────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const setSize = () => {
      // Portrait card: 52% of viewport height wide, 85% tall → ~3:5 ratio
      canvas.height = Math.round(window.innerHeight * 0.85)
      canvas.width  = Math.round(canvas.height * 0.70)
      drawFrame(currentFrameRef.current)
    }

    setSize()
    const ro = new ResizeObserver(setSize)
    ro.observe(document.documentElement)
    return () => ro.disconnect()
  }, [drawFrame])

  /* ── GSAP scroll animation ────────────────────────────────────────── */
  useEffect(() => {
    if (!ready || !sectionRef.current) return
    drawFrame(0)

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: `+=${window.innerHeight * 3}`,
      pin: true,
      scrub: 0.5,
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
    /*
     * Full-viewport pinned section — matches Cartier Roadster layout:
     * deep charcoal bg | left: text block | right: portrait canvas
     */
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: '#0d0c0b' }}
    >
      {/* ── very faint top / bottom hairlines ── */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />

      {/* ── Two-column layout ── */}
      <div className="absolute inset-0 flex items-center">

        {/* LEFT — text block */}
        <div
          className="flex flex-col justify-center gap-5 pl-12 md:pl-20 lg:pl-28"
          style={{ width: '38%', minWidth: 240 }}
        >
          {/* Label */}
          <p
            className="text-[10px] uppercase tracking-[0.35em]"
            style={{ color: 'rgba(212,175,55,0.75)' }}
          >
            New Arrival
          </p>

          {/* Hairline */}
          <div className="w-8 h-px bg-white/20" />

          {/* Product name */}
          <h2
            className="text-[clamp(2rem,3.5vw,3.5rem)] font-extralight leading-[1.1] tracking-tight text-white"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Gold Dome<br />Ring
          </h2>

          {/* Description */}
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)', maxWidth: 280 }}>
            Hand-set on a natural stone surface.
            <br />
            18k polished gold, sculpted by hand
            <br />
            and refined by time.
          </p>

          {/* Hairline */}
          <div className="w-8 h-px bg-white/20" />

          {/* Scroll hint */}
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: 'rgba(212,175,55,0.5)' }}
            >
              Scroll to explore
            </span>
            {/* animated chevron */}
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              className="opacity-50 animate-bounce"
            >
              <path d="M4 6l4 4 4-4" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* RIGHT — portrait canvas */}
        <div
          className="flex items-center justify-center flex-1 h-full"
        >
          {/* Outer glow / depth wrapper */}
          <div
            style={{
              position: 'relative',
              height: '85vh',
              width: 'calc(85vh * 0.70)',
              maxWidth: '55vw',
            }}
          >
            {/* Subtle ambient glow behind the ring */}
            <div
              style={{
                position: 'absolute',
                inset: '-4%',
                background: 'radial-gradient(ellipse at 50% 60%, rgba(212,175,55,0.07) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <canvas
              ref={canvasRef}
              aria-label="Gold Dome Ring on stone — 360° scroll showcase"
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Frame counter (tiny, bottom-right, like a film roll) ── */}
      <div
        className="absolute bottom-8 right-10 text-[10px] tracking-[0.25em] tabular-nums"
        style={{ color: 'rgba(255,255,255,0.2)' }}
      >
        Gold Dome Ring — Urja Jewels
      </div>
    </section>
  )
}
