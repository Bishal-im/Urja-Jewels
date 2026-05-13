'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { fadeIn } from '@/lib/animations'

interface ProductImageGalleryProps {
  imageSrc: string   // <!-- REPLACE IMAGE -->
  imageAlt: string   // <!-- REPLACE ALT -->
  name: string
}

export default function ProductImageGallery({ imageSrc, imageAlt, name }: ProductImageGalleryProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="relative aspect-square w-full bg-fog overflow-hidden"
    >
      {/* <!-- REPLACE IMAGE --> */}
      <Image
        src={imageSrc}
        alt={imageAlt || name} // <!-- REPLACE ALT -->
        fill
        priority
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </motion.div>
  )
}
