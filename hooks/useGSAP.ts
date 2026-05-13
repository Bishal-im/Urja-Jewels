'use client'

import { useEffect } from 'react'
import gsap from 'gsap'

/**
 * Thin wrapper around `gsap.context()` that registers and cleans up a GSAP
 * context tied to an optional container ref.
 *
 * - Wraps the callback in `gsap.context()` so all tweens/timelines created
 *   inside are scoped and can be reverted atomically.
 * - Calls `ctx.revert()` on unmount (or when deps change) to prevent memory
 *   leaks and stale animations.
 *
 * @param callback - Function that creates GSAP animations. Receives the
 *                   `gsap.Context` instance as its argument.
 * @param deps     - Dependency array passed to the underlying `useEffect`.
 *                   Defaults to `[]` (run once on mount).
 * @param scope    - Optional ref to a DOM element. When provided, GSAP scopes
 *                   selector strings inside the callback to that element.
 */
export function useGSAP(
  callback: (context: gsap.Context) => void,
  deps: React.DependencyList = [],
  scope?: React.RefObject<Element>
): void {
  useEffect(() => {
    const ctx = gsap.context(callback, scope?.current ?? undefined)
    return () => ctx.revert()
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}
