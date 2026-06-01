import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { useTranslation } from '@/i18n/useTranslation'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header() {
  const { t } = useTranslation()

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
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
