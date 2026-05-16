import type { TargetAndTransition } from 'framer-motion'

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface Product {
  id: string
  slug: string
  name: string
  price: number // in USD cents, e.g. 450000 = $4,500
  category: 'rings' | 'necklaces' | 'bracelets' | 'earrings'
  description: string
  imageSrc: string // path relative to /public
  featured: boolean
}

export interface SiteConfig {
  name: string
  marqueeItems: string[]
}

export interface NavItem {
  label: string
  href: string
}

export interface AnimationVariant {
  hidden: TargetAndTransition
  visible: TargetAndTransition
}

export interface FrameAnimationState {
  frames: HTMLImageElement[]
  progress: number // 0–1, fraction of frames loaded
  ready: boolean   // true when all frames have resolved
}

// ---------------------------------------------------------------------------
// Site constants
// ---------------------------------------------------------------------------

export const SITE_NAME = 'Urja Jewels'
export const WHATSAPP_NUMBER = '+9779860804988'

export const CONTACT_INFO = {
  phone: '+977 9860804988',
  email: 'concierge@urjajewels.com',
  address: '123 Luxury Lane, New York, NY 10001',
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '').replace(/\s/g, '')}`,
}

export const MARQUEE_TAGS: string[] = [
  'Crafted for Eternity',
  'Est. 2024',
  'Urja Jewels',
  'Handcrafted with Love',
]

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Collection', href: '/collection' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

// ---------------------------------------------------------------------------
// Product data
// ---------------------------------------------------------------------------

// Products are now fetched dynamically from lib/db.ts

