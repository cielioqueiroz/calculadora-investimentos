import { Coins, PiggyBank, Receipt, TrendingUp } from 'lucide-react'
import { motion } from 'motion/react'
import { Card, CardContent } from '@/components/ui/card'
import { Guilloche } from '@/components/shared/Guilloche'
import { AnimatedNumber } from '@/components/shared/AnimatedNumber'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { scaleIn, staggerContainer } from '@/lib/animations'
import { useTranslation } from '@/i18n/useTranslation'
import type { SimulationResult } from '@/types'

interface ResultSummaryProps {
  result: SimulationResult
}

export function ResultSummary({ result }: ResultSummaryProps) {
  const { t } = useTranslation()

  const rest = [
    {
      label: t('result.invested'),
      amount: result.totalInvested,
      icon: PiggyBank,
      tone: 'text-foreground',
    },
    {
      label: t('result.netInterest'),
      amount: result.netInterest,
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
      amount: result.taxAmount,
      icon: Receipt,
      tone: 'text-destructive',
    },
  ]

  return (
    <div className="space-y-4">
      <motion.div variants={scaleIn} initial="hidden" animate="visible">
        <Card className="relative overflow-hidden border-primary/30">
          <Guilloche className="opacity-[0.06]" />
          <CardContent className="relative flex items-end justify-between gap-4 p-5 sm:p-6">
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t('result.netBalance')}
              </p>
              <AnimatedNumber
                value={result.netBalance}
                format={formatCurrency}
                className="block font-display text-3xl font-semibold tabular-nums text-primary sm:text-4xl md:text-5xl dark:bg-gold-metal dark:bg-clip-text dark:text-transparent"
              />
              {result.inflationRate > 0 && (
                <p className="pt-1 text-sm text-muted-foreground">
                  {t('result.realBalance')}:{' '}
                  <span className="font-medium tabular-nums text-foreground">
                    {formatCurrency(result.realNetBalance)}
                  </span>{' '}
                  <span className="text-xs">
                    ({t('result.realHint', { rate: formatPercent(result.inflationRate) })})
                  </span>
                </p>
              )}
            </div>
            <Coins className="h-8 w-8 shrink-0 text-primary" />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {rest.map(({ label, amount, icon: Icon, tone }) => (
          <motion.div key={label} variants={scaleIn}>
            <Card>
              <CardContent className="flex items-start justify-between p-5">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {label}
                  </p>
                  <AnimatedNumber
                    value={amount}
                    format={formatCurrency}
                    className={`block font-display text-2xl font-semibold tabular-nums ${tone}`}
                  />
                </div>
                <Icon className={`h-5 w-5 ${tone}`} />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
