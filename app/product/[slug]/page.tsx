import { notFound } from 'next/navigation'
import PageTransition from '@/components/layout/PageTransition'
import ProductImageGallery from '@/components/product/ProductImageGallery'
import ProductInfo from '@/components/product/ProductInfo'
import RelatedProducts from '@/components/product/RelatedProducts'
import { PRODUCTS } from '@/lib/constants'

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = PRODUCTS.find((p) => p.slug === slug)

  if (!product) {
    notFound()
  }

  return (
    <PageTransition>
      <div className="bg-ivory min-h-screen">
        <div className="max-w-6xl mx-auto px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <ProductImageGallery
              imageSrc={product.imageSrc}
              imageAlt={product.name}
              name={product.name}
            />
            <ProductInfo product={product} />
          </div>
        </div>
        <RelatedProducts currentSlug={product.slug} category={product.category} />
      </div>
    </PageTransition>
  )
}
