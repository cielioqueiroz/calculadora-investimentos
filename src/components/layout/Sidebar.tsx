import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/lib/navigation'
import { useTranslation } from '@/i18n/useTranslation'

export function Sidebar() {
  const { t } = useTranslation()

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border/15 bg-card/30 md:block">
      <nav className="sticky top-16 flex flex-col gap-0.5 p-3">
        {NAV_ITEMS.map(({ to, labelKey, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                'before:absolute before:left-0 before:top-1/2 before:h-0 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-primary before:transition-all',
                isActive
                  ? 'font-medium text-primary before:h-5'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
              )
            }
          >
            <Icon className="h-4 w-4" />
            {t(labelKey)}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
