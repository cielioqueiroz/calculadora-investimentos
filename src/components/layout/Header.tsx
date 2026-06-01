import { NavLink, Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n/useTranslation'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header() {
  const { t } = useTranslation()

  const mobileNav = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/simulador', label: t('nav.simulator'), end: false },
    { to: '/comparar', label: t('nav.compare'), end: false },
    { to: '/historico', label: t('nav.history'), end: false },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border/15 bg-background/70 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-metal text-[hsl(228_11%_5%)] shadow-gold">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <span className="block font-display text-base font-semibold tracking-tight text-foreground">
              InvestCalc
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              {t('header.tagline')}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1 md:hidden">
            {mobileNav.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
