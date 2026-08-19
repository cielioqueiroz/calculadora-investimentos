import { Card, CardContent } from '@/components/ui/card'
import { Guilloche } from '@/components/shared/Guilloche'
import { AnimatedNumber } from '@/components/shared/AnimatedNumber'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { useTranslation } from '@/i18n/useTranslation'
import type { SimulationResult } from '@/types'

interface ResultSummaryProps {
  result: SimulationResult
}

export function ResultSummary({ result }: ResultSummaryProps) {
  const { t } = useTranslation()

  const breakdown = [
    {
      label: t('result.invested'),
      amount: result.totalInvested,
      tone: 'text-foreground',
    },
    {
      label: t('result.netInterest'),
      amount: result.netInterest,
      tone: 'text-success',
    },
    {
      label:
        result.taxRate > 0
          ? t('result.taxWithRate', { rate: formatPercent(result.taxRate * 100) })
          : t('result.tax'),
      amount: result.taxAmount,
      tone: 'text-destructive',
    },
  ]

  return (
    <Card className="relative overflow-hidden">
      <Guilloche className="opacity-[0.06]" />
      <CardContent className="relative p-5 sm:p-6">
        <p className="text-sm text-muted-foreground">{t('result.netBalance')}</p>
        <AnimatedNumber
          value={result.netBalance}
          format={formatCurrency}
          className="mt-1 block font-display text-3xl font-semibold tabular-nums text-primary sm:text-4xl md:text-5xl dark:bg-gold-metal dark:bg-clip-text dark:text-transparent"
        />
        {result.inflationRate > 0 && (
          <p className="mt-1.5 text-sm text-muted-foreground">
            {t('result.realBalance')}{' '}
            <span className="font-medium tabular-nums text-foreground">
              {formatCurrency(result.realNetBalance)}
            </span>
            <span className="text-xs">
              {' '}
              ({t('result.realHint', { rate: formatPercent(result.inflationRate) })})
            </span>
          </p>
        )}

        <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border/15 bg-border/15">
          {breakdown.map(({ label, amount, tone }) => (
            <div key={label} className="bg-card px-3 py-2.5">
              <dt className="truncate text-xs text-muted-foreground">{label}</dt>
              <dd
                className={`mt-0.5 font-display text-base font-semibold tabular-nums sm:text-lg ${tone}`}
              >
                {formatCurrency(amount)}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
