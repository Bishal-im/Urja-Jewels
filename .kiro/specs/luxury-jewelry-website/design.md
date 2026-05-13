# Design Document — Luxury Jewelry Website

## Overview

A cinematic, scroll-driven luxury jewelry website built with Next.js 14 App Router, TypeScript, and Tailwind CSS. The design is inspired by Cartier.com: editorial typography, generous whitespace, gold accents, and motion that feels intentional rather than decorative. Three pages — Home, Collection, and Product Detail — are connected by Framer Motion page transitions and a persistent global layout.

The animation stack is layered deliberately:

- **Lenis** normalises scroll velocity across browsers and feeds its `raf` loop into GSAP's ticker so both systems share a single animation frame.
- **GSAP + ScrollTrigger** drives the HeroCanvas frame sequencer and the ParallaxQuote background offset.
- **Framer Motion** handles page transitions, component entrance animations, and staggered list reveals.

---

## Architecture

```
app/
  layout.tsx              ← Root layout: fonts, providers, Navbar, Footer, CustomCursor
  page.tsx                ← Home page
  collection/
    page.tsx              ← Collection page
  product/
    [slug]/
      page.tsx            ← Product detail page

components/
  layout/
    Navbar.tsx
    Footer.tsx
    CustomCursor.tsx
    SmoothScrollProvider.tsx
    PageTransition.tsx
  home/
    HeroCanvas.tsx
    MarqueeTicker.tsx
    FeaturedCollection.tsx
    ProductGrid.tsx
    ParallaxQuote.tsx
    BrandStory.tsx
    Newsletter.tsx
  collection/
    CollectionHero.tsx
    ProductFilter.tsx
    ProductMasonryGrid.tsx
  product/
    ProductImageGallery.tsx
    ProductInfo.tsx
    RelatedProducts.tsx
  ui/
    Button.tsx
    SectionTitle.tsx
    GoldDivider.tsx
    LoadingScreen.tsx

hooks/
  useGSAP.ts
  useFrameAnimation.ts
  useLenis.ts

lib/
  animations.ts
  constants.ts

styles/
  globals.css

tailwind.config.ts
```

---

## Technology Stack

| Concern | Library / Tool |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 (custom theme) |
| Scroll normalisation | Lenis |
| Scroll-driven animation | GSAP + ScrollTrigger |
| Component animation | Framer Motion |
| Image optimisation | next/image |
| Fonts | next/font/google (Cormorant Garamond, Jost) |

---

## Color System

Defined in `tailwind.config.ts` under `theme.extend.colors`:

```ts
colors: {
  ivory:   '#FAFAF7',
  obsidian:'#1A1A1A',
  gold:    '#B8973A',
  mink:    '#2C2C2C',
  stone:   '#7A7A6E',
  pearl:   '#FFFFFF',
  fog:     '#E8E8E4',
}
```

All components reference these tokens via Tailwind utility classes (`bg-ivory`, `text-gold`, etc.) rather than raw hex values.

---

## Typography

Two typefaces loaded via `next/font/google` in `app/layout.tsx` and exposed as CSS custom properties:

```ts
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
})
```

Applied to `<html>` via `className={`${cormorant.variable} ${jost.variable}`}`.

Tailwind config maps these to `fontFamily.display` and `fontFamily.body`.

---

## Data Model

Defined in `lib/constants.ts`:

```ts
export interface Product {
  id: string
  slug: string
  name: string
  price: number          // in USD cents, e.g. 450000 = $4,500
  category: 'rings' | 'necklaces' | 'bracelets' | 'earrings'
  description: string
  imageSrc: string       // path relative to /public
  featured: boolean
}

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    slug: 'eternal-rose-ring',
    name: 'Eternal Rose Ring',
    price: 450000,
    category: 'rings',
    description: 'A timeless solitaire set in 18k rose gold...',
    imageSrc: '/images/eternal-rose-ring.jpg', // <!-- REPLACE IMAGE -->
    featured: true,
  },
  // ... at least 5 more products
]

export const SITE_NAME = 'Aurum'
export const MARQUEE_TAGS = [
  'Crafted for Eternity',
  'Since 1887',
  'Maison d\'Excellence',
  'Handcrafted in Paris',
]
```

---

## Data Models

### Product

```ts
export interface Product {
  id: string          // unique identifier, e.g. 'p1'
  slug: string        // URL-safe identifier, e.g. 'eternal-rose-ring'
  name: string        // display name
  price: number       // price in USD cents, e.g. 450000 = $4,500
  category: 'rings' | 'necklaces' | 'bracelets' | 'earrings'
  description: string // editorial product description
  imageSrc: string    // path relative to /public, e.g. '/images/ring.jpg'
  featured: boolean   // whether to show in FeaturedCollection on Home page
}
```

### SiteConfig

```ts
export interface SiteConfig {
  name: string          // brand name, e.g. 'Aurum'
  marqueeItems: string[] // taglines for MarqueeTicker
}
```

### AnimationVariant (Framer Motion)

```ts
export interface AnimationVariant {
  hidden: TargetAndTransition
  visible: TargetAndTransition
}
```

### FrameAnimationState

```ts
export interface FrameAnimationState {
  frames: HTMLImageElement[]  // preloaded Image objects
  progress: number            // 0–1, fraction of frames loaded
  ready: boolean              // true when all frames have resolved
}
```

### NavItem

```ts
export interface NavItem {
  label: string   // display text
  href: string    // route path
}
```

---

## Components and Interfaces

### Layout Components

#### `SmoothScrollProvider`
```ts
interface SmoothScrollProviderProps {
  children: React.ReactNode
}
// Initialises Lenis and syncs with GSAP ticker. Renders children unchanged.
```

#### `Navbar`
```ts
// No props — reads pathname from usePathname(), scroll position from useEffect.
// Internal state: scrolled: boolean, mobileOpen: boolean
```

#### `CustomCursor`
```ts
// No props. Returns null on pointer:coarse devices.
// Internal state: position: {x,y}, hovered: boolean
```

#### `PageTransition`
```ts
interface PageTransitionProps {
  children: React.ReactNode
}
// Wraps children in a Framer Motion motion.div with fade+slide variants.
```

#### `Footer`
```ts
// No props. Static editorial footer with brand links and copyright.
```

### Home Components

#### `LoadingScreen`
```ts
interface LoadingScreenProps {
  progress: number   // 0–1
  onComplete: () => void
}
// Renders full-viewport overlay with progress bar.
// Calls onComplete when progress reaches 1 and exit animation finishes.
```

#### `HeroCanvas`
```ts
interface HeroCanvasProps {
  onLoadProgress: (progress: number) => void
  onLoadComplete: () => void
}
// Manages frame preload, canvas draw, and ScrollTrigger pin.
```

#### `MarqueeTicker`
```ts
interface MarqueeTickerProps {
  items: string[]    // tagline strings to display
  speed?: number     // pixels per second, default 80
}
```

#### `FeaturedCollection`
```ts
// No props — reads PRODUCTS from lib/constants.ts internally.
// Filters to featured === true.
```

#### `ParallaxQuote`
```ts
interface ParallaxQuoteProps {
  quote: string
  author?: string
  imageSrc: string   // <!-- REPLACE IMAGE -->
  imageAlt: string   // <!-- REPLACE ALT -->
}
```

#### `BrandStory`
```ts
interface BrandStoryProps {
  heading: string
  body: string
  imageSrc: string   // <!-- REPLACE IMAGE -->
  imageAlt: string   // <!-- REPLACE ALT -->
  imagePosition?: 'left' | 'right'  // default 'left'
}
```

#### `Newsletter`
```ts
// No props. Internal state: email, error, submitted.
```

### Collection Components

#### `CollectionHero`
```ts
interface CollectionHeroProps {
  title: string
  subtitle?: string
}
```

#### `ProductFilter`
```ts
interface ProductFilterProps {
  categories: string[]
  active: string
  onChange: (category: string) => void
}
```

#### `ProductMasonryGrid`
```ts
interface ProductMasonryGridProps {
  products: Product[]
}
```

### Product Components

#### `ProductImageGallery`
```ts
interface ProductImageGalleryProps {
  imageSrc: string   // <!-- REPLACE IMAGE -->
  imageAlt: string   // <!-- REPLACE ALT -->
  name: string
}
```

#### `ProductInfo`
```ts
interface ProductInfoProps {
  product: Product
}
```

#### `RelatedProducts`
```ts
interface RelatedProductsProps {
  currentSlug: string
  category: Product['category']
}
```

### UI Components

#### `Button`
```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}
```

#### `SectionTitle`
```ts
interface SectionTitleProps {
  eyebrow?: string   // small uppercase label above heading
  heading: string
  subheading?: string
  align?: 'left' | 'center'
}
```

#### `GoldDivider`
```ts
interface GoldDividerProps {
  className?: string
}
// Renders a thin horizontal rule in the gold color token.
```

### Hooks

#### `useGSAP`
```ts
function useGSAP(
  callback: (context: gsap.Context) => void,
  deps?: React.DependencyList,
  scope?: React.RefObject<Element>
): void
```

#### `useFrameAnimation`
```ts
function useFrameAnimation(
  totalFrames: number,
  basePath: string
): FrameAnimationState
```

#### `useLenis`
```ts
function useLenis(): React.MutableRefObject<Lenis | null>
```

---

## Component Architecture

### SmoothScrollProvider

A `'use client'` wrapper that initialises Lenis and synchronises it with GSAP's RAF ticker:

```ts
// hooks/useLenis.ts
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    lenisRef.current = lenis

    // Sync with GSAP ticker
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
      lenis.destroy()
    }
  }, [])

  return lenisRef
}
```

`SmoothScrollProvider` renders `{children}` and calls `useLenis()` so the effect runs once at the root.

### LoadingScreen

Full-viewport overlay (`position: fixed`, `z-index: 9999`) rendered while HeroCanvas preloads frames.

State machine:
1. `loading` — overlay visible, progress bar animates from 0 → 100 as frames resolve.
2. `complete` — Framer Motion `AnimatePresence` exit animation (opacity 0, y: -20) removes the overlay.

Progress calculation:

```ts
// For N total frames, each resolved Promise increments loadedCount.
// progressPercent = (loadedCount / totalFrames) * 100
```

The overlay uses `role="status"` and `aria-live="polite"` with a visually hidden text node announcing the percentage.

### HeroCanvas

`'use client'` component. Lifecycle:

1. **Preload** — `Promise.all` over 60 `new Image()` instances. Each `onload` increments a counter and calls `onProgress(count / 60)`.
2. **Mount** — After all frames load, `onComplete()` dismisses the LoadingScreen.
3. **ScrollTrigger** — Pins the `<canvas>` wrapper for a scroll distance of `window.innerHeight * 4`. The `onUpdate` callback receives `self.progress` (0–1) and calls `drawFrame(Math.round(progress * 59))`.
4. **Draw** — `drawFrame(index)` uses the object-fit cover algorithm:

```ts
function drawFrame(index: number) {
  const img = frames[index]
  const canvas = canvasRef.current!
  const ctx = canvas.getContext('2d')!
  const { width: cw, height: ch } = canvas
  const { naturalWidth: iw, naturalHeight: ih } = img

  const scale = Math.max(cw / iw, ch / ih)
  const x = (cw - iw * scale) / 2
  const y = (ch - ih * scale) / 2
  ctx.clearRect(0, 0, cw, ch)
  ctx.drawImage(img, x, y, iw * scale, ih * scale)
}
```

5. **Resize** — `ResizeObserver` on the canvas wrapper updates `canvas.width` / `canvas.height` and redraws the current frame.

### CustomCursor

`'use client'` component. Renders two `<div>` elements: a small dot and a larger ring. Both track `mousemove` via `useEffect`. The ring uses a lerp-based follow with `requestAnimationFrame` for a trailing effect.

Hover state: a `MutationObserver` or event delegation on `document` listens for `mouseenter`/`mouseleave` on `[data-cursor-hover]` elements. When active, the ring scales to 2× and changes `border-color` to `gold`.

On `pointer: coarse` media, the component returns `null`.

### Navbar

`'use client'` component. Uses `usePathname()` from `next/navigation` to determine the active route.

Scroll behaviour: `useEffect` attaches a scroll listener. When `window.scrollY > 80`, a `scrolled` state flips the background from `transparent` to `bg-obsidian/95 backdrop-blur-sm`.

Mobile: at `< 768px`, nav links are hidden and a hamburger button toggles a Framer Motion drawer (`AnimatePresence` + `motion.div` with `x: '-100%'` → `x: 0`).

### MarqueeTicker

Renders two identical `<span>` rows side-by-side inside an `overflow-hidden` container. A GSAP `fromTo` tween on `x` from `0` to `-50%` with `repeat: -1` and `ease: 'none'` creates the seamless loop. `onMouseEnter` calls `tween.pause()`, `onMouseLeave` calls `tween.resume()`.

### FeaturedCollection

Filters `PRODUCTS` by `featured === true`. Renders an asymmetric CSS Grid:

```css
/* Desktop: 12-column grid, cards span varying column counts */
grid-template-columns: repeat(12, 1fr);
/* Card 1: col 1-7, Card 2: col 8-12, Card 3: col 1-5, Card 4: col 6-12 */
```

Each `ProductCard` is wrapped in a Framer Motion `motion.div` with `whileInView` variants:

```ts
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}
```

### ParallaxQuote

Uses `useRef` on the section element and a GSAP ScrollTrigger with `scrub: true`:

```ts
gsap.fromTo(
  bgRef.current,
  { yPercent: -15 },
  {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: {
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  }
)
```

The background `<Image>` is positioned `absolute inset-0 object-cover` inside a `relative overflow-hidden` section.

### Newsletter

Controlled form with `useState` for `email`, `error`, `submitted`.

Validation regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

On valid submit: sets `submitted = true`, clears `email`. Renders a confirmation `<p>` in place of the form.

On invalid submit: sets `error` message, does not clear input.

### PageTransition

Wraps page content in a Framer Motion `motion.div`:

```ts
const variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.3 } },
}
```

Used inside `AnimatePresence` in `app/layout.tsx` keyed by `pathname`.

### ProductDetailPage

`generateStaticParams` exports all slugs for static generation. `notFound()` from `next/navigation` is called when the slug does not match any product in `PRODUCTS`.

---

## Hooks

### `useGSAP.ts`

Thin wrapper around `gsap.context()` that registers and cleans up a GSAP context tied to a container ref:

```ts
export function useGSAP(
  callback: (context: gsap.Context) => void,
  deps: React.DependencyList = [],
  scope?: React.RefObject<Element>
) {
  useEffect(() => {
    const ctx = gsap.context(callback, scope?.current ?? undefined)
    return () => ctx.revert()
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}
```

### `useFrameAnimation.ts`

Encapsulates the HeroCanvas frame-preload logic:

```ts
export function useFrameAnimation(totalFrames: number, basePath: string) {
  const [frames, setFrames] = useState<HTMLImageElement[]>([])
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let loaded = 0
    const imgs = Array.from({ length: totalFrames }, (_, i) => {
      const img = new Image()
      img.src = `${basePath}/frame_${String(i + 1).padStart(3, '0')}.jpg`
      img.onload = () => {
        loaded++
        setProgress(loaded / totalFrames)
        if (loaded === totalFrames) setReady(true)
      }
      img.onerror = () => {
        loaded++
        setProgress(loaded / totalFrames)
        if (loaded === totalFrames) setReady(true)
      }
      return img
    })
    setFrames(imgs)
  }, [totalFrames, basePath])

  return { frames, progress, ready }
}
```

### `useLenis.ts`

Described above under SmoothScrollProvider.

---

## Animation Library (`lib/animations.ts`)

Shared Framer Motion variant presets:

```ts
export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export const slideInLeft = {
  hidden: { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}
```

---

## Page Compositions

### Home (`app/page.tsx`)

```
<LoadingScreen />          ← conditionally rendered until ready
<HeroCanvas />             ← scroll-pinned canvas
<MarqueeTicker />
<FeaturedCollection />
<ParallaxQuote />
<BrandStory />
<Newsletter />
```

### Collection (`app/collection/page.tsx`)

```
<CollectionHero />         ← static editorial header
<ProductFilter />          ← category filter buttons (client component)
<ProductMasonryGrid />     ← all products, staggered entrance
```

### Product Detail (`app/product/[slug]/page.tsx`)

```
<ProductImageGallery />    ← main image + thumbnails
<ProductInfo />            ← name, price, description, Add to Cart
<RelatedProducts />        ← filtered by same category
```

---

## Routing & Data Flow

All product data is static (sourced from `lib/constants.ts`). No API routes are required for the MVP.

- `generateStaticParams` in `app/product/[slug]/page.tsx` pre-renders all product pages at build time.
- `notFound()` handles unknown slugs.
- Navigation uses Next.js `<Link>` throughout; no `router.push` except in the Newsletter confirmation (none needed).

---

## Responsive Behaviour

| Breakpoint | Navbar | FeaturedCollection | BrandStory | ProductGrid |
|---|---|---|---|---|
| < 768 px | Hamburger drawer | Single column | Stacked | 1 col |
| 768–1023 px | Full links | 2-col grid | Side-by-side | 2 col |
| 1024–1279 px | Full links | Asymmetric grid | Side-by-side | 3 col |
| ≥ 1280 px | Full links | Asymmetric grid | Side-by-side | 4 col |

CustomCursor is hidden via `@media (pointer: coarse)` and the component returns `null` when `window.matchMedia('(pointer: coarse)').matches`.

---

## Performance Considerations

1. **Client-only animation libraries** — GSAP, Lenis, and all animation hooks are inside `'use client'` components or dynamic imports to prevent SSR errors.
2. **Frame preloading** — All 60 canvas frames are loaded before the LoadingScreen dismisses, preventing mid-scroll blank frames.
3. **next/image** — All `<Image>` components use `sizes` prop appropriate to their layout slot and `priority` on above-the-fold images.
4. **GSAP context cleanup** — Every `useGSAP` call returns `ctx.revert()` to prevent memory leaks on unmount.
5. **Lenis + GSAP ticker sync** — A single RAF loop drives both systems, avoiding double-frame overhead.

---

## Accessibility

- `<LoadingScreen>` uses `role="status"` and `aria-live="polite"`.
- All `<Image>` instances include `alt` props; placeholder text is marked `{/* <!-- REPLACE ALT --> */}`.
- Interactive elements (`<Button>`, `<Link>`, form controls) have visible `:focus-visible` outlines using the `gold` color token.
- Semantic HTML: `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>` used throughout.
- CustomCursor does not interfere with keyboard navigation; native focus management is preserved.

---

## Error Handling

### Unknown Product Slug
When `app/product/[slug]/page.tsx` receives a slug not present in `PRODUCTS`, it calls `notFound()` from `next/navigation`. Next.js renders the nearest `not-found.tsx` boundary, which displays a minimal 404 message with a "Back to Collection" link. The page does not throw an unhandled error.

### Frame Load Failure
In `useFrameAnimation`, each `Image` instance has both `onload` and `onerror` handlers. Both increment the loaded counter and update progress. This ensures a single failed frame does not stall the loading sequence. The `ready` flag is set to `true` when `loaded === totalFrames` regardless of how many frames errored.

### Newsletter Validation
Client-side email validation runs before any submission attempt. If the regex test fails, an error message is set in state and the form is not submitted. No network request is made for invalid inputs.

### GSAP / Lenis SSR Guard
All components that import GSAP, ScrollTrigger, or Lenis are marked `'use client'`. The `useEffect` hook ensures these libraries only initialise in the browser. `typeof window !== 'undefined'` guards are added where dynamic imports are not sufficient.

### Canvas Context Unavailability
`HeroCanvas` checks that `canvasRef.current?.getContext('2d')` returns a non-null context before attempting to draw. If the context is unavailable (e.g. in a test environment), the draw function exits early without throwing.

---

## Testing Strategy

### Unit Tests (example-based)
- `lib/constants.ts` — verify all six products have required fields and valid types.
- `Newsletter` — verify valid email submits successfully; verify invalid emails show error.
- `useFrameAnimation` — mock `Image` and verify progress increments correctly; verify `onerror` still advances progress.
- `Navbar` — verify active link styling matches current pathname; verify mobile menu toggles.

### Property-Based Tests
Properties 1–12 in the Correctness Properties section are the primary targets for property-based testing using a library such as `fast-check`.

Key generators needed:
- `fc.record({ id: fc.string(), slug: fc.string(), ... })` for Product objects.
- `fc.float({ min: 0, max: 1 })` for scroll progress values.
- `fc.tuple(fc.nat(), fc.nat())` for canvas/image dimensions.
- `fc.array(fc.string({ minLength: 1 }))` for marquee tagline arrays.
- `fc.string()` for email validation (including arbitrary invalid strings).

### Integration Tests
- Navigation: clicking a `ProductCard` routes to the correct `/product/[slug]` URL.
- `LoadingScreen` dismisses after `progress` reaches 1.
- `ProductDetailPage` renders `notFound()` for an unknown slug.

### Accessibility Tests
- Automated axe-core scan on Home, Collection, and Product Detail pages.
- Keyboard navigation through Navbar, ProductCard grid, and Newsletter form.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Product data completeness

*For any* product object exported from `lib/constants.ts`, the object SHALL have all required fields (`id`, `slug`, `name`, `price`, `category`, `description`, `imageSrc`, `featured`) with non-empty string values for string fields and a boolean value for `featured`.

**Validates: Requirements 1.5**

### Property 2: Loading progress is proportional

*For any* count of loaded frames `n` out of a total of `T` frames (where `0 ≤ n ≤ T` and `T > 0`), the progress percentage reported by `useFrameAnimation` SHALL equal `(n / T) * 100`, and SHALL be monotonically non-decreasing as `n` increases.

**Validates: Requirements 3.2**

### Property 3: Scroll progress maps to valid frame index

*For any* scroll progress value `p` in the range `[0, 1]`, the frame index computed by HeroCanvas SHALL be an integer in the range `[0, 59]` (inclusive), and the mapping SHALL be monotonically non-decreasing (higher scroll progress never selects a lower frame index).

**Validates: Requirements 4.3**

### Property 4: Canvas cover-fill preserves full coverage

*For any* canvas dimensions `(cw, ch)` and any source image dimensions `(iw, ih)`, the object-fit cover draw algorithm SHALL produce a drawn rectangle that fully covers the canvas (no uncovered pixels), and the drawn image SHALL maintain the source aspect ratio.

**Validates: Requirements 4.5**

### Property 5: MarqueeTicker renders all provided taglines

*For any* non-empty array of tagline strings passed as props to `MarqueeTicker`, every string in the array SHALL appear at least once in the rendered DOM output.

**Validates: Requirements 5.4**

### Property 6: FeaturedCollection renders only featured products

*For any* product list passed to `FeaturedCollection`, every rendered `ProductCard` SHALL correspond to a product where `featured === true`, and no product with `featured === false` SHALL be rendered.

**Validates: Requirements 6.1**

### Property 7: ProductCard navigation targets correct slug

*For any* product with slug `s`, clicking the corresponding `ProductCard` SHALL navigate to the route `/product/s`. This property holds for all products on both the FeaturedCollection (Home page) and the ProductGrid (Collection page).

**Validates: Requirements 6.4, 10.4**

### Property 8: Newsletter rejects invalid email addresses

*For any* string that does not match the pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` (including the empty string, strings with no `@`, strings with no domain, and whitespace-only strings), submitting the Newsletter form SHALL display a validation error and SHALL NOT transition to the confirmation state.

**Validates: Requirements 9.3, 9.4**

### Property 9: Product detail page renders all required fields

*For any* valid product slug `s` present in `PRODUCTS`, the `ProductDetailPage` rendered at `/product/s` SHALL display the product's `name`, `price`, `category`, and `description` in the DOM.

**Validates: Requirements 11.2**

### Property 10: Unknown slug renders not-found state

*For any* string `s` that does not match any `slug` in `PRODUCTS`, the `ProductDetailPage` at `/product/s` SHALL render a not-found state (via `notFound()`) rather than throwing an unhandled error or rendering partial product data.

**Validates: Requirements 11.4**

### Property 11: Product images have non-empty alt text

*For any* product in `PRODUCTS`, the `<Image>` component rendered for that product SHALL have a non-empty `alt` prop (either the product name or a placeholder marked for replacement).

**Validates: Requirements 13.3**

### Property 12: Canvas redraws on resize

*For any* sequence of viewport resize events, after each resize the HeroCanvas SHALL update `canvas.width` and `canvas.height` to match the new viewport dimensions and SHALL redraw the frame at the current scroll-derived index, leaving no stale frame dimensions.

**Validates: Requirements 12.3**
