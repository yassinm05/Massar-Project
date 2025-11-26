'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'

export const MotionPath = motion.path
export const MotionUl = motion.ul
export const MotionP = motion.p
export const MotionH1 = motion.h1
export const MotionH3 = motion.h3
export const MotionH5 = motion.h5

type MotionDivProps = React.ComponentProps<typeof motion.div> & {
  children?: ReactNode
}

export function MotionDiv({
  children,
  initial = { opacity: 0, x: 100 },
  animate = { opacity: 1, x: 0 },
  transition = { duration: 0.7, ease: "easeOut" },
  ...props
}: MotionDivProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      {...props}
      initial={initial}
      animate={isInView ? animate : initial}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}