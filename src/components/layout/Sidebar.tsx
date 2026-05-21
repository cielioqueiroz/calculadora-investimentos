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
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card/40 md:block">
      <nav className="sticky top-16 flex flex-col gap-1 p-4">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
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
