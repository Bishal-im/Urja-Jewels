'use server'

import { updateSiteContent } from '@/lib/site-content'
import { revalidatePath } from 'next/cache'

export async function updateHeroQuoteAction(formData: FormData) {
  const quote = formData.get('quote') as string
  const author = formData.get('author') as string
  const imageSrc = formData.get('imageSrc') as string

  await updateSiteContent('hero_quote', { quote, author, imageSrc })
  revalidatePath('/')
}

export async function updateBrandStoryAction(formData: FormData) {
  const heading = formData.get('heading') as string
  const body = formData.get('body') as string
  const imageSrc = formData.get('imageSrc') as string

  await updateSiteContent('brand_story', { heading, body, imageSrc })
  revalidatePath('/')
}

export async function updateAboutPageAction(formData: FormData) {
  const heroHeading = formData.get('heroHeading') as string
  const heroSubheading = formData.get('heroSubheading') as string
  const heroImageSrc = formData.get('heroImageSrc') as string
  
  const historyHeading = formData.get('historyHeading') as string
  const historyBody = formData.get('historyBody') as string
  
  const craftQuote = formData.get('craftQuote') as string

  const value1Title = formData.get('value1Title') as string
  const value1Body = formData.get('value1Body') as string
  const value2Title = formData.get('value2Title') as string
  const value2Body = formData.get('value2Body') as string
  const value3Title = formData.get('value3Title') as string
  const value3Body = formData.get('value3Body') as string

  await updateSiteContent('about_page', {
    hero: { heading: heroHeading, subheading: heroSubheading, imageSrc: heroImageSrc },
    history: { heading: historyHeading, body: historyBody },
    craftsmanship: { quote: craftQuote },
    values: [
      { title: value1Title, body: value1Body },
      { title: value2Title, body: value2Body },
      { title: value3Title, body: value3Body }
    ]
  })
  revalidatePath('/about')
}
