import { useMemo } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { SimulatorForm } from '@/components/simulator/SimulatorForm'
import { ResultSummary } from '@/components/simulator/ResultSummary'
import { GrowthChart } from '@/components/simulator/GrowthChart'
import { SaveSimulationDialog } from '@/components/simulator/SaveSimulationDialog'
import { computeSimulation, useSimulationStore } from '@/store/useSimulationStore'
import { useTranslation } from '@/i18n/useTranslation'

export function Simulator() {
  const params = useSimulationStore((s) => s.params)
  const marketRates = useSimulationStore((s) => s.marketRates)
  const { t } = useTranslation()

  const result = useMemo(
    () => computeSimulation(params, marketRates),
    [params, marketRates],
  )

  return (
    <div>
      <PageHeader
        title={t('simulator.title')}
        action={<SaveSimulationDialog />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        <SimulatorForm />

        {result && (
          <div className="space-y-4">
            <ResultSummary result={result} />
            <GrowthChart data={result.breakdown} />
          </div>
        )}
      </div>
    </div>
  )
}
