import { useMarketData } from '@/lib/market/useMarketData'
import { FreshnessBadge } from './FreshnessBadge'
import { Sparkline } from './Sparkline'
import {
  formatPrice,
  formatSignedPercent,
  formatCompact,
} from '@/lib/market/format'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'
import type { MarketSource, Quote } from '@/lib/market/types'

interface MarketTableProps {
  source: MarketSource
  title: string
  onSimulate?: (quote: Quote) => void
}

export function MarketTable({ source, title, onSimulate }: MarketTableProps) {
  const { data, status, updatedAt, loading } = useMarketData(source)
  const { t, locale } = useTranslation()

  const hasCap = data.some((quote) => quote.marketCap)
  const hasTrend = data.some((quote) => quote.sparkline?.length)

  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </h2>
        <FreshnessBadge status={status} updatedAt={updatedAt} />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/15 bg-card/40">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border/15 text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2 text-left font-medium">
                {t('market.col.asset')}
              </th>
              <th className="px-3 py-2 text-right font-medium">
                {t('market.col.price')}
              </th>
              <th className="px-3 py-2 text-right font-medium">
                {t('market.col.change')}
              </th>
              {hasTrend && (
                <th className="hidden px-3 py-2 text-right font-medium sm:table-cell">
                  {t('market.col.trend')}
                </th>
              )}
              {hasCap && (
                <th className="hidden px-3 py-2 text-right font-medium lg:table-cell">
                  {t('market.col.cap')}
                </th>
              )}
              {onSimulate && <th className="w-10 px-3 py-2" />}
            </tr>
          </thead>
          <tbody>
            {loading && status === 'snapshot'
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/10 last:border-0">
                    <td colSpan={6} className="px-3 py-3">
                      <span className="block h-4 w-full animate-pulse rounded bg-muted/60" />
                    </td>
                  </tr>
                ))
              : data.map((quote) => {
                  const up = quote.changePercent >= 0
                  return (
                    <tr
                      key={quote.symbol}
                      className="border-b border-border/10 transition-colors last:border-0 hover:bg-accent/40"
                    >
                      <td className="px-3 py-2.5">
                        <span className="font-medium text-foreground">
                          {quote.symbol}
                        </span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {quote.name}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-foreground">
                        {formatPrice(quote.price, quote.currency, locale)}
                      </td>
                      <td
                        className={cn(
                          'px-3 py-2.5 text-right tabular-nums',
                          up ? 'text-success' : 'text-destructive',
                        )}
                      >
                        {formatSignedPercent(quote.changePercent)}
                      </td>
                      {hasTrend && (
                        <td className="hidden px-3 py-1.5 sm:table-cell">
                          <div className="ml-auto w-24">
                            {quote.sparkline && quote.sparkline.length > 1 && (
                              <Sparkline data={quote.sparkline} up={up} height={28} />
                            )}
                          </div>
                        </td>
                      )}
                      {hasCap && (
                        <td className="hidden px-3 py-2.5 text-right tabular-nums text-muted-foreground lg:table-cell">
                          {quote.marketCap
                            ? formatCompact(quote.marketCap, locale)
                            : '—'}
                        </td>
                      )}
                      {onSimulate && (
                        <td className="px-3 py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => onSimulate(quote)}
                            title={t('market.simulateOn', { symbol: quote.symbol })}
                            className="text-xs text-muted-foreground transition-colors hover:text-primary"
                          >
                            {t('market.simulate')}
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
