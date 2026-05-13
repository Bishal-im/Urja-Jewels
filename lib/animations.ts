import type { TargetAndTransition, Variants } from 'framer-motion'

export interface AnimationVariant extends Variants {
  hidden: TargetAndTransition
  visible: TargetAndTransition
}

export const fadeUp: AnimationVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export const fadeIn: AnimationVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
}

export const staggerContainer: AnimationVariant = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export const slideInLeft: AnimationVariant = {
  hidden: { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}
