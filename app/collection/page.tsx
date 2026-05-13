'use client'

// ---------------------------------------------------------------------------
// Collection page
// ---------------------------------------------------------------------------
// Manages activeCategory state for filtering and composes all collection
// sections in order. Wrapped in PageTransition for Framer Motion page
// transitions.
//
// Requirements: 10.1, 10.2, 10.5
// ---------------------------------------------------------------------------

import { useState } from 'react'
import PageTransition from '@/components/layout/PageTransition'
import CollectionHero from '@/components/collection/CollectionHero'
import ProductFilter from '@/components/collection/ProductFilter'
import ProductMasonryGrid from '@/components/collection/ProductMasonryGrid'
import { PRODUCTS } from '@/lib/constants'

// Derive unique categories from the product list — order reflects first
// appearance in PRODUCTS so the filter buttons stay stable across renders.
const ALL_CATEGORIES = Array.from(new Set(PRODUCTS.map((p) => p.category)))

export default function CollectionPage() {
  // 'All' is the sentinel value meaning no category filter is applied.
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered =
    activeCategory === 'All'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory)

  return (
    <PageTransition>
      <CollectionHero
        title="All Collections"
        subtitle="Discover our complete range of handcrafted pieces."
      />
      <ProductFilter
        categories={ALL_CATEGORIES}
        active={activeCategory}
        onChange={setActiveCategory}
      />
      <ProductMasonryGrid products={filtered} />
    </PageTransition>
  )
}
