'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { slideInLeft } from '@/lib/animations'
import Button from '@/components/ui/Button'
import type { Product } from '@/lib/constants'

interface ProductInfoProps {
  product: Product
}

const formatPrice = (cents: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cents / 100)

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <motion.div
      variants={slideInLeft}
      initial="hidden"
      animate="visible"
      className="flex flex-col justify-center py-8 md:py-0"
    >
      {/* Category badge */}
      <p className="font-body text-xs uppercase tracking-widest text-stone mb-4">
        {product.category}
      </p>

      {/* Name */}
      <h1 className="font-display text-4xl md:text-5xl text-obsidian mb-4 leading-tight">
        {product.name}
      </h1>

      {/* Price */}
      <p className="font-body text-2xl text-obsidian mb-6">
        {formatPrice(product.price)}
      </p>

      {/* Description */}
      <p className="font-body text-stone leading-relaxed mb-10">
        {product.description}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="primary" size="lg">
          Add to Cart
        </Button>
        <Link
          href="/collection"
          className="font-body text-sm uppercase tracking-widest text-stone hover:text-gold transition-colors self-center focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
        >
          ← Back to Collection
        </Link>
      </div>
    </motion.div>
  )
}
