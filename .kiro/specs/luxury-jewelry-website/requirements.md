# Requirements Document

## Introduction

A luxury jewelry animation website built with Next.js 14 App Router, inspired by Cartier.com. The site features a cinematic scroll-driven canvas animation, rich motion design, and an editorial aesthetic that communicates brand prestige. The stack combines GSAP + ScrollTrigger, Lenis smooth scroll, and Framer Motion to deliver a high-end interactive experience across three pages: Home, Collection, and Product Detail. All components are custom-built with no UI kits or jQuery.

## Glossary

- **Site**: The Next.js 14 App Router luxury jewelry website
- **HeroCanvas**: The scroll-driven canvas animation component that sequences 60 JPEG frames as the user scrolls
- **LoadingScreen**: The full-screen overlay with a progress bar shown while HeroCanvas frames are preloaded
- **CustomCursor**: The custom SVG/DOM cursor that replaces the browser default cursor on desktop
- **Navbar**: The top navigation bar with logo, links, and cart icon
- **MarqueeTicker**: The horizontally scrolling marquee strip displaying brand taglines
- **FeaturedCollection**: The editorial grid section showcasing highlighted collection items
- **ProductGrid**: The responsive grid of product cards used on the Collection page
- **ProductCard**: An individual product card displaying image, name, and price
- **ParallaxQuote**: The full-width section with a parallax background image and an overlaid editorial quote
- **BrandStory**: The split-layout section combining an image with brand narrative text
- **Newsletter**: The email capture section at the bottom of the Home page
- **CollectionPage**: The `/collection` route listing all products in a grid
- **ProductDetailPage**: The `/product/[slug]` dynamic route showing a single product's full details
- **GSAP**: GreenSock Animation Platform, used for timeline and scroll-triggered animations
- **ScrollTrigger**: GSAP plugin that ties animations to scroll position
- **Lenis**: Smooth-scroll library that normalises scroll velocity across browsers
- **Framer Motion**: React animation library used for page transitions and component entrance animations
- **Cormorant Garamond**: The serif display typeface loaded via `next/font/google`
- **Jost**: The sans-serif body typeface loaded via `next/font/google`
- **Color System**: The design token palette — ivory, obsidian, gold, mink, stone, pearl, fog
- **lib/constants.ts**: The file containing sample product data and site-wide constants
- **Slug**: A URL-safe string identifier for a product, e.g. `eternal-rose-ring`

---

## Requirements

### Requirement 1 — Project Foundation & Tech Stack

**User Story:** As a developer, I want a correctly configured Next.js 14 App Router project with TypeScript and Tailwind CSS, so that the codebase is type-safe, maintainable, and uses utility-first styling.

#### Acceptance Criteria

1. THE Site SHALL be bootstrapped as a Next.js 14 project using the App Router (`app/` directory) with TypeScript enabled.
2. THE Site SHALL include Tailwind CSS configured with a custom theme that exposes the Color System tokens (ivory, obsidian, gold, mink, stone, pearl, fog) as named Tailwind colors.
3. THE Site SHALL install and configure GSAP (with ScrollTrigger plugin), Lenis, and Framer Motion as runtime dependencies.
4. THE Site SHALL load Cormorant Garamond and Jost via `next/font/google` and apply them as CSS variables accessible throughout the application.
5. THE Site SHALL define `lib/constants.ts` containing at least six sample product objects, each with fields: `id`, `slug`, `name`, `price`, `category`, `description`, `imageSrc`, and `featured` flag.
6. THE Site SHALL NOT depend on jQuery, Bootstrap, or any third-party UI component kit.

---

### Requirement 2 — Global Layout & Custom Cursor

**User Story:** As a visitor, I want a cohesive global layout with a custom cursor and smooth scrolling, so that the browsing experience feels premium and intentional.

#### Acceptance Criteria

1. THE Site SHALL render a root layout (`app/layout.tsx`) that wraps all pages with the Navbar, CustomCursor, and Lenis smooth-scroll provider.
2. THE CustomCursor SHALL replace the native browser cursor on pointer devices by setting `cursor: none` on the `<body>` and rendering a custom DOM element that tracks `mousemove` events.
3. WHEN the cursor hovers over an interactive element (link, button, or product card), THE CustomCursor SHALL scale up and change appearance to indicate interactivity.
4. WHILE Lenis is active, THE Site SHALL deliver smooth, normalised scroll behaviour with a configurable easing duration of no less than 0.8 seconds.
5. THE Navbar SHALL display the brand logo on the left, navigation links (Home, Collection, About, Contact) in the centre, and a cart icon on the right.
6. WHEN a navigation link is active (matches the current route), THE Navbar SHALL apply a distinct visual style (e.g. underline or colour change) to that link.
7. THE Navbar SHALL remain legible against both light and dark page sections by supporting a transparent-to-solid scroll transition.

---

### Requirement 3 — Loading Screen

**User Story:** As a visitor, I want a loading screen with a progress bar while assets are fetched, so that I see a polished entry experience rather than a flash of unstyled content.

#### Acceptance Criteria

1. WHEN the Home page first mounts, THE LoadingScreen SHALL be displayed as a full-viewport overlay covering all page content.
2. WHILE HeroCanvas frames are being preloaded, THE LoadingScreen SHALL display a progress bar that advances proportionally to the number of frames loaded (0 % to 100 %).
3. WHEN all 60 frames have finished loading, THE LoadingScreen SHALL animate out (fade or slide) and reveal the page content beneath.
4. THE LoadingScreen SHALL display the brand name or logo centred on the overlay during the loading period.
5. IF a frame fails to load, THE LoadingScreen SHALL continue advancing progress and SHALL NOT block the reveal animation indefinitely.

---

### Requirement 4 — HeroCanvas Scroll Animation

**User Story:** As a visitor, I want a cinematic scroll-driven frame animation at the top of the Home page, so that scrolling through the hero section feels like watching a film.

#### Acceptance Criteria

1. THE HeroCanvas SHALL render a full-viewport `<canvas>` element pinned to the viewport while the user scrolls through a dedicated scroll container.
2. THE HeroCanvas SHALL load exactly 60 JPEG frames from the paths `/public/frames/frame_001.jpg` through `/public/frames/frame_060.jpg`.
3. WHEN the user scrolls through the hero scroll container, THE HeroCanvas SHALL map the scroll progress (0 % to 100 %) to the frame index (1 to 60) and draw the corresponding frame on the canvas.
4. THE HeroCanvas SHALL use GSAP ScrollTrigger to pin the canvas and drive the frame-index calculation from scroll position.
5. THE HeroCanvas SHALL draw each frame scaled to cover the full canvas dimensions while preserving the frame's aspect ratio (object-fit: cover behaviour).
6. WHILE frames are being preloaded, THE HeroCanvas SHALL display the LoadingScreen progress bar rather than a blank canvas.

---

### Requirement 5 — Marquee Ticker

**User Story:** As a visitor, I want a continuously scrolling text marquee between page sections, so that the site communicates brand messaging in a dynamic, editorial way.

#### Acceptance Criteria

1. THE MarqueeTicker SHALL display a horizontally scrolling strip of repeated brand tagline text that loops infinitely without gaps.
2. THE MarqueeTicker SHALL animate using CSS or GSAP at a constant, configurable speed regardless of viewport width.
3. WHEN the user hovers over the MarqueeTicker, THE MarqueeTicker SHALL pause the scrolling animation.
4. THE MarqueeTicker SHALL support a configurable list of tagline strings passed as props.

---

### Requirement 6 — Featured Collection Section

**User Story:** As a visitor, I want to see a curated editorial grid of featured products on the Home page, so that I can discover highlighted pieces without navigating away.

#### Acceptance Criteria

1. THE FeaturedCollection SHALL render only products from `lib/constants.ts` where the `featured` flag is `true`.
2. THE FeaturedCollection SHALL display products in an asymmetric editorial grid layout that differs from a uniform column grid.
3. WHEN a product card within FeaturedCollection enters the viewport, THE FeaturedCollection SHALL trigger a Framer Motion entrance animation (e.g. fade-up or reveal).
4. WHEN a visitor clicks a product card in FeaturedCollection, THE Site SHALL navigate to the corresponding `/product/[slug]` route.
5. THE FeaturedCollection SHALL display each product's image using `next/image` with a `<!-- REPLACE IMAGE -->` comment marking where real assets plug in.

---

### Requirement 7 — Parallax Quote Section

**User Story:** As a visitor, I want a full-width parallax section with an editorial quote, so that the page has visual breathing room and communicates brand philosophy.

#### Acceptance Criteria

1. THE ParallaxQuote SHALL render a full-viewport-width section with a background image that moves at a slower rate than the page scroll (parallax effect).
2. THE ParallaxQuote SHALL overlay a centred editorial quote in Cormorant Garamond display type on top of the parallax background.
3. THE ParallaxQuote SHALL implement the parallax offset using GSAP ScrollTrigger so that the background image translates vertically as the section scrolls into and out of view.
4. THE ParallaxQuote background image SHALL use `next/image` with a `<!-- REPLACE IMAGE -->` comment.

---

### Requirement 8 — Brand Story Section

**User Story:** As a visitor, I want a split-layout brand story section, so that I can learn about the brand's heritage in an immersive, editorial format.

#### Acceptance Criteria

1. THE BrandStory SHALL render a two-column layout with an image occupying one column and brand narrative text occupying the other.
2. WHEN the BrandStory section enters the viewport, THE BrandStory SHALL animate the text column in using Framer Motion (e.g. slide-in from the side).
3. THE BrandStory image SHALL use `next/image` with a `<!-- REPLACE IMAGE -->` comment.
4. THE BrandStory text SHALL include a heading in Cormorant Garamond and body copy in Jost.

---

### Requirement 9 — Newsletter Section

**User Story:** As a visitor, I want to subscribe to the brand newsletter from the Home page, so that I can receive updates about new collections and events.

#### Acceptance Criteria

1. THE Newsletter SHALL render an email input field and a submit button within a visually distinct section at the bottom of the Home page.
2. WHEN a visitor submits the Newsletter form with a valid email address, THE Newsletter SHALL display a confirmation message and clear the input field.
3. IF a visitor submits the Newsletter form with an empty or invalid email address, THEN THE Newsletter SHALL display an inline validation error message without submitting the form.
4. THE Newsletter SHALL validate email format on the client side before any submission attempt.

---

### Requirement 10 — Collection Page

**User Story:** As a visitor, I want to browse all products on a dedicated Collection page, so that I can explore the full range of offerings in one place.

#### Acceptance Criteria

1. THE CollectionPage SHALL be accessible at the `/collection` route.
2. THE CollectionPage SHALL render all products from `lib/constants.ts` using the ProductGrid component.
3. THE ProductGrid SHALL display ProductCards in a responsive grid: 1 column at 480 px, 2 columns at 768 px, 3 columns at 1024 px, and 4 columns at 1280 px.
4. WHEN a visitor clicks a ProductCard, THE Site SHALL navigate to the corresponding `/product/[slug]` route.
5. THE CollectionPage SHALL include a page-level Framer Motion transition animation on mount.
6. WHEN the CollectionPage mounts, THE CollectionPage SHALL animate ProductCards into view in a staggered sequence using Framer Motion.

---

### Requirement 11 — Product Detail Page

**User Story:** As a visitor, I want to view a product's full details on a dedicated page, so that I can make an informed decision about a piece.

#### Acceptance Criteria

1. THE ProductDetailPage SHALL be accessible at the `/product/[slug]` dynamic route.
2. WHEN a valid slug is provided, THE ProductDetailPage SHALL display the product's name, price, category, description, and image.
3. THE ProductDetailPage image SHALL use `next/image` with a `<!-- REPLACE IMAGE -->` comment.
4. IF an invalid or unknown slug is provided, THEN THE ProductDetailPage SHALL render a 404-style not-found state rather than crashing.
5. THE ProductDetailPage SHALL include an "Add to Cart" button styled consistently with the site's Color System.
6. THE ProductDetailPage SHALL include a "Back to Collection" link that navigates to `/collection`.
7. WHEN the ProductDetailPage mounts, THE ProductDetailPage SHALL animate the product image and text into view using Framer Motion.

---

### Requirement 12 — Responsive Design

**User Story:** As a visitor on any device, I want the site to be fully usable and visually correct, so that the luxury experience is not degraded on smaller screens.

#### Acceptance Criteria

1. THE Site SHALL be responsive at the following breakpoints: 480 px, 768 px, 1024 px, and 1280 px.
2. THE CustomCursor SHALL be hidden on touch/pointer-coarse devices and SHALL NOT interfere with native touch interactions.
3. THE HeroCanvas SHALL resize and redraw the current frame whenever the viewport dimensions change.
4. THE Navbar SHALL collapse navigation links into a mobile menu (hamburger or drawer) at viewports narrower than 768 px.
5. THE FeaturedCollection asymmetric grid SHALL reflow to a single-column layout at viewports narrower than 768 px.
6. THE BrandStory two-column layout SHALL stack vertically at viewports narrower than 768 px.

---

### Requirement 13 — Performance & Accessibility

**User Story:** As a visitor and as a developer, I want the site to load efficiently and meet baseline accessibility standards, so that the experience is inclusive and does not penalise users on slower connections.

#### Acceptance Criteria

1. THE Site SHALL use `next/image` for all images to enable automatic optimisation, lazy loading, and responsive `srcset` generation.
2. THE Site SHALL load GSAP and Lenis only on the client side (using dynamic imports or `'use client'` directives) to avoid server-side rendering errors.
3. THE Site SHALL provide meaningful `alt` text for all `next/image` instances; placeholder alt text SHALL be marked with a `<!-- REPLACE ALT -->` comment where real copy is not yet available.
4. THE Navbar, ProductCard, and Newsletter form SHALL be keyboard-navigable and SHALL have visible focus indicators.
5. THE Site SHALL use semantic HTML elements (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<nav>`) throughout all pages and components.
6. THE LoadingScreen SHALL use an ARIA live region or `role="status"` so that screen readers can announce loading progress.
