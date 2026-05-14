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

import { useState, useEffect } from 'react'
import PageTransition from '@/components/layout/PageTransition'
import CollectionHero from '@/components/collection/CollectionHero'
import ProductFilter from '@/components/collection/ProductFilter'
import ProductMasonryGrid from '@/components/collection/ProductMasonryGrid'
import { Product } from '@/lib/constants'
import { getProductsAction } from '@/app/actions/products'

export default function CollectionPage() {
  // 'All' is the sentinel value meaning no category filter is applied.
  const [activeCategory, setActiveCategory] = useState('All')
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function load() {
      const all = await getProductsAction()
      setProducts(all)
    }
    load()
  }, [])

  const ALL_CATEGORIES = Array.from(new Set(products.map((p) => p.category)))

  const filtered =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory)

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
      
      {filtered.length > 0 ? (
        <ProductMasonryGrid products={filtered} />
      ) : (
        <div className="bg-ivory py-24 text-center">
          <p className="font-body text-stone-500 italic">No products found in this collection.</p>
        </div>
      )}
    </PageTransition>
  )
}
