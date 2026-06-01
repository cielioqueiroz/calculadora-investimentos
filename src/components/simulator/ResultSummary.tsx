import { Coins, PiggyBank, Receipt, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Guilloche } from '@/components/shared/Guilloche'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { useTranslation } from '@/i18n/useTranslation'
import type { SimulationResult } from '@/types'

interface ResultSummaryProps {
  result: SimulationResult
}

export function ResultSummary({ result }: ResultSummaryProps) {
  const { t } = useTranslation()

  const items = [
    {
      label: t('result.invested'),
      value: formatCurrency(result.totalInvested),
      icon: PiggyBank,
      tone: 'text-foreground',
    },
    {
      label: t('result.netInterest'),
      value: formatCurrency(result.netInterest),
      icon: TrendingUp,
      tone: 'text-success',
    },
    {
      label:
        result.taxRate > 0
          ? t('result.taxWithRate', {
              rate: formatPercent(result.taxRate * 100),
            })
          : t('result.tax'),
      value: formatCurrency(result.taxAmount),
      icon: Receipt,
      tone: 'text-destructive',
    },
    {
      label: t('result.netBalance'),
      value: formatCurrency(result.netBalance),
      icon: Coins,
      tone: 'text-primary',
      highlight: true,
    },
  ]

  const highlight = items.find((i) => i.highlight)!
  const rest = items.filter((i) => !i.highlight)
  const HighlightIcon = highlight.icon

  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden border-primary/30">
        <Guilloche className="opacity-[0.06]" />
        <CardContent className="relative flex items-end justify-between gap-4 p-6">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {highlight.label}
            </p>
            <p className="bg-gold-metal bg-clip-text font-display text-4xl font-semibold tabular-nums text-transparent md:text-5xl">
              {highlight.value}
            </p>
          </div>
          <HighlightIcon className="h-8 w-8 shrink-0 text-primary" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {rest.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label}>
            <CardContent className="flex items-start justify-between p-5">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <p className={`font-display text-2xl font-semibold tabular-nums ${tone}`}>
                  {value}
                </p>
              </div>
              <Icon className={`h-5 w-5 ${tone}`} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
