import { useMemo } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { SimulatorForm } from '@/components/simulator/SimulatorForm'
import { ResultSummary } from '@/components/simulator/ResultSummary'
import { GrowthChart } from '@/components/simulator/GrowthChart'
import { SaveSimulationDialog } from '@/components/simulator/SaveSimulationDialog'
import { getInvestmentType } from '@/constants/investments'
import { resolveAnnualRate, simulate } from '@/lib/calculations'
import { useSimulationStore } from '@/store/useSimulationStore'
import { useTranslation } from '@/i18n/useTranslation'

export function Simulator() {
  const params = useSimulationStore((s) => s.params)
  const marketRates = useSimulationStore((s) => s.marketRates)
  const { t } = useTranslation()

  const result = useMemo(() => {
    const type = getInvestmentType(params.investmentTypeId)
    if (!type) return null
    const annualRate = resolveAnnualRate(type, marketRates)
    return simulate(
      {
        investmentTypeId: params.investmentTypeId,
        initialAmount: params.initialAmount,
        monthlyContribution: params.monthlyContribution,
        months: params.months,
        annualRate,
      },
      type.taxExempt,
    )
  }, [params, marketRates])

  return (
    <div>
      <PageHeader
        title={t('simulator.title')}
        description={t('simulator.subtitle')}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <SimulatorForm />
          <SaveSimulationDialog />
        </div>

        {result && (
          <div className="space-y-6">
            <ResultSummary result={result} />
            <GrowthChart data={result.breakdown} />
          </div>
        )}
      </div>
    </div>
  )
}
