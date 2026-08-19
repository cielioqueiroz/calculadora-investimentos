import { Link } from 'react-router-dom'
import { useTranslation } from '@/i18n/useTranslation'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MarketTicker } from '@/components/market/MarketTicker'

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-40 border-b border-border/15 bg-background/70 backdrop-blur-xl">
      <MarketTicker />
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-gold-metal font-display text-base font-bold text-[hsl(228_11%_5%)] shadow-gold">
            R
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-semibold tracking-tight text-foreground">
              Rendimento
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              {t('app.tagline')}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
