import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/lib/navigation'
import { useTranslation } from '@/i18n/useTranslation'

export function MobileNav() {
  const { t } = useTranslation()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/15 bg-background/80 backdrop-blur-xl md:hidden">
      <div className="flex items-stretch justify-around pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map(({ to, labelKey, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 px-1 py-2 text-[11px] transition-colors',
                isActive
                  ? 'font-medium text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span className="truncate">{t(labelKey)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
