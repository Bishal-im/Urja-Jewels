# Implementation Plan: Luxury Jewelry Website

## Overview

Build a cinematic, scroll-driven luxury jewelry website in Next.js 14 App Router with TypeScript and Tailwind CSS. The implementation follows the prescribed build order: project foundation → global layout → home page → collection page → product detail page. GSAP + ScrollTrigger drives canvas and parallax animations; Lenis normalises scroll; Framer Motion handles page transitions and entrance animations.

## Tasks

- [x] 1. Project setup — Next.js, dependencies, Tailwind config, globals.css, fonts
  - [x] 1.1 Scaffold Next.js 14 App Router project with TypeScript and install all runtime dependencies
    - Run `npx create-next-app@latest` with `--typescript --tailwind --app --src-dir=false` flags (or initialise into existing directory)
    - Install runtime deps: `gsap`, `@gsap/react`, `lenis`, `framer-motion`
    - Install dev deps: `fast-check` (for property tests)
    - _Requirements: 1.1, 1.3, 1.6_

  - [x] 1.2 Configure `tailwind.config.ts` with custom color tokens and font families
    - Extend `theme.colors` with: `ivory: '#FAFAF7'`, `obsidian: '#1A1A1A'`, `gold: '#B8973A'`, `mink: '#2C2C2C'`, `stone: '#7A7A6E'`, `pearl: '#FFFFFF'`, `fog: '#E8E8E4'`
    - Extend `theme.fontFamily` with `display: ['var(--font-cormorant)', 'serif']` and `body: ['var(--font-jost)', 'sans-serif']`
    - _Requirements: 1.2_

  - [x] 1.3 Write `styles/globals.css` with base resets and cursor-none rule
    - Import Tailwind directives (`@tailwind base/components/utilities`)
    - Add `body { cursor: none; }` for custom cursor support
    - Add `:focus-visible` outline styles using the `gold` token
    - _Requirements: 2.2, 13.4_

  - [x] 1.4 Create `lib/constants.ts` with Product interface, SiteConfig, and sample data
    - Define `Product`, `SiteConfig`, `NavItem`, `AnimationVariant`, `FrameAnimationState` interfaces
    - Export `PRODUCTS` array with at least 6 products (rings, necklaces, bracelets, earrings), each with `id`, `slug`, `name`, `price`, `category`, `description`, `imageSrc`, `featured`
    - Export `SITE_NAME`, `MARQUEE_TAGS`, `NAV_ITEMS`
    - _Requirements: 1.5_

  - [ ]* 1.5 Write property test for Product data completeness
    - **Property 1: Product data completeness**
    - **Validates: Requirements 1.5**
    - Use `fast-check` to verify every exported product has all required fields with correct types and non-empty string values

  - [x] 1.6 Create `lib/animations.ts` with shared Framer Motion variant presets
    - Export `fadeUp`, `fadeIn`, `staggerContainer`, `slideInLeft` variant objects
    - _Requirements: 6.3, 8.2, 10.6, 11.7_

- [x] 2. Hooks — `useGSAP`, `useFrameAnimation`, `useLenis`
  - [x] 2.1 Implement `hooks/useGSAP.ts`
    - Wrap `gsap.context()` with cleanup via `ctx.revert()` on unmount
    - Accept `callback`, optional `deps`, optional `scope` ref
    - _Requirements: 4.4, 13.2_

  - [x] 2.2 Implement `hooks/useFrameAnimation.ts`
    - Preload `totalFrames` images from `basePath/frame_NNN.jpg`
    - Track `loaded` count; update `progress` (0–1) on both `onload` and `onerror`
    - Set `ready = true` when `loaded === totalFrames`
    - _Requirements: 3.2, 3.5, 4.2_

  - [ ]* 2.3 Write property test for loading progress proportionality
    - **Property 2: Loading progress is proportional**
    - **Validates: Requirements 3.2**
    - Use `fast-check` with `fc.nat()` generators to verify `progress = n / T` and monotonic non-decrease

  - [x] 2.4 Implement `hooks/useLenis.ts`
    - Initialise Lenis with `duration: 1.2` and custom easing
    - Sync with GSAP ticker via `gsap.ticker.add`; set `lagSmoothing(0)`
    - Clean up ticker listener and call `lenis.destroy()` on unmount
    - _Requirements: 2.4, 13.2_

- [x] 3. UI primitives — `Button`, `SectionTitle`, `GoldDivider`
  - [x] 3.1 Implement `components/ui/Button.tsx`
    - Support `variant` (`primary` | `outline` | `ghost`) and `size` (`sm` | `md` | `lg`) props
    - Apply gold color token for primary; visible `:focus-visible` outline
    - Extend `React.ButtonHTMLAttributes<HTMLButtonElement>`
    - _Requirements: 11.5, 13.4_

  - [x] 3.2 Implement `components/ui/SectionTitle.tsx` and `components/ui/GoldDivider.tsx`
    - `SectionTitle`: render optional `eyebrow` (uppercase Jost), `heading` (Cormorant Garamond), optional `subheading`; support `align` prop
    - `GoldDivider`: thin `<hr>` styled with `border-gold`; accept optional `className`
    - _Requirements: 8.4, 13.5_

- [x] 4. Layout components — Navbar, Footer, CustomCursor, SmoothScrollProvider, PageTransition, LoadingScreen
  - [x] 4.1 Implement `components/layout/SmoothScrollProvider.tsx`
    - `'use client'` wrapper that calls `useLenis()` and renders `{children}` unchanged
    - _Requirements: 2.1, 2.4_

  - [x] 4.2 Implement `components/layout/CustomCursor.tsx`
    - `'use client'`; return `null` when `window.matchMedia('(pointer: coarse)').matches`
    - Render dot + ring `<div>` elements; track `mousemove` with RAF lerp for ring trailing
    - Listen for `mouseenter`/`mouseleave` on `[data-cursor-hover]` elements; scale ring 2× and change border to gold on hover
    - _Requirements: 2.2, 2.3, 12.2_

  - [x] 4.3 Implement `components/layout/Navbar.tsx`
    - `'use client'`; use `usePathname()` for active link detection
    - Scroll listener: flip `scrolled` state at `scrollY > 80` → `bg-obsidian/95 backdrop-blur-sm`
    - Mobile `< 768px`: hamburger button toggles Framer Motion drawer (`x: '-100%'` → `x: 0`)
    - Logo left, nav links centre, cart icon right; active link distinct style
    - _Requirements: 2.5, 2.6, 2.7, 12.4_

  - [x] 4.4 Implement `components/layout/Footer.tsx`
    - Static editorial footer with brand links and copyright
    - Use semantic `<footer>` with `<nav>` for link groups
    - _Requirements: 13.5_

  - [x] 4.5 Implement `components/layout/PageTransition.tsx`
    - Wrap `children` in `motion.div` with `initial/animate/exit` variants (`opacity`, `y`)
    - _Requirements: 10.5, 11.7_

  - [x] 4.6 Implement `components/ui/LoadingScreen.tsx`
    - Full-viewport fixed overlay (`z-index: 9999`); accept `progress` (0–1) and `onComplete` props
    - Animate progress bar width as `progress * 100%`
    - Use `AnimatePresence` exit animation (opacity 0, y: -20) when `progress >= 1`; call `onComplete` after exit
    - Add `role="status"` and `aria-live="polite"` with visually hidden percentage text
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 13.6_

  - [x] 4.7 Wire `app/layout.tsx` — fonts, providers, Navbar, Footer, CustomCursor
    - Load `Cormorant_Garamond` and `Jost` via `next/font/google`; apply CSS variables to `<html>`
    - Wrap `<body>` with `SmoothScrollProvider`; render `CustomCursor`, `Navbar`, `<main>{children}</main>`, `Footer`
    - Include `AnimatePresence` keyed by pathname for page transitions
    - _Requirements: 1.4, 2.1, 13.5_

- [x] 5. Checkpoint — layout foundation
  - Ensure all layout components compile without TypeScript errors and the dev server renders the root layout. Ask the user if questions arise.

- [x] 6. Home page sections — HeroCanvas, MarqueeTicker, FeaturedCollection, ParallaxQuote, BrandStory, Newsletter
  - [x] 6.1 Implement `components/home/HeroCanvas.tsx`
    - `'use client'`; call `useFrameAnimation(60, '/frames')` and pass progress to `onLoadProgress`
    - After `ready`, call `onLoadComplete()`
    - Set up GSAP ScrollTrigger: pin canvas wrapper for `window.innerHeight * 4`; map `self.progress` → `drawFrame(Math.round(p * 59))`
    - Implement `drawFrame` with object-fit cover algorithm
    - `ResizeObserver` updates canvas dimensions and redraws current frame
    - Guard `getContext('2d')` for null before drawing
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 12.3_

  - [ ]* 6.2 Write property test for scroll-progress-to-frame-index mapping
    - **Property 3: Scroll progress maps to valid frame index**
    - **Validates: Requirements 4.3**
    - Use `fc.float({ min: 0, max: 1 })` to verify index is integer in `[0, 59]` and mapping is monotonically non-decreasing

  - [ ]* 6.3 Write property test for canvas cover-fill algorithm
    - **Property 4: Canvas cover-fill preserves full coverage**
    - **Validates: Requirements 4.5**
    - Use `fc.tuple(fc.nat({ max: 3840 }), fc.nat({ max: 2160 }))` for canvas and image dimensions; verify drawn rect covers canvas and aspect ratio is preserved

  - [x] 6.4 Implement `components/home/MarqueeTicker.tsx`
    - `'use client'`; render two identical `<span>` rows inside `overflow-hidden`
    - GSAP `fromTo` tween: `x: 0` → `x: '-50%'`, `repeat: -1`, `ease: 'none'`
    - `onMouseEnter` → `tween.pause()`; `onMouseLeave` → `tween.resume()`
    - Accept `items: string[]` and optional `speed` (default 80 px/s)
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 6.5 Write property test for MarqueeTicker tagline rendering
    - **Property 5: MarqueeTicker renders all provided taglines**
    - **Validates: Requirements 5.4**
    - Use `fc.array(fc.string({ minLength: 1 }), { minLength: 1 })` to verify every tagline appears in rendered output

  - [x] 6.6 Implement `components/home/FeaturedCollection.tsx` and `ProductCard` sub-component
    - Filter `PRODUCTS` by `featured === true`
    - Asymmetric 12-column CSS Grid (desktop); single column below 768 px
    - Each card wrapped in `motion.div` with `whileInView` `fadeUp` variant; `viewport={{ once: true }}`
    - Cards link to `/product/[slug]`; images via `next/image` with `data-cursor-hover`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 6.7 Write property test for FeaturedCollection featured-only rendering
    - **Property 6: FeaturedCollection renders only featured products**
    - **Validates: Requirements 6.1**
    - Verify no product with `featured === false` appears in rendered output for any product list

  - [x] 6.8 Implement `components/home/ParallaxQuote.tsx`
    - `'use client'`; GSAP ScrollTrigger `scrub: true`: `yPercent: -15` → `yPercent: 15` on background `<Image>`
    - Overlay centred quote in Cormorant Garamond; optional `author` attribution
    - Accept `quote`, `author`, `imageSrc`, `imageAlt` props
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 6.9 Implement `components/home/BrandStory.tsx`
    - Two-column layout (image + text); stacks vertically below 768 px
    - Text column animates in with `slideInLeft` Framer Motion variant on viewport entry
    - Heading in Cormorant Garamond, body in Jost
    - Accept `heading`, `body`, `imageSrc`, `imageAlt`, `imagePosition` props
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 12.6_

  - [x] 6.10 Implement `components/home/Newsletter.tsx`
    - Controlled form: `useState` for `email`, `error`, `submitted`
    - Validate with `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` before submit
    - On valid: set `submitted = true`, clear `email`; render confirmation `<p>`
    - On invalid: set `error` message, do not clear input
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ]* 6.11 Write property test for Newsletter email validation
    - **Property 8: Newsletter rejects invalid email addresses**
    - **Validates: Requirements 9.3, 9.4**
    - Use `fc.string()` and known-invalid patterns to verify error state is set and `submitted` remains false

  - [x] 6.12 Compose `app/page.tsx` — Home page
    - Render `LoadingScreen` (conditionally until `onComplete`), `HeroCanvas`, `MarqueeTicker`, `FeaturedCollection`, `ParallaxQuote`, `BrandStory`, `Newsletter` in order
    - Manage `loadProgress` and `loadComplete` state; pass callbacks to `HeroCanvas` and `LoadingScreen`
    - Wrap in `PageTransition`
    - _Requirements: 3.1, 3.6, 4.6_

- [x] 7. Checkpoint — Home page
  - Ensure the Home page renders end-to-end with no TypeScript or runtime errors. Verify LoadingScreen, HeroCanvas, MarqueeTicker, FeaturedCollection, ParallaxQuote, BrandStory, and Newsletter are all present. Ask the user if questions arise.

- [x] 8. Collection page
  - [x] 8.1 Implement `components/collection/CollectionHero.tsx`
    - Static editorial header; accept `title` and optional `subtitle` props
    - Animate in with `fadeUp` variant on mount
    - _Requirements: 10.1_

  - [x] 8.2 Implement `components/collection/ProductFilter.tsx`
    - `'use client'`; render category filter buttons
    - Accept `categories: string[]`, `active: string`, `onChange` callback
    - Active button styled with gold underline or background
    - _Requirements: 10.2_

  - [x] 8.3 Implement `components/collection/ProductMasonryGrid.tsx`
    - Responsive grid: 1 col / 2 col / 3 col / 4 col at 480/768/1024/1280 px breakpoints
    - Staggered Framer Motion entrance using `staggerContainer` + `fadeUp` variants with `whileInView`
    - Each `ProductCard` links to `/product/[slug]`; `data-cursor-hover` on cards
    - Accept `products: Product[]`
    - _Requirements: 10.3, 10.4, 10.6_

  - [x] 8.4 Compose `app/collection/page.tsx`
    - Import all products from `lib/constants.ts`; manage `activeCategory` state for filtering
    - Render `CollectionHero`, `ProductFilter`, `ProductMasonryGrid` (filtered products)
    - Wrap in `PageTransition`
    - _Requirements: 10.1, 10.2, 10.5_

- [x] 9. Checkpoint — Collection page
  - Ensure the Collection page renders all products, filter buttons work, and staggered entrance animations fire. Ask the user if questions arise.

- [x] 10. Product detail page
  - [x] 10.1 Implement `components/product/ProductImageGallery.tsx`
    - Display main product image via `next/image` with `priority`; accept `imageSrc`, `imageAlt`, `name`
    - Animate in with `fadeIn` Framer Motion variant
    - _Requirements: 11.2, 11.3, 11.7, 13.1, 13.3_

  - [ ]* 10.2 Write property test for product image alt text
    - **Property 11: Product images have non-empty alt text**
    - **Validates: Requirements 13.3**
    - Verify every product in `PRODUCTS` has a non-empty `imageSrc` and that the rendered `<Image>` receives a non-empty `alt` prop

  - [x] 10.3 Implement `components/product/ProductInfo.tsx`
    - Display `name` (Cormorant Garamond), formatted `price` (USD), `category` badge, `description` (Jost)
    - Render "Add to Cart" `<Button variant="primary">` and "Back to Collection" `<Link>`
    - Animate text block in with `slideInLeft` variant
    - Accept `product: Product`
    - _Requirements: 11.2, 11.5, 11.6, 11.7_

  - [ ]* 10.4 Write property test for product detail required fields
    - **Property 9: Product detail page renders all required fields**
    - **Validates: Requirements 11.2**
    - For every valid slug in `PRODUCTS`, verify `name`, `price`, `category`, `description` appear in rendered output

  - [x] 10.5 Implement `components/product/RelatedProducts.tsx`
    - Filter `PRODUCTS` by same `category`, exclude `currentSlug`
    - Render up to 4 related `ProductCard` items in a responsive row
    - Accept `currentSlug: string` and `category: Product['category']`
    - _Requirements: 10.3_

  - [x] 10.6 Compose `app/product/[slug]/page.tsx`
    - Export `generateStaticParams` returning all product slugs
    - Look up product by slug; call `notFound()` if not found
    - Render `ProductImageGallery`, `ProductInfo`, `RelatedProducts`
    - Wrap in `PageTransition`
    - _Requirements: 11.1, 11.4, 11.7_

  - [ ]* 10.7 Write property test for unknown slug not-found behaviour
    - **Property 10: Unknown slug renders not-found state**
    - **Validates: Requirements 11.4**
    - Verify that for any string not in `PRODUCTS` slugs, the lookup returns `undefined` and `notFound()` would be called

- [x] 11. Checkpoint — Product detail page
  - Ensure the Product Detail page renders correctly for all valid slugs and calls `notFound()` for unknown slugs. Verify animations fire on mount. Ask the user if questions arise.

- [x] 12. Responsive polish and accessibility audit
  - [x] 12.1 Audit and fix responsive breakpoints across all pages and components
    - Verify Navbar hamburger at < 768 px, FeaturedCollection single-column at < 768 px, BrandStory stacked at < 768 px, ProductGrid column counts at all breakpoints
    - _Requirements: 12.1, 12.4, 12.5, 12.6_

  - [ ]* 12.2 Write property test for canvas resize-and-redraw
    - **Property 12: Canvas redraws on resize**
    - **Validates: Requirements 12.3**
    - Simulate resize events and verify canvas dimensions update and `drawFrame` is called with the current frame index

  - [x] 12.3 Accessibility pass — semantic HTML, focus indicators, ARIA
    - Confirm `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>` used throughout
    - Verify all `next/image` instances have non-empty `alt` props
    - Confirm `LoadingScreen` has `role="status"` and `aria-live="polite"`
    - Confirm keyboard navigation works for Navbar, ProductCard grid, Newsletter form
    - _Requirements: 13.3, 13.4, 13.5, 13.6_

- [x] 13. Final checkpoint — full site
  - Ensure all tests pass, all pages compile, and the dev server runs without errors. Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at each major milestone
- Property tests use `fast-check` and validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All `next/image` instances include `<!-- REPLACE IMAGE -->` and `<!-- REPLACE ALT -->` comments where real assets are not yet available
- The HeroCanvas requires 60 JPEG frames at `/public/frames/frame_001.jpg` through `/public/frames/frame_060.jpg` — placeholder images should be added before testing the scroll animation

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["1.4", "1.6"] },
    { "id": 2, "tasks": ["1.5", "2.1", "2.2", "3.1", "3.2"] },
    { "id": 3, "tasks": ["2.3", "2.4", "4.1", "4.2", "4.3", "4.4", "4.5", "4.6"] },
    { "id": 4, "tasks": ["4.7"] },
    { "id": 5, "tasks": ["6.1", "6.4", "6.6", "6.8", "6.9", "6.10"] },
    { "id": 6, "tasks": ["6.2", "6.3", "6.5", "6.7", "6.11", "6.12"] },
    { "id": 7, "tasks": ["8.1", "8.2", "8.3"] },
    { "id": 8, "tasks": ["8.4"] },
    { "id": 9, "tasks": ["10.1", "10.3", "10.5"] },
    { "id": 10, "tasks": ["10.2", "10.4", "10.6"] },
    { "id": 11, "tasks": ["10.7", "12.1", "12.3"] },
    { "id": 12, "tasks": ["12.2"] }
  ]
}
```
