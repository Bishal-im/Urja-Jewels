'use client'

import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/lib/animations'
import ProductCard from '@/components/home/ProductCard'
import type { Product } from '@/lib/constants'

interface ProductMasonryGridProps {
  products: Product[]
}

export default function ProductMasonryGrid({ products }: ProductMasonryGridProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-8 py-12 bg-ivory"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={fadeUp}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
}
