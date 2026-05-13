'use client'

// ---------------------------------------------------------------------------
// BrandStory
// ---------------------------------------------------------------------------
// Two-column editorial layout: one column is a full-bleed image, the other
// is a text block that animates in from the left on viewport entry.
//
// Layout behaviour:
//   - Mobile (< 768 px): columns stack vertically, image on top.
//   - Tablet / Desktop (≥ 768 px): side-by-side grid.
//
// The `imagePosition` prop controls which side the image occupies on wide
// viewports. On mobile the image always renders first (top).
//
// Requirements: 8.1, 8.2, 8.3, 8.4, 12.6
// ---------------------------------------------------------------------------

import Image from 'next/image'
import { motion } from 'framer-motion'
import { slideInLeft } from '@/lib/animations'

interface BrandStoryProps {
  /** Main heading rendered in Cormorant Garamond. */
  heading: string
  /** Body copy rendered in Jost. */
  body: string
  /** Path to the image (relative to /public). <!-- REPLACE IMAGE --> */
  imageSrc: string
  /** Accessible alt text for the image. <!-- REPLACE ALT --> */
  imageAlt: string
  /** Which side the image occupies on wide viewports. Defaults to 'left'. */
  imagePosition?: 'left' | 'right'
}

export default function BrandStory({
  heading,
  body,
  imageSrc,
  imageAlt,
  imagePosition = 'left',
}: BrandStoryProps) {
  // ── Image column ──────────────────────────────────────────────────────────
  // `fill` requires the parent to be `position: relative`.
  // `min-h-[400px]` ensures a visible height on mobile where the column is
  // full-width and the grid row height is determined by content.
  const imageCol = (
    <div className="relative w-full h-80 md:h-full min-h-[400px]">
      {/* <!-- REPLACE IMAGE --> */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  )

  // ── Text column ───────────────────────────────────────────────────────────
  // Animates in from the left using the shared `slideInLeft` variant.
  // `whileInView` + `viewport={{ once: true }}` triggers the animation once
  // when the element enters the viewport.
  const textCol = (
    <motion.div
      variants={slideInLeft}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex flex-col justify-center px-8 md:px-16 py-12"
    >
      <h2 className="font-display text-3xl md:text-4xl text-obsidian mb-6 leading-tight">
        {heading}
      </h2>
      <p className="font-body text-stone leading-relaxed text-base md:text-lg">
        {body}
      </p>
    </motion.div>
  )

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[500px] bg-ivory">
      {imagePosition === 'left' ? (
        <>
          {imageCol}
          {textCol}
        </>
      ) : (
        <>
          {textCol}
          {imageCol}
        </>
      )}
    </section>
  )
}
