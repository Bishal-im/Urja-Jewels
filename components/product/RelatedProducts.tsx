import { getStaticProducts } from '@/lib/db'
import type { Product } from '@/lib/constants'
import ProductCard from '@/components/home/ProductCard'
import SectionTitle from '@/components/ui/SectionTitle'
import GoldDivider from '@/components/ui/GoldDivider'

interface RelatedProductsProps {
  currentSlug: string
  category: Product['category']
}

export default async function RelatedProducts({ currentSlug, category }: RelatedProductsProps) {
  const products = await getStaticProducts()
  const related = products
    .filter((p) => p.category === category && p.slug !== currentSlug)
    .slice(0, 4)

  if (related.length === 0) return null

  return (
    <section className="bg-ivory py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <SectionTitle eyebrow="You May Also Like" heading="Related Pieces" align="center" />
        <GoldDivider className="my-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {related.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
