import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { MarketSection } from '@/components/market/MarketSection'
import { useSimulationStore } from '@/store/useSimulationStore'
import { useTranslation } from '@/i18n/useTranslation'

export function Market() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setParams = useSimulationStore((s) => s.setParams)
  const setMode = useSimulationStore((s) => s.setMode)

  function simulateCrypto() {
    setMode('project')
    setParams({ investmentTypeId: 'cripto' })
    navigate('/simulador')
  }

  return (
    <div className="space-y-10">
      <PageHeader title={t('market.title')} description={t('market.subtitle')} />
      <MarketSection source="forex" title={t('market.economies')} />
      <MarketSection
        source="crypto"
        title={t('market.crypto')}
        onSimulate={simulateCrypto}
      />
      <MarketSection source="b3" title={t('market.b3')} />
    </div>
  )
}
