import { NavLink } from 'react-router-dom'
import { Calculator, GitCompareArrows, History, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n/useTranslation'

export function MobileNav() {
  const { t } = useTranslation()

  const navItems = [
    { to: '/', label: t('nav.home'), icon: LayoutDashboard, end: true },
    { to: '/simulador', label: t('nav.simulator'), icon: Calculator, end: false },
    { to: '/comparar', label: t('nav.compare'), icon: GitCompareArrows, end: false },
    { to: '/historico', label: t('nav.history'), icon: History, end: false },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/15 bg-background/80 backdrop-blur-xl md:hidden">
      <div className="flex items-stretch justify-around pb-[env(safe-area-inset-bottom)]">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 px-1 py-2 text-[11px] font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
