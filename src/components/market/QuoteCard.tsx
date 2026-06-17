import { Card, CardContent } from '@/components/ui/card'
import { Sparkline } from './Sparkline'
import { formatPrice, formatSignedPercent, formatCompact } from '@/lib/market/format'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'
import type { Quote } from '@/lib/market/types'

interface QuoteCardProps {
  quote: Quote
  onSimulate?: (quote: Quote) => void
}

export function QuoteCard({ quote, onSimulate }: QuoteCardProps) {
  const { t, locale } = useTranslation()
  const up = quote.changePercent >= 0

  return (
    <Card className="animate-fade-in transition-colors hover:border-primary/40">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{quote.symbol}</p>
            <p className="truncate text-xs text-muted-foreground">{quote.name}</p>
          </div>
          <span className={cn('shrink-0 text-sm font-medium tabular-nums', up ? 'text-success' : 'text-destructive')}>
            {formatSignedPercent(quote.changePercent)}
          </span>
        </div>

        <p className="font-display text-xl font-semibold tabular-nums text-foreground">
          {formatPrice(quote.price, quote.currency, locale)}
        </p>

        {quote.sparkline && quote.sparkline.length > 1 && (
          <Sparkline data={quote.sparkline} up={up} />
        )}

        <div className="flex items-center justify-between pt-1">
          {quote.marketCap ? (
            <span className="text-[11px] text-muted-foreground">
              {t('market.marketCap')}: {formatCompact(quote.marketCap, locale)}
            </span>
          ) : (
            <span />
          )}
          {onSimulate && (
            <button
              type="button"
              onClick={() => onSimulate(quote)}
              className="rounded-md border border-border/15 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {t('market.simulate')}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
