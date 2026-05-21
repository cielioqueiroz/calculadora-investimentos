import { Coins, PiggyBank, Receipt, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map(({ label, value, icon: Icon, tone, highlight }) => (
        <Card
          key={label}
          className={highlight ? 'border-primary/40 bg-primary/5' : undefined}
        >
          <CardContent className="flex items-start justify-between p-5">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <p className={`text-xl font-bold ${tone}`}>{value}</p>
            </div>
            <Icon className={`h-5 w-5 ${tone}`} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
