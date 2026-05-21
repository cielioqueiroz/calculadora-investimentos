import { useMemo } from 'react'
import { GitCompareArrows } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { ComparisonControls } from '@/components/comparison/ComparisonControls'
import { ComparisonChart } from '@/components/comparison/ComparisonChart'
import { ComparisonTable } from '@/components/comparison/ComparisonTable'
import type { ComparisonRow } from '@/components/comparison/types'
import { INVESTMENT_TYPES } from '@/constants/investments'
import { resolveAnnualRate, simulate } from '@/lib/calculations'
import { useSimulationStore } from '@/store/useSimulationStore'
import { useTranslation } from '@/i18n/useTranslation'

export function Comparison() {
  const params = useSimulationStore((s) => s.params)
  const marketRates = useSimulationStore((s) => s.marketRates)
  const comparisonIds = useSimulationStore((s) => s.comparisonIds)
  const { t } = useTranslation()

  const rows = useMemo<ComparisonRow[]>(() => {
    return INVESTMENT_TYPES.filter((type) =>
      comparisonIds.includes(type.id),
    ).map((type) => {
      const annualRate = resolveAnnualRate(type, marketRates)
      const result = simulate(
        {
          investmentTypeId: type.id,
          initialAmount: params.initialAmount,
          monthlyContribution: params.monthlyContribution,
          months: params.months,
          annualRate,
        },
        type.taxExempt,
      )
      return { type, result }
    })
  }, [comparisonIds, params, marketRates])

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => b.result.netBalance - a.result.netBalance),
    [rows],
  )

  return (
    <div>
      <PageHeader
        title={t('comparison.title')}
        description={t('comparison.subtitle')}
      />

      <div className="space-y-6">
        <ComparisonControls />

        {rows.length === 0 ? (
          <EmptyState
            icon={GitCompareArrows}
            title={t('comparison.empty.title')}
            description={t('comparison.empty.desc')}
          />
        ) : (
          <>
            <ComparisonChart rows={sortedRows} />
            <ComparisonTable rows={sortedRows} />
          </>
        )}
      </div>
    </div>
  )
}
