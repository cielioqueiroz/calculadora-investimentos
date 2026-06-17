import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useMarketData } from '@/lib/market/useMarketData'
import { formatPrice, formatSignedPercent } from '@/lib/market/format'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'
import type { Quote } from '@/lib/market/types'

function pick(quotes: Quote[], symbol: string): Quote | undefined {
  return quotes.find((q) => q.symbol === symbol)
}

export function MarketSummary() {
  const { t, locale } = useTranslation()
  const b3 = useMarketData('b3')
  const forex = useMarketData('forex')
  const crypto = useMarketData('crypto')

  const highlights = [
    pick(b3.data, '^BVSP'),
    pick(forex.data, 'USD'),
    pick(crypto.data, 'BTC'),
  ].filter((q): q is Quote => Boolean(q))

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{t('home.market.title')}</h3>
          <Link
            to="/mercado"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            {t('home.market.cta')}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {highlights.map((q) => {
            const up = q.changePercent >= 0
            return (
              <div
                key={q.symbol}
                className="rounded-md border border-border/15 bg-background/40 p-3"
              >
                <p className="truncate text-xs text-muted-foreground">{q.name}</p>
                <p className="truncate font-display text-base font-semibold tabular-nums text-foreground">
                  {formatPrice(q.price, q.currency, locale)}
                </p>
                <p
                  className={cn(
                    'text-xs font-medium tabular-nums',
                    up ? 'text-success' : 'text-destructive',
                  )}
                >
                  {formatSignedPercent(q.changePercent)}
                </p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
