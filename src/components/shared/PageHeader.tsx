import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  action?: ReactNode
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h1 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h1>
      {action}
    </div>
  )
}
