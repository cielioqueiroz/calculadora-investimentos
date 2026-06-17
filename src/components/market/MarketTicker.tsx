import { useMarketData } from '@/lib/market/useMarketData'
import { formatPrice, formatSignedPercent } from '@/lib/market/format'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'
import type { Quote } from '@/lib/market/types'

function TickerItem({ quote, locale }: { quote: Quote; locale: string }) {
  const up = quote.changePercent >= 0
  return (
    <span className="inline-flex items-center gap-2 px-4 text-xs tabular-nums">
      <span className="font-medium text-foreground">{quote.symbol}</span>
      <span className="text-muted-foreground">
        {formatPrice(quote.price, quote.currency, locale)}
      </span>
      <span className={cn('font-medium', up ? 'text-success' : 'text-destructive')}>
        {formatSignedPercent(quote.changePercent)}
      </span>
    </span>
  )
}

export function MarketTicker() {
  const { locale } = useTranslation()
  const { data, status } = useMarketData('b3')
  const items = data.length ? [...data, ...data] : []

  return (
    <div
      className="group relative flex overflow-hidden border-b border-border/15 bg-background/60"
      aria-hidden="true"
    >
      {status === 'snapshot' && (
        <span className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
          demo
        </span>
      )}
      <div className="flex min-w-full shrink-0 animate-marquee items-center py-1.5 group-hover:[animation-play-state:paused]">
        {items.map((quote, i) => (
          <TickerItem key={`${quote.symbol}-${i}`} quote={quote} locale={locale} />
        ))}
      </div>
    </div>
  )
}
