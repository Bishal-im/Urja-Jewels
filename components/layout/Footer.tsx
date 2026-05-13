import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'

const collectionsLinks = [
  { label: 'All Collections', href: '/collection' },
  { label: 'Rings', href: '/collection?category=rings' },
  { label: 'Necklaces', href: '/collection?category=necklaces' },
  { label: 'Bracelets', href: '/collection?category=bracelets' },
  { label: 'Earrings', href: '/collection?category=earrings' },
]

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const linkClasses =
  'text-fog hover:text-gold transition-colors font-body text-sm'

export default function Footer() {
  return (
    <footer className="bg-obsidian text-fog py-16 px-8">
      {/* Top: brand name + tagline */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="font-display text-2xl text-ivory tracking-widest uppercase">
            {SITE_NAME}
          </p>
          <p className="font-body text-sm text-stone mt-2 tracking-wide">
            Crafted for Eternity
          </p>
        </div>

        {/* Middle: nav link groups */}
        <div className="flex flex-col sm:flex-row gap-12 mb-16">
          <nav aria-label="Collections">
            <p className="font-body text-xs text-stone uppercase tracking-widest mb-4">
              Collections
            </p>
            <ul className="space-y-3">
              {collectionsLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={linkClasses}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <p className="font-body text-xs text-stone uppercase tracking-widest mb-4">
              Company
            </p>
            <ul className="space-y-3">
              {companyLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={linkClasses}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom: copyright */}
        <p className="text-center text-stone text-sm font-body">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
