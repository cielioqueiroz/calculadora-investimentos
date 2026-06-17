import { useEffect } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'

interface AnimatedNumberProps {
  value: number
  format: (value: number) => string
  className?: string
}

export function AnimatedNumber({ value, format, className }: AnimatedNumberProps) {
  const reduce = useReducedMotion()
  const motionValue = useMotionValue(value)
  const text = useTransform(motionValue, (v) => format(v))

  useEffect(() => {
    if (reduce) {
      motionValue.set(value)
      return
    }
    const controls = animate(motionValue, value, {
      duration: 0.6,
      ease: 'easeOut',
    })
    return () => controls.stop()
  }, [value, reduce, motionValue])

  return <motion.span className={className}>{text}</motion.span>
}
