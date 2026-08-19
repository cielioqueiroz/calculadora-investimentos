import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { MarketTable } from '@/components/market/MarketTable'
import { useSimulationStore } from '@/store/useSimulationStore'
import { useTranslation } from '@/i18n/useTranslation'

export function Market() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setParams = useSimulationStore((s) => s.setParams)
  const setMode = useSimulationStore((s) => s.setMode)

  function simulateAs(investmentTypeId: string) {
    return () => {
      setMode('project')
      setParams({ investmentTypeId })
      navigate('/')
    }
  }

  return (
    <div>
      <PageHeader title={t('market.title')} />
      <div className="space-y-8">
        <MarketTable
          source="forex"
          title={t('market.economies')}
          onSimulate={simulateAs('dolar')}
        />
        <MarketTable
          source="crypto"
          title={t('market.crypto')}
          onSimulate={simulateAs('cripto')}
        />
        <MarketTable
          source="b3"
          title={t('market.b3')}
          onSimulate={simulateAs('acoes')}
        />
      </div>
    </div>
  )
}
