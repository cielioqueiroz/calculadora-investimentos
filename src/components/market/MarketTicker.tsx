import { useMemo } from 'react'
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
      <span className="text-border/40">|</span>
    </span>
  )
}

export function MarketTicker() {
  const { locale } = useTranslation()
  const b3 = useMarketData('b3')
  const forex = useMarketData('forex')
  const crypto = useMarketData('crypto')

  const combined = useMemo(
    () => [...b3.data, ...forex.data, ...crypto.data],
    [b3.data, forex.data, crypto.data],
  )

  const isDemo = b3.status === 'snapshot'

  const loop = useMemo(
    () => (combined.length ? [...combined, ...combined] : []),
    [combined],
  )

  return (
    <div
      className="group relative flex overflow-hidden border-b border-border/15 bg-background/60"
      aria-hidden="true"
    >
      {isDemo && (
        <span className="absolute left-0 top-0 z-10 flex h-full items-center bg-background/90 px-2 text-[10px] font-medium uppercase text-muted-foreground">
          demo
        </span>
      )}
      <div className="flex w-max shrink-0 animate-marquee items-center py-1.5 group-hover:[animation-play-state:paused]">
        {loop.map((quote, i) => (
          <TickerItem key={`${quote.symbol}-${i}`} quote={quote} locale={locale} />
        ))}
        {loop.map((quote, i) => (
          <TickerItem key={`dup-${quote.symbol}-${i}`} quote={quote} locale={locale} />
        ))}
      </div>
    </div>
  )
}
