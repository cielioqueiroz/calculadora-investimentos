import { NavLink } from 'react-router-dom'
import { Calculator, GitCompareArrows, History, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n/useTranslation'

export function Sidebar() {
  const { t } = useTranslation()

  const navItems = [
    { to: '/', label: t('nav.home'), icon: LayoutDashboard, end: true },
    { to: '/simulador', label: t('nav.simulator'), icon: Calculator, end: false },
    { to: '/comparar', label: t('nav.compare'), icon: GitCompareArrows, end: false },
    { to: '/historico', label: t('nav.history'), icon: History, end: false },
  ]

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border/15 bg-card/30 md:block">
      <nav className="sticky top-16 flex flex-col gap-1 p-4">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                'before:absolute before:left-0 before:top-1/2 before:h-0 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-primary before:transition-all',
                isActive
                  ? 'text-primary before:h-5'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
