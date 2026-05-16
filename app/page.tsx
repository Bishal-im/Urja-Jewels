import HomeClient from '@/components/home/HomeClient'
import { getSiteContent } from '@/lib/site-content'
import { getStaticProducts } from '@/lib/db'

export default async function HomePage() {
  const [heroQuoteContent, allProducts] = await Promise.all([
    getSiteContent('hero_quote'),
    getStaticProducts(),
  ])

  // Only show products marked as featured on the landing page
  const featuredProducts = allProducts.filter(p => p.featured === true)

  const heroQuote = heroQuoteContent?.content || {
    quote: "Crafted for those who understand that true luxury is measured in moments, not possessions.",
    author: "Urja Jewels",
    imageSrc: "/frames/Gold_dome_ring/Gold_dome_ring_on_stone_202605130855_050.webp"
  }

  return <HomeClient heroQuote={heroQuote} featuredProducts={featuredProducts} />
}
