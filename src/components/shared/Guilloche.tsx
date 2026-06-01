import { cn } from '@/lib/utils'

interface GuillocheProps {
  className?: string
}

/**
 * Engraved banknote-style texture. Decorative only.
 * Renders concentric guilloché arcs in the current gold tone at low opacity.
 */
export function Guilloche({ className }: GuillocheProps) {
  return (
    <svg
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 600 400"
      fill="none"
    >
      <defs>
        <pattern id="guilloche" width="48" height="48" patternUnits="userSpaceOnUse">
          <circle cx="24" cy="24" r="20" stroke="hsl(var(--primary))" strokeWidth="0.6" fill="none" />
          <circle cx="24" cy="24" r="13" stroke="hsl(var(--primary))" strokeWidth="0.6" fill="none" />
          <circle cx="0" cy="0" r="20" stroke="hsl(var(--primary))" strokeWidth="0.6" fill="none" />
          <circle cx="48" cy="48" r="20" stroke="hsl(var(--primary))" strokeWidth="0.6" fill="none" />
        </pattern>
      </defs>
      <rect width="600" height="400" fill="url(#guilloche)" />
    </svg>
  )
}
